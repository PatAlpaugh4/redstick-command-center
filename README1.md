# Redstick Ventures Internal Command Center
## Complete Prompt Series for Kimi Code

---

## 📋 Project Overview

**Type:** Internal Fund Operations Platform (No Public Website)  
**Users:** Redstick Ventures team only (Cam, Yu Wen, + future team members)  
**Purpose:** Unified command center to manage AI agents, deal pipeline, portfolio, and LP intelligence

### Core Value Proposition
> "See everything in your business. Manage all your AI agents. From one hub."

---

## 📁 Deliverables

### 1. **Internal_Command_Center_Prompts.md** (Main Document)
**Contents:**
- Complete design system (colors, typography, spacing)
- Full component specifications
- All page layouts and features
- Animation and interaction details
- Content and copy guidelines
- Accessibility requirements

**Use for:** Understanding the complete design and feature set

### 2. **Internal_Implementation_Guide.md** (Phase-by-Phase)
**Contents:**
- 8 implementation phases (Day 1-6)
- 25+ specific, actionable prompts
- Technical recommendations
- Testing checklists
- Performance targets

**Use for:** Step-by-step development roadmap

### 3. **Prompts_Quick_Reference.md** (Copy-Paste Ready)
**Contents:**
- 19 ready-to-use prompts
- Sequential order
- No missing steps
- Directly paste into Kimi Code

**Use for:** Immediate implementation in Kimi Code

---

## 🎯 Key Features

### AI Agent Management
- **6 Specialized Agents:**
  1. Scout Agent - Deal monitoring
  2. Quill Agent - IC memo generation
  3. LP Research Agent - Investor intelligence
  4. Screening Agent - Deal triage
  5. Content Agent - LinkedIn/posts
  6. Orchestrator - Meta-agent coordination

- **Real-time Status:** Live indicators, activity feeds, performance charts
- **Visual Orchestration:** Node-based flow diagram showing agent interactions

### Deal Pipeline
- **Kanban Board:** 5 stages (Inbound → Screening → Diligence → IC Review → Decision)
- **Drag & Drop:** Move deals between stages
- **Deal Cards:** Company info, stage, sector, assigned partner
- **Detail Drawers:** Full deal information, IC memos, documents

### Portfolio Monitoring
- **Health Dashboard:** 18 companies, TVPI/DPI metrics
- **Status Indicators:** Green (on track), Yellow (attention), Red (support needed)
- **Company Profiles:** Financials, milestones, reports, documents
- **Attention Required:** Prioritized list of companies needing help

### LP Intelligence
- **Signal Feed:** Real-time LP updates, mandate changes, RFPs
- **Relevance Scoring:** 1-100 priority score
- **FCC Tracking:** Dedicated RFP countdown and checklist
- **LP Profiles:** Full firm details, contacts, interaction history

### Content Studio
- **AI Generation:** LinkedIn posts, LP updates, blog articles
- **Editor:** Rich text editing with AI assistance
- **Workflow:** Drafts → Review → Scheduled → Published
- **Approval System:** Submit for review, comments, revisions

### System Features
- **Global Search:** ⌘K command palette (agents, deals, companies, LPs)
- **Notifications:** Real-time alerts, toast messages
- **Activity Feed:** Chronological log of all system events
- **Settings:** Agent config, notifications, integrations, team, billing

---

## 🎨 Design System

### Color Palette (Dark Theme)
```
Background:     #0a0a12 (near-black)
Surface:        #141425 (dark navy)
Elevated:       #1e1e35 (lighter navy)
Border:         #2a2a45 (subtle)
Accent:         #e94560 (redstick red)
Success:        #22c55e (green)
Warning:        #f59e0b (amber)
Error:          #ef4444 (red)
Info:           #3b82f6 (blue)
Text Primary:   #ffffff
Text Secondary: #a0a0b8
Text Tertiary:  #6b6b80
```

### Typography
- **Font:** Inter (Google Fonts)
- **Scale:** 12px to 36px
- **Weights:** 400, 500, 600, 700
- **Mono:** JetBrains Mono (for code/logs)

### Layout
- **Header:** 64px fixed
- **Sidebar:** 240px (expanded), 72px (collapsed)
- **Content:** Scrollable, 24px padding
- **Mobile:** Bottom tab navigation

---

## 🚀 Implementation Timeline

| Phase | Duration | Features |
|-------|----------|----------|
| 1 | Day 1 | Project setup, authentication, layout shell |
| 2 | Day 1-2 | Dashboard, search, notifications |
| 3 | Day 2-3 | AI agent management (grid, detail, activity, orchestration) |
| 4 | Day 3-4 | Deal pipeline (Kanban, cards, detail drawer) |
| 5 | Day 4 | Portfolio monitoring (grid, company detail) |
| 6 | Day 4-5 | LP intelligence (feed, profiles, FCC tracking) |
| 7 | Day 5 | Content studio (generation, workflow, approval) |
| 8 | Day 5-6 | Settings, polish, testing |

**Total: 5-6 days**

---

## 📱 Responsive Breakpoints

- **Desktop (1280px+):** Full layout with sidebar
- **Tablet (768-1279px):** Collapsible sidebar
- **Mobile (<768px):** Bottom tab navigation

---

## ♿ Accessibility

- Keyboard navigation (Tab, Enter, Escape, arrows)
- Focus indicators (2px accent outline)
- ARIA labels for all icons
- Color contrast 4.5:1 minimum
- Reduced motion support
- Screen reader compatible

---

## ⚡ Performance Targets

- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Lighthouse Score: > 90
- 60fps animations

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS 3.4+
- **Components:** shadcn/ui (Radix primitives)
- **Animations:** Framer Motion
- **State:** Zustand
- **Server State:** React Query
- **Charts:** Recharts
- **Drag & Drop:** @dnd-kit

---

## 📝 How to Use These Prompts

### Option 1: Quick Reference (Recommended)
1. Open `Redstick_Prompts_Quick_Reference.md`
2. Copy Prompt 1
3. Paste into Kimi Code (Antigravity)
4. Execute and review output
5. Continue with Prompt 2, 3, 4...

### Option 2: Implementation Guide
1. Open `Redstick_Internal_Implementation_Guide.md`
2. Follow Phase 1 prompts sequentially
3. Check off items as completed
4. Move to next phase

### Option 3: Full Specification
1. Open `Redstick_Internal_Command_Center_Prompts.md`
2. Review complete design system
3. Reference specific component details
4. Use as specification document

---

## ✅ Pre-Implementation Checklist

Before starting, ensure you have:
- [ ] Kimi Code access in Antigravity
- [ ] Empty project directory
- [ ] Node.js 18+ installed
- [ ] 30+ minutes per prompt
- [ ] Reviewed all 3 documents

---

## 🎯 Success Criteria

The implementation is complete when:
- [ ] Login page functional with mock auth
- [ ] Dashboard shows all stats and activity
- [ ] All 6 AI agents visible with status
- [ ] Deal pipeline has drag-and-drop
- [ ] Portfolio shows 18 companies
- [ ] LP intelligence feed has 10+ items
- [ ] Content studio can generate drafts
- [ ] Settings pages complete
- [ ] Responsive on all devices
- [ ] Animations smooth at 60fps

---

## 🔮 Future Enhancements (Post-MVP)

After initial implementation:
1. Connect to real APIs (OpenAI, Otter.ai, etc.)
2. Implement WebSocket for real-time updates
3. Add database persistence (PostgreSQL)
4. Set up production deployment (Vercel)
5. Add advanced analytics
6. Implement role-based permissions
7. Add two-factor authentication
8. Create mobile app (React Native)

---

## 📞 Support

If you encounter issues:
1. Review the prompt for clarity
2. Check implementation guide for context
3. Reference full specification for details
4. Adjust mock data as needed

---

## 📄 Document Versions

- **Main Specification:** v2.0 (Internal Only)
- **Implementation Guide:** v1.0
- **Quick Reference:** v1.0
- **Last Updated:** March 2026

---

**Ready to build? Start with Prompt 1 in the Quick Reference guide.**
