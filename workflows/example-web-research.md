# Workflow: Web Research and Report Generation

## Objective

Conduct comprehensive web research on a given topic and generate a structured markdown report with findings, analysis, and citations.

## Required Inputs

| Input | Description | Format |
|-------|-------------|--------|
| `topic` | Research topic or question | String |
| `depth` | Research depth (basic/detailed/comprehensive) | Enum |
| `sources` | Number of sources to gather | Integer (default: 10) |
| `output_format` | Report format (markdown/docx/pdf) | Enum (default: markdown) |

## Workflow Steps

### Step 1: Query Generation

**Tool:** `code_runner` (Python)

Generate search queries from the topic:

```python
def generate_queries(topic: str, depth: str) -> list:
    """Generate search queries based on topic and depth"""
    if depth == "basic":
        return [topic]
    elif depth == "detailed":
        return [
            topic,
            f"{topic} latest trends 2024",
            f"{topic} best practices"
        ]
    else:  # comprehensive
        return [
            topic,
            f"{topic} latest trends 2024",
            f"{topic} best practices",
            f"{topic} case studies",
            f"{topic} market analysis",
            f"{topic} expert opinions"
        ]
```

### Step 2: Web Search

**Tool:** `web_search`

Execute searches for each query:

```
For each query in queries:
    results = web_search(query, num_results=5)
    store results in raw_data/
```

### Step 3: Content Extraction

**Tool:** `browser_visit` + `browser_scroll`

Visit top results and extract content:

```
For each URL in search_results:
    page = browser_visit(URL)
    content = extract_text(page)
    save to .tmp/extracted/{timestamp}_{domain}.txt
```

### Step 4: Analysis

**Tool:** `code_runner` (Python with NLP)

Analyze extracted content:

```python
def analyze_content(files: list) -> dict:
    """Analyze content for key themes, sentiment, trends"""
    # Extract key themes
    # Sentiment analysis
    # Identify trends
    # Generate statistics
    return analysis_results
```

### Step 5: Report Generation

**Tool:** `file_write`

Generate structured markdown report:

```markdown
# Research Report: [TOPIC]

**Date:** [Timestamp]
**Research Depth:** [Depth]
**Sources:** [Count]

## Executive Summary

[2-3 paragraph summary]

## Key Findings

### Finding 1: [Title]
[Description with citations]

### Finding 2: [Title]
[Description with citations]

## Analysis

### Trends
- [Trend 1]
- [Trend 2]

### Sentiment
[Overall sentiment analysis]

### Market Landscape
[Competitive analysis if applicable]

## Sources

1. [Title] - [URL]
2. [Title] - [URL]
...

## Appendix

### Raw Data
[Links to raw extracted files]
```

### Step 6: Export (Optional)

**Tool:** `code_runner`

Convert to requested format:

```python
def export_report(input_file: str, format: str) -> str:
    """Convert markdown to docx/pdf"""
    if format == "docx":
        # Use python-docx
        pass
    elif format == "pdf":
        # Use weasyprint or similar
        pass
    return output_file
```

## Expected Outputs

| Output | Location | Description |
|--------|----------|-------------|
| `report.md` | `/output/research-report.md` | Main report |
| `raw_data/` | `.tmp/raw/` | Search results |
| `extracted/` | `.tmp/extracted/` | Scraped content |
| `analysis.json` | `.tmp/analysis.json` | Analysis results |

## Edge Cases

### Rate Limiting

**Issue:** Search APIs return rate limit errors

**Solution:**
1. Implement exponential backoff
2. Cache results to avoid re-search
3. Use multiple API keys if available
4. Document rate limits in workflow

### Content Extraction Failure

**Issue:** Website blocks scraping or returns empty content

**Solution:**
1. Try alternative selectors
2. Use textise dot iitty service
3. Skip and mark as failed in report
4. Document failure in sources section

### Irrelevant Results

**Issue:** Search returns off-topic content

**Solution:**
1. Refine queries with more specific keywords
2. Add negative keywords to exclude
3. Manual review and filtering
4. Update query generation logic

## Performance Considerations

- **Time:** 5-15 minutes depending on depth
- **Tokens:** ~50K-200K for comprehensive research
- **Cost:** $0.15-0.60 depending on depth
- **Parallelization:** Search and extraction can be parallelized with Agent Swarm

## Agent Swarm Optimization

For faster execution, use Agent Swarm:

```
Activate Agent Swarm with 4 agents:
1. Search Agent: Execute all web searches in parallel
2. Extraction Agent: Scrape all URLs simultaneously
3. Analysis Agent: Process and analyze content
4. Report Agent: Generate final report

Coordination: Use shared memory for results
```

## Improvements Log

| Date | Issue | Solution | Status |
|------|-------|----------|--------|
| 2024-01-15 | Rate limiting | Added exponential backoff | ✅ Fixed |
| 2024-01-20 | Content extraction | Added fallback selectors | ✅ Fixed |
| 2024-02-01 | Slow execution | Implemented Agent Swarm | ✅ Improved |

## Usage Example

```python
# Using kimi-agent-sdk
from kimi_agent_sdk import prompt

async def run_research():
    async for msg in prompt("""
        Execute workflow: web-research
        Inputs:
        - topic: "AI development tools market 2024"
        - depth: "comprehensive"
        - sources: 15
        - output_format: "markdown"
    """, yolo=True):
        print(msg.extract_text())
```

## Success Criteria

- [ ] Report generated with all sections
- [ ] At least 80% of sources successfully extracted
- [ ] All citations link to valid URLs
- [ ] Analysis includes quantitative metrics
- [ ] Report saved to specified output location
