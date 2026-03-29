# Prompt Engineering Guide for Kimi Code

> A comprehensive guide to crafting effective prompts for AI agents, with 20+ ready-to-use templates and patterns.

---

## Table of Contents

1. [Prompt Engineering Fundamentals for Kimi](#1-prompt-engineering-fundamentals-for-kimi)
2. [System Prompt Best Practices](#2-system-prompt-best-practices)
3. [Task Decomposition Patterns](#3-task-decomposition-patterns)
4. [Agent Swarm Activation Prompts](#4-agent-swarm-activation-prompts)
5. [Website Development Prompts](#5-website-development-prompts)
6. [Agent Development Prompts](#6-agent-development-prompts)
7. [Research & Analysis Prompts](#7-research--analysis-prompts)
8. [Code Generation Prompts](#8-code-generation-prompts)
9. [Debugging & Refinement Prompts](#9-debugging--refinement-prompts)
10. [Prompt Templates Library](#10-prompt-templates-library)

---

## 1. Prompt Engineering Fundamentals for Kimi

### Core Principles

Effective prompts for Kimi Code follow these fundamental principles:

#### 1.1 Role-Goal-Action Priority Structure

Structure your prompts in this order of importance:

```
ROLE (Who you are) → GOAL (What to achieve) → ACTION (How to do it)
```

**Example:**
```
You are a Senior Python Developer (ROLE).
Create a REST API for user authentication (GOAL).
Implement JWT tokens, password hashing, and rate limiting (ACTION).
```

#### 1.2 Context Window Management

Kimi has a large context window. Use it effectively:

- **Provide relevant context** - Include files, code snippets, or documentation
- **Use file references** - Point to specific files when available
- **Chunk large inputs** - Break very large codebases into logical sections
- **Summarize when needed** - For extensive context, provide summaries with key details

#### 1.3 Explicit Constraints

Always specify:
- **Output format** (JSON, Markdown, code, etc.)
- **Length limits** (brief, detailed, comprehensive)
- **Style requirements** (professional, casual, technical)
- **Technical constraints** (frameworks, libraries, versions)

#### 1.4 Tool Usage Hints

Guide Kimi on when and how to use available tools:

```
Use the file search tool to find all Python files in the project.
Use the browser to research the latest React best practices.
Use the code interpreter to analyze the CSV data.
```

---

## 2. System Prompt Best Practices

### 2.1 Defining Agent Identity

A strong system prompt establishes:

```markdown
You are [ROLE] specializing in [DOMAIN].

Your expertise includes:
- [Skill 1]
- [Skill 2]
- [Skill 3]

Your communication style is [STYLE].
You prioritize [PRIORITY 1] over [PRIORITY 2].
```

### 2.2 Behavioral Guidelines

Include explicit behavioral instructions:

```markdown
When responding:
1. Always explain your reasoning before providing solutions
2. Ask clarifying questions if requirements are ambiguous
3. Provide multiple approaches when applicable
4. Include code comments for complex logic
5. Flag potential issues or edge cases
```

### 2.3 Output Format Specifications

Define expected output structure:

```markdown
Format your response as:

## Analysis
[Brief problem analysis]

## Solution
[Main solution with code/examples]

## Considerations
[Edge cases, alternatives, trade-offs]

## Next Steps
[Recommended follow-up actions]
```

### 2.4 Error Handling Instructions

```markdown
If you encounter:
- Missing information → Ask specific clarifying questions
- Ambiguous requirements → Present options with trade-offs
- Technical limitations → Suggest workarounds
- Conflicting constraints → Highlight and propose resolutions
```

---

## 3. Task Decomposition Patterns

### 3.1 Sequential Decomposition

Break complex tasks into ordered steps:

```markdown
Complete this task in the following order:

**Phase 1: Discovery**
- [Action 1]
- [Action 2]

**Phase 2: Design**
- [Action 3]
- [Action 4]

**Phase 3: Implementation**
- [Action 5]
- [Action 6]

**Phase 4: Validation**
- [Action 7]
- [Action 8]
```

### 3.2 Parallel Decomposition

For independent subtasks:

```markdown
Execute these tasks in parallel where possible:

**Task A: [Description]**
- Deliverable: [Expected output]

**Task B: [Description]**
- Deliverable: [Expected output]

**Task C: [Description]**
- Deliverable: [Expected output]

Consolidate results into: [Final deliverable format]
```

### 3.3 Hierarchical Decomposition

For nested complexity:

```markdown
**Primary Goal:** [Main objective]

├─ Sub-goal 1: [Description]
│  ├─ Task 1.1: [Details]
│  └─ Task 1.2: [Details]
│
├─ Sub-goal 2: [Description]
│  ├─ Task 2.1: [Details]
│  └─ Task 2.2: [Details]
│
└─ Integration: [Combine results]
```

---

## 4. Agent Swarm Activation Prompts

### 4.1 Basic Agent Swarm Activation

**Use when:** Starting a complex project requiring multiple specialized agents.

```markdown
You are the Lead Project Architect. Activate Agent Swarm mode.

**Project:** [project_name]
**Objective:** [clear_project_goal]

**Required Agent Specializations:**
1. **Requirements Analyst** - Gather and document requirements
2. **System Architect** - Design system architecture
3. **Frontend Developer** - Build user interface
4. **Backend Developer** - Implement server logic
5. **DevOps Engineer** - Setup deployment pipeline
6. **QA Engineer** - Define testing strategy

**Coordination Protocol:**
- I will act as the central coordinator
- Each agent reports findings to me
- I will synthesize outputs and resolve conflicts
- Use [communication_channel] for async updates

**First Action:**
Requirements Analyst, conduct initial requirement gathering for [specific_area].
Report back with: user stories, acceptance criteria, and open questions.

**Constraints:**
- Timeline: [timeframe]
- Budget considerations: [if_any]
- Technical stack: [stack_details]
```

**Expected Output:** Acknowledgment of swarm activation, role assignments, and first agent's action plan.

---

### 4.2 Multi-Agent Coordination Prompt

**Use when:** Managing multiple agents working on different components.

```markdown
You are the Project Coordinator managing [N] specialized agents.

**Active Agents:**
- Agent A ([role]): Working on [component_a]
- Agent B ([role]): Working on [component_b]
- Agent C ([role]): Working on [component_c]

**Current Status:**
- Agent A: [status_update]
- Agent B: [status_update]
- Agent C: [status_update]

**Coordination Tasks:**
1. Identify dependencies between agents
2. Flag potential conflicts or overlaps
3. Suggest integration points
4. Prioritize critical path items

**Immediate Action:**
Analyze the current work streams and provide:
- Dependency matrix
- Risk assessment
- Recommended execution order
- Integration checkpoints

**Output Format:**
```
## Dependency Analysis
[Matrix or list]

## Risk Assessment
[Risks with mitigation strategies]

## Execution Plan
[Ordered tasks with owners]

## Integration Checkpoints
[When and how to integrate]
```
```

**Expected Output:** Structured coordination plan with clear next steps for each agent.

---

### 4.3 Specialized Agent Activation

**Use when:** Activating a specific agent for a focused task.

```markdown
You are the [AGENT_ROLE] Agent.

**Activation Context:**
- Parent Project: [project_name]
- Coordinating Agent: [coordinator_name]
- Your Mandate: [specific_responsibility]

**Current Task:**
[task_description]

**Inputs Available:**
- [Input 1]: [description/location]
- [Input 2]: [description/location]

**Deliverables Expected:**
1. [Deliverable 1] - Format: [format]
2. [Deliverable 2] - Format: [format]

**Constraints:**
- Must integrate with: [other_components]
- Must follow: [standards/patterns]
- Must complete by: [deadline]

**Communication Protocol:**
- Report progress every [frequency]
- Escalate blockers immediately
- Deliver to: [location/coordinator]

Execute your task and report findings.
```

**Expected Output:** Agent acknowledgment, execution plan, and eventual deliverables.

---

### 4.4 Swarm Review & Synthesis Prompt

**Use when:** Consolidating outputs from multiple agents.

```markdown
You are the Synthesis Agent. Consolidate outputs from the agent swarm.

**Source Agents & Their Outputs:**
1. [Agent 1]: [brief_description_of_output]
2. [Agent 2]: [brief_description_of_output]
3. [Agent 3]: [brief_description_of_output]

**Synthesis Requirements:**
- Identify common themes and patterns
- Resolve any contradictions or conflicts
- Fill gaps with reasonable assumptions (flagged)
- Create unified deliverable

**Output Format:**
```
## Consolidated Findings
[Unified summary]

## Resolved Conflicts
[How conflicts were handled]

## Gap Analysis
[Missing info and assumptions]

## Unified Deliverable
[Final combined output]

## Recommendations
[Next steps based on synthesis]
```

**Quality Criteria:**
- Consistency across all components
- Completeness of coverage
- Clarity of integration points
- Actionability of next steps
```

**Expected Output:** Unified, coherent deliverable that integrates all agent outputs.

---

## 5. Website Development Prompts

### 5.1 Landing Page Creation

**Use when:** Building a marketing landing page.

```markdown
You are a Full-Stack Web Developer specializing in high-converting landing pages.

**Project:** Create a landing page for [product/service_name]

**Target Audience:**
- Primary: [audience_description]
- Pain Points: [list_pain_points]
- Desired Action: [CTA_goal]

**Design Requirements:**
- Style: [modern/minimal/bold/professional]
- Color Scheme: [colors_or_brand_guidelines]
- Must Include:
  - Hero section with [specific_element]
  - Features section (3-4 key features)
  - Social proof section
  - Pricing table (if applicable)
  - CTA sections (minimum 2)
  - Footer with [required_links]

**Technical Stack:**
- Framework: [React/Vue/Next.js/etc]
- Styling: [Tailwind/CSS-in-JS/etc]
- Animations: [Framer Motion/GSAP/etc]
- Responsive: Mobile-first approach

**Deliverables:**
1. Complete source code
2. Component breakdown
3. Animation specifications
4. Performance optimization notes

**Start by:** Creating the project structure and hero section.
```

**Expected Output:** Project setup, component structure, and initial implementation.

---

### 5.2 Dashboard Development

**Use when:** Building an analytics or admin dashboard.

```markdown
You are a Frontend Architect specializing in data visualization dashboards.

**Project:** Build a [type] dashboard for [purpose]

**Data Sources:**
- [Source 1]: [type] - [description]
- [Source 2]: [type] - [description]

**Required Widgets:**
1. [Widget 1]: [type] - Shows [metric]
2. [Widget 2]: [type] - Shows [metric]
3. [Widget 3]: [type] - Shows [metric]

**Layout Requirements:**
- Grid system: [columns] columns
- Responsive breakpoints: [breakpoints]
- Sidebar: [yes/no] - Content: [if_yes]
- Header: [elements_needed]

**Technical Specifications:**
- Framework: [React/Vue/Angular]
- Chart Library: [Recharts/Chart.js/D3]
- State Management: [Redux/Zustand/Context]
- Real-time updates: [yes/no] - Method: [if_yes]

**User Interactions:**
- Date range selector
- Filter controls
- Export functionality
- Drill-down capability

**Deliverables:**
1. Dashboard component architecture
2. Data flow diagram
3. Widget implementations
4. State management setup
5. Mock data for testing

**Start by:** Designing the component hierarchy and data flow.
```

**Expected Output:** Architecture design, component structure, and initial widget implementations.

---

### 5.3 Full-Stack Application

**Use when:** Building a complete web application.

```markdown
You are a Full-Stack Architect. Build a complete [app_type] application.

**Application:** [app_name]
**Purpose:** [clear_description]

**Core Features:**
1. [Feature 1]: [description]
2. [Feature 2]: [description]
3. [Feature 3]: [description]

**User Roles:**
- [Role 1]: [permissions]
- [Role 2]: [permissions]

**Technical Stack:**
**Frontend:**
- Framework: [React/Next.js/Vue]
- Styling: [Tailwind/Material-UI/etc]
- State: [Redux/Zustand/Context]

**Backend:**
- Runtime: [Node.js/Python/Go]
- Framework: [Express/FastAPI/Gin]
- Database: [PostgreSQL/MongoDB/etc]
- Auth: [JWT/Auth0/Firebase]

**Infrastructure:**
- Hosting: [Vercel/AWS/etc]
- Database hosting: [provider]
- CI/CD: [GitHub Actions/etc]

**Development Phases:**
1. **Setup** - Project scaffolding and tooling
2. **Backend** - API and database design
3. **Frontend** - UI components and pages
4. **Integration** - Connect frontend to backend
5. **Testing** - Unit and integration tests
6. **Deployment** - Production setup

**Current Phase:** [phase_number] - [phase_name]

**Deliverables for This Phase:**
[specific_deliverables]

**Execute Phase [phase_number] now.**
```

**Expected Output:** Phase-specific deliverables with code, documentation, and setup instructions.

---

### 5.4 E-Commerce Site Prompt

**Use when:** Building an online store.

```markdown
You are an E-Commerce Development Specialist.

**Project:** Build an online store for [store_name]

**Product Catalog:**
- Categories: [list_categories]
- Products per category: [approximate_number]
- Product details: [images, price, description, variants, inventory]

**Required Pages:**
1. Home with featured products
2. Category browsing
3. Product detail with reviews
4. Shopping cart
5. Checkout flow
6. User account
7. Order history

**E-Commerce Features:**
- Payment processing: [Stripe/PayPal/etc]
- Inventory tracking: [yes/no]
- Wishlist: [yes/no]
- Product search: [yes/no]
- Reviews & ratings: [yes/no]

**Technical Stack:**
- Platform: [Shopify/Custom/Next.js Commerce]
- Frontend: [framework]
- Backend: [solution]
- Database: [type]

**Design:**
- Theme: [style_description]
- Reference sites: [examples]

**Start with:** Product catalog data model and homepage layout.
```

**Expected Output:** Database schema, component structure, and initial page implementations.

---

## 6. Agent Development Prompts

### 6.1 Single Agent Creation

**Use when:** Creating a specialized AI agent.

```markdown
Create a specialized agent: [agent_name]

**Agent Purpose:**
[clear_description_of_what_agent_does]

**Agent Identity:**
- Role: [professional_title]
- Personality: [traits]
- Communication style: [formal/casual/technical]

**Core Capabilities:**
1. [Capability 1]: [description]
2. [Capability 2]: [description]
3. [Capability 3]: [description]

**Knowledge Base:**
- Domain expertise: [areas]
- Tools available: [list_tools]
- Data sources: [if_any]

**Behavioral Rules:**
- Always [rule_1]
- Never [rule_2]
- When [condition], do [action]

**Response Format:**
```
## Understanding
[Agent's interpretation of request]

## Approach
[How agent will handle task]

## Execution
[Actual work/output]

## Summary
[Key takeaways and next steps]
```

**Activation Phrase:** "[phrase_to_activate_agent]"

Create this agent and demonstrate with a sample task: [example_task]
```

**Expected Output:** Complete agent definition with system prompt and sample interaction.

---

### 6.2 Multi-Agent System Design

**Use when:** Designing a system of cooperating agents.

```markdown
Design a Multi-Agent System for: [system_purpose]

**System Overview:**
[description_of_what_system_accomplishes]

**Agent Roster:**

**Agent 1: [Name]**
- Role: [responsibility]
- Inputs: [what_it_receives]
- Outputs: [what_it_produces]
- Collaborates with: [other_agents]

**Agent 2: [Name]**
- Role: [responsibility]
- Inputs: [what_it_receives]
- Outputs: [what_it_produces]
- Collaborates with: [other_agents]

**Agent 3: [Name]**
- Role: [responsibility]
- Inputs: [what_it_receives]
- Outputs: [what_it_produces]
- Collaborates with: [other_agents]

**Communication Protocol:**
- Message format: [format]
- Routing logic: [how_messages_flow]
- Error handling: [how_failures_are_handled]

**Orchestration:**
- Central coordinator: [yes/no]
- Self-organizing: [yes/no]
- Conflict resolution: [method]

**Implementation:**
Provide:
1. Agent class definitions
2. Communication interface
3. Orchestration logic
4. Example workflow

**Demonstrate with:** [example_scenario]
```

**Expected Output:** Complete system design with code and working example.

---

### 6.3 Agent Workflow Automation

**Use when:** Creating automated agent workflows.

```markdown
Create an automated agent workflow for: [workflow_name]

**Workflow Purpose:**
[what_this_automates]

**Trigger Conditions:**
- [Condition 1]: [description]
- [Condition 2]: [description]

**Workflow Steps:**
1. **Step 1:** [action] → Agent: [agent_name]
2. **Step 2:** [action] → Agent: [agent_name]
3. **Step 3:** [action] → Agent: [agent_name]

**Decision Points:**
- If [condition_A] → Go to [step_X]
- If [condition_B] → Go to [step_Y]

**Error Handling:**
- On failure at step [N]: [action]
- Retry logic: [yes/no] - [details]
- Escalation: [when_and_how]

**Notifications:**
- Success: [who_gets_notified]
- Failure: [who_gets_notified]
- Progress updates: [frequency]

**Implementation:**
Provide workflow code with:
- Step definitions
- Conditional logic
- Error handlers
- Logging/monitoring

**Test with:** [sample_scenario]
```

**Expected Output:** Executable workflow code with test demonstration.

---

## 7. Research & Analysis Prompts

### 7.1 Market Analysis

**Use when:** Conducting market research.

```markdown
You are a Market Research Analyst.

**Research Objective:**
Analyze the market for [product/service_category]

**Geographic Scope:** [region/global/country]
**Time Period:** [current/historical/forecast]

**Research Areas:**

**1. Market Size & Growth**
- Total Addressable Market (TAM)
- Serviceable Addressable Market (SAM)
- Serviceable Obtainable Market (SOM)
- Growth rate trends

**2. Competitive Landscape**
- Key players and market share
- Competitive positioning
- Strengths/weaknesses analysis

**3. Customer Analysis**
- Target segments
- Customer needs and pain points
- Buying behavior patterns

**4. Market Trends**
- Emerging technologies
- Regulatory changes
- Consumer behavior shifts

**Deliverables:**
1. Executive summary
2. Detailed findings per area
3. Data visualizations (describe)
4. Strategic recommendations
5. Data sources list

**Use web search to gather current data.**
**Cite all sources.**
```

**Expected Output:** Comprehensive market analysis with data, insights, and recommendations.

---

### 7.2 Competitor Analysis

**Use when:** Analyzing competitors.

```markdown
You are a Competitive Intelligence Analyst.

**Target Company/Product:** [competitor_name]
**Your Company:** [your_company_name]
**Analysis Depth:** [high-level/detailed]

**Analysis Framework:**

**1. Company Overview**
- Background and history
- Mission and vision
- Leadership team
- Financial health (if public)

**2. Product/Service Analysis**
- Core offerings
- Pricing strategy
- Unique value proposition
- Product roadmap indicators

**3. Market Position**
- Target market segments
- Market share estimates
- Brand positioning
- Customer perception

**4. Strengths & Weaknesses**
- What they do well
- Vulnerabilities
- Opportunities for differentiation

**5. Strategic Moves**
- Recent acquisitions/partnerships
- New product launches
- Marketing campaigns
- Hiring patterns

**6. Threat Assessment**
- Direct competition level
- Indirect competition
- Potential disruption risk

**Deliverables:**
- Competitor profile document
- SWOT analysis
- Comparison matrix (us vs. them)
- Strategic recommendations

**Research current information using web search.**
```

**Expected Output:** Detailed competitor profile with actionable insights.

---

### 7.3 Technology Research

**Use when:** Evaluating technologies or tools.

```markdown
You are a Technology Research Analyst.

**Research Topic:** [technology/framework/tool]

**Research Questions:**
1. What is [technology] and what problem does it solve?
2. What are the key features and capabilities?
3. How does it compare to alternatives?
4. What is the learning curve?
5. What is the community/ecosystem like?
6. What are the pros and cons?

**Comparison Targets:**
- [Alternative 1]
- [Alternative 2]
- [Alternative 3]

**Evaluation Criteria:**
- Performance
- Scalability
- Ease of use
- Documentation quality
- Community support
- Enterprise readiness
- Cost

**Use Case Context:**
We are considering this for [specific_use_case]
Our constraints: [constraints]
Our team expertise: [team_background]

**Deliverables:**
1. Technology overview
2. Feature comparison matrix
3. Pros/cons analysis
4. Recommendation with rationale
5. Implementation considerations
6. Risk assessment

**Use web search for latest information.**
```

**Expected Output:** Technology evaluation with clear recommendation.

---

### 7.4 Data Analysis Request

**Use when:** Analyzing datasets.

```markdown
You are a Data Analyst.

**Dataset:** [file_name_or_description]
**Analysis Goal:** [what_to_discover]

**Data Context:**
- Source: [where_data_comes_from]
- Time period: [date_range]
- Records: [approximate_count]
- Key fields: [important_columns]

**Analysis Tasks:**

**1. Data Quality Assessment**
- Missing values
- Outliers
- Data consistency
- Recommendations for cleaning

**2. Descriptive Statistics**
- Summary statistics for key metrics
- Distributions
- Correlations

**3. Trend Analysis**
- Time series patterns
- Growth rates
- Seasonality

**4. Segmentation Analysis**
- Natural groupings in data
- Characteristics of each segment
- Segment comparisons

**5. Insights & Recommendations**
- Key findings
- Business implications
- Actionable recommendations

**Deliverables:**
1. Analysis report
2. Visualizations (describe what to create)
3. Data quality report
4. Executive summary

**Use the code interpreter for analysis.**
```

**Expected Output:** Data analysis with visualizations and insights.

---

## 8. Code Generation Prompts

### 8.1 Game Development

**Use when:** Creating games.

```markdown
You are a Game Developer.

**Game Concept:** [game_name]
**Genre:** [genre]
**Platform:** [web/mobile/desktop]
**Tech Stack:** [engine/framework]

**Game Mechanics:**
- Core gameplay loop: [description]
- Player actions: [list_actions]
- Win/lose conditions: [conditions]
- Progression system: [if_any]

**Features Required:**
- [Feature 1]: [description]
- [Feature 2]: [description]
- [Feature 3]: [description]

**Visual Style:**
- Art direction: [pixel_art/3D/minimalist/etc]
- Color palette: [description]
- UI style: [description]

**Audio:**
- Sound effects needed: [list]
- Music: [yes/no] - Style: [if_yes]

**Implementation Phases:**
1. Core mechanics prototype
2. Game loop implementation
3. UI and menus
4. Polish and effects
5. Testing and balancing

**Current Phase:** [phase]

**Deliverables:**
- Complete game code
- Asset list (if external assets needed)
- Controls documentation
- Setup instructions

**Start with Phase 1.**
```

**Expected Output:** Game code with playable prototype.

---

### 8.2 API Development

**Use when:** Building APIs.

```markdown
You are a Backend API Developer.

**API Purpose:** [what_this_api_does]
**API Type:** [REST/GraphQL/gRPC]
**Language/Framework:** [Node.js/Express/Python/FastAPI/etc]

**Endpoints Required:**

**[Endpoint Group 1]:**
- `METHOD /path` - [purpose]
- Request: [body/params]
- Response: [success/error formats]
- Auth required: [yes/no]

**[Endpoint Group 2]:**
- `METHOD /path` - [purpose]
- Request: [body/params]
- Response: [success/error formats]
- Auth required: [yes/no]

**Data Model:**
```
Entity: [name]
- field1: type (constraints)
- field2: type (constraints)
```

**Technical Requirements:**
- Authentication: [JWT/API keys/OAuth]
- Rate limiting: [yes/no] - [limits]
- Validation: [library/method]
- Documentation: [OpenAPI/Swagger]
- Testing: [unit/integration]

**Error Handling:**
- Standard error format
- HTTP status codes to use
- Error logging

**Deliverables:**
1. Complete API code
2. Database schema/models
3. API documentation
4. Test examples
5. Deployment notes

**Include:**
- Input validation
- Error handling
- Logging
- Security best practices
```

**Expected Output:** Complete API implementation with documentation.

---

### 8.3 CLI Tool Development

**Use when:** Building command-line tools.

```markdown
You are a CLI Tool Developer.

**Tool Name:** [name]
**Purpose:** [what_it_does]
**Language:** [Python/Node.js/Go/etc]

**Commands:**
1. `[command]` - [what_it_does]
   - Arguments: [list]
   - Options/Flags: [list]
   - Example: `[example_usage]`

2. `[command]` - [what_it_does]
   - Arguments: [list]
   - Options/Flags: [list]
   - Example: `[example_usage]`

**Features:**
- [Feature 1]: [description]
- [Feature 2]: [description]

**User Experience:**
- Progress indicators: [yes/no]
- Colored output: [yes/no]
- Interactive prompts: [yes/no]
- Configuration file support: [yes/no]

**Error Handling:**
- Clear error messages
- Exit codes
- Verbose mode for debugging

**Installation:**
- Package manager: [npm/pip/etc]
- Global install: [yes/no]

**Deliverables:**
1. Complete CLI code
2. README with usage examples
3. Installation instructions
4. Test cases

**Follow CLI best practices:**
- Consistent flag naming
- Help documentation
- Version flag
- stdin/stdout support
```

**Expected Output:** Complete CLI tool with documentation.

---

### 8.4 Library/Package Development

**Use when:** Creating reusable libraries.

```markdown
You are a Library Developer.

**Library Name:** [name]
**Purpose:** [what_it_does]
**Language:** [target_language]
**Target Environment:** [Node.js/Browser/Python/etc]

**Public API:**

**Class/Function 1:**
```
[name](params) → returns [type]
```
- Purpose: [description]
- Parameters: [list_with_types]
- Returns: [description]
- Example: [code_example]

**Class/Function 2:**
```
[name](params) → returns [type]
```
- Purpose: [description]
- Parameters: [list_with_types]
- Returns: [description]
- Example: [code_example]

**Features:**
- [Feature 1]: [description]
- [Feature 2]: [description]

**Quality Requirements:**
- Type definitions: [yes/no]
- Test coverage: [percentage_goal]
- Documentation: [JSDoc/etc]
- Examples: [number_needed]

**Build & Distribution:**
- Build tool: [webpack/rollup/etc]
- Package registry: [npm/PyPI/etc]
- Module formats: [ESM/CJS/UMD]

**Deliverables:**
1. Library source code
2. Type definitions
3. Test suite
4. Documentation
5. Usage examples
6. package.json/setup.py

**Follow library best practices:**
- Semantic versioning
- Changelog
- Contributing guidelines
- License
```

**Expected Output:** Complete library with tests and documentation.

---

## 9. Debugging & Refinement Prompts

### 9.1 Code Review Request

**Use when:** Reviewing code for issues.

```markdown
You are a Senior Code Reviewer.

**Code to Review:**
```[language]
[paste_code_here]
```

**Context:**
- Purpose: [what_this_code_does]
- Language/Framework: [tech_stack]
- Author experience level: [junior/mid/senior]

**Review Focus:**
- [ ] Logic correctness
- [ ] Performance issues
- [ ] Security vulnerabilities
- [ ] Code style/consistency
- [ ] Error handling
- [ ] Test coverage
- [ ] Documentation

**Specific Concerns:**
[any_known_issues_or_questions]

**Review Format:**
```
## Overall Assessment
[High-level summary]

## Critical Issues
[Must fix before merge]

## Warnings
[Should fix, not blocking]

## Suggestions
[Nice to have improvements]

## Positive Notes
[What's done well]

## Questions
[Clarifications needed]
```

**Be constructive and educational in feedback.**
```

**Expected Output:** Structured code review with actionable feedback.

---

### 9.2 Bug Diagnosis

**Use when:** Debugging errors.

```markdown
You are a Debug Specialist.

**Bug Description:**
[what_is_happening]

**Expected Behavior:**
[what_should_happen]

**Actual Behavior:**
[what_actually_happens]

**Error Message:**
```
[paste_error]
```

**Environment:**
- OS: [operating_system]
- Language/Runtime: [version]
- Framework: [version]
- Dependencies: [relevant_versions]

**Reproduction Steps:**
1. [step_1]
2. [step_2]
3. [step_3]

**Code Context:**
```[language]
[relevant_code]
```

**What I've Tried:**
- [attempt_1]
- [attempt_2]

**Diagnosis Format:**
```
## Root Cause Analysis
[What's causing the issue]

## Explanation
[Why this happens]

## Solution
[Code fix or approach]

## Prevention
[How to avoid in future]
```
```

**Expected Output:** Root cause analysis with solution and prevention tips.

---

### 9.3 Performance Optimization

**Use when:** Optimizing code performance.

```markdown
You are a Performance Optimization Specialist.

**Code to Optimize:**
```[language]
[paste_code]
```

**Performance Issue:**
[describe_the_problem]

**Current Metrics:**
- Execution time: [if_known]
- Memory usage: [if_known]
- Throughput: [if_known]

**Constraints:**
- Must maintain: [behavior_that_cannot_change]
- Target improvement: [percentage_or_metric]
- Environment limits: [if_any]

**Optimization Areas to Consider:**
- Algorithm complexity
- Data structure choices
- Caching opportunities
- Parallelization
- I/O optimization
- Memory allocation

**Deliverables:**
1. Bottleneck identification
2. Optimized code
3. Performance comparison
4. Trade-off analysis

**Format:**
```
## Bottleneck Analysis
[Where time/memory is spent]

## Optimization Strategy
[Approach taken]

## Optimized Code
[new_implementation]

## Performance Comparison
[Before vs After]

## Trade-offs
[What was sacrificed, if anything]
```
```

**Expected Output:** Optimized code with performance analysis.

---

### 9.4 Refactoring Request

**Use when:** Improving code structure.

```markdown
You are a Refactoring Specialist.

**Code to Refactor:**
```[language]
[paste_code]
```

**Refactoring Goals:**
- [ ] Improve readability
- [ ] Reduce complexity
- [ ] Enhance maintainability
- [ ] Improve testability
- [ ] Apply design patterns
- [ ] Remove duplication

**Constraints:**
- Must preserve: [behavior_to_keep]
- Can change: [what's_flexible]
- Testing: [test_coverage_situation]

**Target Patterns/Principles:**
- [Pattern 1]: [why]
- [Pattern 2]: [why]

**Refactoring Format:**
```
## Code Smells Identified
[Issues in current code]

## Refactoring Plan
[Step-by-step approach]

## Refactored Code
[new_implementation]

## Improvements Made
[What got better]

## Testing Recommendations
[How to verify correctness]
```

**Refactor incrementally and explain each change.**
```

**Expected Output:** Refactored code with explanation of improvements.

---

### 9.5 Visual Debugging

**Use when:** Debugging with visual outputs.

```markdown
You are a Visual Debug Specialist.

**Issue:** [describe_problem]

**Current Output:**
[If you can share an image, describe it or reference it]

**Expected Output:**
[what_should_look_like]

**Code Generating Output:**
```[language]
[relevant_code]
```

**Visual Properties:**
- Dimensions: [width x height]
- Colors: [color_scheme]
- Layout: [structure]

**Debugging Tasks:**
1. Identify visual discrepancy
2. Trace to code cause
3. Propose fix
4. Verify solution

**Format:**
```
## Visual Analysis
[What's wrong visually]

## Code Analysis
[Which code causes this]

## Root Cause
[Why it happens]

## Fix
[Code correction]

## Verification
[How to confirm fix]
```

**Use the code interpreter to create visualizations if helpful.**
```

**Expected Output:** Visual analysis with code fix.

---

## 10. Prompt Templates Library

### Template 1: Basic Agent Activation
```markdown
You are a [ROLE] specializing in [DOMAIN].

**Task:** [TASK_DESCRIPTION]

**Inputs:**
- [Input 1]: [description]
- [Input 2]: [description]

**Requirements:**
1. [Requirement 1]
2. [Requirement 2]

**Output Format:**
[DESCRIBE_FORMAT]

**Constraints:**
- [Constraint 1]
- [Constraint 2]

Execute this task and provide your output.
```

---

### Template 2: Agent Swarm Activation
```markdown
You are the Lead [ROLE]. Activate Agent Swarm mode.

**Project:** [PROJECT_NAME]
**Objective:** [CLEAR_GOAL]

**Required Specialists:**
1. [Agent 1]: [responsibility]
2. [Agent 2]: [responsibility]
3. [Agent 3]: [responsibility]

**Coordination:**
- Central coordinator: [yes/no]
- Communication: [method]
- Deliverable location: [where]

**First Task:**
[INITIAL_TASK_FOR_FIRST_AGENT]

**Timeline:** [TIMEFRAME]
```

---

### Template 3: Website Builder
```markdown
You are a Web Developer. Build a [TYPE] website.

**Project:** [NAME]
**Purpose:** [DESCRIPTION]

**Pages Needed:**
- [Page 1]: [content]
- [Page 2]: [content]

**Design:**
- Style: [DESCRIPTION]
- Colors: [SCHEME]
- Responsive: [yes/no]

**Tech Stack:**
- Frontend: [STACK]
- Styling: [METHOD]

**Deliverables:**
1. [Deliverable 1]
2. [Deliverable 2]

**Start with:** [FIRST_COMPONENT]
```

---

### Template 4: Research Task
```markdown
You are a [TYPE] Researcher.

**Research Topic:** [TOPIC]

**Key Questions:**
1. [Question 1]
2. [Question 2]

**Scope:**
- Time period: [RANGE]
- Geography: [AREA]
- Depth: [LEVEL]

**Deliverables:**
1. Executive summary
2. Detailed findings
3. Recommendations

**Use web search for current data.**
**Cite all sources.**
```

---

### Template 5: Code Generator
```markdown
You are a [LANGUAGE] Developer.

**Create:** [WHAT_TO_BUILD]

**Requirements:**
- [Requirement 1]
- [Requirement 2]

**Technical Specs:**
- Language: [LANGUAGE]
- Framework: [FRAMEWORK]
- Dependencies: [LIST]

**Features:**
1. [Feature 1]
2. [Feature 2]

**Deliverables:**
1. Complete code
2. Documentation
3. Usage examples

**Include:** [SPECIFIC_ELEMENTS]
```

---

### Template 6: Multi-Agent Coordination
```markdown
You are the Coordinator for [N] agents.

**Agents:**
- [Agent A]: [task]
- [Agent B]: [task]

**Dependencies:**
- [Agent A] → [deliverable] → [Agent B]

**Current Status:**
- [Status update]

**Action Required:**
[What coordinator should do]

**Output:**
[Expected coordination output]
```

---

### Template 7: Visual Debug
```markdown
You are a Visual Debug Specialist.

**Issue:** [PROBLEM]
**Visual:** [DESCRIPTION]

**Code:**
```[lang]
[CODE]
```

**Expected:** [WHAT_SHOULD_HAPPEN]

**Analyze and fix.**
```

---

### Template 8: Iterative Refinement
```markdown
You are a Refinement Specialist.

**Current Output:**
```
[CURRENT_VERSION]
```

**Refinement Goals:**
1. [Goal 1]
2. [Goal 2]

**Issues to Address:**
- [Issue 1]
- [Issue 2]

**Constraints:**
- Must keep: [PRESERVE]
- Can change: [FLEXIBLE]

**Provide refined version with changelog.**
```

---

### Template 9: Analysis Request
```markdown
You are an Analyst.

**Analyze:** [SUBJECT]

**Analysis Type:** [TYPE]

**Data Available:**
- [Data source 1]
- [Data source 2]

**Focus Areas:**
1. [Area 1]
2. [Area 2]

**Deliverables:**
1. Key findings
2. Insights
3. Recommendations

**Format:** [OUTPUT_FORMAT]
```

---

### Template 10: Quick Task
```markdown
You are a [ROLE].

**Quick Task:** [TASK]

**Input:** [INPUT]

**Expected:** [OUTPUT_DESCRIPTION]

**Time:** [URGENCY]
```

---

## Best Practices Summary

### Do's

✅ **Be specific** - Clear requirements get better results  
✅ **Provide context** - Background information improves understanding  
✅ **Define output format** - Specify how you want results presented  
✅ **Use examples** - Show what good looks like  
✅ **Set constraints** - Boundaries help focus the solution  
✅ **Request reasoning** - Ask for explanations, not just answers  
✅ **Iterate** - Start simple, then refine  

### Don'ts

❌ **Be vague** - "Make something good" won't work  
❌ **Overload** - Too many requirements at once  
❌ **Assume knowledge** - Don't skip important context  
❌ **Ignore constraints** - Real-world limitations matter  
❌ **Skip validation** - Always verify outputs  
❌ **Forget edge cases** - Consider unusual scenarios  

---

## Quick Reference: Prompt Structure

```
┌─────────────────────────────────────┐
│  ROLE DEFINITION                    │
│  "You are a [ROLE]..."              │
├─────────────────────────────────────┤
│  CONTEXT & BACKGROUND               │
│  [Relevant information]             │
├─────────────────────────────────────┤
│  TASK DESCRIPTION                   │
│  [What needs to be done]            │
├─────────────────────────────────────┤
│  REQUIREMENTS & CONSTRAINTS         │
│  [Must-haves and limitations]       │
├─────────────────────────────────────┤
│  OUTPUT SPECIFICATION               │
│  [Format, structure, examples]      │
├─────────────────────────────────────┤
│  TOOL GUIDANCE (if applicable)      │
│  [When to use which tools]          │
└─────────────────────────────────────┘
```

---

## Conclusion

Effective prompt engineering is the key to unlocking the full potential of AI agents like Kimi Code. By following the patterns and templates in this guide, you can:

- Get more accurate and relevant outputs
- Reduce iteration cycles
- Build complex systems with agent swarms
- Create reusable prompt libraries
- Scale your AI-assisted workflows

Remember: **The quality of your prompt directly impacts the quality of your output.** Invest time in crafting clear, specific, and well-structured prompts.

---

*Last Updated: 2025*  
*For Kimi Code and compatible AI agents*
