#!/usr/bin/env python3
"""
Configuration Module

Central configuration settings for the Market Research Report Generator.
"""

from typing import List, Dict, Any


class Config:
    """
    Configuration class for Market Research Report Generator.
    
    Modify these settings to customize your research.
    """
    
    # Default research parameters
    DEFAULT_TARGET_COMPANY: str = "Tesla"
    DEFAULT_INDUSTRY: str = "Electric Vehicles"
    DEFAULT_COMPETITORS: List[str] = [
        "Ford",
        "General Motors",
        "Rivian",
        "Lucid Motors",
        "BYD"
    ]
    
    # Research depth
    # Options: "basic", "standard", "deep"
    RESEARCH_DEPTH: str = "standard"
    
    # Data sources
    ENABLE_WEB_SEARCH: bool = True
    ENABLE_NEWS_SEARCH: bool = True
    ENABLE_REVIEW_AGGREGATION: bool = True
    
    # Report settings
    REPORT_FORMAT: str = "docx"  # Options: "docx", "pdf", "html"
    INCLUDE_CHARTS: bool = True
    INCLUDE_TABLES: bool = True
    INCLUDE_RECOMMENDATIONS: bool = True
    
    # Chart settings
    CHART_STYLE: str = "seaborn"
    CHART_DPI: int = 150
    CHART_FORMAT: str = "png"
    
    # Output settings
    OUTPUT_DIRECTORY: str = "./reports"
    TEMP_CHART_DIRECTORY: str = "./temp_charts"
    
    # Analysis settings
    SENTIMENT_ANALYSIS_ENABLED: bool = True
    PRICING_ANALYSIS_ENABLED: bool = True
    COMPETITOR_ANALYSIS_ENABLED: bool = True
    TREND_ANALYSIS_ENABLED: bool = True
    
    # Data limits
    MAX_COMPETITORS: int = 10
    MAX_PRODUCTS_PER_COMPETITOR: int = 10
    MAX_REVIEWS_PER_COMPANY: int = 1000
    
    # API settings (for real implementations)
    API_TIMEOUT_SECONDS: int = 30
    MAX_RETRIES: int = 3
    
    # Cache settings
    CACHE_ENABLED: bool = True
    CACHE_DURATION_HOURS: int = 24


# Research depth configurations
class ResearchDepth:
    """Research depth presets"""
    
    BASIC = {
        "max_competitors": 3,
        "max_products": 5,
        "max_reviews": 500,
        "include_charts": False,
        "analysis_detail": "summary"
    }
    
    STANDARD = {
        "max_competitors": 5,
        "max_products": 10,
        "max_reviews": 1000,
        "include_charts": True,
        "analysis_detail": "standard"
    }
    
    DEEP = {
        "max_competitors": 10,
        "max_products": 20,
        "max_reviews": 5000,
        "include_charts": True,
        "analysis_detail": "comprehensive"
    }


# Industry presets
class IndustryPresets:
    """Pre-configured settings for different industries"""
    
    TECH = {
        "data_sources": ["crunchbase", "techcrunch", "producthunt"],
        "key_metrics": ["funding", "users", "revenue", "growth"]
    }
    
    RETAIL = {
        "data_sources": ["yelp", "google_reviews", "trustpilot"],
        "key_metrics": ["locations", "revenue", "customer_satisfaction"]
    }
    
    SAAS = {
        "data_sources": ["g2", "capterra", "trustradius"],
        "key_metrics": ["mrr", "arr", "churn", "nps"]
    }
