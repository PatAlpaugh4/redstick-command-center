#!/usr/bin/env python3
"""
Travel Deal Finder Agent

A web research agent that finds and analyzes travel deals using
web search and browser automation tools.

Kimi-Specific Implementation:
- Uses web_search tool for finding deal sources
- Uses browser automation for extracting details
- Demonstrates structured data processing
"""

import json
import csv
from datetime import datetime
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, asdict

# Import our modules
from deal_extractor import DealExtractor
from deal_analyzer import DealAnalyzer
from config import Config


@dataclass
class TravelDeal:
    """Data class representing a travel deal"""
    destination: str
    price: float
    original_price: float
    departure_city: str
    dates: str
    duration_days: int
    source: str
    url: str
    airline: str = "Unknown"
    hotel_included: bool = False
    deal_score: float = 0.0
    
    @property
    def savings(self) -> float:
        """Calculate dollar savings"""
        return self.original_price - self.price
    
    @property
    def savings_percent(self) -> float:
        """Calculate percentage savings"""
        if self.original_price > 0:
            return round((self.savings / self.original_price) * 100, 1)
        return 0.0


class TravelDealFinder:
    """
    Main agent class for finding travel deals.
    
    Demonstrates Kimi capabilities:
    - Web search integration
    - Browser automation
    - Data processing and analysis
    - Structured output generation
    """
    
    def __init__(self, 
                 destinations: List[str] = None,
                 departure_city: str = "New York",
                 max_price: float = 2000,
                 min_savings_percent: float = 15):
        """
        Initialize the travel deal finder.
        
        Args:
            destinations: List of destination cities to search
            departure_city: City to depart from
            max_price: Maximum deal price to consider
            min_savings_percent: Minimum savings percentage for good deals
        """
        self.destinations = destinations or Config.DEFAULT_DESTINATIONS
        self.departure_city = departure_city
        self.max_price = max_price
        self.min_savings_percent = min_savings_percent
        
        # Initialize components
        self.extractor = DealExtractor()
        self.analyzer = DealAnalyzer()
        
        # Storage for found deals
        self.deals: List[TravelDeal] = []
        self.search_date = datetime.now().isoformat()
    
    def find_deals(self) -> List[TravelDeal]:
        """
        Main method to find travel deals.
        
        This method demonstrates the Kimi workflow:
        1. Search for deal sources
        2. Extract deal details from each source
        3. Analyze and score deals
        4. Filter and return best deals
        
        Returns:
            List of TravelDeal objects
        """
        print(f"🔍 Searching for travel deals from {self.departure_city}...")
        print(f"   Destinations: {', '.join(self.destinations)}")
        print(f"   Max Price: ${self.max_price}")
        print()
        
        all_deals = []
        
        # Search for deals for each destination
        for destination in self.destinations:
            print(f"📍 Searching deals for {destination}...")
            
            # Step 1: Search for deal sources
            search_query = f"{self.departure_city} to {destination} flight deals 2024"
            
            # In a real implementation, this would use the web_search tool
            # For demo purposes, we'll simulate the search results
            search_results = self._simulate_search(destination)
            
            # Step 2: Extract deal details from each source
            for result in search_results:
                deal = self.extractor.extract_deal_details(
                    url=result['url'],
                    destination=destination,
                    departure_city=self.departure_city
                )
                if deal:
                    all_deals.append(deal)
        
        # Step 3: Analyze and score deals
        print(f"\n📊 Analyzing {len(all_deals)} deals...")
        scored_deals = self.analyzer.score_deals(all_deals)
        
        # Step 4: Filter deals based on criteria
        self.deals = self._filter_deals(scored_deals)
        
        print(f"\n✅ Found {len(self.deals)} deals matching your criteria!")
        
        return self.deals
    
    def _simulate_search(self, destination: str) -> List[Dict[str, str]]:
        """
        Simulate web search results for demo purposes.
        
        In a real implementation, this would use:
        web_search(queries=[f"{departure} to {destination} deals"])
        
        Args:
            destination: Destination city
            
        Returns:
            List of search result dictionaries
        """
        # Simulated search results
        return [
            {
                "title": f"Cheap flights to {destination}",
                "url": f"https://example-travel.com/{destination.lower()}-deals",
                "snippet": f"Find the best deals to {destination}"
            },
            {
                "title": f"{destination} vacation packages",
                "url": f"https://example-vacations.com/packages/{destination.lower()}",
                "snippet": f"All-inclusive packages to {destination}"
            }
        ]
    
    def _filter_deals(self, deals: List[TravelDeal]) -> List[TravelDeal]:
        """
        Filter deals based on user criteria.
        
        Args:
            deals: List of all found deals
            
        Returns:
            Filtered list of deals
        """
        filtered = []
        
        for deal in deals:
            # Filter by price
            if deal.price > self.max_price:
                continue
            
            # Filter by savings percentage
            if deal.savings_percent < self.min_savings_percent:
                continue
            
            filtered.append(deal)
        
        # Sort by deal score (highest first)
        filtered.sort(key=lambda x: x.deal_score, reverse=True)
        
        return filtered
    
    def get_deal_summary(self) -> Dict[str, Any]:
        """
        Generate a summary of found deals.
        
        Returns:
            Dictionary with deal statistics
        """
        if not self.deals:
            return {"message": "No deals found"}
        
        prices = [d.price for d in self.deals]
        savings = [d.savings for d in self.deals]
        
        return {
            "search_date": self.search_date,
            "total_deals": len(self.deals),
            "destinations_covered": list(set(d.destination for d in self.deals)),
            "price_range": {
                "min": min(prices),
                "max": max(prices),
                "avg": round(sum(prices) / len(prices), 2)
            },
            "total_potential_savings": round(sum(savings), 2),
            "best_deal": {
                "destination": self.deals[0].destination,
                "price": self.deals[0].price,
                "savings_percent": self.deals[0].savings_percent
            }
        }
    
    def export_to_json(self, filepath: str = "deals.json") -> str:
        """
        Export deals to JSON format.
        
        Args:
            filepath: Output file path
            
        Returns:
            Path to created file
        """
        output = {
            "search_metadata": {
                "date": self.search_date,
                "departure_city": self.departure_city,
                "destinations": self.destinations,
                "max_price": self.max_price
            },
            "summary": self.get_deal_summary(),
            "deals": [asdict(deal) for deal in self.deals]
        }
        
        with open(filepath, 'w') as f:
            json.dump(output, f, indent=2)
        
        print(f"💾 Exported to JSON: {filepath}")
        return filepath
    
    def export_to_csv(self, filepath: str = "deals.csv") -> str:
        """
        Export deals to CSV format.
        
        Args:
            filepath: Output file path
            
        Returns:
            Path to created file
        """
        if not self.deals:
            print("No deals to export")
            return ""
        
        fieldnames = [
            'destination', 'price', 'original_price', 'savings',
            'savings_percent', 'departure_city', 'dates', 'duration_days',
            'airline', 'hotel_included', 'source', 'url', 'deal_score'
        ]
        
        with open(filepath, 'w', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            
            for deal in self.deals:
                row = asdict(deal)
                row['savings'] = deal.savings
                row['savings_percent'] = deal.savings_percent
                writer.writerow(row)
        
        print(f"💾 Exported to CSV: {filepath}")
        return filepath
    
    def print_deals(self):
        """Print deals in a formatted table"""
        if not self.deals:
            print("No deals found")
            return
        
        print("\n" + "="*80)
        print(f"{'DESTINATION':<15} {'PRICE':<10} {'SAVINGS':<10} {'SCORE':<8} {'DATES':<20}")
        print("="*80)
        
        for deal in self.deals[:10]:  # Show top 10
            print(f"{deal.destination:<15} ${deal.price:<9.0f} "
                  f"{deal.savings_percent:.0f}%{'':<6} {deal.deal_score:<8.1f} {deal.dates:<20}")
        
        print("="*80)


def main():
    """
    Main entry point demonstrating the complete workflow.
    """
    print("="*80)
    print("🌍 TRAVEL DEAL FINDER AGENT")
    print("="*80)
    print()
    
    # Initialize the agent with configuration
    finder = TravelDealFinder(
        destinations=["Tokyo", "Paris", "Bali", "London", "Rome"],
        departure_city="New York",
        max_price=1500,
        min_savings_percent=10
    )
    
    # Find deals
    deals = finder.find_deals()
    
    # Print results
    finder.print_deals()
    
    # Generate summary
    summary = finder.get_deal_summary()
    print("\n📈 DEAL SUMMARY:")
    print(json.dumps(summary, indent=2))
    
    # Export results
    finder.export_to_json("travel_deals.json")
    finder.export_to_csv("travel_deals.csv")
    
    print("\n✨ Done! Check the exported files for complete results.")


if __name__ == "__main__":
    main()
