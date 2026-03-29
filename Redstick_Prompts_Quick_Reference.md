# Redstick Internal Command Center - Quick Reference
## Copy-Paste Ready Prompts for Kimi Code

---

## How to Use This Guide

1. Open Kimi Code in Antigravity
2. Copy each prompt section
3. Paste into Kimi Code chat
4. Execute sequentially
5. Review output before proceeding to next prompt

---

## PROMPT 1: Project Setup

```
Initialize a new Next.js 14 project named "redstick-command-center" with:

TECH STACK:
- Next.js 14 (App Router)
- TypeScript (strict mode)
- Tailwind CSS 3.4+
- shadcn/ui components
- Framer Motion
- Zustand
- React Query

FOLDER STRUCTURE:
app/
  (auth)/login/page.tsx
  (dashboard)/layout.tsx
  (dashboard)/page.tsx
  (dashboard)/agents/page.tsx
  (dashboard)/pipeline/page.tsx
  (dashboard)/portfolio/page.tsx
  (dashboard)/lp-intelligence/page.tsx
  (dashboard)/content-studio/page.tsx
  (dashboard)/settings/page.tsx
components/
  layout/ (Header, Sidebar, BottomNav)
  agents/
  pipeline/
  portfolio/
  lp/
  content/
  shared/
lib/
store/

DESIGN SYSTEM - Create these color tokens in design-system.ts:
background: #0a0a12
surface: #141425
surface-elevated: #1e1e35
border: #2a2a45
accent: #e94560
success: #22c55e
warning: #f59e0b
error: #ef4444
info: #3b82f6
text-primary: #ffffff
text-secondary: #a0a0b8
text-tertiary: #6b6b80

Install and configure all dependencies. Set up dark theme as default.
```

---

## PROMPT 2: Authentication System

```
Create the authentication system:

1. LOGIN PAGE (app/(auth)/login/page.tsx):
   - Full-screen dark background with subtle gradient animation
   - Centered login card (max-width: 420px)
   - Form fields: Email, Password (with show/hide), Remember me
   - Submit button with loading state
   - Error handling with shake animation
   - "Forgot password" link

2. AUTH CONTEXT:
   - Create AuthContext with user state, login/logout functions
   - Mock authentication (test users: cam@redstick.vc, yuwen@redstick.vc)
   - Protected route middleware
   - Session persistence in localStorage

3. REDIRECT LOGIC:
   - Unauthenticated users → /login
   - After login → /dashboard
   - Logout → /login

Style with the design system colors. Professional, secure appearance.
```

---

## PROMPT 3: Main Layout Shell

```
Create the main authenticated layout components:

1. HEADER (components/layout/Header.tsx):
   - Fixed position, 64px height
   - Left: Page title + breadcrumb
   - Center: Global search bar with ⌘K shortcut
   - Right: Notification bell (with badge), theme toggle, user avatar dropdown

2. SIDEBAR (components/layout/Sidebar.tsx):
   - Fixed position, left side, 240px width (72px collapsed)
   - Collapsible with toggle at bottom
   - Navigation sections:
     * MAIN: Dashboard, AI Agents, Pipeline, Portfolio
     * INTELLIGENCE: LP Research, Market Signals, Content Studio
     * SYSTEM: Settings, Help, Sign Out
   - Active state: Left accent border
   - Badge support for counts

3. BOTTOM NAV (mobile):
   - Fixed bottom, 64px height
   - 5 tabs: Dashboard, Agents, Pipeline, Portfolio, More
   - Active tab highlighted

4. MAIN LAYOUT:
   - Check authentication
   - Render header + sidebar + content
   - Responsive: Full desktop, collapsible tablet, bottom nav mobile
```

---

## PROMPT 4: Dashboard Overview

```
Create the main dashboard page at app/(dashboard)/page.tsx:

HEADER:
- Greeting: "Good [morning/afternoon], [Name]"
- Current date
- Quick actions: "Run All Agents", "New Deal"

STATS GRID (4 cards, responsive):
1. Active Agents - 4/6 running, sparkline, trend
2. Pipeline Activity - 12 deals this week, breakdown
3. Portfolio Health - 94% average, attention needed
4. LP Intelligence - 8 new signals, priority count

QUICK ACCESS (4 cards):
- Scout Agent Status (live indicator)
- Recent Deal Activity (last 3)
- Upcoming Tasks
- Content Drafts Pending

ACTIVITY FEED:
- Last 7-10 items
- Icon, description, timestamp, agent
- "View All" link

Use mock data. Add animations: card fade-in, number count-up, activity slide-in.
```

---

## PROMPT 5: Global Search

```
Create global search/command palette:

TRIGGER: ⌘/Ctrl + K or search icon in header

COMPONENT:
- Modal with backdrop blur
- Centered (max-width: 640px)
- Search input (auto-focus)
- Categorized results

CATEGORIES:
- Agents (6 items)
- Deals (10 items)
- Portfolio Companies (8 items)
- LPs (5 items)
- Commands (5 items)

RESULT ITEM:
- Icon, title, subtitle, keyboard shortcut
- Click to navigate
- Arrow key navigation
- Enter to select

FEATURES:
- Recent searches
- Clear history
- Empty state with suggestions
- Highlight matching text

Use cmdk library or build custom. Add mock search data.
```

---

## PROMPT 6: Notification System

```
Create notification system:

NOTIFICATION CONTEXT:
- Global state
- Add/remove/clear functions
- Unread count

DROPDOWN (in header):
- Bell icon with unread badge
- Click to open dropdown (width: 400px)
- Header: "Notifications" + "Mark all as read"

NOTIFICATION ITEM:
- Icon (type color)
- Title, description, timestamp
- Unread indicator (left border)

TYPES:
- Agent completed (green)
- Agent error (red)
- New deal (blue)
- LP signal (purple)
- Pipeline moved (amber)

TOAST NOTIFICATIONS:
- Position: bottom-right
- Types: success, error, warning, info
- Auto-dismiss: 5 seconds
- Pause on hover
- Manual dismiss

Add 5-7 mock notifications. Show toast examples.
```

---

## PROMPT 7: AI Agent Grid

```
Create the AI Agent management page at app/(dashboard)/agents/page.tsx:

PAGE HEADER:
- Title: "AI Agents"
- Subtitle: "Manage and monitor your AI workforce"
- Actions: "Create Agent", view toggle, filter

AGENT GRID (3 columns desktop, 2 tablet, 1 mobile):

6 AGENT CARDS:

1. SCOUT AGENT (Globe icon, blue)
   - Monitors pipeline companies, funding news, hiring signals
   - Status: Active with pulsing green dot
   - Current task: "Scanning 47 companies..."
   - Progress bar at 60%
   - Today: 24 tasks, 1.2s avg
   - Actions: Pause, Logs, Configure

2. QUILL AGENT (FileText icon, purple)
   - Generates IC memos from transcripts
   - Status: Idle
   - Last task: "Generated memo for DeepSite"
   - Today: 8 memos, 45s avg

3. LP RESEARCH AGENT (Users icon, green)
   - Tracks LP mandate changes, RFPs
   - Status: Active
   - Current task: "Monitoring 220 LPs..."
   - Today: 3 signals detected

4. SCREENING AGENT (Filter icon, orange)
   - Auto-screens inbound decks
   - Status: Active
   - Current task: "Screening 3 new decks..."
   - Today: 12 screened, 8 passed

5. CONTENT AGENT (PenTool icon, pink)
   - Drafts LinkedIn posts and LP updates
   - Status: Paused
   - Last task: "Published LinkedIn post"
   - Queue: 2 drafts pending

6. ORCHESTRATOR (Cpu icon, red accent)
   - Coordinates all agents
   - Status: Always Active
   - Current task: "Managing 5 active agents..."
   - Uptime: 99.9%

CARD INTERACTIONS:
- Hover: Lift effect, border accent
- Click: Open detail panel
- Menu: Start/Stop, Logs, Configure
- Draggable to reorder

Add realistic mock data for each agent.
```

---

## PROMPT 8: Agent Detail Panel

```
Create agent detail slide-out panel:

PANEL:
- Width: 480px
- Slides from right
- Dark elevated background
- Close button

HEADER:
- Large agent icon (48px)
- Agent name (bold)
- Status badge
- Actions: Start, Stop, Restart

TABS:

1. OVERVIEW:
   - Description of agent purpose
   - Current status with details
   - Current task with progress bar
   - Today's stats (tasks, success rate, avg time)
   - Recent outputs (last 3)
   - Quick actions: Run Now, Test, Pause

2. ACTIVITY LOG:
   - Scrollable list
   - Filter: All, Success, Error, Info
   - Each entry: timestamp, level icon, message
   - Expandable for details
   - Search logs input

3. PERFORMANCE:
   - Charts (last 7 days):
     * Tasks completed (bar chart)
     * Response time (line chart)
     * Success rate (area chart)
   - Key metrics: total tasks, avg time, error rate, uptime

4. SETTINGS:
   - Enable/disable toggle
   - Schedule configuration (cron-like)
   - Parameters/inputs
   - Output destinations
   - Notification preferences
   - Danger zone: Delete agent

Add tab animations and realistic mock data.
```

---

## PROMPT 9: Activity Feed

```
Create global activity feed component:

STRUCTURE:
- Filter bar: type, agent, date range
- Scrollable list
- Group by date (Today, Yesterday, This Week)

ACTIVITY ITEM:
- Icon (type-based color)
- Description with highlighted entities
- Timestamp (relative: "2 min ago")
- Agent attribution
- Expandable details

TYPES & ICONS:
- IC Memo Generated (file-text, purple)
- Deal Screened (search, blue)
- LP Alert (bell, green)
- News Detected (globe, cyan)
- Task Completed (check-circle, green)
- Error (alert-triangle, red)
- Agent Restarted (refresh-cw, amber)

REAL-TIME FEATURES:
- "Live" indicator with pulsing dot
- New items slide in from top
- Unread count badge
- "Mark all as read" button

Add 15-20 mock activities with various types, agents, and timestamps.
```

---

## PROMPT 10: Agent Orchestration Visualizer

```
Create agent flow diagram:

VISUALIZATION:
- Node-based diagram
- Orchestrator at center
- 5 agents as surrounding nodes
- Animated connections with data flow

LAYOUT:
        [SCOUT]
           ↑
           ↓
[CONTENT] ← [ORCHESTRATOR] → [QUILL]
           ↑
           ↓
     [SCREENING]
           ↑
           ↓
    [LP RESEARCH]

NODES:
- Each node: Icon, name, status indicator
- Different colors per agent
- Clickable (opens detail)
- Hover: Show details tooltip

CONNECTIONS:
- Animated dashed lines
- Data packets moving along paths
- Speed indicates activity level
- Direction arrows

CONTROLS:
- Play/Pause animation
- Speed control
- Reset view

MODES:
- Real-time (live flow)
- Last hour (replay)
- Architecture (static)

Add realistic animation and mock data flow patterns.
```

---

## PROMPT 11: Pipeline Kanban Board

```
Create deal pipeline at app/(dashboard)/pipeline/page.tsx:

PAGE HEADER:
- Title: "Deal Pipeline"
- Actions: "Add Deal", view toggle (board/list), filter, search

BOARD LAYOUT:
- Horizontal scrollable
- 5 columns, 320px each
- Gap: 16px

COLUMNS:
1. INBOUND (gray) - 4 deals
2. SCREENING (blue) - 3 deals
3. DILIGENCE (amber) - 2 deals
4. IC REVIEW (purple) - 2 deals
5. DECISION (green/red) - 1 deal

COLUMN HEADER:
- Name + count badge
- Avg days in stage
- Add deal button

DEAL CARD:
- Company name (bold)
- Stage badge (Seed/Series A)
- Sector tag (AgTech/Food/AI)
- Source (Warm Intro/Inbound/Scout)
- Assigned partner avatar
- Days in stage (amber if >7, red if >14)
- Quick links: IC Memo, Notes

DRAG & DROP:
- Cards draggable between columns
- Ghost card while dragging
- Drop zone highlight
- Confirmation modal for DECISION column
- Update timestamp on move

Add 12 mock deals across all stages with realistic data.
```

---

## PROMPT 12: Deal Detail Drawer

```
Create deal detail slide-out drawer:

WIDTH: 560px

HEADER:
- Company name (text-xl, bold)
- Stage badge
- Close button
- Actions: Edit, Move Stage, Archive

SECTIONS:

1. COMPANY INFO:
   - Website, location, founded date
   - Sector, stage, check size sought

2. FOUNDERS:
   - List with names, titles, LinkedIn links

3. DEAL DETAILS:
   - Source, date received, assigned partner

4. IC MEMO:
   - Status (Draft/Complete)
   - Preview (expandable)
   - "View Full" button
   - "Generate with Quill" button

5. SCREENING REPORT:
   - Score (1-100)
   - Thesis fit (Yes/No/Partial)
   - Red flags list
   - Recommendation

6. ACTIVITY TIMELINE:
   - Chronological events
   - Icons, descriptions, timestamps

7. DOCUMENTS:
   - Pitch deck, one-pager, model, data room

8. NOTES:
   - Free-form text area
   - Timestamped entries

Add complete mock data for one example deal.
```

---

## PROMPT 13: Portfolio Dashboard

```
Create portfolio at app/(dashboard)/portfolio/page.tsx:

PAGE HEADER:
- Title: "Portfolio"
- Actions: "Generate Report", view toggle, filter

STATS ROW (4 cards):
1. Total Companies: 18 (12 active, 3 exited, 3 written off)
2. Fund TVPI: 1.8x (+0.2x this quarter)
3. Fund DPI: 0.4x (+0.1x this quarter)
4. Attention Needed: 2 companies

GRID VIEW (3 columns):
Company cards with:
- Logo/initials
- Company name
- Health status (green/yellow/red dot)
- Valuation: $12M → $45M (+275%)
- Revenue: +180% YoY
- Next milestone
- Quick links: Dashboard, Reports, Contact

ATTENTION SECTION (if >0):
- Companies needing support
- Specific issues
- Suggested actions

LIST VIEW (table):
- Columns: Company, Sector, Stage, Investment Date, Valuation, Growth, Health, Actions
- Sortable
- Bulk actions

Add 18 mock portfolio companies with various health statuses.
```

---

## PROMPT 14: Company Detail View

```
Create company detail page at app/(dashboard)/portfolio/[id]/page.tsx:

HEADER:
- Large logo
- Company name
- Health status badge
- Quick stats row

TABS:
1. OVERVIEW:
   - Description, founders, investment details
   - Board seats, key metrics

2. FINANCIALS:
   - Revenue chart (monthly)
   - Burn rate, runway
   - Key metrics table

3. MILESTONES:
   - Achievement timeline
   - Upcoming goals
   - Missed milestones (if any)

4. REPORTS:
   - Monthly/quarterly reports
   - Auto-generated summaries
   - Download options

5. DOCUMENTS:
   - Investment docs
   - Cap table
   - Board decks
   - Data room access

Add complete mock data including charts and documents.
```

---

## PROMPT 15: LP Intelligence Feed

```
Create LP intelligence at app/(dashboard)/lp-intelligence/page.tsx:

PAGE HEADER:
- Title: "LP Intelligence"
- Actions: "Add LP", "Export Report"

LAYOUT:
- Filter sidebar (left, 240px)
- Intelligence feed (center)
- LP details (right, optional)

FILTERS:
- LP Type, Geography, Mandate, Signal Type, Date Range, Search

INTELLIGENCE CARDS:
- LP logo/name
- Signal type badge (colored)
- Description
- Relevance score (1-100)
- Timestamp
- Actions: Save, Share, Contact, Profile

SIGNAL TYPES:
- New Mandate (green)
- Personnel Change (blue)
- RFP Released (red - high priority)
- Portfolio Announcement (purple)
- Mandate Shift (amber)

FCC TRACKING:
- Dedicated section at top
- Countdown to RFP
- Key dates checklist
- Document status

Add 10-15 mock intelligence items with various types and priorities.
```

---

## PROMPT 16: LP Profile Panel

```
Create LP profile detail view:

STRUCTURE:
- Slide-out panel or full page

SECTIONS:
1. FIRM DETAILS:
   - AUM, vintage, geography, team size

2. INVESTMENT CRITERIA:
   - Stage, sector, check size, geography

3. PORTFOLIO:
   - Current VC investments
   - Ag/food investments
   - Performance (if known)

4. KEY CONTACTS:
   - Name, title, email, LinkedIn
   - Relationship strength indicator

5. INTERACTION HISTORY:
   - Meetings, calls, emails
   - Notes from each interaction

6. SIGNALS:
   - All detected signals for this LP

7. NOTES:
   - Strategy thoughts
   - Next steps
   - Reminders

Add 3-4 complete LP profiles with full information.
```

---

## PROMPT 17: Content Studio

```
Create content studio at app/(dashboard)/content-studio/page.tsx:

PAGE HEADER:
- Title: "Content Studio"
- Actions: "New Content"

TABS:
1. CREATE:
   - Content type cards: LinkedIn Post, LP Update, Blog, Email, Thesis Update
   - Context inputs: Topic, Key Points, Audience, Tone, Length
   - "Generate Draft" button
   - AI-generated content editor
   - Formatting toolbar
   - Regenerate options

2. DRAFTS:
   - List of drafts with status
   - Quick actions: Edit, Preview, Delete

3. SCHEDULED:
   - Calendar view
   - Scheduled posts with platform, date, status

4. PUBLISHED:
   - History with performance metrics
   - Repurpose option

APPROVAL WORKFLOW:
- Submit for review
- Reviewer assignment
- Comments thread
- Revision history

Add mock drafts, scheduled posts, and published content.
```

---

## PROMPT 18: System Settings

```
Create settings at app/(dashboard)/settings/page.tsx:

CATEGORIES (left sidebar):
1. Agent Configuration
2. Notifications
3. Integrations
4. Team Management
5. Billing & Usage
6. Appearance
7. Data & Privacy

AGENT CONFIG:
- List of agents with enable/disable toggles
- Schedule settings
- Parameter inputs
- API key management

NOTIFICATIONS:
- Email preferences
- Slack webhook
- Alert thresholds
- Quiet hours

INTEGRATIONS:
- Otter.ai, CRM, Data sources
- Connection status
- Configure buttons

TEAM:
- User list with roles
- Invite new member
- Permission settings

BILLING:
- Token usage chart
- Cost breakdown
- Usage limits

APPEARANCE:
- Theme (dark/light/system)
- Density (compact/comfortable)
- Accent color picker
- Font size

Add realistic settings and connected integrations.
```

---

## PROMPT 19: Final Polish

```
Add final polish to the entire application:

ANIMATIONS:
- Page transitions (fade/slide)
- Card hover effects (lift + shadow)
- Button micro-interactions (scale + glow)
- Scroll-triggered reveals
- Loading skeletons for all data

RESPONSIVE:
- Test all breakpoints
- Mobile bottom navigation
- Tablet collapsible sidebar
- Touch-friendly targets (min 44px)

ACCESSIBILITY:
- Keyboard navigation (Tab, Enter, Escape)
- Focus indicators (2px accent outline)
- ARIA labels for all icons
- Color contrast check (4.5:1 minimum)
- Reduced motion support

PERFORMANCE:
- Image optimization
- Lazy loading for below-fold
- Code splitting by route
- React.memo for expensive components

TESTING:
- Cross-browser (Chrome, Safari, Firefox)
- Mobile (iOS Safari, Chrome Android)
- Keyboard-only navigation
- Screen reader (VoiceOver, NVDA)

Fix any issues found. Ensure smooth 60fps animations.
```

---

## Summary

**Total Prompts:** 19  
**Estimated Timeline:** 5-6 days  
**Deliverable:** Fully functional internal command center

### Key Features Built:
- ✅ Authentication & login
- ✅ Dashboard overview
- ✅ AI agent management (6 agents)
- ✅ Deal pipeline (Kanban board)
- ✅ Portfolio monitoring
- ✅ LP intelligence feed
- ✅ Content generation studio
- ✅ System settings
- ✅ Global search
- ✅ Notifications
- ✅ Activity feed
- ✅ Agent orchestration visualizer

### Next Steps After Implementation:
1. Connect to real APIs (OpenAI, Otter, etc.)
2. Implement WebSocket for real-time updates
3. Add database persistence
4. Set up production deployment
5. User acceptance testing

---

*Ready to implement. Copy each prompt and execute in Kimi Code.*
