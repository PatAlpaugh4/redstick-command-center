#!/usr/bin/env python3
"""
Chart Generator

Creates charts and visualizations for market research reports.
Uses matplotlib for chart generation.
"""

import matplotlib.pyplot as plt
import numpy as np
from typing import List, Dict, Any, Tuple
import os


class ChartGenerator:
    """
    Generates charts for market research reports.
    
    Chart Types:
    - Bar charts for comparisons
    - Pie charts for market share
    - Line charts for trends
    - Horizontal bar charts for rankings
    """
    
    def __init__(self, output_dir: str = "./temp_charts"):
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)
    
    def create_market_share_chart(self, 
                                   data: Dict[str, float],
                                   title: str = "Market Share") -> str:
        """
        Create pie chart for market share.
        
        Args:
            data: Dictionary of company -> market share %
            title: Chart title
            
        Returns:
            Path to generated chart image
        """
        fig, ax = plt.subplots(figsize=(8, 6))
        
        companies = list(data.keys())
        shares = list(data.values())
        
        colors = plt.cm.Set3(np.linspace(0, 1, len(companies)))
        
        wedges, texts, autotexts = ax.pie(
            shares, 
            labels=companies, 
            autopct='%1.1f%%',
            colors=colors,
            startangle=90
        )
        
        ax.set_title(title, fontsize=14, fontweight='bold')
        
        # Save chart
        chart_path = os.path.join(self.output_dir, "market_share.png")
        plt.savefig(chart_path, dpi=150, bbox_inches='tight')
        plt.close()
        
        return chart_path
    
    def create_price_comparison_chart(self,
                                       data: Dict[str, float],
                                       title: str = "Price Comparison") -> str:
        """
        Create horizontal bar chart for price comparison.
        
        Args:
            data: Dictionary of product -> price
            title: Chart title
            
        Returns:
            Path to generated chart image
        """
        fig, ax = plt.subplots(figsize=(10, 6))
        
        products = list(data.keys())
        prices = list(data.values())
        
        # Sort by price
        sorted_data = sorted(zip(products, prices), key=lambda x: x[1])
        products, prices = zip(*sorted_data)
        
        colors = plt.cm.viridis(np.linspace(0.3, 0.9, len(products)))
        
        bars = ax.barh(products, prices, color=colors)
        
        ax.set_xlabel('Price (USD)', fontsize=12)
        ax.set_title(title, fontsize=14, fontweight='bold')
        ax.grid(axis='x', alpha=0.3)
        
        # Add value labels
        for i, (bar, price) in enumerate(zip(bars, prices)):
            ax.text(price + 1000, i, f'${price:,.0f}', 
                   va='center', fontsize=9)
        
        chart_path = os.path.join(self.output_dir, "price_comparison.png")
        plt.savefig(chart_path, dpi=150, bbox_inches='tight')
        plt.close()
        
        return chart_path
    
    def create_sentiment_chart(self,
                                data: Dict[str, Dict[str, float]],
                                title: str = "Sentiment Analysis") -> str:
        """
        Create grouped bar chart for sentiment comparison.
        
        Args:
            data: Dictionary of company -> sentiment scores
            title: Chart title
            
        Returns:
            Path to generated chart image
        """
        fig, ax = plt.subplots(figsize=(12, 6))
        
        companies = list(data.keys())
        categories = ['positive', 'neutral', 'negative']
        
        x = np.arange(len(companies))
        width = 0.25
        
        colors = {'positive': '#2ecc71', 'neutral': '#f39c12', 'negative': '#e74c3c'}
        
        for i, category in enumerate(categories):
            values = [data[comp].get(category, 0) for comp in companies]
            ax.bar(x + i * width, values, width, 
                   label=category.title(), color=colors[category])
        
        ax.set_xlabel('Company', fontsize=12)
        ax.set_ylabel('Sentiment %', fontsize=12)
        ax.set_title(title, fontsize=14, fontweight='bold')
        ax.set_xticks(x + width)
        ax.set_xticklabels(companies, rotation=45, ha='right')
        ax.legend()
        ax.grid(axis='y', alpha=0.3)
        
        chart_path = os.path.join(self.output_dir, "sentiment_analysis.png")
        plt.savefig(chart_path, dpi=150, bbox_inches='tight')
        plt.close()
        
        return chart_path
    
    def create_trend_chart(self,
                           data: Dict[str, List[float]],
                           labels: List[str],
                           title: str = "Market Trends") -> str:
        """
        Create line chart for trend analysis.
        
        Args:
            data: Dictionary of metric -> values over time
            labels: X-axis labels (time periods)
            title: Chart title
            
        Returns:
            Path to generated chart image
        """
        fig, ax = plt.subplots(figsize=(10, 6))
        
        for metric, values in data.items():
            ax.plot(labels, values, marker='o', label=metric, linewidth=2)
        
        ax.set_xlabel('Time Period', fontsize=12)
        ax.set_ylabel('Value', fontsize=12)
        ax.set_title(title, fontsize=14, fontweight='bold')
        ax.legend()
        ax.grid(alpha=0.3)
        
        chart_path = os.path.join(self.output_dir, "market_trends.png")
        plt.savefig(chart_path, dpi=150, bbox_inches='tight')
        plt.close()
        
        return chart_path
    
    def create_competitor_comparison_chart(self,
                                           data: Dict[str, Dict[str, float]],
                                           metrics: List[str],
                                           title: str = "Competitor Comparison") -> str:
        """
        Create radar chart for multi-metric competitor comparison.
        
        Args:
            data: Dictionary of company -> metric scores
            metrics: List of metrics to compare
            title: Chart title
            
        Returns:
            Path to generated chart image
        """
        fig, ax = plt.subplots(figsize=(8, 8), subplot_kw=dict(projection='polar'))
        
        # Number of metrics
        num_metrics = len(metrics)
        
        # Compute angle for each metric
        angles = [n / float(num_metrics) * 2 * np.pi for n in range(num_metrics)]
        angles += angles[:1]  # Complete the circle
        
        # Plot each competitor
        colors = plt.cm.Set2(np.linspace(0, 1, len(data)))
        
        for i, (company, scores) in enumerate(data.items()):
            values = [scores.get(m, 0) for m in metrics]
            values += values[:1]  # Complete the circle
            
            ax.plot(angles, values, 'o-', linewidth=2, 
                   label=company, color=colors[i])
            ax.fill(angles, values, alpha=0.15, color=colors[i])
        
        # Set metric labels
        ax.set_xticks(angles[:-1])
        ax.set_xticklabels(metrics)
        
        ax.set_title(title, fontsize=14, fontweight='bold', pad=20)
        ax.legend(loc='upper right', bbox_to_anchor=(1.3, 1.0))
        
        chart_path = os.path.join(self.output_dir, "competitor_comparison.png")
        plt.savefig(chart_path, dpi=150, bbox_inches='tight')
        plt.close()
        
        return chart_path


# Example usage
if __name__ == "__main__":
    generator = ChartGenerator()
    
    # Market share chart
    market_share = {
        "Tesla": 18.5,
        "BYD": 16.2,
        "VW": 8.5,
        "GM": 7.8,
        "Ford": 6.5
    }
    path1 = generator.create_market_share_chart(market_share)
    print(f"Market share chart: {path1}")
    
    # Price comparison
    prices = {
        "Tesla Model 3": 38990,
        "Ford Mach-E": 42995,
        "GM Bolt": 26500,
        "Rivian R1T": 73900
    }
    path2 = generator.create_price_comparison_chart(prices)
    print(f"Price comparison chart: {path2}")
    
    # Sentiment chart
    sentiment = {
        "Tesla": {"positive": 72, "neutral": 18, "negative": 10},
        "Ford": {"positive": 68, "neutral": 22, "negative": 10},
        "GM": {"positive": 65, "neutral": 25, "negative": 10}
    }
    path3 = generator.create_sentiment_chart(sentiment)
    print(f"Sentiment chart: {path3}")
