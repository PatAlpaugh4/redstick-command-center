#!/usr/bin/env python3
"""
Deal Analyzer Module

Analyzes and scores travel deals based on multiple factors.
Demonstrates data analysis patterns for Kimi.
"""

from typing import List, Dict, Any
from dataclasses import dataclass
import statistics


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
        return self.original_price - self.price
    
    @property
    def savings_percent(self) -> float:
        if self.original_price > 0:
            return round((self.savings / self.original_price) * 100, 1)
        return 0.0


class DealAnalyzer:
    """
    Analyzes travel deals and calculates deal scores.
    
    Scoring Factors:
    - Price savings (40% weight)
    - Price relative to market (30% weight)
    - Package value (20% weight)
    - Duration value (10% weight)
    """
    
    def __init__(self):
        self.market_averages = self._load_market_averages()
    
    def _load_market_averages(self) -> Dict[str, float]:
        """
        Load average prices by destination for comparison.
        In a real implementation, this could come from a database
        or historical data analysis.
        """
        return {
            "Tokyo": 1100,
            "Paris": 850,
            "Bali": 1250,
            "London": 750,
            "Rome": 800,
            "Sydney": 1400,
            "Dubai": 1000,
            "New York": 600,
            "Los Angeles": 700
        }
    
    def score_deals(self, deals: List[TravelDeal]) -> List[TravelDeal]:
        """
        Calculate deal scores for all deals.
        
        Args:
            deals: List of TravelDeal objects
            
        Returns:
            List of deals with calculated scores
        """
        scored_deals = []
        
        for deal in deals:
            score = self._calculate_deal_score(deal)
            deal.deal_score = score
            scored_deals.append(deal)
        
        return scored_deals
    
    def _calculate_deal_score(self, deal: TravelDeal) -> float:
        """
        Calculate a comprehensive deal score (0-10).
        
        Scoring Algorithm:
        - Savings Score (40%): Higher savings = higher score
        - Market Comparison (30%): Price vs market average
        - Package Value (20%): Hotel inclusion bonus
        - Duration Value (10%): Cost per day efficiency
        
        Args:
            deal: TravelDeal to score
            
        Returns:
            Deal score from 0-10
        """
        # Savings score (0-10 based on savings percentage)
        savings_score = min(deal.savings_percent / 5, 10) * 0.40
        
        # Market comparison score
        market_avg = self.market_averages.get(deal.destination, deal.price * 1.2)
        if market_avg > 0:
            market_ratio = deal.price / market_avg
            market_score = max(0, (1 - market_ratio) + 1) * 5 * 0.30
        else:
            market_score = 5 * 0.30
        
        # Package value score
        package_score = 7 if deal.hotel_included else 5
        package_score *= 0.20
        
        # Duration value score (cost per day)
        if deal.duration_days > 0:
            cost_per_day = deal.price / deal.duration_days
            duration_score = max(0, 10 - (cost_per_day / 50)) * 0.10
        else:
            duration_score = 5 * 0.10
        
        # Calculate total score
        total_score = savings_score + market_score + package_score + duration_score
        
        return round(min(total_score, 10), 2)
    
    def get_price_analysis(self, deals: List[TravelDeal]) -> Dict[str, Any]:
        """
        Generate price analysis statistics.
        
        Args:
            deals: List of TravelDeal objects
            
        Returns:
            Dictionary with price statistics
        """
        if not deals:
            return {"error": "No deals to analyze"}
        
        prices = [d.price for d in deals]
        savings = [d.savings_percent for d in deals]
        
        analysis = {
            "price_statistics": {
                "mean": round(statistics.mean(prices), 2),
                "median": round(statistics.median(prices), 2),
                "min": min(prices),
                "max": max(prices),
                "std_dev": round(statistics.stdev(prices), 2) if len(prices) > 1 else 0
            },
            "savings_statistics": {
                "mean_percent": round(statistics.mean(savings), 1),
                "median_percent": round(statistics.median(savings), 1),
                "max_percent": max(savings)
            },
            "total_deals": len(deals),
            "destinations": list(set(d.destination for d in deals)),
            "average_deal_score": round(
                statistics.mean([d.deal_score for d in deals]), 2
            )
        }
        
        return analysis
    
    def find_best_deals(self, 
                       deals: List[TravelDeal], 
                       top_n: int = 5) -> List[TravelDeal]:
        """
        Find the top N best deals based on score.
        
        Args:
            deals: List of TravelDeal objects
            top_n: Number of top deals to return
            
        Returns:
            List of top N deals
        """
        sorted_deals = sorted(deals, key=lambda x: x.deal_score, reverse=True)
        return sorted_deals[:top_n]
    
    def compare_destinations(self, deals: List[TravelDeal]) -> Dict[str, Any]:
        """
        Compare deals across different destinations.
        
        Args:
            deals: List of TravelDeal objects
            
        Returns:
            Dictionary with destination comparisons
        """
        destination_stats = {}
        
        for deal in deals:
            dest = deal.destination
            if dest not in destination_stats:
                destination_stats[dest] = {
                    "deals_count": 0,
                    "prices": [],
                    "savings": [],
                    "scores": []
                }
            
            destination_stats[dest]["deals_count"] += 1
            destination_stats[dest]["prices"].append(deal.price)
            destination_stats[dest]["savings"].append(deal.savings_percent)
            destination_stats[dest]["scores"].append(deal.deal_score)
        
        # Calculate averages for each destination
        comparison = {}
        for dest, stats in destination_stats.items():
            comparison[dest] = {
                "deals_count": stats["deals_count"],
                "avg_price": round(statistics.mean(stats["prices"]), 2),
                "avg_savings_percent": round(statistics.mean(stats["savings"]), 1),
                "avg_deal_score": round(statistics.mean(stats["scores"]), 2),
                "best_price": min(stats["prices"])
            }
        
        return comparison


# Example usage
if __name__ == "__main__":
    analyzer = DealAnalyzer()
    
    # Create sample deals
    sample_deals = [
        TravelDeal("Tokyo", 899, 1200, "NYC", "Mar 15-25", 10, "site.com", "url"),
        TravelDeal("Paris", 650, 900, "NYC", "Apr 10-17", 7, "site.com", "url"),
        TravelDeal("Bali", 1100, 1500, "NYC", "May 5-15", 10, "site.com", "url"),
    ]
    
    # Score deals
    scored = analyzer.score_deals(sample_deals)
    
    # Print analysis
    for deal in scored:
        print(f"{deal.destination}: ${deal.price} - Score: {deal.deal_score}")
    
    # Get price analysis
    analysis = analyzer.get_price_analysis(scored)
    print("\nPrice Analysis:")
    print(analysis)
