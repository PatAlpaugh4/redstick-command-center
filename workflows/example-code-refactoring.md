# Workflow: Code Refactoring and Optimization

## Objective

Analyze existing codebase, identify issues, and refactor for improved performance, readability, and maintainability.

## Required Inputs

| Input | Description | Format |
|-------|-------------|--------|
| `code_path` | Path to codebase | Directory path |
| `focus_areas` | Areas to focus on | Array (performance/security/readability) |
| `tech_stack` | Programming language/framework | Enum |
| `output_format` | Report format | Enum (markdown/json) |

## Workflow Steps

### Step 1: Codebase Analysis

**Tool:** `file_read` + `shell_execute`

Analyze codebase structure:

```bash
# Get file structure
find . -type f -name "*.py" -o -name "*.js" -o -name "*.ts" | head -50

# Count lines of code
cloc . --json

# Check for common issues
eslint . --format json
pylint . --output-format=json
```

### Step 2: Issue Detection

**Tool:** `code_runner`

Analyze code for issues:

```python
def analyze_code(files: list) -> dict:
    """Analyze code for various issues"""
    issues = {
        "performance": [],
        "security": [],
        "readability": [],
        "maintainability": []
    }
    
    for file in files:
        content = read_file(file)
        
        # Performance issues
        if "for.*in.*range" in content:
            issues["performance"].append({
                "file": file,
                "line": find_line(content, "for"),
                "issue": "Inefficient loop",
                "suggestion": "Use list comprehension or generator"
            })
        
        # Security issues
        if "eval(" in content or "exec(" in content:
            issues["security"].append({
                "file": file,
                "line": find_line(content, "eval"),
                "issue": "Dangerous function usage",
                "suggestion": "Use ast.literal_eval or json.loads"
            })
        
        # Readability issues
        if count_lines(content) > 100:
            issues["readability"].append({
                "file": file,
                "issue": "Function too long",
                "suggestion": "Break into smaller functions"
            })
    
    return issues
```

### Step 3: Refactoring

**Tool:** `file_edit`

Apply refactoring changes:

```python
def refactor_file(file_path: str, issues: list) -> bool:
    """Apply refactoring to file"""
    content = read_file(file_path)
    
    for issue in issues:
        if issue["type"] == "performance":
            content = apply_performance_fix(content, issue)
        elif issue["type"] == "security":
            content = apply_security_fix(content, issue)
        elif issue["type"] == "readability":
            content = apply_readability_fix(content, issue)
    
    write_file(file_path, content)
    return True
```

### Step 4: Testing

**Tool:** `code_runner`

Run tests to verify changes:

```bash
# Run existing tests
npm test

# Run type checking
npm run type-check

# Run linter
npm run lint

# Run formatter
npm run format
```

### Step 5: Performance Benchmarking

**Tool:** `code_runner`

Benchmark before/after performance:

```python
import time
import statistics

def benchmark_function(func, iterations=100):
    """Benchmark function performance"""
    times = []
    for _ in range(iterations):
        start = time.time()
        func()
        end = time.time()
        times.append(end - start)
    
    return {
        "mean": statistics.mean(times),
        "median": statistics.median(times),
        "stdev": statistics.stdev(times),
        "min": min(times),
        "max": max(times)
    }
```

### Step 6: Report Generation

**Tool:** `file_write`

Generate refactoring report:

```markdown
# Code Refactoring Report

**Date:** [Timestamp]
**Codebase:** [Path]
**Tech Stack:** [Stack]

## Summary

- **Files Analyzed:** [Count]
- **Issues Found:** [Count]
- **Issues Fixed:** [Count]
- **Performance Improvement:** [X%]

## Issues by Category

### Performance ([Count])

| File | Line | Issue | Solution |
|------|------|-------|----------|
| [File] | [Line] | [Issue] | [Solution] |

### Security ([Count])

| File | Line | Issue | Solution |
|------|------|-------|----------|
| [File] | [Line] | [Issue] | [Solution] |

### Readability ([Count])

| File | Line | Issue | Solution |
|------|------|-------|----------|
| [File] | [Line] | [Issue] | [Solution] |

## Performance Benchmarks

| Function | Before | After | Improvement |
|----------|--------|-------|-------------|
| [Function] | [Time] | [Time] | [X%] |

## Files Modified

- [File 1]
- [File 2]
- ...

## Recommendations

1. [Recommendation 1]
2. [Recommendation 2]
3. ...

## Next Steps

- [ ] Run full test suite
- [ ] Deploy to staging
- [ ] Monitor performance metrics
```

## Expected Outputs

| Output | Location | Description |
|--------|----------|-------------|
| Refactored code | Original paths | Modified source files |
| Report | `/output/refactoring-report.md` | Detailed report |
| Benchmarks | `/output/benchmarks.json` | Performance data |
| Test results | `/output/test-results.json` | Test outcomes |

## Edge Cases

### Breaking Changes

**Issue:** Refactoring breaks existing functionality

**Solution:**
1. Run full test suite before and after
2. Use feature flags for major changes
3. Gradual rollout with monitoring
4. Maintain backward compatibility

### Complex Dependencies

**Issue:** Code has complex interdependencies

**Solution:**
1. Create dependency graph
2. Refactor leaf nodes first
3. Work inward toward core
4. Use integration tests

### Legacy Code

**Issue:** Very old code with no tests

**Solution:**
1. Write characterization tests first
2. Document existing behavior
3. Refactor in small increments
4. Add tests as you go

## Performance Considerations

- **Time:** 5-20 minutes depending on codebase size
- **Tokens:** ~50K-300K for large codebases
- **Cost:** $0.15-0.90 depending on size
- **Safety:** Always backup before refactoring

## Agent Swarm Optimization

```
Activate Agent Swarm with 4 agents:
1. Analysis Agent: Scan codebase for issues
2. Performance Agent: Optimize performance bottlenecks
3. Security Agent: Fix security vulnerabilities
4. Testing Agent: Verify all changes

Coordination: Shared issue tracker, sequential file processing
```

## Improvements Log

| Date | Issue | Solution | Status |
|------|-------|----------|--------|
| 2024-01-12 | False positives | Improved detection patterns | ✅ Fixed |
| 2024-01-28 | Breaking changes | Added compatibility layer | ✅ Fixed |
| 2024-02-08 | Large files | Chunked processing | ✅ Improved |

## Usage Example

```python
from kimi_agent_sdk import prompt

async def refactor_codebase():
    async for msg in prompt("""
        Execute workflow: code-refactoring
        Inputs:
        - code_path: "/src"
        - focus_areas: ["performance", "security", "readability"]
        - tech_stack: "typescript"
        - output_format: "markdown"
    """, yolo=True):
        print(msg.extract_text())
```

## Success Criteria

- [ ] All critical issues fixed
- [ ] No breaking changes introduced
- [ ] All tests pass
- [ ] Performance improved by >10%
- [ ] Code coverage maintained or improved
- [ ] Report generated with all findings
