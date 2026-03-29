#!/usr/bin/env python3
"""
Basic Agent Template for Kimi Code
==================================
A simple single-agent template demonstrating both high-level and low-level SDK usage.

Installation:
    pip install kimi-agent-sdk

Environment Variables:
    KIMI_API_KEY - Your Kimi API key
    KIMI_BASE_URL - Optional: Custom API base URL

Usage:
    python basic-agent.py
"""

import os
import asyncio
from typing import Optional, List, Dict, Any

# =============================================================================
# SDK Imports
# =============================================================================
from kimi_agent_sdk import prompt, Session, Config
from kimi_agent_sdk.types import TextPart, ApprovalRequest, ToolCallPart

# =============================================================================
# Configuration
# =============================================================================

# Load API credentials from environment
KIMI_API_KEY = os.getenv("KIMI_API_KEY")
KIMI_BASE_URL = os.getenv("KIMI_BASE_URL", "https://api.moonshot.cn/v1")

if not KIMI_API_KEY:
    raise ValueError("KIMI_API_KEY environment variable is required")

# Create configuration with provider settings
config = Config(
    provider="kimi",
    model="kimi-k2-0711-preview",  # or your preferred model
    api_key=KIMI_API_KEY,
    base_url=KIMI_BASE_URL,
    # Optional: Add default parameters
    temperature=0.7,
    max_tokens=4096,
)

# =============================================================================
# Agent Definition
# =============================================================================

class BasicAgent:
    """
    A simple agent that can process tasks with tool support and approval handling.
    
    Features:
    - High-level prompt() API for simple use cases
    - Low-level Session API for advanced control
    - Tool integration pattern
    - Approval handling (YOLO mode and manual)
    - Streaming response handling
    """
    
    def __init__(
        self,
        name: str = "BasicAgent",
        system_prompt: Optional[str] = None,
        config: Optional[Config] = None,
        yolo_mode: bool = False,
    ):
        self.name = name
        self.config = config or globals().get("config")
        self.yolo_mode = yolo_mode
        self.system_prompt = system_prompt or self._default_system_prompt()
        
        # Define available tools
        self.tools = self._define_tools()
    
    def _default_system_prompt(self) -> str:
        """Default system prompt for the agent."""
        return """You are a helpful AI assistant. Your tasks:
1. Understand user requests clearly
2. Use available tools when needed
3. Provide clear, accurate responses
4. Ask for clarification when uncertain

Always be helpful, honest, and harmless."""

    def _define_tools(self) -> List[Dict[str, Any]]:
        """Define tools available to the agent."""
        return [
            {
                "type": "function",
                "function": {
                    "name": "get_current_time",
                    "description": "Get the current date and time",
                    "parameters": {
                        "type": "object",
                        "properties": {},
                        "required": [],
                    },
                },
            },
            {
                "type": "function",
                "function": {
                    "name": "calculate",
                    "description": "Perform a mathematical calculation",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "expression": {
                                "type": "string",
                                "description": "Mathematical expression to evaluate (e.g., '2 + 2')",
                            },
                        },
                        "required": ["expression"],
                    },
                },
            },
        ]
    
    # =============================================================================
    # Tool Handlers
    # =============================================================================
    
    async def _handle_get_current_time(self) -> str:
        """Handle get_current_time tool call."""
        from datetime import datetime
        return datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    async def _handle_calculate(self, expression: str) -> str:
        """Handle calculate tool call safely."""
        try:
            # Safe evaluation - only allow basic math operations
            allowed_names = {"__builtins__": {}}
            allowed_names.update({
                "abs": abs, "round": round, "max": max, "min": min,
                "sum": sum, "pow": pow,
            })
            result = eval(expression, allowed_names, {"__builtins__": {}})
            return str(result)
        except Exception as e:
            return f"Error calculating '{expression}': {str(e)}"
    
    async def _execute_tool(self, tool_call: ToolCallPart) -> str:
        """Execute a tool call and return the result."""
        name = tool_call.name
        arguments = tool_call.arguments or {}
        
        if name == "get_current_time":
            return await self._handle_get_current_time()
        elif name == "calculate":
            return await self._handle_calculate(arguments.get("expression", ""))
        else:
            return f"Unknown tool: {name}"
    
    # =============================================================================
    # High-Level API (Simple Usage)
    # =============================================================================
    
    async def run_simple(self, user_input: str) -> str:
        """
        Run agent using high-level prompt() API.
        
        This is the simplest way to use the agent - just provide input and get output.
        Best for: Quick tasks, simple Q&A, prototyping
        """
        print(f"\n[{self.name}] Running with high-level API...")
        
        # Simple prompt call - handles everything internally
        response = await prompt(
            user_input,
            system=self.system_prompt,
            config=self.config,
        )
        
        return response
    
    # =============================================================================
    # Low-Level API (Advanced Control)
    # =============================================================================
    
    async def run_advanced(
        self,
        user_input: str,
        context: Optional[List[Dict]] = None,
    ) -> str:
        """
        Run agent using low-level Session API.
        
        This gives you full control over:
        - Message streaming
        - Tool execution
        - Approval handling
        - Context management
        
        Best for: Production systems, complex workflows, custom handling
        """
        print(f"\n[{self.name}] Running with low-level Session API...")
        
        # Create a new session
        session = Session(config=self.config)
        
        # Add system message
        session.add_system_message(self.system_prompt)
        
        # Add context if provided
        if context:
            for msg in context:
                session.add_message(msg["role"], msg["content"])
        
        # Add user input
        session.add_user_message(user_input)
        
        # Collect the full response
        full_response = []
        
        # Stream the response with tool and approval handling
        async for part in session.stream(tools=self.tools):
            if isinstance(part, TextPart):
                # Regular text output - print and collect
                print(part.text, end="", flush=True)
                full_response.append(part.text)
                
            elif isinstance(part, ApprovalRequest):
                # Tool execution approval request
                print(f"\n\n[APPROVAL REQUEST] Tool: {part.tool_name}")
                print(f"Arguments: {part.arguments}")
                
                if self.yolo_mode:
                    # Auto-approve in YOLO mode
                    print("[YOLO MODE] Auto-approving...")
                    await part.approve()
                else:
                    # Manual approval
                    choice = input("Approve? (y/n): ").lower().strip()
                    if choice in ("y", "yes"):
                        await part.approve()
                    else:
                        await part.reject("User denied approval")
                        
            elif isinstance(part, ToolCallPart):
                # Tool execution result
                print(f"\n[TOOL CALL] {part.name}")
                result = await self._execute_tool(part)
                print(f"[TOOL RESULT] {result}")
                
                # Add tool result to session
                session.add_tool_result(part.id, result)
        
        return "".join(full_response)
    
    # =============================================================================
    # Interactive Mode
    # =============================================================================
    
    async def interactive(self):
        """Run agent in interactive chat mode."""
        print(f"\n{'='*60}")
        print(f"  {self.name} - Interactive Mode")
        print(f"  Commands: 'quit' to exit, 'yolo' to toggle auto-approval")
        print(f"{'='*60}\n")
        
        context = []
        
        while True:
            try:
                user_input = input("\nYou: ").strip()
                
                if user_input.lower() in ("quit", "exit", "q"):
                    print("Goodbye!")
                    break
                    
                if user_input.lower() == "yolo":
                    self.yolo_mode = not self.yolo_mode
                    print(f"YOLO mode: {'ON' if self.yolo_mode else 'OFF'}")
                    continue
                
                if not user_input:
                    continue
                
                # Use advanced API for full control
                response = await self.run_advanced(user_input, context)
                
                # Update context (keep last 10 messages)
                context.append({"role": "user", "content": user_input})
                context.append({"role": "assistant", "content": response})
                context = context[-10:]
                
            except KeyboardInterrupt:
                print("\nGoodbye!")
                break
            except Exception as e:
                print(f"\nError: {e}")


# =============================================================================
# Main Entry Point
# =============================================================================

async def main():
    """Main entry point demonstrating different usage patterns."""
    
    # Initialize agent
    agent = BasicAgent(
        name="MyBasicAgent",
        yolo_mode=False,  # Set to True for auto-approval
    )
    
    # Example 1: Simple high-level usage
    print("\n" + "="*60)
    print("Example 1: High-Level API (Simple)")
    print("="*60)
    
    result = await agent.run_simple("What is the capital of France?")
    print(f"\nResponse: {result}")
    
    # Example 2: Advanced usage with tools
    print("\n" + "="*60)
    print("Example 2: Low-Level API with Tools")
    print("="*60)
    
    result = await agent.run_advanced("What time is it now? Also calculate 15 * 23.")
    print(f"\n\nFull Response: {result}")
    
    # Example 3: Interactive mode (uncomment to use)
    # await agent.interactive()


if __name__ == "__main__":
    asyncio.run(main())
