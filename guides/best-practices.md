# Kimi Code in Antigravity: Best Practices Guide

> A comprehensive guide to maximizing productivity with Kimi K2.5's multi-agent capabilities in the Antigravity development environment.

---

## Table of Contents

1. [Overview of Kimi K2.5 + Antigravity Integration](#1-overview-of-kimi-k25--antigravity-integration)
2. [Getting Started](#2-getting-started)
3. [The 4 Operational Modes](#3-the-4-operational-modes)
4. [Agent Swarm Best Practices](#4-agent-swarm-best-practices)
5. [Prompt Engineering for Swarms](#5-prompt-engineering-for-swarms)
6. [Performance Optimization](#6-performance-optimization)
7. [Security & Privacy Considerations](#7-security--privacy-considerations)
8. [Resource Management](#8-resource-management)
9. [Common Pitfalls and How to Avoid Them](#9-common-pitfalls-and-how-to-avoid-them)
10. [Comparison with Other Tools](#10-comparison-with-other-tools)

---

## 1. Overview of Kimi K2.5 + Antigravity Integration

### What is Kimi K2.5?

Kimi K2.5 is Moonshot AI's flagship large language model featuring:

| Specification | Value |
|--------------|-------|
| **Total Parameters** | 1 Trillion |
| **Activated per Request** | 32 Billion (MoE architecture) |
| **Context Window** | 256,000 tokens |
| **Multimodal Support** | Text, Images, Video, Documents |
| **Max Sub-agents (Swarm)** | 100 agents |
| **Tool Calls per Agent** | 200-300 |
| **Total Tool Calls (Swarm)** | Up to 1,500 |

### Why Use Kimi Code in Antigravity?

Antigravity provides an IDE-native environment for Kimi K2.5, enabling:

- **Seamless code integration** - Direct file system access within your workspace
- **Real-time context awareness** - Understanding of your entire project structure
- **Multi-agent orchestration** - Coordinate complex development tasks automatically
- **Vision capabilities** - Analyze UI mockups, diagrams, and screenshots
- **Cost efficiency** - MoE architecture means you only pay for activated parameters

### Key Use Cases

```
✓ Parallel code generation across multiple files
✓ Automated testing and debugging workflows
✓ Vision-based UI implementation from mockups
✓ Large-scale refactoring operations
✓ Documentation generation at scale
✓ Multi-language project coordination
```

---

## 2. Getting Started

### Installation

#### Option 1: VS Code Extension (Recommended)

```bash
# Open VS Code Extensions marketplace
# Search for "Kimi Code"
# Click Install
```

#### Option 2: CLI Installation

```bash
# Install Kimi Code CLI globally
npm install -g @moonshot-ai/kimi-code

# Initialize in your project
kimi-code init
```

### API Configuration

#### Step 1: Obtain API Key

1. Visit [platform.moonshot.cn](https://platform.moonshot.cn)
2. Create an account or sign in
3. Navigate to API Keys section
4. Generate a new key with appropriate permissions

#### Step 2: Configure in Antigravity

**VS Code Settings:**

```json
{
  "kimi.apiKey": "your-api-key-here",
  "kimi.model": "kimi-k2.5",
  "kimi.maxTokens": 256000,
  "kimi.temperature": 0.3,
  "kimi.enableSwarm": true,
  "kimi.contextAwareness": true
}
```

**Environment Variables (CLI):**

```bash
# Add to .bashrc, .zshrc, or .env file
export KIMI_API_KEY="your-api-key-here"
export KIMI_MODEL="kimi-k2.5"
export KIMI_MAX_TOKENS="256000"
```

**Project-level Configuration (.kimirc):**

```yaml
# .kimirc in project root
api:
  key: ${KIMI_API_KEY}
  model: kimi-k2.5
  
context:
  max_tokens: 256000
  include_patterns:
    - "src/**/*"
    - "docs/**/*"
  exclude_patterns:
    - "node_modules/**"
    - ".git/**"
    - "*.log"

swarm:
  enabled: true
  max_agents: 10
  coordination_strategy: "hierarchical"
  
optimization:
  context_compression: true
  local_inference: false
  mcp_integrations:
    - github
    - postgres
    - slack
```

### First Run Verification

```bash
# Test your configuration
kimi-code status

# Expected output:
# ✓ API connection successful
# ✓ Model: kimi-k2.5
# ✓ Context window: 256K tokens
# ✓ Swarm mode: Enabled
```

---

## 3. The 4 Operational Modes

Kimi Code offers four distinct operational modes, each optimized for different task types:

### Mode Comparison Table

| Mode | Latency | Use Case | Token Cost | Best For |
|------|---------|----------|------------|----------|
| **Instant** | <1s | Quick queries, syntax help | Very Low | Simple questions, code snippets |
| **Thinking** | 2-5s | Complex reasoning, debugging | Low-Medium | Algorithm design, problem solving |
| **Agent** | 5-15s | Multi-step tasks with tools | Medium | File operations, testing, deployment |
| **Agent Swarm** | 10-60s | Parallel coordination | Medium-High | Large projects, multiple files, complex workflows |

### 3.1 Instant Mode

**When to Use:**
- Quick syntax questions
- Simple code explanations
- One-line fixes
- Documentation lookups

**Example:**

```python
# User prompt (Instant mode)
"What's the Python syntax for list comprehension with filtering?"

# Kimi response
"""
List comprehension with filtering:

```python
# Basic syntax
[expression for item in iterable if condition]

# Example: Get even numbers squared
evens_squared = [x**2 for x in range(10) if x % 2 == 0]
# Result: [0, 4, 16, 36, 64]
```
"""
```

**Activation:**
```javascript
// VS Code command palette
> Kimi: Instant Mode

// Or use keyboard shortcut
Ctrl+Shift+I (Windows/Linux)
Cmd+Shift+I (Mac)
```

### 3.2 Thinking Mode

**When to Use:**
- Complex algorithm design
- Debugging tricky issues
- Architecture decisions
- Performance optimization

**Example:**

```python
# User prompt (Thinking mode)
"""
I need to design a caching strategy for an API that handles 
10,000 requests/second with varying data freshness requirements.
Different endpoints need different TTLs.
"""

# Kimi response (thinking process included)
"""
Let me think through this systematically...

## Analysis
1. **Request Volume**: 10K req/s suggests need for distributed caching
2. **Varying TTLs**: Multi-tier cache strategy required
3. **Data Freshness**: Cache invalidation strategy critical

## Recommended Architecture

```python
import redis
from functools import wraps
import hashlib
import json

class MultiTierCache:
    def __init__(self):
        self.l1_cache = {}  # In-memory, < 1ms
        self.l2_cache = redis.Redis()  # Distributed, ~5ms
        
    def cache_with_ttl(self, ttl_seconds: int, tier: str = 'l2'):
        def decorator(func):
            @wraps(func)
            def wrapper(*args, **kwargs):
                cache_key = self._generate_key(func, args, kwargs)
                
                # Try L1 first (if applicable)
                if tier in ['l1', 'both']:
                    if cache_key in self.l1_cache:
                        return self.l1_cache[cache_key]
                
                # Try L2
                cached = self.l2_cache.get(cache_key)
                if cached:
                    result = json.loads(cached)
                    # Populate L1 if using both tiers
                    if tier == 'both':
                        self.l1_cache[cache_key] = result
                    return result
                
                # Execute and cache
                result = func(*args, **kwargs)
                self._set_cache(cache_key, result, ttl_seconds, tier)
                return result
            return wrapper
        return decorator
    
    def _generate_key(self, func, args, kwargs):
        key_data = f"{func.__name__}:{str(args)}:{str(kwargs)}"
        return hashlib.md5(key_data.encode()).hexdigest()
    
    def _set_cache(self, key, value, ttl, tier):
        serialized = json.dumps(value)
        if tier in ['l2', 'both']:
            self.l2_cache.setex(key, ttl, serialized)
        if tier in ['l1', 'both']:
            self.l1_cache[key] = value

# Usage with different TTLs
cache = MultiTierCache()

@cache.cache_with_ttl(ttl_seconds=300, tier='l1')  # 5 min, in-memory
def get_user_profile(user_id):
    return db.query(User).get(user_id)

@cache.cache_with_ttl(ttl_seconds=3600, tier='l2')  # 1 hour, distributed
def get_product_catalog():
    return db.query(Product).all()

@cache.cache_with_ttl(ttl_seconds=60, tier='both')  # 1 min, both tiers
def get_realtime_metrics():
    return analytics_service.get_current()
```

## Additional Considerations
- **Cache Warming**: Pre-populate hot data
- **Stampede Protection**: Use locks for popular keys
- **Monitoring**: Track hit rates per endpoint
"""
```

**Activation:**
```javascript
// VS Code command palette
> Kimi: Thinking Mode

// Or use keyboard shortcut
Ctrl+Shift+T (Windows/Linux)
Cmd+Shift+T (Mac)
```

### 3.3 Agent Mode

**When to Use:**
- Multi-step file operations
- Running tests and analyzing results
- Git operations with analysis
- Database migrations
- API integration tasks

**Example:**

```python
# User prompt (Agent mode)
"""
Refactor the authentication module to use JWT tokens instead 
of session cookies. Update all affected files and run tests.
"""

# Kimi agent workflow:
# 1. Analyze current auth implementation
# 2. Identify all files using session auth
# 3. Create JWT utility module
# 4. Update middleware
# 5. Update route handlers
# 6. Run tests
# 7. Report results

# Generated files:
"""
# auth/jwt_handler.py
import jwt
from datetime import datetime, timedelta
from functools import wraps
from flask import request, g

class JWTHandler:
    def __init__(self, secret_key, algorithm='HS256'):
        self.secret_key = secret_key
        self.algorithm = algorithm
    
    def generate_token(self, user_id, expires_in=24):
        payload = {
            'user_id': user_id,
            'exp': datetime.utcnow() + timedelta(hours=expires_in),
            'iat': datetime.utcnow()
        }
        return jwt.encode(payload, self.secret_key, algorithm=self.algorithm)
    
    def verify_token(self, token):
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            return payload['user_id']
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None

# Decorator for protected routes
def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token or not token.startswith('Bearer '):
            return {'error': 'Missing token'}, 401
        
        token = token.split(' ')[1]
        user_id = jwt_handler.verify_token(token)
        
        if not user_id:
            return {'error': 'Invalid or expired token'}, 401
        
        g.user_id = user_id
        return f(*args, **kwargs)
    return decorated
"""
```

**Activation:**
```javascript
// VS Code command palette
> Kimi: Agent Mode

// Or use keyboard shortcut
Ctrl+Shift+A (Windows/Linux)
Cmd+Shift+A (Mac)
```

### 3.4 Agent Swarm Mode

**When to Use:**
- Large-scale refactoring across many files
- Parallel testing of multiple components
- Multi-module feature implementation
- Complex documentation generation
- Cross-language project coordination

**Example:**

```python
# User prompt (Agent Swarm mode)
"""
Create a complete REST API for an e-commerce platform with:
- User authentication and authorization
- Product catalog with search
- Shopping cart functionality
- Order processing
- Payment integration (Stripe)
- Email notifications
- Admin dashboard endpoints

Generate all necessary files including tests.
"""

# Kimi Swarm coordination:
# Agent 1: Authentication & User Management
# Agent 2: Product Catalog & Search
# Agent 3: Shopping Cart Service
# Agent 4: Order Processing
# Agent 5: Payment Integration
# Agent 6: Email Service
# Agent 7: Admin API
# Agent 8: Database Models & Migrations
# Agent 9: API Tests
# Agent 10: Integration Coordinator

# Each agent works in parallel on their domain
```

**Activation:**
```javascript
// VS Code command palette
> Kimi: Agent Swarm Mode

// Or use keyboard shortcut
Ctrl+Shift+S (Windows/Linux)
Cmd+Shift+S (Mac)

# Or programmatically:
```python
from kimi_code import SwarmCoordinator

coordinator = SwarmCoordinator(
    max_agents=10,
    coordination_strategy="hierarchical"
)

result = coordinator.execute(
    task="Build e-commerce API",
    agents_config=[
        {"role": "auth_specialist", "files": ["auth/*", "users/*"]},
        {"role": "catalog_specialist", "files": ["products/*", "search/*"]},
        # ... more agents
    ]
)
```

---

## 4. Agent Swarm Best Practices

### 4.1 When to Activate Agent Swarm

**✓ DO Use Swarm When:**
- Task involves 5+ files
- Multiple independent components need work
- Parallel execution saves time
- Different expertise areas are needed
- Task can be naturally decomposed

**✗ DON'T Use Swarm When:**
- Task is simple (< 3 files)
- Components are highly interdependent
- Sequential execution is required
- Debugging a single issue
- Quick one-off questions

### 4.2 Swarm Activation Patterns

#### Pattern 1: Domain-Based Decomposition

```python
# Best for: Microservices, modular architectures

swarm_config = {
    "agents": [
        {
            "name": "auth_agent",
            "domain": "authentication",
            "files": ["src/auth/**/*", "src/middleware/auth.*"],
            "responsibilities": ["login", "register", "JWT", "permissions"]
        },
        {
            "name": "api_agent", 
            "domain": "api_endpoints",
            "files": ["src/routes/**/*", "src/controllers/**/*"],
            "responsibilities": ["REST endpoints", "validation", "serialization"]
        },
        {
            "name": "data_agent",
            "domain": "data_layer",
            "files": ["src/models/**/*", "src/repositories/**/*"],
            "responsibilities": ["ORM models", "queries", "migrations"]
        }
    ],
    "coordinator": {
        "strategy": "domain_lead",
        "sync_points": ["after_models", "after_controllers"]
    }
}
```

#### Pattern 2: Layer-Based Decomposition

```python
# Best for: Full-stack features, MVC architectures

swarm_config = {
    "agents": [
        {
            "name": "frontend_agent",
            "layer": "presentation",
            "files": ["frontend/src/components/**/*", "frontend/src/pages/**/*"],
            "tech_stack": ["React", "TypeScript", "Tailwind"]
        },
        {
            "name": "backend_agent",
            "layer": "application",
            "files": ["backend/src/services/**/*", "backend/src/controllers/**/*"],
            "tech_stack": ["Node.js", "Express", "TypeScript"]
        },
        {
            "name": "database_agent",
            "layer": "data",
            "files": ["backend/src/models/**/*", "migrations/**/*"],
            "tech_stack": ["PostgreSQL", "Prisma"]
        }
    ],
    "coordinator": {
        "strategy": "layer_cake",
        "interface_contracts": True  # Enforce API contracts between layers
    }
}
```

#### Pattern 3: Feature-Based Decomposition

```python
# Best for: Product features, user stories

swarm_config = {
    "agents": [
        {
            "name": "checkout_feature_agent",
            "feature": "checkout",
            "scope": ["cart", "payment", "confirmation"],
            "files": [
                "**/cart/**/*",
                "**/payment/**/*", 
                "**/checkout/**/*"
            ]
        },
        {
            "name": "search_feature_agent",
            "feature": "search",
            "scope": ["indexing", "querying", "filtering"],
            "files": [
                "**/search/**/*",
                "**/indexing/**/*"
            ]
        }
    ],
    "coordinator": {
        "strategy": "feature_lead",
        "shared_resources": ["database", "message_queue"]
    }
}
```

### 4.3 Effective Swarm Coordination

#### Hierarchical Coordination

```python
from kimi_code import SwarmCoordinator

# Best for: Complex projects with clear leadership

coordinator = SwarmCoordinator(
    strategy="hierarchical",
    lead_agent="architect_agent",
    worker_agents=[
        "frontend_agent",
        "backend_agent", 
        "database_agent",
        "testing_agent"
    ]
)

# Execution flow:
# 1. Architect creates high-level design
# 2. Workers implement in parallel
# 3. Architect reviews and integrates
# 4. Testing agent validates
```

#### Peer-to-Peer Coordination

```python
# Best for: Collaborative tasks, code reviews

coordinator = SwarmCoordinator(
    strategy="peer_to_peer",
    agents=[
        {"name": "implementer", "role": "write"},
        {"name": "reviewer_1", "role": "review"},
        {"name": "reviewer_2", "role": "review"},
        {"name": "tester", "role": "test"}
    ],
    consensus_threshold=0.7  # 70% agreement required
)
```

#### Pipeline Coordination

```python
# Best for: CI/CD, sequential workflows

coordinator = SwarmCoordinator(
    strategy="pipeline",
    stages=[
        {"name": "design", "agent": "architect_agent"},
        {"name": "implement", "agent": "developer_agent"},
        {"name": "test", "agent": "qa_agent"},
        {"name": "deploy", "agent": "devops_agent"}
    ],
    auto_promote=True,  # Auto-advance on success
    rollback_on_failure=True
)
```

### 4.4 Swarm Size Guidelines

| Project Size | Recommended Agents | Coordination Strategy |
|-------------|-------------------|----------------------|
| Small (1-10 files) | 2-3 agents | Peer-to-peer |
| Medium (10-50 files) | 3-5 agents | Hierarchical |
| Large (50-200 files) | 5-10 agents | Hierarchical + Domain leads |
| Enterprise (200+ files) | 10-20 agents | Multi-level hierarchy |

### 4.5 Communication Patterns

```python
# Define clear communication protocols

swarm_config = {
    "communication": {
        "channels": {
            "broadcast": "all_agents",  # Everyone receives
            "direct": "agent_to_agent",  # Point-to-point
            "hierarchical": "up_down_only"  # Through coordinator
        },
        "message_types": {
            "task_assignment": {"priority": "high", "response_required": True},
            "status_update": {"priority": "normal", "response_required": False},
            "blocker": {"priority": "critical", "escalate": True},
            "completion": {"priority": "high", "triggers_sync": True}
        }
    }
}
```

---

## 5. Prompt Engineering for Swarms

### 5.1 Prompt Structure for Multi-Agent Tasks

#### The 5-Part Prompt Template

```markdown
## 1. CONTEXT
[Provide background information about the project, current state, and goals]

## 2. TASK DECOMPOSITION
[Break down the task into sub-tasks for each agent]

### Agent 1: [Role Name]
- **Responsibilities**: [List specific tasks]
- **Input**: [What this agent needs]
- **Output**: [What this agent produces]
- **Dependencies**: [Other agents this depends on]

### Agent 2: [Role Name]
...

## 3. COORDINATION REQUIREMENTS
[Define how agents should coordinate]
- Sync points: [When agents must synchronize]
- Shared resources: [What resources are shared]
- Communication protocol: [How agents communicate]

## 4. CONSTRAINTS & STANDARDS
[Define boundaries and quality standards]
- Code style: [Linting rules, formatting]
- Testing requirements: [Coverage, test types]
- Performance criteria: [Response times, efficiency]

## 5. SUCCESS CRITERIA
[Define what success looks like]
- Functional requirements: [What must work]
- Quality metrics: [How to measure success]
- Deliverables: [What artifacts to produce]
```

### 5.2 Example: Complete Swarm Prompt

```markdown
## CONTEXT
We are building a new user dashboard for our SaaS platform. The current 
dashboard uses jQuery and needs modernization. We're migrating to React 
with TypeScript.

Current tech stack:
- Backend: Python/FastAPI
- Database: PostgreSQL
- Frontend: React 18, TypeScript, Tailwind CSS, React Query

## TASK DECOMPOSITION

### Agent 1: Database Specialist
**Responsibilities**:
- Create new tables for dashboard widgets
- Add indexes for performance
- Write migration scripts

**Input**: Current schema, widget requirements
**Output**: Migration files, updated models
**Dependencies**: None (starts first)

### Agent 2: API Developer  
**Responsibilities**:
- Create REST endpoints for widget data
- Implement caching strategy
- Add authentication checks

**Input**: Database schema from Agent 1
**Output**: API routes, controllers, services
**Dependencies**: Agent 1 (schema)

### Agent 3: Frontend Developer
**Responsibilities**:
- Create React components for dashboard
- Implement data fetching with React Query
- Add loading states and error handling

**Input**: API contracts from Agent 2
**Output**: React components, hooks, types
**Dependencies**: Agent 2 (API contracts)

### Agent 4: UI/UX Implementer
**Responsibilities**:
- Style components with Tailwind
- Ensure responsive design
- Implement dark mode support

**Input**: Components from Agent 3
**Output**: Styled, responsive components
**Dependencies**: Agent 3 (components)

### Agent 5: Testing Specialist
**Responsibilities**:
- Write unit tests for API endpoints
- Create component tests with React Testing Library
- Add E2E tests for critical paths

**Input**: All code from Agents 1-4
**Output**: Test suites, coverage report
**Dependencies**: Agents 1-4 (all code)

## COORDINATION REQUIREMENTS

### Sync Points
1. After Agent 1 completes schema (blocks Agent 2)
2. After Agent 2 defines API contracts (blocks Agent 3)
3. After Agent 3 creates component structure (blocks Agent 4)
4. Final integration before Agent 5 tests

### Shared Resources
- Database (migrations must be coordinated)
- API routes (no duplicate endpoints)
- Component library (reuse existing)

### Communication Protocol
- Use shared types file for contracts
- Comment on interfaces with @agent mentions
- Raise blockers immediately via coordinator

## CONSTRAINTS & STANDARDS

### Code Style
- Python: Black formatter, 88 char line length
- TypeScript: ESLint with @typescript-eslint/recommended
- Components: Functional with hooks, no class components

### Testing Requirements
- API: 80% coverage minimum
- Components: Test user interactions
- E2E: Critical user journeys only

### Performance Criteria
- API response: < 200ms p95
- Component render: < 100ms
- First contentful paint: < 1.5s

## SUCCESS CRITERIA

### Functional Requirements
- [ ] Users can view dashboard with 5 widget types
- [ ] Widgets refresh automatically every 30 seconds
- [ ] Dashboard works on mobile and desktop
- [ ] Dark mode toggle functions correctly

### Quality Metrics
- [ ] Test coverage > 80%
- [ ] No TypeScript errors
- [ ] Lighthouse score > 90
- [ ] Zero critical security issues

### Deliverables
- [ ] Migration files in /migrations
- [ ] API code in /backend/src/dashboard
- [ ] Frontend code in /frontend/src/dashboard
- [ ] Tests in respective __tests__ directories
- [ ] README with setup instructions
```

### 5.3 Coordination Keywords

Use these keywords in prompts to guide swarm behavior:

| Keyword | Effect | Example |
|---------|--------|---------|
| `PARALLEL` | Agents work simultaneously | "Agents 1 and 2 can work PARALLEL on independent modules" |
| `SEQUENTIAL` | Agents work in order | "Agents must work SEQUENTIAL: schema → API → frontend" |
| `BLOCKS` | Creates dependency | "Agent 1 BLOCKS Agent 2 (schema required first)" |
| `SYNC_POINT` | Forces synchronization | "SYNC_POINT after API contracts defined" |
| `SHARED` | Marks shared resources | "SHARED: database connection pool" |
| `EXCLUSIVE` | Marks isolated work | "EXCLUSIVE: Agent 3 owns all CSS" |
| `FALLBACK` | Defines backup plan | "FALLBACK: If Agent 2 fails, Agent 1 handles API" |

### 5.4 Anti-Patterns to Avoid

**❌ Vague Role Definitions**
```markdown
# BAD
Agent 1: Do backend stuff
Agent 2: Do frontend stuff
```

**✅ Specific Role Definitions**
```markdown
# GOOD
Agent 1: Create PostgreSQL schema for user analytics with proper 
indexing on timestamp and user_id columns. Write migration using 
Alembic. Create SQLAlchemy models with relationships.

Agent 2: Implement React components for analytics dashboard using 
Recharts for visualizations. Connect to /api/analytics endpoints. 
Implement date range filtering.
```

**❌ Missing Dependencies**
```markdown
# BAD
All agents start immediately and figure it out.
```

**✅ Clear Dependencies**
```markdown
# GOOD
Phase 1: Agent 1 (schema) - no dependencies
Phase 2: Agents 2 & 3 (API & types) - depends on Phase 1
Phase 3: Agent 4 (frontend) - depends on Phase 2
Phase 4: Agent 5 (tests) - depends on Phase 3
```

**❌ No Success Criteria**
```markdown
# BAD
Make it work good.
```

**✅ Measurable Criteria**
```markdown
# GOOD
Success criteria:
- All API endpoints return 200 OK with valid JSON
- Frontend renders without console errors
- Test coverage >= 80%
- Lighthouse performance score >= 90
```

---

## 6. Performance Optimization

### 6.1 Context Compression

Kimi K2.5's 256K context window is powerful, but efficient use matters:

#### Automatic Compression Strategies

```python
# Enable in configuration
context_config = {
    "compression": {
        "enabled": True,
        "strategy": "semantic",  # or "truncation", "summarization"
        "threshold": 0.8,  # Compress when context > 80% full
        "preserve": [
            "recent_messages",  # Keep last N messages intact
            "critical_files",   # Never compress these
            "user_preferences"  # Keep user settings
        ]
    }
}
```

#### Manual Compression Techniques

```python
# 1. Summarize long files before sending
file_summary = """
# src/services/payment.py (Summary)
# Purpose: Handles payment processing via Stripe
# Key Functions:
#   - process_payment(): Main payment handler
#   - refund_payment(): Handles refunds
#   - validate_card(): Card validation
# Dependencies: stripe, logging, models.Payment
# Last Modified: 2024-01-15
"""

# 2. Use code folding markers
folded_code = """
class PaymentService:
    # ... 45 lines of initialization ...
    
    def process_payment(self, amount, currency, token):
        # [Implementation: 120 lines]
        # Key logic: Validate → Charge → Record → Notify
        pass
    
    # ... 30 lines of helper methods ...
"""

# 3. Exclude irrelevant files
exclude_patterns = [
    "**/*.test.js",      # Test files (unless testing)
    "**/node_modules/**", # Dependencies
    "**/*.min.js",       # Minified files
    "**/dist/**",        # Build output
    "**/.git/**",        # Git internals
]
```

### 6.2 Local Inference

For sensitive data or cost optimization:

#### Setup Local Kimi Inference

```bash
# 1. Download weights from Hugging Face
huggingface-cli download moonshot-ai/kimi-k2.5 \
    --local-dir ./kimi-k2.5 \
    --local-dir-use-symlinks False

# 2. Run with vLLM (recommended)
vllm serve ./kimi-k2.5 \
    --tensor-parallel-size 4 \
    --max-model-len 256000 \
    --gpu-memory-utilization 0.9

# 3. Configure Kimi Code to use local endpoint
```

```python
# Configuration for local inference
local_config = {
    "inference": {
        "mode": "local",
        "endpoint": "http://localhost:8000/v1",
        "api_key": "not-needed-for-local",
        "model": "kimi-k2.5",
        "timeout": 300  # Longer timeout for local
    }
}
```

#### When to Use Local Inference

| Scenario | Recommendation |
|----------|---------------|
| Sensitive data (PII, healthcare, finance) | ✅ Local required |
| High-volume batch processing | ✅ Local cost-effective |
| Prototyping/experimentation | ✅ Local preferred |
| Production with < 1000 req/day | ☁️ Cloud fine |
| Production with > 1000 req/day | ⚖️ Evaluate both |
| Need 99.99% uptime | ☁️ Cloud + fallback |

### 6.3 MCP (Model Context Protocol) Integrations

MCP extends Kimi Code with external tools:

#### Available Integrations

```yaml
# .kimirc - MCP configuration
mcp:
  integrations:
    # Database
    postgres:
      enabled: true
      connection: "${DATABASE_URL}"
      read_only: true  # Safety first
      
    # Version Control
    github:
      enabled: true
      token: "${GITHUB_TOKEN}"
      permissions: ["read", "write"]
      
    # Communication
    slack:
      enabled: true
      webhook: "${SLACK_WEBHOOK_URL}"
      channel: "#dev-updates"
      
    # Documentation
    notion:
      enabled: true
      token: "${NOTION_TOKEN}"
      database_id: "..."
      
    # Cloud Services
    aws:
      enabled: true
      region: "us-east-1"
      services: ["s3", "lambda", "cloudwatch"]
```

#### Using MCP in Prompts

```python
# Query database directly
"""
@mcp:postgres
Show me the schema for the users table and identify any missing 
indexes that might be causing slow queries.
"""

# Create GitHub issue from code analysis
"""
@mcp:github
After analyzing the codebase, create an issue titled "Refactor 
authentication middleware" with these findings:
- Current middleware has 3 security vulnerabilities
- Response time is 500ms (target: <100ms)
- Code duplication across 5 files
"""

# Send notification on completion
"""
@mcp:slack
Notify #deployments that the refactoring is complete and all 
tests are passing. Include a summary of changes.
"""
```

### 6.4 Caching Strategies

```python
# Enable response caching
cache_config = {
    "cache": {
        "enabled": True,
        "backend": "redis",  # or "memory", "disk"
        "ttl": {
            "instant_mode": 3600,    # 1 hour
            "thinking_mode": 1800,   # 30 minutes
            "agent_mode": 600,       # 10 minutes
            "swarm_mode": 300        # 5 minutes
        },
        "key_strategy": "content_hash",  # Hash of prompt + context
        "invalidate_on": {
            "file_change": True,
            "git_commit": True,
            "manual_flush": True
        }
    }
}
```

### 6.5 Token Usage Optimization

#### Cost Calculation

```python
# Kimi K2.5 Pricing (as of 2025)
INPUT_PRICE = 0.60 / 1_000_000   # $0.60 per million tokens
OUTPUT_PRICE = 2.50 / 1_000_000  # $2.50 per million tokens

def estimate_cost(input_tokens, output_tokens):
    input_cost = (input_tokens * INPUT_PRICE)
    output_cost = (output_tokens * OUTPUT_PRICE)
    return input_cost + output_cost

# Example: 10K input, 5K output
print(f"Cost: ${estimate_cost(10000, 5000):.4f}")  # $0.0185
```

#### Optimization Techniques

| Technique | Savings | Implementation |
|-----------|---------|----------------|
| Context compression | 30-50% | Enable automatic compression |
| Response caching | 40-70% | Cache common queries |
| Mode selection | 20-40% | Use Instant for simple tasks |
| Prompt templating | 10-20% | Reuse prompt structures |
| Batch processing | 15-25% | Group related requests |

---

## 7. Security & Privacy Considerations

### 7.1 Data Handling Best Practices

#### What Gets Sent to Kimi API

```
✓ Sent to API:
- Your prompts and questions
- File contents you explicitly share
- Project structure (file names, paths)
- Selected code snippets
- Configuration files (.kimirc)

✗ NOT Sent to API (by default):
- Environment variables
- .env files
- Secrets and API keys
- Passwords and tokens
- Private keys
```

#### Secure Configuration

```yaml
# .kimirc - Security settings
security:
  # Never send these patterns
  redact_patterns:
    - "password.*=.*"
    - "api_key.*=.*"
    - "secret.*=.*"
    - "token.*=.*"
    - "-----BEGIN.*-----"
  
  # Exclude these files entirely
  exclude_files:
    - ".env"
    - ".env.*"
    - "*.pem"
    - "*.key"
    - "secrets.yaml"
    - "credentials.json"
  
  # Confirm before sending large files
  confirm_threshold_bytes: 100000  # 100KB
  
  # Audit logging
  audit_log:
    enabled: true
    path: "./logs/kimi-audit.log"
    retention_days: 30
```

### 7.2 API Key Security

```bash
# ❌ NEVER do this
export KIMI_API_KEY="sk-abc123..."  # In committed files

# ✅ DO this instead
# 1. Use environment variables
export KIMI_API_KEY="${KIMI_API_KEY}"

# 2. Use secret management
# AWS Secrets Manager
aws secretsmanager get-secret-value --secret-id kimi/api-key

# HashiCorp Vault
vault kv get secret/kimi-api-key

# 3. Use .env files (gitignored)
# .env.local (add to .gitignore!)
KIMI_API_KEY=sk-abc123...
```

### 7.3 Compliance Considerations

| Regulation | Requirement | Kimi Code Setting |
|------------|-------------|-------------------|
| GDPR | Data minimization | `redact_patterns` for PII |
| HIPAA | PHI protection | `exclude_files` for health data |
| SOC 2 | Audit trail | `audit_log.enabled: true` |
| PCI DSS | No card data | Block credit card patterns |

### 7.4 Network Security

```yaml
# .kimirc - Network settings
network:
  # Use HTTPS only
  protocol: "https"
  
  # Pin certificate (optional)
  certificate_pin: "sha256/abc123..."
  
  # Proxy configuration
  proxy:
    enabled: false
    # url: "http://proxy.company.com:8080"
    # auth: "${PROXY_AUTH}"
  
  # Request timeout
  timeout_seconds: 60
  
  # Retry configuration
  retry:
    max_attempts: 3
    backoff: "exponential"
```

---

## 8. Resource Management

### 8.1 Token Usage Tracking

```python
# Enable detailed token tracking
tracking_config = {
    "tracking": {
        "enabled": True,
        "metrics": [
            "input_tokens",
            "output_tokens",
            "total_tokens",
            "cost_usd",
            "response_time_ms"
        ],
        "export": {
            "format": "json",  # or "csv", "prometheus"
            "destination": "./logs/token-usage.json"
        }
    }
}

# View usage report
```

```json
{
  "session_id": "sess_abc123",
  "start_time": "2025-01-15T10:00:00Z",
  "requests": [
    {
      "timestamp": "2025-01-15T10:05:00Z",
      "mode": "agent",
      "input_tokens": 5234,
      "output_tokens": 1847,
      "total_tokens": 7081,
      "cost_usd": 0.0077,
      "response_time_ms": 8452
    }
  ],
  "session_total": {
    "input_tokens": 5234,
    "output_tokens": 1847,
    "total_tokens": 7081,
    "cost_usd": 0.0077
  }
}
```

### 8.2 Checkpointing

Save and restore swarm state:

```python
from kimi_code import SwarmCoordinator

# Create checkpoint
coordinator = SwarmCoordinator(...)
coordinator.execute(task="Build feature X")

checkpoint_id = coordinator.save_checkpoint(
    name="after_api_design",
    include_files=True,
    include_context=True
)

# Restore from checkpoint
coordinator.load_checkpoint(checkpoint_id)
# Continue from saved state
```

#### Checkpoint Configuration

```yaml
# .kimirc - Checkpoint settings
checkpoint:
  enabled: true
  auto_save:
    enabled: true
    interval_minutes: 10
    on_error: true
  storage:
    backend: "local"  # or "s3", "gcs"
    path: "./.kimi/checkpoints"
  retention:
    max_checkpoints: 10
    max_age_days: 7
```

### 8.3 Rate Limiting

```python
# Configure rate limits to avoid API throttling
rate_limit_config = {
    "rate_limiting": {
        "enabled": True,
        "limits": {
            "requests_per_minute": 60,
            "tokens_per_minute": 100000,
            "concurrent_requests": 5
        },
        "strategy": "token_bucket",  # or "sliding_window"
        "on_limit": "queue"  # or "reject", "retry"
    }
}
```

### 8.4 Budget Management

```yaml
# .kimirc - Budget settings
budget:
  enabled: true
  daily_limit_usd: 50.00
  monthly_limit_usd: 500.00
  
  alerts:
    - threshold: 50%  # Alert at $25
      action: "log"
    - threshold: 80%  # Alert at $40
      action: "notify"
      channel: "slack"
    - threshold: 95%  # Alert at $47.50
      action: "block"
      message: "Daily budget exceeded"
  
  per_mode_limits:
    instant:
      daily_limit_usd: 5.00
    thinking:
      daily_limit_usd: 10.00
    agent:
      daily_limit_usd: 20.00
    swarm:
      daily_limit_usd: 15.00
```

---

## 9. Common Pitfalls and How to Avoid Them

### 9.1 Pitfall: Context Overflow

**Problem:** Hitting the 256K token limit with large projects.

**Symptoms:**
- "Context window exceeded" errors
- Truncated responses
- Missing file references

**Solutions:**

```python
# 1. Use selective file inclusion
context_config = {
    "include": [
        "src/**/*.py",      # Only Python files
        "config/**/*.yaml", # Config files
    ],
    "exclude": [
        "**/*.test.py",     # Exclude tests
        "**/migrations/**", # Exclude migrations
    ]
}

# 2. Enable automatic compression
compression_config = {
    "enabled": True,
    "strategy": "semantic",
    "threshold": 0.7
}

# 3. Use @file references instead of full context
"""
@file:src/main.py
@file:src/utils.py
Focus on these specific files for the refactoring task.
"""
```

### 9.2 Pitfall: Over-Engineering with Swarms

**Problem:** Using Agent Swarm for simple tasks.

**Symptoms:**
- High token costs for simple changes
- Longer execution times
- Unnecessary coordination overhead

**Decision Matrix:**

| Task Complexity | Files Involved | Recommended Mode |
|----------------|----------------|------------------|
| Simple Q&A | 0-1 | Instant |
| Single file edit | 1 | Thinking |
| Multi-step task | 2-5 | Agent |
| Complex project | 5+ | Agent Swarm |

### 9.3 Pitfall: Poor Agent Coordination

**Problem:** Agents conflict or duplicate work.

**Symptoms:**
- Merge conflicts
- Duplicate code
- Inconsistent patterns

**Solutions:**

```python
# 1. Define clear ownership
agent_config = {
    "agents": [
        {
            "name": "database_agent",
            "owns": ["models/", "migrations/"],
            "excludes_others": True  # No other agent touches these
        }
    ]
}

# 2. Use interface contracts
"""
Agent 1 produces: UserService interface
Agent 2 consumes: UserService interface

Contract:
- Methods: create_user(), get_user(), update_user()
- Returns: User object or None
- Raises: UserNotFoundError, ValidationError
"""

# 3. Implement sync points
coordination_config = {
    "sync_points": [
        {"after": "schema_creation", "agents": ["api", "frontend"]},
        {"after": "api_contract", "agents": ["frontend", "tests"]}
    ]
}
```

### 9.4 Pitfall: Ignoring Token Costs

**Problem:** Unexpectedly high API bills.

**Symptoms:**
- Daily budget exceeded
- High costs for simple tasks
- No visibility into usage

**Solutions:**

```yaml
# 1. Set up budget alerts
budget:
  daily_limit_usd: 20.00
  alerts:
    - threshold: 80%
      action: notify

# 2. Use appropriate modes
# Instant: $0.0001-0.001 per request
# Thinking: $0.001-0.01 per request  
# Agent: $0.01-0.10 per request
# Swarm: $0.10-1.00 per request

# 3. Cache common responses
cache:
  enabled: true
  ttl: 3600
```

### 9.5 Pitfall: Security Oversights

**Problem:** Accidentally exposing secrets.

**Symptoms:**
- Secrets in AI responses
- API keys in logs
- Credentials in shared context

**Solutions:**

```yaml
# 1. Configure redaction
security:
  redact_patterns:
    - "password\s*=\s*['\"][^'\"]+['\"]"
    - "api_key\s*=\s*['\"][^'\"]+['\"]"
    - "-----BEGIN (RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----"

# 2. Exclude sensitive files
exclude_files:
  - ".env"
  - "*.pem"
  - "secrets.yaml"

# 3. Enable audit logging
audit_log:
  enabled: true
  path: "./logs/security-audit.log"
```

### 9.6 Pitfall: Mode Confusion

**Problem:** Using wrong mode for the task.

| Wrong Choice | Better Choice | Why |
|--------------|---------------|-----|
| Swarm for 2 files | Agent mode | Less overhead |
| Instant for debugging | Thinking mode | Better reasoning |
| Agent for quick Q&A | Instant mode | Faster response |
| Thinking for file ops | Agent mode | Tool access |

### 9.7 Quick Troubleshooting Guide

| Issue | Likely Cause | Solution |
|-------|--------------|----------|
| "Context exceeded" | Too many files | Use selective inclusion |
| Slow responses | Wrong mode | Switch to Instant/Thinking |
| High costs | Swarm overuse | Use Agent mode instead |
| Conflicting code | Poor coordination | Define clear ownership |
| Missing files | Exclude patterns | Review .kimirc config |
| API errors | Rate limiting | Reduce concurrent requests |

---

## 10. Comparison with Other Tools

### 10.1 Feature Comparison

| Feature | Kimi K2.5 | Claude 3.5 Sonnet | GPT-4o |
|---------|-----------|-------------------|--------|
| **Parameters** | 1T (32B active) | ~175B | ~1.8T |
| **Context Window** | 256K | 200K | 128K |
| **Multimodal** | ✅ Text, Image, Video | ✅ Text, Image | ✅ Text, Image |
| **Max Agents** | 100 | 1 | 1 |
| **Tool Calls** | 200-300/agent | ~20 | ~32 |
| **Vision** | ✅ Excellent | ✅ Excellent | ✅ Good |
| **Code Quality** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Input Price** | $0.60/M | $3.00/M | $2.50/M |
| **Output Price** | $2.50/M | $15.00/M | $10.00/M |

### 10.2 When to Choose Kimi K2.5

**✅ Kimi K2.5 is Best For:**

1. **Large-scale parallel workflows**
   - Multi-file refactoring
   - Complex project generation
   - Parallel testing

2. **Cost-sensitive deployments**
   - MoE architecture = pay for activated params only
   - 5x cheaper than Claude for similar quality
   - Better for high-volume use cases

3. **Vision-based development**
   - Converting mockups to code
   - Analyzing diagrams and screenshots
   - UI implementation from designs

4. **Multi-agent coordination**
   - Up to 100 sub-agents
   - Complex orchestration scenarios
   - Enterprise-scale automation

**Example Decision:**

```python
"""
Scenario: Building a new microservice with 15 files

Kimi K2.5 Swarm:
- Cost: ~$0.50
- Time: ~2 minutes
- Agents: 5 specialized agents
- Result: Complete implementation + tests

Claude 3.5:
- Cost: ~$2.00
- Time: ~5 minutes (sequential)
- Agents: 1 (no native swarm)
- Result: Implementation (tests extra)

Winner: Kimi K2.5 for cost and speed
"""
```

### 10.3 When to Choose Alternatives

**✅ Claude 3.5 Sonnet is Best For:**

1. **Deep reasoning tasks**
   - Complex algorithm design
   - Mathematical proofs
   - Nuanced analysis

2. **Creative writing**
   - Documentation with personality
   - User-facing content
   - Marketing copy

3. **When you need single-agent excellence**
   - No need for parallel coordination
   - Prefer simpler architecture

**✅ GPT-4o is Best For:**

1. **Ecosystem integration**
   - Extensive plugin ecosystem
   - Wide third-party support
   - Established integrations

2. **When you need voice/chat**
   - Real-time voice conversations
   - Interactive chat experiences

3. **General-purpose tasks**
   - Balanced across all domains
   - Good at everything, best at nothing

### 10.4 Cost Comparison Example

**Task: Generate a full-stack feature (API + Frontend + Tests)**

| Tool | Input Tokens | Output Tokens | Cost |
|------|--------------|---------------|------|
| Kimi K2.5 Swarm | 50K | 30K | **$0.105** |
| Claude 3.5 Sonnet | 50K | 30K | $0.600 |
| GPT-4o | 50K | 30K | $0.425 |

**Savings with Kimi:**
- vs Claude: **82% cheaper**
- vs GPT-4o: **75% cheaper**

### 10.5 Integration Comparison

| Integration | Kimi Code | Claude (Anthropic) | GPT (OpenAI) |
|-------------|-----------|-------------------|--------------|
| VS Code Extension | ✅ Native | ✅ Via third-party | ✅ Official |
| JetBrains IDEs | ✅ Available | ✅ Via third-party | ✅ Official |
| CLI Tool | ✅ Kimi Code | ❌ Limited | ✅ Available |
| API | ✅ REST/Streaming | ✅ REST/Streaming | ✅ REST/Streaming |
| Local Inference | ✅ HuggingFace | ❌ No | ❌ No |
| MCP Support | ✅ Native | ❌ No | ⚠️ Limited |

### 10.6 Migration Guide

**From Claude to Kimi:**

```python
# Claude prompt
"""
Human: Please refactor this authentication code to use JWT.

<auth_code>
def login(username, password):
    # ...
</auth_code>

Assistant: I'll help you refactor this to use JWT tokens.
"""

# Kimi equivalent
"""
Refactor this authentication code to use JWT tokens.

@file:src/auth.py

Requirements:
- Use PyJWT library
- Token expiry: 24 hours
- Include refresh token mechanism
- Add proper error handling
"""
```

**From GPT to Kimi:**

```python
# GPT function calling
functions = [
    {
        "name": "get_weather",
        "parameters": {...}
    }
]

# Kimi equivalent (built-in tool use)
"""
Get the current weather for San Francisco and suggest appropriate clothing.

@mcp:weather_api
location: San Francisco, CA
"""
```

---

## Quick Reference Card

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+I` | Instant Mode |
| `Ctrl+Shift+T` | Thinking Mode |
| `Ctrl+Shift+A` | Agent Mode |
| `Ctrl+Shift+S` | Agent Swarm Mode |
| `Ctrl+Shift+K` | Open Kimi Panel |

### Mode Selection Flowchart

```
Start
  │
  ├─ Simple question? ──Yes──► Instant Mode
  │
  ├─ Complex reasoning? ──Yes──► Thinking Mode
  │
  ├─ Multi-step with files? ──Yes──► Agent Mode
  │
  └─ Large project, many files? ──Yes──► Agent Swarm Mode
```

### Token Cost Estimator

```python
def quick_estimate(mode, complexity):
    """
    mode: 'instant', 'thinking', 'agent', 'swarm'
    complexity: 'low', 'medium', 'high'
    """
    costs = {
        'instant': {'low': 0.001, 'medium': 0.003, 'high': 0.005},
        'thinking': {'low': 0.005, 'medium': 0.015, 'high': 0.03},
        'agent': {'low': 0.02, 'medium': 0.05, 'high': 0.10},
        'swarm': {'low': 0.10, 'medium': 0.30, 'high': 0.80}
    }
    return costs[mode][complexity]

# Examples
print(quick_estimate('instant', 'low'))    # $0.001
print(quick_estimate('swarm', 'high'))     # $0.80
```

---

## Conclusion

Kimi K2.5 in Antigravity represents a significant advancement in AI-assisted development. By leveraging its multi-agent capabilities, massive context window, and cost-effective MoE architecture, you can dramatically accelerate your development workflow.

**Key Takeaways:**

1. **Choose the right mode** for your task complexity
2. **Use Agent Swarm** for large projects with clear decomposition
3. **Implement proper coordination** to avoid conflicts
4. **Monitor token usage** to control costs
5. **Follow security best practices** to protect sensitive data
6. **Leverage MCP integrations** for extended capabilities

**Next Steps:**

- Install Kimi Code extension in your IDE
- Configure your API key and preferences
- Start with Instant mode for simple tasks
- Gradually explore Agent and Swarm modes
- Join the community for tips and support

---

## Resources

- [Kimi Platform Documentation](https://platform.moonshot.cn)
- [Kimi Code GitHub](https://github.com/moonshot-ai/kimi-code)
- [Hugging Face Weights](https://huggingface.co/moonshot-ai)
- [Community Discord](https://discord.gg/kimi-ai)
- [Antigravity Documentation](https://docs.antigravity.ai)

---

*Last Updated: January 2025 | Kimi K2.5 | Antigravity v2.0*
