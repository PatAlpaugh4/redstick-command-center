# Kimi Code in Antigravity IDE - Complete Guide

> How to configure and use Kimi K2.5 with the Antigravity browser extension

---

## Overview

**Antigravity** is a browser-based AI IDE that works with Kimi Code to provide:
- Visual workflow management
- Browser automation and scraping
- Real-time collaboration
- Integrated debugging tools

**Kimi Code** is the official VS Code extension for Kimi K2.5 that brings Agent Swarm capabilities directly to your editor.

---

## Installation & Setup

### Step 1: Install Antigravity Browser Extension

1. Open Chrome/Edge and navigate to the Chrome Web Store
2. Search for "Antigravity" or visit [antigravity.google](https://antigravity.google)
3. Click "Add to Chrome" and confirm installation
4. The Antigravity icon will appear in your browser toolbar

### Step 2: Get Kimi API Key

1. Visit [platform.moonshot.ai](https://platform.moonshot.ai)
2. Sign up or log in to your account
3. Navigate to **API Keys** section
4. Click **Create New Key**
5. Copy the key (starts with `sk-`)

### Step 3: Configure Kimi in Antigravity

1. Open Antigravity by clicking the browser extension icon
2. Go to **Settings** (gear icon)
3. Navigate to **Models** → **Third-Party Models**
4. Click **Add Model**
5. Enter the following:

| Field | Value |
|-------|-------|
| Model Name | `Kimi K2.5` |
| API Endpoint | `https://api.moonshot.ai/v1` |
| API Key | Your copied API key |
| Context Window | `256000` |
| Temperature | `0.7` (adjust as needed) |

6. Check the following options:
   - ✅ **Support Tool Use**
   - ✅ **Multimodal Input**
   - ✅ **Enable Agent Mode**

7. Click **Save**

### Step 4: Install Kimi Code Extension (VS Code)

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Kimi Code"
4. Click **Install**
5. Reload VS Code if prompted

### Step 5: Connect VS Code to Antigravity

1. In VS Code, open Command Palette (Ctrl+Shift+P)
2. Type "Kimi Code: Connect to Antigravity"
3. Follow the authentication flow
4. Your VS Code is now linked to Antigravity browser sessions

---

## Using Kimi in Antigravity

### Basic Usage

1. Open Antigravity in your browser
2. Click **New Session**
3. Select **Kimi K2.5** from the model dropdown
4. Start typing your prompt

### Activating Agent Swarm Mode

To use Kimi's parallel agent capabilities:

```
You are the Lead Project Architect. Activate Agent Swarm mode with up to 
5 sub-agents to build a complete task management application.

Coordinate agents for:
1. Frontend development (React + Tailwind)
2. Backend API design (Node.js/Express)
3. Database schema (PostgreSQL)
4. Authentication system
5. Testing and documentation

Requirements:
- Use shared memory for coordination
- Report progress every 60 seconds
- Synthesize outputs into unified deliverable
```

### Browser Automation

Antigravity integrates with Kimi's browser tools:

```
Visit https://example.com and extract all product names and prices.
Save the data to a CSV file.
```

**Available browser tools:**
- `browser_visit` - Load a webpage
- `browser_click` - Click elements
- `browser_scroll` - Scroll pages
- `browser_find` - Search for text
- `browser_input` - Fill forms

### Screenshot to Code

1. Take a screenshot of any website or design
2. Upload it to Antigravity
3. Prompt: "Build a website that looks exactly like this screenshot"
4. Kimi will generate the HTML/CSS/JS code

---

## Antigravity-Specific Features

### Visual Workflow Builder

Antigravity provides a drag-and-drop interface for building workflows:

1. Click **Workflows** tab
2. Drag **Kimi Agent** nodes onto canvas
3. Connect nodes with arrows
4. Configure each node:
   - Select model (Kimi K2.5)
   - Choose mode (Instant/Thinking/Agent/Swarm)
   - Define inputs and outputs
5. Click **Run** to execute

### Real-Time Collaboration

- Share Antigravity sessions with team members
- Multiple users can view Kimi's progress simultaneously
- Leave comments on generated code
- Track changes with built-in version control

### Integrated Debugging

When Kimi generates code:
1. Antigravity highlights syntax errors
2. Click **Debug** to run with breakpoints
3. View console output in real-time
4. Step through execution line by line

### File Management

Antigravity provides a file explorer:
- Browse generated files
- Edit code directly in browser
- Download files as ZIP
- Sync with GitHub repositories

---

## Configuration Reference

### Antigravity Settings for Kimi

```json
{
  "models": {
    "kimi-k2.5": {
      "provider": "kimi",
      "base_url": "https://api.moonshot.ai/v1",
      "api_key": "${KIMI_API_KEY}",
      "model": "kimi-k2.5",
      "context_window": 256000,
      "temperature": 0.7,
      "tools": [
        "web_search",
        "code_runner",
        "browser_visit",
        "browser_click",
        "browser_scroll",
        "file_read",
        "file_write",
        "shell_execute",
        "image_search",
        "image_generate"
      ],
      "multimodal": true,
      "supports_vision": true
    }
  },
  "agent_swarm": {
    "enabled": true,
    "max_agents": 100,
    "default_agents": 5,
    "coordination_protocol": "shared_memory"
  },
  "browser_automation": {
    "enabled": true,
    "headless": false,
    "viewport": {
      "width": 1280,
      "height": 720
    }
  }
}
```

### Environment Variables

Create `.env` file in your project root:

```bash
# Kimi API
KIMI_API_KEY=sk-your-api-key-here
KIMI_BASE_URL=https://api.moonshot.ai/v1

# Antigravity
ANTIGRAVITY_TOKEN=your-antigravity-token
ANTIGRAVITY_PROJECT_ID=your-project-id

# Optional: Other services
OPENAI_API_KEY=sk-...          # If using OpenAI fallback
ANTHROPIC_API_KEY=sk-ant-...   # If using Claude fallback
BRAVE_API_KEY=...              # For Brave Search MCP
```

---

## Best Practices

### 1. Mode Selection

| Scenario | Mode | Why |
|----------|------|-----|
| Quick question | Instant | Fastest response |
| Complex problem | Thinking | Better reasoning |
| Multi-step task | Agent | Tool use + autonomy |
| Large project | Agent Swarm | Parallel execution |

### 2. Context Management

- Kimi has 256K context window
- For long sessions, enable compression
- Clear context periodically with `/clear`
- Use file references instead of pasting large code blocks

### 3. Tool Usage

- Kimi supports 200-300 tool calls per agent
- In Agent Swarm: up to 1,500 total tool calls
- Use `yolo=True` for trusted operations
- Use `yolo=False` for sensitive operations (requires approval)

### 4. Browser Automation

- Always specify full URLs (include `https://`)
- Use `browser_find` to locate elements before clicking
- Handle pagination with `browser_scroll`
- Save screenshots for debugging

### 5. Cost Management

- **Input:** $0.60/M tokens
- **Output:** $2.50/M tokens
- Agent Swarm is cost-effective for parallel tasks
- Monitor usage in Antigravity dashboard

---

## Troubleshooting

### Issue: Kimi not responding

**Solution:**
1. Check API key is valid
2. Verify `KIMI_BASE_URL` is correct
3. Check internet connection
4. Try switching to Instant mode

### Issue: Browser automation failing

**Solution:**
1. Ensure Antigravity browser extension is enabled
2. Check if website blocks automation
3. Try different selectors (CSS, XPath)
4. Add delays between actions

### Issue: Agent Swarm not coordinating

**Solution:**
1. Reduce number of agents (try 3-5)
2. Check shared memory configuration
3. Verify each agent has clear, non-overlapping tasks
4. Add explicit coordination instructions

### Issue: Context overflow

**Solution:**
1. Enable context compression
2. Clear conversation with `/clear`
3. Break task into smaller chunks
4. Use file references instead of inline code

### Issue: High token usage

**Solution:**
1. Use more specific prompts
2. Enable context compression
3. Cache intermediate results
4. Use local inference for repeated tasks

---

## Example Workflows

### Workflow 1: Research Report

```
You are the Research Lead. Activate Agent Swarm with 4 agents:

1. Web Research Agent: Search for latest trends in [topic]
2. Data Extraction Agent: Scrape pricing and features from 5 competitors
3. Analysis Agent: Analyze findings and identify patterns
4. Report Writer Agent: Generate 10-page markdown report

Requirements:
- Include citations for all sources
- Add charts and visualizations
- Save report to /output/research-report.md
```

### Workflow 2: Website Build

```
You are the Lead Developer. Activate Agent Swarm with 5 agents:

1. Design Agent: Create responsive layout with Tailwind CSS
2. Frontend Agent: Build React components
3. Backend Agent: Design API with Express.js
4. Database Agent: Create PostgreSQL schema
5. Testing Agent: Write tests and documentation

Requirements:
- Mobile-first responsive design
- Dark mode support
- Deploy to Vercel
```

### Workflow 3: Code Review

```
Review the codebase in /src and provide:
1. Security vulnerabilities
2. Performance bottlenecks
3. Code style issues
4. Refactoring suggestions

Generate a detailed report with specific file references and line numbers.
```

---

## Advanced Features

### Custom Tools

Register custom tools in Antigravity:

```python
# tools/custom_tool.py
def analyze_sentiment(text: str) -> dict:
    """Analyze sentiment of text"""
    # Implementation
    return {"sentiment": "positive", "score": 0.85}
```

Then reference in workflow:
```
Use the analyze_sentiment tool to process customer reviews.
```

### MCP Integrations

Connect external services:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "${DATABASE_URL}"
      }
    }
  }
}
```

### Local Inference

For maximum performance:

1. Download Kimi weights from Hugging Face
2. Deploy with vLLM or SGLang
3. Configure Antigravity to use local endpoint:

```json
{
  "models": {
    "kimi-local": {
      "provider": "local",
      "base_url": "http://localhost:8000/v1",
      "model": "kimi-k2.5"
    }
  }
}
```

---

## Resources

### Official Documentation

- [Kimi API Docs](https://platform.moonshot.ai/docs)
- [Kimi Agent SDK](https://github.com/MoonshotAI/kimi-agent-sdk)
- [Antigravity Documentation](https://antigravity.im/documentation)

### Community

- [Antigravity Community](https://www.skool.com/khoa-ai-ung-dun)
- [r/google_antigravity](https://www.reddit.com/r/google_antigravity/)
- [Kimi Discord](https://discord.gg/kimi)

### Support

- Kimi Support: support@moonshot.ai
- Antigravity Support: support@antigravity.im

---

## Quick Reference Card

### Keyboard Shortcuts (Antigravity)

| Shortcut | Action |
|----------|--------|
| `Ctrl+Enter` | Send prompt |
| `Ctrl+Shift+Enter` | Send with Agent Swarm |
| `Ctrl+/` | Toggle tool panel |
| `Ctrl+B` | Toggle browser view |
| `Ctrl+Shift+C` | Clear context |

### Cost Calculator

| Task | Estimated Tokens | Cost |
|------|------------------|------|
| Simple Q&A | 1K-5K | $0.001-0.015 |
| Code generation | 10K-50K | $0.02-0.15 |
| Research report | 100K-500K | $0.20-1.50 |
| Full website | 200K-1M | $0.50-3.00 |

### Mode Selection Flowchart

```
Is it a simple question?
├── YES → Instant Mode
└── NO → Does it require tools?
    ├── YES → Is it parallelizable?
    │   ├── YES → Agent Swarm Mode
    │   └── NO → Agent Mode
    └── NO → Thinking Mode
```

---

**You're now ready to use Kimi K2.5 with Antigravity!** 🚀

Start with simple tasks, then gradually explore Agent Swarm for complex projects.
