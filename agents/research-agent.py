#!/usr/bin/env python3
"""
Research Agent Template for Kimi Code
=====================================
A specialized agent for web research, data gathering, and report generation.

Features:
- Web search integration
- Multi-source research
- Report generation in multiple formats
- Source tracking and citation
- Research caching

Installation:
    pip install kimi-agent-sdk

Environment Variables:
    KIMI_API_KEY - Your Kimi API key
    KIMI_BASE_URL - Optional: Custom API base URL
"""

import os
import asyncio
import json
from typing import Optional, List, Dict, Any
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path

# =============================================================================
# SDK Imports
# =============================================================================
from kimi_agent_sdk import prompt, Session, Config
from kimi_agent_sdk.types import TextPart, ApprovalRequest, ToolCallPart

# =============================================================================
# Configuration
# =============================================================================

KIMI_API_KEY = os.getenv("KIMI_API_KEY")
KIMI_BASE_URL = os.getenv("KIMI_BASE_URL", "https://api.moonshot.cn/v1")

if not KIMI_API_KEY:
    raise ValueError("KIMI_API_KEY environment variable is required")

DEFAULT_CONFIG = Config(
    provider="kimi",
    model="kimi-k2-0711-preview",
    api_key=KIMI_API_KEY,
    base_url=KIMI_BASE_URL,
    temperature=0.3,  # Lower temperature for factual research
    max_tokens=8192,
)


# =============================================================================
# Data Models
# =============================================================================

@dataclass
class ResearchSource:
    """Represents a research source."""
    title: str
    url: str
    content: str
    accessed_at: str = field(default_factory=lambda: datetime.now().isoformat())
    reliability: str = "medium"  # high, medium, low


@dataclass
class ResearchFinding:
    """Represents a research finding."""
    topic: str
    content: str
    sources: List[ResearchSource] = field(default_factory=list)
    confidence: str = "medium"  # high, medium, low


@dataclass
class ResearchReport:
    """Final research report."""
    query: str
    summary: str
    findings: List[ResearchFinding]
    sources: List[ResearchSource]
    recommendations: List[str]
    generated_at: str = field(default_factory=lambda: datetime.now().isoformat())
    metadata: Dict[str, Any] = field(default_factory=dict)


# =============================================================================
# Research Agent
# =============================================================================

class ResearchAgent:
    """
    Specialized agent for conducting research and generating reports.
    
    Capabilities:
    - Multi-query research
    - Source verification
    - Report generation (markdown, JSON)
    - Research caching
    - Fact-checking
    """
    
    def __init__(
        self,
        config: Optional[Config] = None,
        cache_dir: Optional[str] = None,
        max_sources: int = 10,
    ):
        self.config = config or DEFAULT_CONFIG
        self.max_sources = max_sources
        
        # Setup cache
        self.cache_dir = Path(cache_dir) if cache_dir else Path.home() / ".research_agent_cache"
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        
        # Research history
        self.research_history: List[Dict] = []
        
        # System prompts for different research phases
        self.query_expansion_prompt = """You are a Research Query Specialist.
Your task is to expand a research topic into multiple specific search queries.

Given a research topic, generate 3-5 specific search queries that will help gather comprehensive information.
Each query should target a different aspect of the topic.

Output format: JSON array of query strings
Example: ["query 1", "query 2", "query 3"]"""

        self.synthesis_prompt = """You are a Research Synthesis Specialist.
Your task is to synthesize research findings into a coherent report.

Guidelines:
1. Organize findings by theme or topic
2. Identify key insights and patterns
3. Note any contradictions or gaps in information
4. Assess the reliability of sources
5. Provide actionable recommendations

Structure your response with:
- Executive Summary
- Key Findings (with confidence levels)
- Detailed Analysis
- Recommendations
- Sources"""

        self.fact_check_prompt = """You are a Fact-Checking Specialist.
Your task is to verify claims and identify potential misinformation.

For each claim:
1. Assess its verifiability
2. Note any supporting or contradicting evidence
3. Assign a confidence score (high/medium/low/uncertain)
4. Flag any suspicious or unverifiable claims

Output format:
- Claim: [the claim]
- Verdict: [verified/partially verified/unverified/false]
- Confidence: [high/medium/low]
- Notes: [explanation]"""
    
    # =============================================================================
    # Web Search Integration
    # =============================================================================
    
    async def _web_search(self, query: str, num_results: int = 5) -> List[Dict]:
        """
        Perform web search. 
        
        Note: This is a placeholder. In production, integrate with:
        - SerpAPI (Google Search)
        - Bing Search API
        - DuckDuckGo
        - Custom search service
        """
        # Placeholder implementation
        # In production, replace with actual search API call
        return [
            {
                "title": f"Search result for: {query}",
                "url": "https://example.com",
                "snippet": f"This is a placeholder result for '{query}'",
            }
        ]
    
    async def _fetch_content(self, url: str) -> str:
        """
        Fetch content from a URL.
        
        Note: This is a placeholder. In production, use:
        - requests/aiohttp for fetching
        - BeautifulSoup/Readability for extraction
        - Playwright for JavaScript-heavy sites
        """
        # Placeholder implementation
        return f"Content from {url}"
    
    # =============================================================================
    # Research Methods
    # =============================================================================
    
    async def expand_queries(self, topic: str) -> List[str]:
        """Expand a research topic into multiple search queries."""
        prompt_text = f"Expand this research topic into search queries:\n\nTopic: {topic}"
        
        response = await prompt(
            prompt_text,
            system=self.query_expansion_prompt,
            config=self.config,
        )
        
        try:
            queries = json.loads(response)
            if isinstance(queries, list):
                return queries
        except json.JSONDecodeError:
            pass
        
        # Fallback: return topic as single query
        return [topic]
    
    async def research_topic(
        self,
        topic: str,
        depth: str = "medium",  # shallow, medium, deep
    ) -> List[ResearchFinding]:
        """
        Conduct research on a topic.
        
        Args:
            topic: Research topic or question
            depth: Research depth (shallow/medium/deep)
        
        Returns:
            List of research findings
        """
        print(f"\n[Research] Starting research on: {topic}")
        
        # Step 1: Expand queries
        print("[Research] Expanding queries...")
        queries = await self.expand_queries(topic)
        print(f"[Research] Generated {len(queries)} queries")
        
        # Adjust based on depth
        if depth == "shallow":
            queries = queries[:2]
        elif depth == "deep":
            queries = queries[:7]
        
        # Step 2: Search and gather sources
        print("[Research] Gathering sources...")
        all_sources: List[ResearchSource] = []
        
        for query in queries:
            search_results = await self._web_search(query, num_results=3)
            
            for result in search_results:
                source = ResearchSource(
                    title=result.get("title", "Unknown"),
                    url=result.get("url", ""),
                    content=result.get("snippet", ""),
                )
                all_sources.append(source)
        
        # Limit sources
        all_sources = all_sources[:self.max_sources]
        print(f"[Research] Gathered {len(all_sources)} sources")
        
        # Step 3: Analyze and synthesize findings
        print("[Research] Analyzing findings...")
        
        sources_text = "\n\n".join([
            f"Source: {s.title}\nURL: {s.url}\nContent: {s.content}"
            for s in all_sources
        ])
        
        analysis_prompt = f"""Research Topic: {topic}

Sources:
{sources_text}

Please analyze these sources and extract key findings. For each finding:
1. Identify the main insight or fact
2. Note which sources support it
3. Assess confidence level (high/medium/low)

Output format: JSON array of findings
[
  {{
    "topic": "finding topic",
    "content": "detailed finding",
    "confidence": "high|medium|low"
  }}
]"""
        
        response = await prompt(
            analysis_prompt,
            config=self.config,
        )
        
        findings = []
        try:
            data = json.loads(response)
            for item in data:
                finding = ResearchFinding(
                    topic=item.get("topic", ""),
                    content=item.get("content", ""),
                    confidence=item.get("confidence", "medium"),
                    sources=all_sources,
                )
                findings.append(finding)
        except json.JSONDecodeError:
            # Fallback: create single finding
            findings.append(ResearchFinding(
                topic=topic,
                content=response,
                sources=all_sources,
            ))
        
        print(f"[Research] Extracted {len(findings)} findings")
        
        # Log research
        self.research_history.append({
            "topic": topic,
            "depth": depth,
            "queries": queries,
            "sources_count": len(all_sources),
            "findings_count": len(findings),
            "timestamp": datetime.now().isoformat(),
        })
        
        return findings
    
    async def fact_check(self, claims: List[str]) -> List[Dict]:
        """Fact-check a list of claims."""
        print(f"\n[Research] Fact-checking {len(claims)} claims...")
        
        claims_text = "\n".join([f"{i+1}. {claim}" for i, claim in enumerate(claims)])
        
        prompt_text = f"""Please fact-check these claims:

{claims_text}

Provide your analysis for each claim."""
        
        response = await prompt(
            prompt_text,
            system=self.fact_check_prompt,
            config=self.config,
        )
        
        # Parse fact-check results
        results = []
        lines = response.split("\n")
        current_result = {}
        
        for line in lines:
            line = line.strip()
            if line.startswith("- Claim:"):
                if current_result:
                    results.append(current_result)
                current_result = {"claim": line.replace("- Claim:", "").strip()}
            elif line.startswith("- Verdict:"):
                current_result["verdict"] = line.replace("- Verdict:", "").strip()
            elif line.startswith("- Confidence:"):
                current_result["confidence"] = line.replace("- Confidence:", "").strip()
            elif line.startswith("- Notes:"):
                current_result["notes"] = line.replace("- Notes:", "").strip()
        
        if current_result:
            results.append(current_result)
        
        return results
    
    async def generate_report(
        self,
        query: str,
        findings: List[ResearchFinding],
        format: str = "markdown",  # markdown, json, html
    ) -> ResearchReport:
        """Generate a research report from findings."""
        print(f"\n[Research] Generating {format} report...")
        
        # Collect all sources
        all_sources = []
        for finding in findings:
            all_sources.extend(finding.sources)
        
        # Deduplicate sources
        seen_urls = set()
        unique_sources = []
        for source in all_sources:
            if source.url not in seen_urls:
                seen_urls.add(source.url)
                unique_sources.append(source)
        
        # Synthesize findings
        findings_text = "\n\n".join([
            f"Finding: {f.topic}\nConfidence: {f.confidence}\nContent: {f.content}"
            for f in findings
        ])
        
        synthesis_prompt = f"""Original Query: {query}

Findings:
{findings_text}

Please synthesize these findings into a comprehensive report with:
1. Executive Summary (2-3 paragraphs)
2. Key Findings summary
3. Detailed Analysis
4. Actionable Recommendations (3-5 items)

Format the output as markdown."""
        
        report_content = await prompt(
            synthesis_prompt,
            system=self.synthesis_prompt,
            config=self.config,
        )
        
        # Parse report sections
        summary = report_content
        recommendations = []
        
        # Extract recommendations
        if "Recommendations" in report_content:
            recs_section = report_content.split("Recommendations")[-1]
            for line in recs_section.split("\n"):
                line = line.strip()
                if line.startswith(("-", "*", "1.", "2.", "3.")):
                    recommendations.append(line.lstrip("- *1234567890.").strip())
        
        return ResearchReport(
            query=query,
            summary=summary,
            findings=findings,
            sources=unique_sources,
            recommendations=recommendations,
            metadata={
                "format": format,
                "total_findings": len(findings),
                "total_sources": len(unique_sources),
            },
        )
    
    # =============================================================================
    # Export Methods
    # =============================================================================
    
    def export_report(
        self,
        report: ResearchReport,
        filepath: str,
        format: str = "markdown",
    ) -> str:
        """Export report to file."""
        path = Path(filepath)
        path.parent.mkdir(parents=True, exist_ok=True)
        
        if format == "json":
            data = {
                "query": report.query,
                "summary": report.summary,
                "findings": [
                    {
                        "topic": f.topic,
                        "content": f.content,
                        "confidence": f.confidence,
                    }
                    for f in report.findings
                ],
                "sources": [
                    {
                        "title": s.title,
                        "url": s.url,
                        "accessed_at": s.accessed_at,
                    }
                    for s in report.sources
                ],
                "recommendations": report.recommendations,
                "generated_at": report.generated_at,
            }
            path.write_text(json.dumps(data, indent=2))
            
        elif format == "html":
            html = f"""<!DOCTYPE html>
<html>
<head>
    <title>Research Report: {report.query}</title>
    <style>
        body {{ font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }}
        h1 {{ color: #333; }}
        .source {{ margin: 10px 0; padding: 10px; background: #f5f5f5; }}
        .finding {{ margin: 15px 0; padding: 15px; border-left: 3px solid #007bff; }}
        .confidence-high {{ color: green; }}
        .confidence-medium {{ color: orange; }}
        .confidence-low {{ color: red; }}
    </style>
</head>
<body>
    <h1>Research Report</h1>
    <p><strong>Query:</strong> {report.query}</p>
    <p><strong>Generated:</strong> {report.generated_at}</p>
    
    <h2>Summary</h2>
    <div>{report.summary.replace(chr(10), '<br>')}</div>
    
    <h2>Key Findings</h2>
    {''.join([f'<div class="finding"><h3>{f.topic}</h3><p>{f.content}</p><p class="confidence-{f.confidence}">Confidence: {f.confidence}</p></div>' for f in report.findings])}
    
    <h2>Sources</h2>
    {''.join([f'<div class="source"><a href="{s.url}">{s.title}</a></div>' for s in report.sources])}
    
    <h2>Recommendations</h2>
    <ul>
    {''.join([f'<li>{r}</li>' for r in report.recommendations])}
    </ul>
</body>
</html>"""
            path.write_text(html)
            
        else:  # markdown
            md = f"""# Research Report: {report.query}

**Generated:** {report.generated_at}

---

## Summary

{report.summary}

---

## Key Findings

"""
            for finding in report.findings:
                md += f"""### {finding.topic}

{finding.content}

**Confidence:** {finding.confidence}

"""
            
            md += """---

## Sources

"""
            for source in report.sources:
                md += f"- [{source.title}]({source.url})\n"
            
            md += """
---

## Recommendations

"""
            for rec in report.recommendations:
                md += f"- {rec}\n"
            
            path.write_text(md)
        
        return str(path)
    
    # =============================================================================
    # Cache Methods
    # =============================================================================
    
    def _get_cache_key(self, topic: str) -> str:
        """Generate cache key for a topic."""
        import hashlib
        return hashlib.md5(topic.encode()).hexdigest()
    
    def get_cached_research(self, topic: str) -> Optional[List[ResearchFinding]]:
        """Get cached research results."""
        cache_key = self._get_cache_key(topic)
        cache_file = self.cache_dir / f"{cache_key}.json"
        
        if cache_file.exists():
            try:
                data = json.loads(cache_file.read_text())
                findings = [ResearchFinding(**f) for f in data]
                print(f"[Research] Using cached results for: {topic}")
                return findings
            except Exception:
                pass
        
        return None
    
    def cache_research(self, topic: str, findings: List[ResearchFinding]):
        """Cache research results."""
        cache_key = self._get_cache_key(topic)
        cache_file = self.cache_dir / f"{cache_key}.json"
        
        data = [
            {
                "topic": f.topic,
                "content": f.content,
                "confidence": f.confidence,
            }
            for f in findings
        ]
        
        cache_file.write_text(json.dumps(data))


# =============================================================================
# Usage Examples
# =============================================================================

async def example_basic_research():
    """Basic research example."""
    agent = ResearchAgent()
    
    # Conduct research
    findings = await agent.research_topic(
        topic="Latest developments in quantum computing 2024",
        depth="medium",
    )
    
    # Generate report
    report = await agent.generate_report(
        query="Latest developments in quantum computing 2024",
        findings=findings,
        format="markdown",
    )
    
    # Export
    filepath = agent.export_report(report, "/tmp/quantum_computing_report.md")
    print(f"\nReport saved to: {filepath}")
    
    # Print summary
    print("\n" + "="*60)
    print("REPORT SUMMARY")
    print("="*60)
    print(report.summary[:500] + "...")


async def example_fact_checking():
    """Fact-checking example."""
    agent = ResearchAgent()
    
    claims = [
        "The Earth is flat.",
        "Water boils at 100 degrees Celsius at sea level.",
        "Humans only use 10% of their brains.",
    ]
    
    results = await agent.fact_check(claims)
    
    print("\n" + "="*60)
    print("FACT-CHECK RESULTS")
    print("="*60)
    for result in results:
        print(f"\nClaim: {result.get('claim', 'N/A')}")
        print(f"Verdict: {result.get('verdict', 'N/A')}")
        print(f"Confidence: {result.get('confidence', 'N/A')}")


async def main():
    """Main entry point."""
    print("\n" + "="*60)
    print("Research Agent Template")
    print("="*60)
    
    await example_basic_research()
    # await example_fact_checking()


if __name__ == "__main__":
    asyncio.run(main())
