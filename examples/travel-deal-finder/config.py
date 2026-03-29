#!/usr/bin/env python3
"""
Configuration Module

Central configuration settings for the Travel Deal Finder.
"""

from typing import List, Dict, Any


class Config:
    """
    Configuration class for Travel Deal Finder.
    
    Modify these settings to customize your deal search.
    """
    
    # Default destinations to search
    DEFAULT_DESTINATIONS: List[str] = [
        "Tokyo",
        "Paris",
        "Bali",
        "London",
        "Rome",
        "Sydney",
        "Dubai",
        "Barcelona",
        "Amsterdam"
    ]
    
    # Default departure city
    DEFAULT_DEPARTURE_CITY: str = "New York"
    
    # Price filters
    MAX_PRICE: float = 2000.0
    MIN_PRICE: float = 200.0
    
    # Savings threshold (minimum % to consider a "good deal")
    MIN_SAVINGS_PERCENT: float = 15.0
    
    # Date preferences
    PREFERRED_MONTHS: List[str] = ["Mar", "Apr", "May", "Sep", "Oct"]
    MIN_DURATION_DAYS: int = 5
    MAX_DURATION_DAYS: int = 21
    
    # Airline preferences (empty = no preference)
    PREFERRED_AIRLINES: List[str] = []
    
    # Output settings
    OUTPUT_FORMATS: List[str] = ["json", "csv"]
    DEFAULT_OUTPUT_DIR: str = "./output"
    
    # Search settings
    SEARCH_TIMEOUT_SECONDS: int = 30
    MAX_RESULTS_PER_DESTINATION: int = 10
    
    # Deal scoring weights
    SCORING_WEIGHTS: Dict[str, float] = {
        "savings": 0.40,
        "market_comparison": 0.30,
        "package_value": 0.20,
        "duration_value": 0.10
    }
    
    # API endpoints (for real implementations)
    TRAVEL_APIS: Dict[str, str] = {
        "skyscanner": "https://api.skyscanner.net",
        "kayak": "https://api.kayak.com",
        "expedia": "https://api.expedia.com"
    }
    
    # User agent for web requests
    USER_AGENT: str = "TravelDealFinder/1.0"
    
    # Cache settings
    CACHE_ENABLED: bool = True
    CACHE_DURATION_HOURS: int = 24


# Example configuration presets
class Presets:
    """Pre-configured settings for common use cases"""
    
    BUDGET_TRAVELER = {
        "max_price": 800,
        "min_savings_percent": 20,
        "destinations": ["Mexico City", "Bali", "Thailand", "Portugal"]
    }
    
    LUXURY_TRAVELER = {
        "max_price": 5000,
        "min_savings_percent": 10,
        "destinations": ["Maldives", "Seychelles", "Bora Bora", "Dubai"]
    }
    
    EUROPE_FOCUSED = {
        "max_price": 1500,
        "min_savings_percent": 15,
        "destinations": ["Paris", "London", "Rome", "Barcelona", "Amsterdam"]
    }
    
    ASIA_FOCUSED = {
        "max_price": 1800,
        "min_savings_percent": 15,
        "destinations": ["Tokyo", "Seoul", "Bangkok", "Singapore", "Hong Kong"]
    }
