# 🚀 Kimi Code + Antigravity Quick Start Cheat Sheet

> **One-page reference to get you coding with AI in 5 minutes**

---

## 📋 Table of Contents

1. [One-Page Setup](#1-one-page-setup)
2. [Essential Commands](#2-essential-commands)
3. [Common Patterns](#3-common-patterns)
4. [Prompt Templates](#4-prompt-templates)
5. [Configuration Quick Reference](#5-configuration-quick-reference)
6. [Troubleshooting](#6-troubleshooting)
7. [Pricing & Limits](#7-pricing--limits)
8. [Useful Links](#8-useful-links)

---

## 1. One-Page Setup

### ⚡ 5-Minute Installation

```bash
# Install Kimi Code globally
npm install -g @kimi-code/cli

# Or use npx (no install)
npx @kimi-code/cli

# Verify installation
kimi --version
```

### 🔑 First-Time Setup

```bash
# Login to authenticate
kimi login

# Or set API key directly
export KIMI_API_KEY="your-api-key-here"

# Initialize project config
kimi init
```

### 🎯 Quick Project Start

```bash
# Create new project from template
kimi new my-project --template react-ts

# Or initialize in existing project
cd existing-project && kimi init

# Start interactive mode
kimi chat
```

---

## 2. Essential Commands

### 🖥️ CLI Commands

| Command | Alias | Description | Example |
|---------|-------|-------------|---------|
| `kimi chat` | `kimi c` | Start interactive chat | `kimi chat --file src/app.ts` |
| `kimi ask` | `kimi a` | Single question mode | `kimi ask "Explain this code"` |
| `kimi edit` | `kimi e` | Edit files with AI | `kimi edit src/utils.ts` |
| `kimi review` | `kimi r` | Code review | `kimi review --pr 123` |
| `kimi test` | `kimi t` | Generate tests | `kimi test src/calc.ts` |
| `kimi doc` | `kimi d` | Generate documentation | `kimi doc src/components/` |
| `kimi commit` | - | AI-generated commit message | `kimi commit --stage` |
| `kimi explain` | `kimi x` | Explain code/file | `kimi explain src/complex.ts` |

### ⌨️ Interactive Mode Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+C` | Exit chat |
| `Ctrl+D` | Submit message |
| `↑/↓` | Navigate message history |
| `@file` | Reference file in prompt |
| `@folder` | Reference entire folder |
| `/clear` | Clear conversation |
| `/save` | Save conversation to file |
| `/help` | Show all commands |

### 📝 File Operations

```bash
# Include multiple files
kimi chat --file src/app.ts --file src/utils.ts

# Include entire directory
kimi chat --dir src/components/

# Use glob patterns
kimi chat --pattern "src/**/*.ts"

# Read from stdin
cat file.ts | kimi ask "Review this code"
```

---

## 3. Common Patterns

### 🔧 Code Generation Patterns

```typescript
// Generate function from signature
// Prompt: "Implement this function: calculateTotal(items: CartItem[]): number"

// Generate React component
// Prompt: "Create a Button component with variants: primary, secondary, danger"

// Generate API endpoint
// Prompt: "Create Express route for GET /api/users with pagination"
```

### 🔄 Refactoring Patterns

```bash
# Refactor to TypeScript
kimi edit src/legacy.js --prompt "Convert to TypeScript with proper types"

# Extract component
kimi edit src/App.tsx --prompt "Extract UserCard component from lines 45-89"

# Modernize syntax
kimi edit src/old-code.js --prompt "Convert to modern ES6+ syntax"
```

### 🧪 Testing Patterns

```bash
# Generate unit tests
kimi test src/calculator.ts --framework jest

# Generate integration tests
kimi test src/api/ --type integration

# Add test coverage
kimi edit src/calc.test.ts --prompt "Add edge case tests for null inputs"
```

### 📊 Documentation Patterns

```bash
# Generate README
kimi doc --type readme --output README.md

# Generate API docs
kimi doc src/api/ --type openapi --output api.yaml

# Add inline comments
kimi edit src/complex.ts --prompt "Add JSDoc comments to all functions"
```

### 🐛 Debugging Patterns

```bash
# Analyze error
kimi ask "Fix this error: TypeError: Cannot read property 'map' of undefined"

# Debug with logs
kimi chat --file error.log --prompt "Analyze these error logs"

# Performance review
kimi review src/slow-module.ts --focus performance
```

---

## 4. Prompt Templates

### 💡 Copy-Paste Prompts

#### 1. Code Review
```
Review this code for:
- Bugs and edge cases
- Performance issues
- Security vulnerabilities
- Code style consistency
- Type safety (if TypeScript)

Provide specific line-by-line feedback.
```

#### 2. Generate Tests
```
Generate comprehensive unit tests for this code including:
- Happy path scenarios
- Edge cases (null, undefined, empty arrays)
- Error handling
- Boundary conditions

Use [Jest/Vitest/Mocha] with [describe/it] pattern.
```
#### 3. Refactor Code
```
Refactor this code to:
- Improve readability
- Reduce complexity
- Follow [SOLID/DRY/KISS] principles
- Add proper error handling
- Maintain existing functionality

Explain the changes made.
```
#### 4. Explain Code
```
Explain this code as if teaching a junior developer:
- What does it do?
- How does it work step-by-step?
- What are the key concepts?
- Are there any potential issues?
```
#### 5. Convert Language/Framework
```
Convert this [React/Vue/Angular] component to [target framework].
Maintain all functionality including:
- State management
- Event handlers
- Lifecycle methods
- Styling approach
```
#### 6. Add TypeScript Types
```
Add comprehensive TypeScript types to this code:
- Function parameters and return types
- Interface/Type definitions
- Generic types where appropriate
- Fix any type issues
```
#### 7. Optimize Performance
```
Optimize this code for performance:
- Identify bottlenecks
- Reduce time complexity
- Minimize memory usage
- Add caching if beneficial
- Show before/after complexity analysis
```

#### 8. Generate Documentation
```
Generate documentation for this code:
- README with usage examples
- API documentation
- JSDoc/TSDoc comments
- Setup instructions
```

#### 9. Fix Security Issues
```
Identify and fix security issues in this code:
- Input validation
- SQL injection risks
- XSS vulnerabilities
- Authentication/authorization gaps
- Sensitive data exposure
```

#### 10. Create Feature
```
Implement [feature description] following these requirements:
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

Use existing patterns from the codebase. Include tests.
```

---

## 5. Configuration Quick Reference

### ⚙️ Global Config (`~/.kimi/config.json`)

```json
{
  "apiKey": "your-api-key",
  "defaultModel": "kimi-k2.5",
  "temperature": 0.7,
  "maxTokens": 4096,
  "theme": "dark",
  "autoSave": true,
  "editor": "vscode"
}
```

### 📁 Project Config (`.kimi/config.json`)

```json
{
  "project": {
    "name": "my-project",
    "type": "react-ts",
    "include": ["src/**/*", "tests/**/*"],
    "exclude": ["node_modules", "dist", ".git"]
  },
  "ai": {
    "model": "kimi-k2.5",
    "temperature": 0.3,
    "contextWindow": 256000
  },
  "commands": {
    "test": "npm test",
    "lint": "npm run lint",
    "build": "npm run build"
  }
}
```

### 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `KIMI_API_KEY` | API authentication key | - |
| `KIMI_MODEL` | Default model to use | `kimi-k2.5` |
| `KIMI_TEMPERATURE` | Response creativity (0-2) | `0.7` |
| `KIMI_MAX_TOKENS` | Max tokens per response | `4096` |
| `KIMI_TIMEOUT` | Request timeout (ms) | `60000` |
| `KIMI_PROXY` | HTTP proxy URL | - |

### 🎨 Model Selection

| Model | Best For | Context | Speed |
|-------|----------|---------|-------|
| `kimi-k2.5` | General coding | 256K | Fast |
| `kimi-k2.5-long` | Large codebases | 2M | Medium |
| `kimi-k2.5-pro` | Complex tasks | 256K | Medium |

---

## 6. Troubleshooting

### ❌ Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `401 Unauthorized` | Invalid API key | Run `kimi login` or check `KIMI_API_KEY` |
| `429 Rate Limited` | Too many requests | Wait and retry; upgrade plan |
| `Context too long` | Exceeded token limit | Use `--model kimi-k2.5-long` or reduce files |
| `Timeout` | Request took too long | Increase `KIMI_TIMEOUT` or simplify prompt |
| `Model not found` | Invalid model name | Check `kimi models` for available options |
| `File not found` | Path issue | Use absolute path or check working directory |

### 🔍 Debug Mode

```bash
# Enable verbose logging
kimi --verbose chat

# Check configuration
kimi config --list

# Validate setup
kimi doctor

# Test API connection
kimi ping
```

### 🛠️ Quick Fixes

```bash
# Reset configuration
kimi config --reset

# Clear cache
kimi cache --clear

# Update to latest version
npm update -g @kimi-code/cli

# Reinstall if corrupted
npm uninstall -g @kimi-code/cli && npm install -g @kimi-code/cli
```

### 📝 Log Locations

| Platform | Log Path |
|----------|----------|
| macOS | `~/.kimi/logs/` |
| Linux | `~/.kimi/logs/` |
| Windows | `%USERPROFILE%\.kimi\logs\` |

---

## 7. Pricing & Limits

### 💰 Token Pricing

| Model | Input (per 1M tokens) | Output (per 1M tokens) |
|-------|----------------------|------------------------|
| `kimi-k2.5` | $0.50 | $2.00 |
| `kimi-k2.5-long` | $1.00 | $4.00 |
| `kimi-k2.5-pro` | $2.00 | $8.00 |

### 📊 Rate Limits

| Plan | RPM (Requests/min) | TPM (Tokens/min) | Daily Limit |
|------|-------------------|------------------|-------------|
| Free | 20 | 100,000 | 500,000 |
| Pro | 100 | 1,000,000 | 10,000,000 |
| Enterprise | Custom | Custom | Unlimited |

### 📏 Context Windows

| Model | Context Window | Output Limit |
|-------|---------------|--------------|
| `kimi-k2.5` | 256,000 tokens | 8,192 tokens |
| `kimi-k2.5-long` | 2,000,000 tokens | 8,192 tokens |
| `kimi-k2.5-pro` | 256,000 tokens | 8,192 tokens |

### 🧮 Token Estimation

```
~4 characters ≈ 1 token (English)
~1 word ≈ 1.3 tokens (English)
Code: roughly 1 token per 3-4 characters
```

### 💡 Cost-Saving Tips

- Use `kimi-k2.5` for most tasks
- Limit context with `--file` instead of `--dir`
- Use shorter, focused prompts
- Enable response caching in config
- Review token usage with `kimi usage`

---

## 8. Useful Links

### 📚 Official Resources

| Resource | URL | Description |
|----------|-----|-------------|
| Documentation | https://docs.kimi-code.dev | Full documentation |
| API Reference | https://docs.kimi-code.dev/api | API endpoints |
| Changelog | https://docs.kimi-code.dev/changelog | Version history |
| Status Page | https://status.kimi-code.dev | Service status |

### 🛠️ Tools & Extensions

| Tool | Link | Description |
|------|------|-------------|
| VS Code Extension | [Marketplace](https://marketplace.visualstudio.com) | IDE integration |
| JetBrains Plugin | [Plugins](https://plugins.jetbrains.com) | IntelliJ/WebStorm |
| GitHub Action | [Actions](https://github.com/marketplace) | CI/CD automation |
| Docker Image | [Docker Hub](https://hub.docker.com) | Containerized usage |

### 👥 Community

| Platform | Link | Description |
|----------|------|-------------|
| GitHub | https://github.com/kimi-code | Open source repos |
| Discord | https://discord.gg/kimi-code | Community chat |
| Reddit | r/kimicode | Discussions |
| Twitter/X | @kimi_code | Updates & tips |

### 🆘 Support

| Type | Contact | Response Time |
|------|---------|---------------|
| Documentation | docs@kimi-code.dev | 24-48h |
| Bug Reports | github.com/kimi-code/issues | - |
| Enterprise | enterprise@kimi-code.dev | 4h |
| Security | security@kimi-code.dev | 24h |

---

## 🎯 Quick Reference Card

```
┌────────────────────────────────────────────────────────┐
│  KIMI CODE QUICK REFERENCE                             │
├────────────────────────────────────────────────────────┤
│  INSTALL:  npm i -g @kimi-code/cli                     │
│  LOGIN:    kimi login                                  │
│  CHAT:     kimi chat --file <file>                     │
│  EDIT:     kimi edit <file> --prompt "..."             │
│  TEST:     kimi test <file>                            │
│  REVIEW:   kimi review <file>                          │
├────────────────────────────────────────────────────────┤
│  SHORTCUTS: Ctrl+C=Exit | @file=Ref | /help=Help       │
│  ENV VARS:  KIMI_API_KEY, KIMI_MODEL, KIMI_TEMPERATURE │
│  MODELS:    kimi-k2.5 (default), kimi-k2.5-long        │
│  SUPPORT:   docs@kimi-code.dev | discord.gg/kimi-code  │
└────────────────────────────────────────────────────────┘
```

*Last updated: 2025 | Version: 1.0*
