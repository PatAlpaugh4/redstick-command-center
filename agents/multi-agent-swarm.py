#!/usr/bin/env python3
"""
Multi-Agent Swarm Template for Kimi Code
========================================
A template for creating agent swarms that decompose tasks and collaborate.

This template demonstrates:
- Task decomposition into subtasks
- Multiple specialized agents working together
- Result aggregation and synthesis
- Parallel and sequential execution patterns

Installation:
    pip install kimi-agent-sdk

Environment Variables:
    KIMI_API_KEY - Your Kimi API key
    KIMI_BASE_URL - Optional: Custom API base URL
"""

import os
import asyncio
from typing import Optional, List, Dict, Any, Callable
from dataclasses import dataclass, field
from enum import Enum
import json

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

# Default configuration
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
    """Status of a task in the swarm."""
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"


@dataclass
class SubTask:
    """Represents a subtask in the decomposition."""
    id: str
    description: str
    agent_type: str
    dependencies: List[str] = field(default_factory=list)
    status: TaskStatus = TaskStatus.PENDING
    result: Optional[str] = None
    error: Optional[str] = None


@dataclass
class SwarmResult:
    """Result from the swarm execution."""
    original_task: str
    subtasks: List[SubTask]
    final_output: str
    execution_time: float
    metadata: Dict[str, Any] = field(default_factory=dict)


# =============================================================================
# Base Agent Class
# =============================================================================

class SwarmAgent:
    """Base class for all swarm agents."""
    
    def __init__(
        self,
        name: str,
        role: str,
        system_prompt: str,
        config: Optional[Config] = None,
    ):
        self.name = name
        self.role = role
        self.system_prompt = system_prompt
        self.config = config or DEFAULT_CONFIG
    
    async def execute(self, task: str, context: Optional[Dict] = None) -> str:
        """Execute the agent's task."""
        raise NotImplementedError("Subclasses must implement execute()")
    
    def _build_prompt(self, task: str, context: Optional[Dict] = None) -> str:
        """Build the full prompt with context."""
        prompt_text = task
        
        if context:
            prompt_text = f"""Context from previous steps:
{json.dumps(context, indent=2)}

Your task:
{task}"""
        
        return prompt_text


# =============================================================================
# Specialized Agents
# =============================================================================

class PlannerAgent(SwarmAgent):
    """
    Agent responsible for task decomposition and planning.
    Breaks down complex tasks into manageable subtasks.
    """
    
    def __init__(self, config: Optional[Config] = None):
        super().__init__(
            name="Planner",
            role="task_decomposition",
            system_prompt="""You are a Task Planning Specialist. Your job is to:
1. Analyze complex tasks and break them down into clear, actionable subtasks
2. Identify dependencies between subtasks
3. Assign appropriate agent types to each subtask
4. Return structured output in JSON format

Available agent types:
- "researcher": Gathers information and performs analysis
- "writer": Creates content, documentation, or responses
- "critic": Reviews and provides feedback on quality
- "coder": Writes, reviews, or debugs code
- "synthesizer": Combines multiple outputs into coherent result

Output format:
{
  "subtasks": [
    {
      "id": "1",
      "description": "Clear task description",
      "agent_type": "researcher|writer|critic|coder|synthesizer",
      "dependencies": ["2", "3"]  // IDs of tasks that must complete first
    }
  ]
}""",
            config=config,
        )
    
    async def execute(self, task: str, context: Optional[Dict] = None) -> List[SubTask]:
        """Decompose task into subtasks."""
        prompt_text = self._build_prompt(
            f"Decompose this task into subtasks: {task}",
            context
        )
        
        response = await prompt(
            prompt_text,
            system=self.system_prompt,
            config=self.config,
        )
        
        # Parse JSON response
        try:
            data = json.loads(response)
            subtasks = []
            for st in data.get("subtasks", []):
                subtasks.append(SubTask(
                    id=st["id"],
                    description=st["description"],
                    agent_type=st["agent_type"],
                    dependencies=st.get("dependencies", []),
                ))
            return subtasks
        except json.JSONDecodeError:
            # Fallback: create a single subtask
            return [SubTask(
                id="1",
                description=task,
                agent_type="synthesizer",
                dependencies=[],
            )]


class ResearcherAgent(SwarmAgent):
    """Agent for research and information gathering."""
    
    def __init__(self, config: Optional[Config] = None):
        super().__init__(
            name="Researcher",
            role="research",
            system_prompt="""You are a Research Specialist. Your job is to:
1. Gather relevant information on the given topic
2. Analyze and synthesize findings
3. Provide well-structured, factual information
4. Cite sources when possible
5. Be thorough but concise

Always provide actionable insights backed by reasoning.""",
            config=config,
        )
    
    async def execute(self, task: str, context: Optional[Dict] = None) -> str:
        prompt_text = self._build_prompt(task, context)
        
        return await prompt(
            prompt_text,
            system=self.system_prompt,
            config=self.config,
        )


class WriterAgent(SwarmAgent):
    """Agent for content creation and writing."""
    
    def __init__(self, config: Optional[Config] = None):
        super().__init__(
            name="Writer",
            role="writing",
            system_prompt="""You are a Content Writing Specialist. Your job is to:
1. Create clear, engaging, and well-structured content
2. Adapt tone and style to the audience and purpose
3. Use appropriate formatting (headings, lists, etc.)
4. Ensure content is complete and actionable
5. Edit for clarity, grammar, and flow

Write content that is ready for immediate use.""",
            config=config,
        )
    
    async def execute(self, task: str, context: Optional[Dict] = None) -> str:
        prompt_text = self._build_prompt(task, context)
        
        return await prompt(
            prompt_text,
            system=self.system_prompt,
            config=self.config,
        )


class CriticAgent(SwarmAgent):
    """Agent for reviewing and critiquing work."""
    
    def __init__(self, config: Optional[Config] = None):
        super().__init__(
            name="Critic",
            role="review",
            system_prompt="""You are a Quality Review Specialist. Your job is to:
1. Review content for accuracy, completeness, and quality
2. Identify errors, gaps, or areas for improvement
3. Provide constructive, actionable feedback
4. Assess against best practices and standards
5. Rate overall quality and suggest specific improvements

Be thorough but constructive in your criticism.""",
            config=config,
        )
    
    async def execute(self, task: str, context: Optional[Dict] = None) -> str:
        prompt_text = self._build_prompt(task, context)
        
        return await prompt(
            prompt_text,
            system=self.system_prompt,
            config=self.config,
        )


class CoderAgent(SwarmAgent):
    """Agent for code generation and review."""
    
    def __init__(self, config: Optional[Config] = None):
        super().__init__(
            name="Coder",
            role="coding",
            system_prompt="""You are a Software Development Specialist. Your job is to:
1. Write clean, efficient, and well-documented code
2. Follow best practices and coding standards
3. Include error handling and edge cases
4. Provide clear explanations and comments
5. Review code for bugs and improvements

Always produce production-ready code.""",
            config=config,
        )
    
    async def execute(self, task: str, context: Optional[Dict] = None) -> str:
        prompt_text = self._build_prompt(task, context)
        
        return await prompt(
            prompt_text,
            system=self.system_prompt,
            config=self.config,
        )


class SynthesizerAgent(SwarmAgent):
    """Agent for combining multiple outputs into final result."""
    
    def __init__(self, config: Optional[Config] = None):
        super().__init__(
            name="Synthesizer",
            role="synthesis",
            system_prompt="""You are a Synthesis Specialist. Your job is to:
1. Combine multiple inputs into a coherent, unified output
2. Resolve conflicts and inconsistencies between sources
3. Maintain the key information from all inputs
4. Create a well-structured final deliverable
5. Ensure the output flows naturally and is complete

Your output should be polished and ready for use.""",
            config=config,
        )
    
    async def execute(self, task: str, context: Optional[Dict] = None) -> str:
        prompt_text = self._build_prompt(task, context)
        
        return await prompt(
            prompt_text,
            system=self.system_prompt,
            config=self.config,
        )


# =============================================================================
# Agent Swarm Orchestrator
# =============================================================================

class AgentSwarm:
    """
    Orchestrates multiple agents to complete complex tasks.
    
    Features:
    - Automatic task decomposition
    - Dependency-aware execution
    - Parallel execution where possible
    - Result aggregation
    """
    
    def __init__(
        self,
        config: Optional[Config] = None,
        max_parallel: int = 3,
    ):
        self.config = config or DEFAULT_CONFIG
        self.max_parallel = max_parallel
        
        # Initialize agent registry
        self.agents: Dict[str, SwarmAgent] = {
            "planner": PlannerAgent(config),
            "researcher": ResearcherAgent(config),
            "writer": WriterAgent(config),
            "critic": CriticAgent(config),
            "coder": CoderAgent(config),
            "synthesizer": SynthesizerAgent(config),
        }
        
        # Execution tracking
        self.completed_tasks: Dict[str, SubTask] = {}
        self.execution_log: List[Dict] = []
    
    def _get_agent(self, agent_type: str) -> SwarmAgent:
        """Get agent by type."""
        if agent_type not in self.agents:
            # Fallback to synthesizer for unknown types
            return self.agents["synthesizer"]
        return self.agents[agent_type]
    
    def _get_ready_tasks(self, subtasks: List[SubTask]) -> List[SubTask]:
        """Get tasks that are ready to execute (dependencies met)."""
        ready = []
        for task in subtasks:
            if task.status != TaskStatus.PENDING:
                continue
            
            # Check if all dependencies are completed
            deps_met = all(
                self.completed_tasks.get(dep, SubTask("", "", "")).status == TaskStatus.COMPLETED
                for dep in task.dependencies
            )
            
            if deps_met:
                ready.append(task)
        
        return ready
    
    def _build_task_context(self, task: SubTask) -> Dict:
        """Build context from completed dependencies."""
        context = {}
        for dep_id in task.dependencies:
            if dep_id in self.completed_tasks:
                dep_task = self.completed_tasks[dep_id]
                context[f"task_{dep_id}"] = {
                    "description": dep_task.description,
                    "result": dep_task.result,
                }
        return context
    
    async def _execute_subtask(self, subtask: SubTask) -> SubTask:
        """Execute a single subtask."""
        print(f"  [Swarm] Executing: {subtask.id} - {subtask.agent_type}")
        
        subtask.status = TaskStatus.IN_PROGRESS
        
        try:
            agent = self._get_agent(subtask.agent_type)
            context = self._build_task_context(subtask)
            
            result = await agent.execute(subtask.description, context)
            
            subtask.result = result
            subtask.status = TaskStatus.COMPLETED
            
            self.execution_log.append({
                "task_id": subtask.id,
                "agent": subtask.agent_type,
                "status": "completed",
                "result_preview": result[:200] + "..." if len(result) > 200 else result,
            })
            
        except Exception as e:
            subtask.error = str(e)
            subtask.status = TaskStatus.FAILED
            
            self.execution_log.append({
                "task_id": subtask.id,
                "agent": subtask.agent_type,
                "status": "failed",
                "error": str(e),
            })
        
        self.completed_tasks[subtask.id] = subtask
        return subtask
    
    async def execute(self, task: str) -> SwarmResult:
        """
        Execute a complex task using the swarm.
        
        Flow:
        1. Planner decomposes task into subtasks
        2. Execute subtasks respecting dependencies
        3. Synthesizer combines results into final output
        """
        import time
        start_time = time.time()
        
        print(f"\n[Swarm] Starting task: {task[:100]}...")
        
        # Step 1: Decompose task
        print("\n[Swarm] Step 1: Decomposing task...")
        planner = self.agents["planner"]
        subtasks = await planner.execute(task)
        
        print(f"[Swarm] Created {len(subtasks)} subtasks:")
        for st in subtasks:
            deps = f" (depends on: {st.dependencies})" if st.dependencies else ""
            print(f"  - {st.id}: {st.agent_type}{deps}")
        
        # Step 2: Execute subtasks
        print("\n[Swarm] Step 2: Executing subtasks...")
        
        pending = set(st.id for st in subtasks)
        
        while pending:
            # Get tasks ready to execute
            ready = self._get_ready_tasks(subtasks)
            
            if not ready and pending:
                # Deadlock detection
                raise RuntimeError(f"Deadlock detected: cannot satisfy dependencies for {pending}")
            
            # Limit parallel execution
            to_execute = ready[:self.max_parallel]
            
            # Execute in parallel
            tasks = [self._execute_subtask(st) for st in to_execute]
            await asyncio.gather(*tasks)
            
            # Update pending
            pending = set(st.id for st in subtasks if st.status == TaskStatus.PENDING)
        
        # Step 3: Synthesize final result
        print("\n[Swarm] Step 3: Synthesizing final result...")
        
        # Gather all results
        all_results = {
            st.id: {
                "description": st.description,
                "agent_type": st.agent_type,
                "result": st.result,
            }
            for st in subtasks
            if st.status == TaskStatus.COMPLETED
        }
        
        synthesizer = self.agents["synthesizer"]
        synthesis_prompt = f"""Original task: {task}

Results from all subtasks:
{json.dumps(all_results, indent=2)}

Please synthesize these results into a coherent final output that addresses the original task."""
        
        final_output = await synthesizer.execute(synthesis_prompt)
        
        execution_time = time.time() - start_time
        
        print(f"\n[Swarm] Completed in {execution_time:.2f}s")
        
        return SwarmResult(
            original_task=task,
            subtasks=subtasks,
            final_output=final_output,
            execution_time=execution_time,
            metadata={
                "total_subtasks": len(subtasks),
                "completed_subtasks": len([st for st in subtasks if st.status == TaskStatus.COMPLETED]),
                "failed_subtasks": len([st for st in subtasks if st.status == TaskStatus.FAILED]),
            },
        )
    
    def get_execution_log(self) -> List[Dict]:
        """Get the execution log for debugging."""
        return self.execution_log


# =============================================================================
# Usage Examples
# =============================================================================

async def example_simple():
    """Simple example of using the swarm."""
    swarm = AgentSwarm()
    
    task = "Write a blog post about the benefits of AI in healthcare"
    
    result = await swarm.execute(task)
    
    print("\n" + "="*60)
    print("FINAL OUTPUT:")
    print("="*60)
    print(result.final_output)
    
    print("\n" + "="*60)
    print("METADATA:")
    print("="*60)
    print(f"Execution time: {result.execution_time:.2f}s")
    print(f"Total subtasks: {result.metadata['total_subtasks']}")
    print(f"Completed: {result.metadata['completed_subtasks']}")


async def example_complex():
    """Complex example with code generation."""
    swarm = AgentSwarm(max_parallel=5)
    
    task = """Create a Python web scraper that:
1. Fetches data from a public API
2. Parses and validates the data
3. Stores results in a SQLite database
4. Includes error handling and logging
5. Has unit tests

Provide complete, production-ready code."""
    
    result = await swarm.execute(task)
    
    print("\n" + "="*60)
    print("FINAL OUTPUT:")
    print("="*60)
    print(result.final_output)
    
    print("\n" + "="*60)
    print("EXECUTION LOG:")
    print("="*60)
    for log in swarm.get_execution_log():
        print(f"  {log['task_id']} ({log['agent']}): {log['status']}")


async def main():
    """Main entry point."""
    print("\n" + "="*60)
    print("Multi-Agent Swarm Template")
    print("="*60)
    
    # Run examples
    await example_simple()
    # await example_complex()  # Uncomment to run complex example


if __name__ == "__main__":
    asyncio.run(main())
