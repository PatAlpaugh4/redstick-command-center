# Travel Deal Finder Agent

A web research agent that automatically finds and analyzes travel deals from multiple sources.

## Features

- **Web Search**: Finds travel deals from multiple sources
- **Browser Automation**: Extracts detailed deal information
- **Data Analysis**: Compares prices, calculates savings
- **Structured Output**: Exports to JSON and CSV formats
- **Intelligent Filtering**: Filters by price, destination, dates

## Project Structure

```
travel-deal-finder/
├── agent.py              # Main agent implementation
├── deal_extractor.py     # Web scraping and data extraction
├── deal_analyzer.py      # Price comparison and analysis
├── data_export.py        # JSON/CSV export functionality
├── config.py             # Configuration settings
├── requirements.txt      # Python dependencies
└── README.md            # This file
```

## Setup Instructions

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure Settings**
   Edit `config.py` to set your preferences:
   - Destinations of interest
   - Price ranges
   - Date ranges
   - Output formats

3. **Run the Agent**
   ```bash
   python agent.py
   ```

## Usage Example

```python
from agent import TravelDealFinder

# Initialize the agent
finder = TravelDealFinder(
    destinations=["Tokyo", "Paris", "Bali"],
    max_price=1500,
    departure_city="New York"
)

# Find deals
deals = finder.find_deals()

# Export results
finder.export_to_json(deals, "deals.json")
finder.export_to_csv(deals, "deals.csv")
```

## Output Format

### JSON Output
```json
{
  "search_date": "2024-01-15",
  "deals": [
    {
      "destination": "Tokyo",
      "price": 899,
      "original_price": 1200,
      "savings": 301,
      "savings_percent": 25,
      "dates": "2024-03-15 to 2024-03-25",
      "source": "example-travel-site.com",
      "deal_score": 8.5
    }
  ]
}
```

### CSV Output
The CSV includes columns: destination, price, original_price, savings, savings_percent, dates, source, deal_score

## Kimi-Specific Patterns

This example demonstrates:
- **Web Search Tool**: For finding deal sources
- **Browser Automation**: For extracting detailed information
- **Structured Output**: JSON/CSV generation
- **Data Analysis**: Price comparison algorithms

## Prompt That Generated This

```
Create a travel deal finder agent that:
1. Uses web search to find travel deals
2. Uses browser automation to extract deal details
3. Analyzes prices and calculates savings
4. Exports structured data to JSON and CSV
5. Includes filtering by destination, price, and dates
```
