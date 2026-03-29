#!/usr/bin/env python3
"""
Agent Orchestrator Template for Kimi Code
=========================================
Main orchestrator that coordinates multiple specialized agents.

This template provides:
- Agent registration and management
- Workflow definition and execution
- Inter-agent communication
- State management
- Error handling and recovery
- Progress tracking and logging

Installation:
    pip install kimi-agent-sdk

Environment Variables:
    KIMI_API_KEY - Your Kimi API key
    KIMI_BASE_URL - Optional: Custom API base URL
"""

import os
import asyncio
import json
from typing import Optional, List, Dict, Any, Callable, Type, Union
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum, auto
from pathlib import Path
import traceback

# =============================================================================
# SDK Imports
# =============================================================================
from kimi_agent_sdk import prompt, Session, Config
from kimi_agent_sdk.types import TextPart, ApprovalRequest, ToolCallPart

# =============================================================================
# Configuration
# =============================================================================

KIMI_API_KEY = os.getenv("KIMI_API_KEY")
KIMI_BASE_URL = os.getenv("KIMI_BASE_URL", "https://api.moonshot.cn/v1")

if not KIMI_API_KEY:
    raise ValueError("KIMI_API_KEY environment variable is required")

DEFAULT_CONFIG = Config(
    provider="kimi",
    model="kimi-k2-0711-preview",
    api_key=KIMI_API_KEY,
    base_url=KIMI_BASE_URL,
    temperature=0.7,
    max_tokens=4096,
)


# =============================================================================
# Data Models
# =============================================================================

class TaskStatus(Enum):
    """Status of a task in the workflow."""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    SKIPPED = "skipped"
    WAITING_APPROVAL = "waiting_approval"


class AgentType(Enum):
    """Types of agents that can be registered."""
    GENERAL = "general"
    RESEARCH = "research"
    CODING = "coding"
    WRITING = "writing"
    ANALYSIS = "analysis"
    REVIEW = "review"
    CUSTOM = "custom"


@dataclass
class AgentTask:
    """Represents a task to be executed by an agent."""
    id: str
    name: str
    agent_type: AgentType
    prompt: str
    dependencies: List[str] = field(default_factory=list)
    status: TaskStatus = TaskStatus.PENDING
    result: Any = None
    error: Optional[str] = None
    execution_time: float = 0.0
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class WorkflowResult:
    """Result of a workflow execution."""
    workflow_id: str
    tasks: List[AgentTask]
    final_output: Any
    start_time: datetime
    end_time: datetime
    success: bool
    logs: List[Dict]


@dataclass
class AgentCapability:
    """Defines what an agent can do."""
    name: str
    description: str
    agent_type: AgentType
    system_prompt: str
    tools: List[Dict] = field(default_factory=list)


# =============================================================================
# Base Agent Interface
# =============================================================================

class BaseAgent:
    """Base interface for all agents in the orchestrator."""
    
    def __init__(
        self,
        name: str,
        capability: AgentCapability,
        config: Optional[Config] = None,
        yolo_mode: bool = False,
    ):
        self.name = name
        self.capability = capability
        self.config = config or DEFAULT_CONFIG
        self.yolo_mode = yolo_mode
        self.execution_count = 0
        self.total_execution_time = 0.0
    
    async def execute(
        self,
        task: AgentTask,
        context: Dict[str, Any],
    ) -> Any:
        """
        Execute a task.
        
        Args:
            task: The task to execute
            context: Context from previous tasks
        
        Returns:
            Task result
        """
        raise NotImplementedError("Subclasses must implement execute()")
    
    def get_stats(self) -> Dict[str, Any]:
        """Get agent execution statistics."""
        avg_time = (
            self.total_execution_time / self.execution_count
            if self.execution_count > 0 else 0
        )
        return {
            "name": self.name,
            "type": self.capability.agent_type.value,
            "execution_count": self.execution_count,
            "total_execution_time": self.total_execution_time,
            "average_execution_time": avg_time,
        }


# =============================================================================
# Generic Agent Implementation
# =============================================================================

class GenericAgent(BaseAgent):
    """Generic agent implementation using the SDK."""
    
    async def execute(
        self,
        task: AgentTask,
        context: Dict[str, Any],
    ) -> str:
        """Execute task using the prompt API."""
        import time
        start_time = time.time()
        
        # Build prompt with context
        full_prompt = self._build_prompt(task.prompt, context)
        
        # Execute with SDK
        response = await prompt(
            full_prompt,
            system=self.capability.system_prompt,
            config=self.config,
        )
        
        # Update stats
        execution_time = time.time() - start_time
        self.execution_count += 1
        self.total_execution_time += execution_time
        
        return response
    
    def _build_prompt(self, prompt_text: str, context: Dict[str, Any]) -> str:
        """Build full prompt with context."""
        if not context:
            return prompt_text
        
        context_str = json.dumps(context, indent=2, default=str)
        return f"""Context from previous tasks:
{context_str}

---

Your task:
{prompt_text}"""


# =============================================================================
# Advanced Agent with Session API
# =============================================================================

class SessionAgent(BaseAgent):
    """Advanced agent using Session API for full control."""
    
    def __init__(
        self,
        name: str,
        capability: AgentCapability,
        config: Optional[Config] = None,
        yolo_mode: bool = False,
    ):
        super().__init__(name, capability, config, yolo_mode)
        self.session: Optional[Session] = None
    
    async def execute(
        self,
        task: AgentTask,
        context: Dict[str, Any],
    ) -> str:
        """Execute task using Session API with streaming."""
        import time
        start_time = time.time()
        
        # Create new session
        self.session = Session(config=self.config)
        
        # Add system message
        self.session.add_system_message(self.capability.system_prompt)
        
        # Add context as previous messages
        if context:
            for key, value in context.items():
                self.session.add_system_message(
                    f"Context - {key}: {json.dumps(value, default=str)}"
                )
        
        # Add task
        self.session.add_user_message(task.prompt)
        
        # Stream response
        response_parts = []
        
        async for part in self.session.stream(tools=self.capability.tools):
            if isinstance(part, TextPart):
                response_parts.append(part.text)
                
            elif isinstance(part, ApprovalRequest):
                # Handle approval
                if self.yolo_mode:
                    await part.approve()
                else:
                    # In real implementation, you'd want to handle this properly
                    await part.approve()  # Auto-approve for now
                    
            elif isinstance(part, ToolCallPart):
                # Handle tool call
                result = await self._handle_tool_call(part)
                self.session.add_tool_result(part.id, result)
        
        # Update stats
        execution_time = time.time() - start_time
        self.execution_count += 1
        self.total_execution_time += execution_time
        
        return "".join(response_parts)
    
    async def _handle_tool_call(self, tool_call: ToolCallPart) -> str:
        """Handle tool execution. Override in subclasses."""
        return f"Tool {tool_call.name} executed with args: {tool_call.arguments}"


# =============================================================================
# Agent Registry
# =============================================================================

class AgentRegistry:
    """Registry for managing available agents."""
    
    def __init__(self):
        self._agents: Dict[str, BaseAgent] = {}
        self._capabilities: Dict[AgentType, List[str]] = {
            agent_type: [] for agent_type in AgentType
        }
    
    def register(self, agent: BaseAgent) -> None:
        """Register an agent."""
        self._agents[agent.name] = agent
        self._capabilities[agent.capability.agent_type].append(agent.name)
    
    def unregister(self, name: str) -> None:
        """Unregister an agent."""
        if name in self._agents:
            agent = self._agents[name]
            self._capabilities[agent.capability.agent_type].remove(name)
            del self._agents[name]
    
    def get(self, name: str) -> Optional[BaseAgent]:
        """Get agent by name."""
        return self._agents.get(name)
    
    def get_by_type(self, agent_type: AgentType) -> List[BaseAgent]:
        """Get all agents of a specific type."""
        names = self._capabilities.get(agent_type, [])
        return [self._agents[name] for name in names if name in self._agents]
    
    def list_agents(self) -> List[str]:
        """List all registered agent names."""
        return list(self._agents.keys())
    
    def get_stats(self) -> Dict[str, Dict]:
        """Get statistics for all agents."""
        return {name: agent.get_stats() for name, agent in self._agents.items()}


# =============================================================================
# Workflow Engine
# =============================================================================

class WorkflowEngine:
    """Engine for executing agent workflows."""
    
    def __init__(
        self,
        registry: AgentRegistry,
        max_parallel: int = 3,
        enable_logging: bool = True,
    ):
        self.registry = registry
        self.max_parallel = max_parallel
        self.enable_logging = enable_logging
        self.logs: List[Dict] = []
    
    def _log(self, level: str, message: str, data: Optional[Dict] = None):
        """Log a message."""
        if not self.enable_logging:
            return
        
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "level": level,
            "message": message,
        }
        if data:
            log_entry["data"] = data
        
        self.logs.append(log_entry)
        
        # Also print
        print(f"[{level.upper()}] {message}")
    
    def _get_ready_tasks(self, tasks: List[AgentTask]) -> List[AgentTask]:
        """Get tasks that are ready to execute."""
        # Get completed task IDs
        completed = {
            t.id for t in tasks
            if t.status in (TaskStatus.COMPLETED, TaskStatus.SKIPPED)
        }
        
        ready = []
        for task in tasks:
            if task.status != TaskStatus.PENDING:
                continue
            
            # Check dependencies
            deps_satisfied = all(dep in completed for dep in task.dependencies)
            if deps_satisfied:
                ready.append(task)
        
        return ready
    
    def _build_context(
        self,
        task: AgentTask,
        all_tasks: List[AgentTask],
    ) -> Dict[str, Any]:
        """Build context from completed dependencies."""
        context = {}
        
        for dep_id in task.dependencies:
            dep_task = next((t for t in all_tasks if t.id == dep_id), None)
            if dep_task and dep_task.status == TaskStatus.COMPLETED:
                context[dep_id] = {
                    "name": dep_task.name,
                    "result": dep_task.result,
                }
        
        return context
    
    async def _execute_task(
        self,
        task: AgentTask,
        context: Dict[str, Any],
    ) -> AgentTask:
        """Execute a single task."""
        self._log("info", f"Executing task: {task.name} ({task.id})")
        
        task.status = TaskStatus.RUNNING
        
        try:
            # Find appropriate agent
            agents = self.registry.get_by_type(task.agent_type)
            if not agents:
                # Fallback to general agent
                agents = self.registry.get_by_type(AgentType.GENERAL)
            
            if not agents:
                raise RuntimeError(f"No agent available for type: {task.agent_type}")
            
            # Use first available agent (could implement load balancing)
            agent = agents[0]
            
            # Execute
            import time
            start_time = time.time()
            result = await agent.execute(task, context)
            task.execution_time = time.time() - start_time
            
            task.result = result
            task.status = TaskStatus.COMPLETED
            
            self._log(
                "info",
                f"Task completed: {task.name}",
                {"execution_time": task.execution_time},
            )
            
        except Exception as e:
            task.status = TaskStatus.FAILED
            task.error = str(e)
            self._log("error", f"Task failed: {task.name}", {"error": str(e)})
        
        return task
    
    async def execute(self, workflow_id: str, tasks: List[AgentTask]) -> WorkflowResult:
        """
        Execute a workflow of tasks.
        
        Args:
            workflow_id: Unique identifier for this workflow run
            tasks: List of tasks to execute
        
        Returns:
            WorkflowResult with all task results
        """
        start_time = datetime.now()
        
        self._log("info", f"Starting workflow: {workflow_id}")
        self._log("info", f"Total tasks: {len(tasks)}")
        
        pending = {t.id for t in tasks}
        
        while pending:
            # Get ready tasks
            ready = self._get_ready_tasks(tasks)
            
            if not ready and pending:
                # Deadlock detected
                self._log("error", "Deadlock detected in workflow")
                raise RuntimeError(f"Workflow deadlock: cannot satisfy dependencies")
            
            # Limit parallel execution
            to_execute = ready[:self.max_parallel]
            
            # Execute in parallel
            exec_tasks = []
            for task in to_execute:
                context = self._build_context(task, tasks)
                exec_tasks.append(self._execute_task(task, context))
            
            await asyncio.gather(*exec_tasks)
            
            # Update pending
            pending = {t.id for t in tasks if t.status == TaskStatus.PENDING}
        
        end_time = datetime.now()
        
        # Determine final output (from last completed task or aggregation)
        completed_tasks = [t for t in tasks if t.status == TaskStatus.COMPLETED]
        final_output = None
        if completed_tasks:
            # Use result from last task in sequence
            final_output = completed_tasks[-1].result
        
        success = all(t.status == TaskStatus.COMPLETED for t in tasks)
        
        self._log("info", f"Workflow completed: {workflow_id}")
        
        return WorkflowResult(
            workflow_id=workflow_id,
            tasks=tasks,
            final_output=final_output,
            start_time=start_time,
            end_time=end_time,
            success=success,
            logs=self.logs.copy(),
        )


# =============================================================================
# Agent Orchestrator
# =============================================================================

class AgentOrchestrator:
    """
    Main orchestrator for coordinating multiple agents.
    
    This is the main entry point for using the agent system.
    
    Example:
        orchestrator = AgentOrchestrator()
        
        # Register agents
        orchestrator.register_agent(GenericAgent(...))
        orchestrator.register_agent(SessionAgent(...))
        
        # Define workflow
        tasks = [
            AgentTask(id="1", name="Research", agent_type=AgentType.RESEARCH, prompt="..."),
            AgentTask(id="2", name="Write", agent_type=AgentType.WRITING, prompt="...", dependencies=["1"]),
        ]
        
        # Execute
        result = await orchestrator.run_workflow("my_workflow", tasks)
    """
    
    def __init__(
        self,
        config: Optional[Config] = None,
        max_parallel: int = 3,
    ):
        self.config = config or DEFAULT_CONFIG
        self.registry = AgentRegistry()
        self.engine = WorkflowEngine(
            self.registry,
            max_parallel=max_parallel,
        )
        self.workflow_history: List[WorkflowResult] = []
        
        # Register default agents
        self._register_default_agents()
    
    def _register_default_agents(self):
        """Register default agents."""
        # General purpose agent
        self.register_agent(GenericAgent(
            name="general_agent",
            capability=AgentCapability(
                name="General Purpose Agent",
                description="Handles general tasks",
                agent_type=AgentType.GENERAL,
                system_prompt="You are a helpful AI assistant. Provide clear, accurate, and helpful responses.",
            ),
            config=self.config,
        ))
        
        # Research agent
        self.register_agent(GenericAgent(
            name="research_agent",
            capability=AgentCapability(
                name="Research Agent",
                description="Conducts research and gathers information",
                agent_type=AgentType.RESEARCH,
                system_prompt="""You are a Research Specialist. Your job is to:
1. Gather comprehensive information on topics
2. Analyze and synthesize findings
3. Provide well-structured, factual information
4. Cite sources when possible
Be thorough, accurate, and objective.""",
            ),
            config=self.config,
        ))
        
        # Coding agent
        self.register_agent(GenericAgent(
            name="coding_agent",
            capability=AgentCapability(
                name="Coding Agent",
                description="Generates and reviews code",
                agent_type=AgentType.CODING,
                system_prompt="""You are a Software Development Specialist. Your job is to:
1. Write clean, efficient, well-documented code
2. Follow best practices and coding standards
3. Include error handling and edge cases
4. Provide clear explanations
Always produce production-ready code.""",
            ),
            config=self.config,
        ))
        
        # Writing agent
        self.register_agent(GenericAgent(
            name="writing_agent",
            capability=AgentCapability(
                name="Writing Agent",
                description="Creates written content",
                agent_type=AgentType.WRITING,
                system_prompt="""You are a Content Writing Specialist. Your job is to:
1. Create clear, engaging, well-structured content
2. Adapt tone and style to the audience
3. Use appropriate formatting
4. Ensure completeness and accuracy
Write content that is ready for immediate use.""",
            ),
            config=self.config,
        ))
        
        # Analysis agent
        self.register_agent(GenericAgent(
            name="analysis_agent",
            capability=AgentCapability(
                name="Analysis Agent",
                description="Analyzes data and provides insights",
                agent_type=AgentType.ANALYSIS,
                system_prompt="""You are a Data Analysis Specialist. Your job is to:
1. Analyze information objectively
2. Identify patterns and insights
3. Draw logical conclusions
4. Present findings clearly
Be thorough and evidence-based in your analysis.""",
            ),
            config=self.config,
        ))
        
        # Review agent
        self.register_agent(GenericAgent(
            name="review_agent",
            capability=AgentCapability(
                name="Review Agent",
                description="Reviews and critiques work",
                agent_type=AgentType.REVIEW,
                system_prompt="""You are a Quality Review Specialist. Your job is to:
1. Review work for quality and accuracy
2. Identify issues and areas for improvement
3. Provide constructive feedback
4. Assess against best practices
Be thorough but constructive in your criticism.""",
            ),
            config=self.config,
        ))
    
    def register_agent(self, agent: BaseAgent) -> None:
        """Register an agent with the orchestrator."""
        self.registry.register(agent)
        print(f"[Orchestrator] Registered agent: {agent.name}")
    
    def unregister_agent(self, name: str) -> None:
        """Unregister an agent."""
        self.registry.unregister(name)
        print(f"[Orchestrator] Unregistered agent: {name}")
    
    async def run_workflow(
        self,
        workflow_id: str,
        tasks: List[AgentTask],
    ) -> WorkflowResult:
        """
        Run a workflow of agent tasks.
        
        Args:
            workflow_id: Unique identifier for this workflow
            tasks: List of tasks to execute
        
        Returns:
            WorkflowResult with all results
        """
        result = await self.engine.execute(workflow_id, tasks)
        self.workflow_history.append(result)
        return result
    
    async def run_simple(
        self,
        prompt: str,
        agent_type: AgentType = AgentType.GENERAL,
    ) -> str:
        """
        Run a simple single-task workflow.
        
        Args:
            prompt: The task prompt
            agent_type: Type of agent to use
        
        Returns:
            Task result as string
        """
        task = AgentTask(
            id="1",
            name="simple_task",
            agent_type=agent_type,
            prompt=prompt,
        )
        
        result = await self.run_workflow(f"simple_{datetime.now().timestamp()}", [task])
        return result.final_output or ""
    
    def get_agent_stats(self) -> Dict[str, Dict]:
        """Get statistics for all registered agents."""
        return self.registry.get_stats()
    
    def get_workflow_history(self) -> List[WorkflowResult]:
        """Get history of all executed workflows."""
        return self.workflow_history
    
    def export_workflow_report(
        self,
        result: WorkflowResult,
        filepath: str,
    ) -> str:
        """Export a workflow result to a file."""
        path = Path(filepath)
        path.parent.mkdir(parents=True, exist_ok=True)
        
        report = {
            "workflow_id": result.workflow_id,
            "success": result.success,
            "start_time": result.start_time.isoformat(),
            "end_time": result.end_time.isoformat(),
            "duration_seconds": (
                result.end_time - result.start_time
            ).total_seconds(),
            "tasks": [
                {
                    "id": t.id,
                    "name": t.name,
                    "agent_type": t.agent_type.value,
                    "status": t.status.value,
                    "execution_time": t.execution_time,
                    "error": t.error,
                }
                for t in result.tasks
            ],
            "final_output": str(result.final_output)[:1000] if result.final_output else None,
            "logs": result.logs,
        }
        
        path.write_text(json.dumps(report, indent=2))
        return str(path)


# =============================================================================
# Usage Examples
# =============================================================================

async def example_simple_workflow():
    """Example: Simple single-task workflow."""
    orchestrator = AgentOrchestrator()
    
    result = await orchestrator.run_simple(
        prompt="Explain the benefits of async/await in Python",
        agent_type=AgentType.GENERAL,
    )
    
    print("\n" + "="*60)
    print("SIMPLE WORKFLOW RESULT")
    print("="*60)
    print(result)


async def example_multi_step_workflow():
    """Example: Multi-step workflow with dependencies."""
    orchestrator = AgentOrchestrator()
    
    # Define tasks with dependencies
    tasks = [
        AgentTask(
            id="research",
            name="Research Topic",
            agent_type=AgentType.RESEARCH,
            prompt="Research the current state of AI in healthcare. Focus on recent breakthroughs and applications.",
        ),
        AgentTask(
            id="analysis",
            name="Analyze Findings",
            agent_type=AgentType.ANALYSIS,
            prompt="Analyze the research findings and identify the top 3 most impactful applications of AI in healthcare.",
            dependencies=["research"],
        ),
        AgentTask(
            id="write",
            name="Write Report",
            agent_type=AgentType.WRITING,
            prompt="Write a comprehensive report on AI in healthcare based on the research and analysis. Include an executive summary.",
            dependencies=["analysis"],
        ),
        AgentTask(
            id="review",
            name="Review Report",
            agent_type=AgentType.REVIEW,
            prompt="Review the report for accuracy, clarity, and completeness. Provide feedback and suggestions.",
            dependencies=["write"],
        ),
    ]
    
    # Execute workflow
    result = await orchestrator.run_workflow("ai_healthcare_research", tasks)
    
    print("\n" + "="*60)
    print("MULTI-STEP WORKFLOW RESULT")
    print("="*60)
    print(f"Success: {result.success}")
    print(f"Duration: {(result.end_time - result.start_time).total_seconds():.2f}s")
    
    print("\nTask Results:")
    for task in result.tasks:
        status_icon = "✓" if task.status == TaskStatus.COMPLETED else "✗"
        print(f"  {status_icon} {task.name}: {task.status.value} ({task.execution_time:.2f}s)")
    
    print("\nFinal Output Preview:")
    if result.final_output:
        print(str(result.final_output)[:500] + "...")
    
    # Export report
    report_path = orchestrator.export_workflow_report(result, "/tmp/workflow_report.json")
    print(f"\nReport saved to: {report_path}")


async def example_custom_agent():
    """Example: Register and use a custom agent."""
    orchestrator = AgentOrchestrator()
    
    # Create custom agent
    custom_capability = AgentCapability(
        name="Math Solver",
        description="Solves mathematical problems",
        agent_type=AgentType.CUSTOM,
        system_prompt="""You are a Mathematics Specialist. Your job is to:
1. Solve mathematical problems step by step
2. Show all work clearly
3. Explain the reasoning
4. Verify the solution
Be precise and thorough in your calculations.""",
    )
    
    custom_agent = GenericAgent(
        name="math_solver",
        capability=custom_capability,
    )
    
    # Register
    orchestrator.register_agent(custom_agent)
    
    # Use in workflow
    tasks = [
        AgentTask(
            id="math",
            name="Solve Problem",
            agent_type=AgentType.CUSTOM,
            prompt="Solve: What is the sum of all prime numbers between 1 and 100?",
        ),
    ]
    
    result = await orchestrator.run_workflow("math_problem", tasks)
    
    print("\n" + "="*60)
    print("CUSTOM AGENT RESULT")
    print("="*60)
    print(result.final_output)
    
    # Show agent stats
    print("\n" + "="*60)
    print("AGENT STATISTICS")
    print("="*60)
    stats = orchestrator.get_agent_stats()
    for name, stat in stats.items():
        print(f"{name}: {stat['execution_count']} executions, avg {stat['average_execution_time']:.2f}s")


async def main():
    """Main entry point."""
    print("\n" + "="*60)
    print("Agent Orchestrator Template")
    print("="*60)
    
    # Run examples
    await example_simple_workflow()
    # await example_multi_step_workflow()
    # await example_custom_agent()


if __name__ == "__main__":
    asyncio.run(main())
