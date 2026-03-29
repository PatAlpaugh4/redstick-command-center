#!/usr/bin/env python3
"""
Coding Agent Template for Kimi Code
===================================
A specialized agent for code generation, review, and refactoring.

Features:
- Multi-language code generation
- Code review and analysis
- Refactoring suggestions
- Documentation generation
- Test generation
- Git integration patterns

Installation:
    pip install kimi-agent-sdk

Environment Variables:
    KIMI_API_KEY - Your Kimi API key
    KIMI_BASE_URL - Optional: Custom API base URL
"""

import os
import asyncio
import json
import re
from typing import Optional, List, Dict, Any, Tuple
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from enum import Enum

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
    temperature=0.2,  # Lower temperature for code generation
    max_tokens=8192,
)


# =============================================================================
# Data Models
# =============================================================================

class CodeLanguage(Enum):
    """Supported programming languages."""
    PYTHON = "python"
    JAVASCRIPT = "javascript"
    TYPESCRIPT = "typescript"
    JAVA = "java"
    CPP = "cpp"
    GO = "go"
    RUST = "rust"
    SQL = "sql"
    HTML = "html"
    CSS = "css"
    SHELL = "shell"
    GENERIC = "generic"


@dataclass
class CodeFile:
    """Represents a code file."""
    path: str
    content: str
    language: CodeLanguage
    description: str = ""
    
    @property
    def filename(self) -> str:
        return Path(self.path).name


@dataclass
class CodeReview:
    """Code review result."""
    file_path: str
    issues: List[Dict[str, Any]]
    suggestions: List[str]
    score: int  # 0-100
    summary: str


@dataclass
class GeneratedCode:
    """Generated code result."""
    files: List[CodeFile]
    explanation: str
    dependencies: List[str]
    setup_instructions: List[str]


# =============================================================================
# Coding Agent
# =============================================================================

class CodingAgent:
    """
    Specialized agent for software development tasks.
    
    Capabilities:
    - Code generation from specifications
    - Code review and analysis
    - Refactoring and optimization
    - Documentation generation
    - Test case generation
    - Multi-file project generation
    """
    
    def __init__(
        self,
        config: Optional[Config] = None,
        workspace_dir: Optional[str] = None,
    ):
        self.config = config or DEFAULT_CONFIG
        self.workspace_dir = Path(workspace_dir) if workspace_dir else Path.cwd()
        
        # System prompts for different tasks
        self.code_gen_prompt = """You are an expert Software Engineer specializing in writing clean, efficient, and production-ready code.

Guidelines:
1. Write code that follows best practices and industry standards
2. Include comprehensive error handling
3. Add clear comments and docstrings
4. Use meaningful variable and function names
5. Follow language-specific style guides (PEP 8 for Python, etc.)
6. Consider edge cases and security implications
7. Write modular, testable code

When generating code:
- Provide complete, runnable code
- Include necessary imports
- Add type hints where appropriate
- Include example usage if relevant"""

        self.code_review_prompt = """You are a Senior Code Reviewer with expertise in software quality and best practices.

Review Criteria:
1. Correctness - Does the code work as intended?
2. Readability - Is the code easy to understand?
3. Maintainability - Can the code be easily modified?
4. Performance - Are there efficiency concerns?
5. Security - Are there potential vulnerabilities?
6. Testing - Is the code testable? Are tests needed?
7. Documentation - Are comments and docs adequate?

For each issue found, provide:
- Severity: critical/high/medium/low
- Location: line numbers or function names
- Description: what's wrong
- Suggestion: how to fix it

Provide an overall quality score (0-100) and summary."""

        self.refactor_prompt = """You are a Refactoring Specialist focused on improving code quality.

Refactoring Goals:
1. Improve readability and maintainability
2. Reduce complexity and duplication
3. Enhance performance where applicable
4. Modernize code patterns
5. Maintain or improve test coverage

Approach:
- Make small, focused changes
- Preserve existing functionality
- Follow the "boy scout rule": leave code better than you found it
- Explain the rationale for each change"""

        self.test_gen_prompt = """You are a Test Engineering Specialist.

Test Generation Guidelines:
1. Write comprehensive unit tests
2. Include edge cases and boundary conditions
3. Test both success and failure scenarios
4. Use appropriate testing frameworks
5. Aim for high code coverage
6. Write clear, descriptive test names
7. Follow Arrange-Act-Assert pattern

Generate tests that are:
- Independent and isolated
- Repeatable and deterministic
- Fast to execute
- Easy to understand and maintain"""
    
    # =============================================================================
    # Language Detection
    # =============================================================================
    
    def detect_language(self, file_path: str) -> CodeLanguage:
        """Detect programming language from file extension."""
        ext = Path(file_path).suffix.lower()
        
        language_map = {
            ".py": CodeLanguage.PYTHON,
            ".js": CodeLanguage.JAVASCRIPT,
            ".ts": CodeLanguage.TYPESCRIPT,
            ".java": CodeLanguage.JAVA,
            ".cpp": CodeLanguage.CPP,
            ".cc": CodeLanguage.CPP,
            ".c": CodeLanguage.CPP,
            ".go": CodeLanguage.GO,
            ".rs": CodeLanguage.RUST,
            ".sql": CodeLanguage.SQL,
            ".html": CodeLanguage.HTML,
            ".htm": CodeLanguage.HTML,
            ".css": CodeLanguage.CSS,
            ".sh": CodeLanguage.SHELL,
            ".bash": CodeLanguage.SHELL,
        }
        
        return language_map.get(ext, CodeLanguage.GENERIC)
    
    def _get_language_name(self, lang: CodeLanguage) -> str:
        """Get human-readable language name."""
        return lang.value
    
    # =============================================================================
    # Code Generation
    # =============================================================================
    
    async def generate_code(
        self,
        specification: str,
        language: CodeLanguage = CodeLanguage.PYTHON,
        context: Optional[Dict] = None,
    ) -> GeneratedCode:
        """
        Generate code from a specification.
        
        Args:
            specification: Description of what the code should do
            language: Target programming language
            context: Additional context (existing code, constraints, etc.)
        """
        print(f"\n[Coding] Generating {language.value} code...")
        
        lang_name = self._get_language_name(language)
        
        context_str = ""
        if context:
            context_str = f"\n\nAdditional Context:\n{json.dumps(context, indent=2)}"
        
        prompt_text = f"""Generate {lang_name} code for the following specification:

{specification}{context_str}

Please provide:
1. The complete code implementation
2. A brief explanation of the approach
3. Any dependencies required
4. Setup/installation instructions if needed

Format your response as:

=== CODE ===
[code here]
=== END CODE ===

=== EXPLANATION ===
[explanation here]
=== END EXPLANATION ===

=== DEPENDENCIES ===
- dependency1
- dependency2
=== END DEPENDENCIES ===

=== SETUP ===
- setup step 1
- setup step 2
=== END SETUP ==="""
        
        response = await prompt(
            prompt_text,
            system=self.code_gen_prompt,
            config=self.config,
        )
        
        # Parse response
        code = self._extract_section(response, "CODE")
        explanation = self._extract_section(response, "EXPLANATION")
        dependencies = self._extract_list_section(response, "DEPENDENCIES")
        setup = self._extract_list_section(response, "SETUP")
        
        # Create code file
        file_extension = {
            CodeLanguage.PYTHON: ".py",
            CodeLanguage.JAVASCRIPT: ".js",
            CodeLanguage.TYPESCRIPT: ".ts",
            CodeLanguage.JAVA: ".java",
            CodeLanguage.GO: ".go",
            CodeLanguage.RUST: ".rs",
            CodeLanguage.SQL: ".sql",
            CodeLanguage.HTML: ".html",
            CodeLanguage.CSS: ".css",
            CodeLanguage.SHELL: ".sh",
        }.get(language, ".txt")
        
        code_file = CodeFile(
            path=f"generated{file_extension}",
            content=code,
            language=language,
            description=specification[:100],
        )
        
        return GeneratedCode(
            files=[code_file],
            explanation=explanation,
            dependencies=dependencies,
            setup_instructions=setup,
        )
    
    async def generate_multi_file_project(
        self,
        specification: str,
        languages: List[CodeLanguage],
    ) -> GeneratedCode:
        """Generate a multi-file project."""
        print(f"\n[Coding] Generating multi-file project...")
        
        langs_str = ", ".join([l.value for l in languages])
        
        prompt_text = f"""Generate a multi-file project with the following specification:

{specification}

Languages to use: {langs_str}

Provide a complete project structure with:
1. All necessary files with complete code
2. File organization and structure
3. How files interact with each other
4. Dependencies and setup instructions

Format each file as:

=== FILE: path/to/file.ext ===
[file content]
=== END FILE ==="""
        
        response = await prompt(
            prompt_text,
            system=self.code_gen_prompt,
            config=self.config,
        )
        
        # Parse files
        files = self._extract_files(response)
        
        return GeneratedCode(
            files=files,
            explanation="Multi-file project generated based on specification.",
            dependencies=[],
            setup_instructions=["See individual files for setup instructions."],
        )
    
    # =============================================================================
    # Code Review
    # =============================================================================
    
    async def review_code(
        self,
        code: str,
        file_path: str = "unknown",
        language: Optional[CodeLanguage] = None,
    ) -> CodeReview:
        """
        Review code and provide feedback.
        
        Args:
            code: The code to review
            file_path: Path to the file (for reference)
            language: Programming language (auto-detected if not provided)
        """
        print(f"\n[Coding] Reviewing code from {file_path}...")
        
        if language is None:
            language = self.detect_language(file_path)
        
        prompt_text = f"""Please review the following {language.value} code:

File: {file_path}

```
{code}
```

Provide a detailed code review including:
1. List of issues with severity, location, description, and fix suggestion
2. General improvement suggestions
3. Overall quality score (0-100)
4. Brief summary

Format your response as JSON:
{{
  "issues": [
    {{
      "severity": "critical|high|medium|low",
      "location": "function name or line range",
      "description": "what's wrong",
      "suggestion": "how to fix"
    }}
  ],
  "suggestions": ["suggestion 1", "suggestion 2"],
  "score": 85,
  "summary": "brief overall assessment"
}}"""
        
        response = await prompt(
            prompt_text,
            system=self.code_review_prompt,
            config=self.config,
        )
        
        # Parse JSON response
        try:
            data = json.loads(response)
            return CodeReview(
                file_path=file_path,
                issues=data.get("issues", []),
                suggestions=data.get("suggestions", []),
                score=data.get("score", 0),
                summary=data.get("summary", ""),
            )
        except json.JSONDecodeError:
            # Fallback: return basic review
            return CodeReview(
                file_path=file_path,
                issues=[],
                suggestions=["Could not parse review results"],
                score=50,
                summary=response[:200],
            )
    
    async def review_file(self, file_path: str) -> CodeReview:
        """Review a code file from disk."""
        path = Path(file_path)
        if not path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")
        
        code = path.read_text()
        language = self.detect_language(file_path)
        
        return await self.review_code(code, file_path, language)
    
    # =============================================================================
    # Refactoring
    # =============================================================================
    
    async def refactor_code(
        self,
        code: str,
        goals: List[str],
        language: Optional[CodeLanguage] = None,
    ) -> CodeFile:
        """
        Refactor code based on specified goals.
        
        Args:
            code: The code to refactor
            goals: List of refactoring goals (e.g., ["improve readability", "reduce complexity"])
            language: Programming language
        """
        print(f"\n[Coding] Refactoring code...")
        
        goals_str = "\n".join([f"- {g}" for g in goals])
        
        prompt_text = f"""Refactor the following code to achieve these goals:

Goals:
{goals_str}

Original Code:
```
{code}
```

Please provide:
1. The refactored code
2. A summary of changes made
3. Explanation of improvements

Format:

=== REFACTORED CODE ===
[refactored code]
=== END CODE ===

=== CHANGES ===
[summary of changes]
=== END CHANGES ==="""
        
        response = await prompt(
            prompt_text,
            system=self.refactor_prompt,
            config=self.config,
        )
        
        refactored_code = self._extract_section(response, "REFACTORED CODE")
        changes = self._extract_section(response, "CHANGES")
        
        return CodeFile(
            path="refactored.py",  # Generic path
            content=refactored_code,
            language=language or CodeLanguage.PYTHON,
            description=f"Refactored: {changes[:100]}",
        )
    
    # =============================================================================
    # Documentation Generation
    # =============================================================================
    
    async def generate_documentation(
        self,
        code: str,
        doc_type: str = "docstring",  # docstring, readme, api_docs
        language: Optional[CodeLanguage] = None,
    ) -> str:
        """Generate documentation for code."""
        print(f"\n[Coding] Generating {doc_type} documentation...")
        
        lang = language.value if language else "the given language"
        
        prompt_text = f"""Generate {doc_type} documentation for the following {lang} code:

```
{code}
```

Provide comprehensive documentation that:
- Explains the purpose and usage
- Documents all functions, classes, and parameters
- Includes examples where helpful
- Follows standard documentation conventions"""
        
        return await prompt(
            prompt_text,
            system="You are a technical documentation specialist.",
            config=self.config,
        )
    
    # =============================================================================
    # Test Generation
    # =============================================================================
    
    async def generate_tests(
        self,
        code: str,
        framework: str = "pytest",  # pytest, unittest, jest, etc.
        language: CodeLanguage = CodeLanguage.PYTHON,
    ) -> CodeFile:
        """Generate unit tests for code."""
        print(f"\n[Coding] Generating {framework} tests...")
        
        prompt_text = f"""Generate comprehensive unit tests for the following code:

Code to test:
```
{code}
```

Framework: {framework}

Requirements:
1. Test all public functions and methods
2. Include edge cases and boundary conditions
3. Test error scenarios
4. Use descriptive test names
5. Follow best practices for {framework}

Provide complete, runnable test code."""
        
        response = await prompt(
            prompt_text,
            system=self.test_gen_prompt,
            config=self.config,
        )
        
        # Extract test code
        test_code = self._extract_code_blocks(response)
        if not test_code:
            test_code = response
        
        return CodeFile(
            path=f"test_generated.py",
            content=test_code,
            language=language,
            description=f"Unit tests using {framework}",
        )
    
    # =============================================================================
    # File Operations
    # =============================================================================
    
    def save_code(self, code_file: CodeFile, output_dir: Optional[str] = None) -> str:
        """Save generated code to file."""
        output_path = Path(output_dir) if output_dir else self.workspace_dir
        output_path.mkdir(parents=True, exist_ok=True)
        
        file_path = output_path / code_file.path
        file_path.parent.mkdir(parents=True, exist_ok=True)
        
        file_path.write_text(code_file.content)
        print(f"[Coding] Saved: {file_path}")
        
        return str(file_path)
    
    def save_project(self, generated: GeneratedCode, output_dir: str):
        """Save a multi-file project."""
        output_path = Path(output_dir)
        output_path.mkdir(parents=True, exist_ok=True)
        
        saved_files = []
        for code_file in generated.files:
            file_path = output_path / code_file.path
            file_path.parent.mkdir(parents=True, exist_ok=True)
            file_path.write_text(code_file.content)
            saved_files.append(str(file_path))
            print(f"[Coding] Saved: {file_path}")
        
        # Save README
        readme = self._generate_readme(generated)
        readme_path = output_path / "README.md"
        readme_path.write_text(readme)
        
        return saved_files
    
    def _generate_readme(self, generated: GeneratedCode) -> str:
        """Generate README for a project."""
        files_list = "\n".join([f"- {f.path}" for f in generated.files])
        deps_list = "\n".join([f"- {d}" for d in generated.dependencies]) or "None"
        setup_list = "\n".join([f"1. {s}" for s in generated.setup_instructions]) or "No setup required."
        
        return f"""# Generated Project

## Files
{files_list}

## Dependencies
{deps_list}

## Setup
{setup_list}

## Explanation
{generated.explanation}

---
*Generated by CodingAgent*
"""
    
    # =============================================================================
    # Helper Methods
    # =============================================================================
    
    def _extract_section(self, text: str, section_name: str) -> str:
        """Extract content from a marked section."""
        pattern = rf"===\s*{section_name}\s*===(.*?)===\s*END\s*{section_name}\s*==="
        match = re.search(pattern, text, re.DOTALL | re.IGNORECASE)
        if match:
            return match.group(1).strip()
        return ""
    
    def _extract_list_section(self, text: str, section_name: str) -> List[str]:
        """Extract a list from a marked section."""
        content = self._extract_section(text, section_name)
        items = []
        for line in content.split("\n"):
            line = line.strip()
            if line.startswith(("-", "*")):
                items.append(line[1:].strip())
            elif line:
                items.append(line)
        return items
    
    def _extract_files(self, text: str) -> List[CodeFile]:
        """Extract multiple files from response."""
        files = []
        pattern = r"===\s*FILE:\s*(.+?)\s*===(.*?)===\s*END\s*FILE\s*==="
        matches = re.findall(pattern, text, re.DOTALL | re.IGNORECASE)
        
        for file_path, content in matches:
            file_path = file_path.strip()
            content = content.strip()
            language = self.detect_language(file_path)
            
            files.append(CodeFile(
                path=file_path,
                content=content,
                language=language,
            ))
        
        return files
    
    def _extract_code_blocks(self, text: str) -> str:
        """Extract code from markdown code blocks."""
        pattern = r"```(?:\w+)?\n(.*?)```"
        matches = re.findall(pattern, text, re.DOTALL)
        if matches:
            return "\n\n".join(matches)
        return text


# =============================================================================
# Usage Examples
# =============================================================================

async def example_code_generation():
    """Example: Generate code from specification."""
    agent = CodingAgent()
    
    spec = """Create a Python class for managing a simple todo list with the following features:
    - Add tasks with priority and due date
    - Mark tasks as complete
    - List all tasks (with optional filtering)
    - Save/load tasks from JSON file
    """
    
    result = await agent.generate_code(
        specification=spec,
        language=CodeLanguage.PYTHON,
    )
    
    print("\n" + "="*60)
    print("GENERATED CODE")
    print("="*60)
    print(result.files[0].content)
    
    print("\n" + "="*60)
    print("EXPLANATION")
    print("="*60)
    print(result.explanation)
    
    # Save to file
    agent.save_code(result.files[0], "/tmp/generated")


async def example_code_review():
    """Example: Review code."""
    agent = CodingAgent()
    
    code = """
def calc(a, b, op):
    if op == 'add':
        return a + b
    elif op == 'sub':
        return a - b
    elif op == 'mul':
        return a * b
    elif op == 'div':
        return a / b
    """
    
    review = await agent.review_code(code, "calculator.py")
    
    print("\n" + "="*60)
    print("CODE REVIEW")
    print("="*60)
    print(f"Score: {review.score}/100")
    print(f"Summary: {review.summary}")
    
    print("\nIssues:")
    for issue in review.issues:
        print(f"  [{issue['severity'].upper()}] {issue['location']}: {issue['description']}")
    
    print("\nSuggestions:")
    for suggestion in review.suggestions:
        print(f"  - {suggestion}")


async def example_test_generation():
    """Example: Generate tests."""
    agent = CodingAgent()
    
    code = """
class Calculator:
    def add(self, a, b):
        return a + b
    
    def divide(self, a, b):
        if b == 0:
            raise ValueError("Cannot divide by zero")
        return a / b
"""
    
    tests = await agent.generate_tests(code, framework="pytest")
    
    print("\n" + "="*60)
    print("GENERATED TESTS")
    print("="*60)
    print(tests.content)


async def main():
    """Main entry point."""
    print("\n" + "="*60)
    print("Coding Agent Template")
    print("="*60)
    
    await example_code_generation()
    # await example_code_review()
    # await example_test_generation()


if __name__ == "__main__":
    asyncio.run(main())
