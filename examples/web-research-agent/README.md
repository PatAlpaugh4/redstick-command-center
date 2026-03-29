# Web Research Agent

A simple Python agent that searches the web and generates markdown research reports.

## Features

- 🔍 Extracts keywords from research topics
- 🌐 Performs web searches (simulated in demo, replaceable with real API)
- 📝 Generates formatted markdown reports
- 💾 Saves reports with timestamps

## Usage

```bash
python research_agent.py "Your research topic here"
```

### Example

```bash
python research_agent.py "machine learning applications"
```

## Output

The agent generates a markdown report (`research_report_YYYYMMDD_HHMMSS.md`) containing:
- Executive summary
- Key findings from sources
- Analysis and insights
- List of sources

## Customization

To use a real search API, replace the `search_web()` function with:

```python
import requests

def search_web(query: str, num_results: int = 5):
    # Example using SerpAPI
    api_key = "YOUR_API_KEY"
    url = "https://serpapi.com/search"
    params = {
        "q": query,
        "api_key": api_key,
        "num": num_results
    }
    response = requests.get(url, params=params)
    data = response.json()
    # Parse and return results...
```

## Requirements

- Python 3.7+
- No external dependencies (uses standard library only)

## File Structure

```
web-research-agent/
├── research_agent.py    # Main agent script
├── README.md            # This file
└── research_report_*.md # Generated reports
```
