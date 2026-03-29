# Market Research Report Generator

A multi-agent research system that generates comprehensive market research reports with competitor analysis, pricing data, and sentiment analysis.

## Features

- **Multi-Agent Architecture**: Parallel research agents working together
- **Competitor Analysis**: Analyzes competitor strategies and positioning
- **Pricing Intelligence**: Collects and analyzes pricing data
- **Sentiment Analysis**: Analyzes customer sentiment from reviews
- **Report Generation**: Creates professional DOCX reports with charts

## Project Structure

```
market-research-report/
├── agents/
│   ├── __init__.py
│   ├── base_agent.py       # Base agent class
│   ├── competitor_agent.py # Competitor analysis agent
│   ├── pricing_agent.py    # Pricing intelligence agent
│   └── sentiment_agent.py  # Sentiment analysis agent
├── report/
│   ├── __init__.py
│   ├── report_generator.py # DOCX report generation
│   └── chart_generator.py  # Chart creation
├── orchestrator.py         # Multi-agent orchestrator
├── config.py              # Configuration settings
├── requirements.txt       # Python dependencies
└── README.md             # This file
```

## Setup Instructions

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure Research Parameters**
   Edit `config.py` to set:
   - Target industry/company
   - Competitors to analyze
   - Research depth
   - Report format preferences

3. **Run the Research System**
   ```bash
   python orchestrator.py
   ```

## Usage Example

```python
from orchestrator import ResearchOrchestrator

# Initialize the orchestrator
orchestrator = ResearchOrchestrator(
    target_company="Tesla",
    industry="Electric Vehicles",
    competitors=["Ford", "GM", "Rivian", "Lucid"]
)

# Run parallel research
results = orchestrator.run_research()

# Generate report
orchestrator.generate_report("tesla_market_research.docx")
```

## Multi-Agent Workflow

```
┌─────────────────┐
│  Orchestrator   │
└────────┬────────┘
         │
    ┌────┴────┬────────────┬─────────────┐
    │         │            │             │
    ▼         ▼            ▼             ▼
┌───────┐ ┌───────┐  ┌──────────┐  ┌──────────┐
│Competitor│ │Pricing│  │Sentiment │  │  Trend   │
│  Agent   │ │ Agent │  │  Agent   │  │  Agent   │
└────┬───┘ └───┬───┘  └────┬─────┘  └────┬─────┘
     │         │           │             │
     └─────────┴─────┬─────┴─────────────┘
                     │
                     ▼
            ┌────────────────┐
            │ Report Generator│
            │   (DOCX + Charts)│
            └────────────────┘
```

## Output Format

The generated report includes:
- Executive Summary
- Competitor Analysis (with comparison tables)
- Pricing Intelligence (with charts)
- Sentiment Analysis (with visualizations)
- Market Trends
- Strategic Recommendations

## Kimi-Specific Patterns

This example demonstrates:
- **Multi-Agent Coordination**: Parallel agent execution
- **Web Search**: Research data collection
- **Data Analysis**: Statistical analysis and insights
- **Document Generation**: DOCX creation with python-docx
- **Chart Generation**: matplotlib/seaborn visualizations

## Prompt That Generated This

```
Create a multi-agent market research system that:
1. Has multiple specialized agents working in parallel
2. Performs competitor analysis, pricing research, and sentiment analysis
3. Collects data using web search and browser automation
4. Analyzes and synthesizes findings
5. Generates a professional DOCX report with charts and tables
```
