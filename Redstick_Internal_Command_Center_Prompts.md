# Redstick Ventures: Internal Command Center
## Purely Internal AI-Powered Fund Operations Hub
### Prompt Series for Kimi Code (Antigravity)

---

# PART 1: PROJECT OVERVIEW & DESIGN SYSTEM

## 1.1 Project Definition

**Type:** Internal Fund Operations Platform  
**Users:** Redstick Ventures team only (Cam, Yu Wen, + future team members)  
**Purpose:** Unified command center to:
- Manage all AI agents (Scout, Quill, LP Research, Screening, Content, Orchestrator)
- Monitor deal pipeline from inbound to decision
- Track portfolio company performance
- Receive LP intelligence and signals
- Generate content for LP updates and LinkedIn
- Coordinate all fund operations from one interface

**Core Value Proposition:** "See everything in your business. Manage all your AI agents. From one hub."

---

## 1.2 Design System

### Color Palette (Dark Theme Default)

```css
/* Primary Brand Colors */
--color-primary: #1a1a2e;        /* Deep navy - main background */
--color-primary-light: #16213e;  /* Lighter navy - panels */
--color-accent: #e94560;         /* Redstick red - actions, alerts */
--color-accent-hover: #ff6b6b;   /* Lighter red - hover states */

/* Surface Colors */
--color-background: #0a0a12;     /* Near-black - page background */
--color-surface: #141425;        /* Card/surface background */
--color-surface-elevated: #1e1e35; /* Elevated panels, modals */
--color-border: #2a2a45;         /* Subtle borders */

/* Text Colors */
--color-text-primary: #ffffff;   /* Primary text */
--color-text-secondary: #a0a0b8; /* Secondary/muted text */
--color-text-tertiary: #6b6b80;  /* Tertiary text, placeholders */

/* Semantic Status Colors */
--color-success: #22c55e;        /* Green - active, healthy, proceeding */
--color-warning: #f59e0b;        /* Amber - attention, paused, pending */
--color-error: #ef4444;          /* Red - error, stopped, blocked */
--color-info: #3b82f6;           /* Blue - informational, idle */
--color-neutral: #6b7280;        /* Gray - offline, archived */
```

### Typography System

```css
/* Font Families */
--font-heading: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', 'SF Mono', monospace;

/* Type Scale */
--text-xs: 0.75rem;      /* 12px - labels, badges */
--text-sm: 0.875rem;     /* 14px - secondary text */
--text-base: 1rem;       /* 16px - body text */
--text-lg: 1.125rem;     /* 18px - emphasis */
--text-xl: 1.25rem;      /* 20px - card titles */
--text-2xl: 1.5rem;      /* 24px - section headers */
--text-3xl: 1.875rem;    /* 30px - page titles */
--text-4xl: 2.25rem;     /* 36px - major headers */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
```

### Spacing System

```css
/* Base 4px grid */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

### Border Radius & Shadows

```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-2xl: 24px;
--radius-full: 9999px;

/* Shadows for dark theme */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.4);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -2px rgba(0, 0, 0, 0.4);
--shadow-glow: 0 0 20px rgba(233, 69, 96, 0.25);
--shadow-success-glow: 0 0 15px rgba(34, 197, 94, 0.2);
```

---

## 1.3 Layout Architecture

### Overall Structure

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER (64px)                                              │
│  [Logo] [Breadcrumb]        [Search] [Notifications] [User] │
├──────────┬──────────────────────────────────────────┬───────┤
│          │                                          │       │
│ SIDEBAR  │         MAIN CONTENT AREA                │ PANEL │
│ (240px)  │         (scrollable)                     │(320px)│
│          │                                          │       │
│ [Nav]    │                                          │ [Detail
│ [Items]  │                                          │  View]│
│          │                                          │       │
│ [Collapse│                                          │       │
│  Toggle] │                                          │       │
│          │                                          │       │
└──────────┴──────────────────────────────────────────┴───────┘
```

### Breakpoints

```css
--breakpoint-sm: 640px;   /* Large phones */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Small laptops */
--breakpoint-xl: 1280px;  /* Desktops */
--breakpoint-2xl: 1536px; /* Large monitors */
```

### Responsive Behavior

- **Desktop (1280px+):** Full layout with sidebar, content, and right panel
- **Tablet (768-1279px):** Collapsible sidebar, content takes remaining space
- **Mobile (<768px):** Bottom tab navigation, full-screen content

---

# PART 2: ENTRY FLOW & AUTHENTICATION

## 2.1 Login Page

### Prompt 2.1.1: Login Screen

```
Create a secure, elegant login page for the Redstick Ventures internal command center:

LAYOUT:
- Full-screen dark background with subtle gradient
- Centered login card (max-width: 420px)
- Card: Dark surface background, rounded-xl, shadow-lg

CONTENT:
1. Logo at top (Redstick wordmark, centered)
2. Headline: "Command Center" (text-2xl, font-semibold)
3. Subtext: "Internal use only" (text-sm, text-secondary)
4. Form fields:
   - Email input (with envelope icon)
   - Password input (with lock icon, show/hide toggle)
   - "Remember me" checkbox
5. Submit button: "Sign In" (full-width, accent color)
6. "Forgot password?" link (text-sm, centered)

INTERACTIONS:
- Input focus: Border changes to accent color
- Button hover: Slight lift + glow effect
- Loading state: Spinner in button
- Error state: Shake animation + error message
- Success: Fade out, redirect to dashboard

SECURITY:
- Password field masked by default
- Rate limiting indication
- Session timeout warning

BACKGROUND:
- Subtle animated gradient or particle effect
- Very low opacity (5-10%) to not distract
- Dark, professional atmosphere
```

---

# PART 3: MAIN LAYOUT COMPONENTS

## 3.1 Header Component

### Prompt 3.1.1: Top Navigation Bar

```
Create the fixed header navigation bar:

STRUCTURE:
- Fixed position, top: 0, full-width
- Height: 64px
- Background: var(--color-background) with backdrop-blur
- Border-bottom: 1px solid var(--color-border)
- Z-index: 50

LEFT SECTION:
- Hamburger menu button (mobile only)
- Page title (current section name)
- Breadcrumb trail (if applicable)

CENTER SECTION:
- Global search bar (expandable)
  * Icon: Search (magnifying glass)
  * Placeholder: "Search agents, deals, companies..."
  * Shortcut hint: "⌘K"
  * On focus: Expands, shows recent searches

RIGHT SECTION:
1. Notification bell icon
   - Badge with unread count (red if >0)
   - Dropdown on click with recent notifications
   - Mark all as read option
   
2. Theme toggle (sun/moon icon)
   - Switches between dark/light mode
   
3. User avatar dropdown
   - Profile picture or initials
   - Dropdown menu:
     * Profile
     * Settings
     * Help & Support
     * Separator
     * Sign Out

INTERACTIONS:
- All icons have hover state (opacity change)
- Dropdowns animate in (fade + slide)
- Search can be triggered by ⌘/Ctrl+K
```

## 3.2 Sidebar Navigation

### Prompt 3.2.1: Collapsible Sidebar

```
Create the main navigation sidebar:

STRUCTURE:
- Fixed position, left side
- Width: 240px (expanded), 72px (collapsed)
- Height: 100vh minus header (64px)
- Background: var(--color-surface)
- Border-right: 1px solid var(--color-border)
- Overflow-y: auto (scrollable if needed)

LOGO AREA (top):
- Redstick logo (simplified icon when collapsed)
- "VENTURES" text (hidden when collapsed)

NAVIGATION SECTIONS:

MAIN (label: hidden when collapsed):
- Dashboard (home icon)
  * Active state: Left border accent, background highlight
  * Badge: None
  
- AI Agents (robot icon)
  * Badge: Active agent count (if >0)
  
- Pipeline (git-branch icon)
  * Badge: New deals count
  
- Portfolio (grid icon)
  * Badge: Attention needed count (red if >0)

INTELLIGENCE (label: hidden when collapsed):
- LP Research (users icon)
  * Badge: New signals count
  
- Market Signals (trending-up icon)
  * Badge: New items count
  
- Content Studio (edit-3 icon)
  * Badge: Drafts pending count

SYSTEM (label: hidden when collapsed):
- Settings (settings icon)
- Help (help-circle icon)
- Sign Out (log-out icon)

COLLAPSE TOGGLE (bottom):
- Button with chevron-left/right icon
- Tooltip: "Collapse sidebar" / "Expand sidebar"
- Persists state in localStorage

NAV ITEM STATES:
- Default: text-secondary, no background
- Hover: text-primary, subtle background
- Active: text-primary, accent left border, elevated background
- Transition: 150ms ease

MOBILE:
- Hidden on mobile
- Replaced by bottom tab bar
```

## 3.3 Bottom Tab Bar (Mobile)

### Prompt 3.3.1: Mobile Navigation

```
Create mobile bottom tab bar:

STRUCTURE:
- Fixed position, bottom: 0
- Height: 64px + safe-area-inset-bottom
- Background: var(--color-surface)
- Border-top: 1px solid var(--color-border)
- Display: flex, justify-content: space-around

TABS (5 items):
1. Dashboard (home icon)
2. Agents (robot icon)
3. Pipeline (git-branch icon)
4. Portfolio (grid icon)
5. More (menu icon) - opens sheet with additional options

ACTIVE STATE:
- Icon: accent color
- Label: visible, accent color
- Background: subtle accent tint

INACTIVE STATE:
- Icon: text-secondary
- Label: hidden (or very small)

INTERACTIONS:
- Tap: Immediate navigation
- Active tab: Slightly raised
- Badge indicators on icons
```

---

# PART 4: DASHBOARD & OVERVIEW

## 4.1 Main Dashboard

### Prompt 4.1.1: Dashboard Overview

```
Create the main dashboard/overview page:

HEADER SECTION:
- Greeting: "Good [morning/afternoon], [Name]" (text-2xl, font-semibold)
- Date: "Monday, March 30, 2026" (text-sm, text-secondary)
- Quick actions row (right-aligned):
  * "Run All Agents" button (accent)
  * "New Deal" button (outline)
  * Settings gear icon

STATS GRID (4 cards):
1. Active Agents
   - Icon: robot (accent color)
   - Number: 4 (large, bold)
   - Label: "of 6 agents running"
   - Sparkline: Activity over last 24h
   - Trend: "+2 today" (green)

2. Pipeline Activity
   - Icon: git-branch (blue)
   - Number: 12 (large, bold)
   - Label: "deals this week"
   - Breakdown: "3 new, 5 moved, 4 decisions"
   - Trend: "+3 vs last week" (green)

3. Portfolio Health
   - Icon: activity (green)
   - Score: 94% (large, bold)
   - Label: "average health score"
   - Subtext: "2 companies need attention" (if >0, show in amber/red)

4. LP Intelligence
   - Icon: radio (purple)
   - Number: 8 (large, bold)
   - Label: "new signals today"
   - Priority: "2 high priority" (red badge if >0)

QUICK ACCESS GRID (4 cards):
- Scout Agent Status
- Recent Deal Activity
- Upcoming Tasks
- Content Drafts

ACTIVITY FEED (bottom section):
- Header: "Recent Activity" with "View All" link
- Last 5-7 activity items
- Each item: icon, description, timestamp, agent attribution

LAYOUT:
- Responsive grid for stats (4 cols desktop, 2 cols tablet, 1 col mobile)
- Cards have consistent padding (24px)
- Gap: 24px between cards
```

---

# PART 5: AI AGENT MANAGEMENT

## 5.1 Agent Grid View

### Prompt 5.1.1: Agent Management Grid

```
Create the AI Agent management grid - the core feature:

PAGE HEADER:
- Title: "AI Agents" (text-3xl, font-bold)
- Subtitle: "Manage and monitor your AI workforce"
- Actions (right):
  * "Create Agent" button (accent)
  * View toggle (grid/list icons)
  * Filter dropdown

AGENT GRID (3 columns desktop, 2 tablet, 1 mobile):
Each agent card:

CARD STRUCTURE:
┌─────────────────────────────────────┐
│ [Icon] Agent Name          [Menu]   │
│ [Status Badge]                      │
│                                     │
│ Current Task:                       │
│ "Screening 3 inbound deals..."      │
│ [Progress Bar: 60%]                 │
│                                     │
│ Today: 12 tasks | Avg: 2.3s         │
│                                     │
│ [Pause] [Logs] [Configure]          │
└─────────────────────────────────────┘

AGENT TYPES (6 cards):

1. SCOUT AGENT
   - Icon: Globe/search icon
   - Color: Blue
   - Purpose: "Monitors pipeline companies, funding news, hiring signals"
   - Schedule: "Runs every 4 hours"

2. QUILL AGENT
   - Icon: FileText/edit icon
   - Color: Purple
   - Purpose: "Generates IC memos from call transcripts"
   - Schedule: "On-demand + auto for new calls"

3. LP RESEARCH AGENT
   - Icon: Users icon
   - Color: Green
   - Purpose: "Tracks LP mandate changes, personnel shifts, RFPs"
   - Schedule: "Daily at 6 AM"

4. SCREENING AGENT
   - Icon: Filter icon
   - Color: Orange
   - Purpose: "Auto-screens inbound decks against Fund II criteria"
   - Schedule: "Real-time on upload"

5. CONTENT AGENT
   - Icon: PenTool icon
   - Color: Pink
   - Purpose: "Drafts LinkedIn posts and LP update content"
   - Schedule: "Weekly + on-demand"

6. ORCHESTRATOR
   - Icon: Cpu/layers icon
   - Color: Accent (red)
   - Purpose: "Coordinates all agents, manages data flow"
   - Schedule: "Always running"

STATUS BADGES:
- Active: Green dot + "Running" + pulse animation
- Idle: Blue dot + "Waiting"
- Paused: Amber dot + "Paused"
- Error: Red dot + "Error" + pulse animation (faster)
- Offline: Gray dot + "Offline"

INTERACTIONS:
- Click card: Open agent detail panel (right side)
- Hover card: Subtle lift, border accent
- Menu button: Dropdown (Start/Stop, View Logs, Configure, Delete)
- Drag cards: Reorder priority (persisted)

QUICK ACTIONS (per card):
- Play/Pause toggle
- View Logs (opens log drawer)
- Configure (opens settings)
```

## 5.2 Agent Detail Panel

### Prompt 5.2.1: Agent Detail Slide-out Panel

```
Create the agent detail panel (slides in from right):

PANEL STRUCTURE:
- Width: 480px (desktop), 100% (mobile)
- Height: 100%
- Background: var(--color-surface-elevated)
- Border-left: 1px solid var(--color-border)
- Z-index: 40
- Animation: Slide in 300ms ease-out

HEADER:
- Agent icon (large, 48px)
- Agent name (text-xl, font-bold)
- Status badge
- Close button (X icon)
- Actions: Start/Stop, Restart

TABS (4 tabs):
1. OVERVIEW (default)
2. ACTIVITY LOG
3. PERFORMANCE
4. SETTINGS

TAB 1: OVERVIEW
- Description: What this agent does
- Current status: Detailed state
- Current task: Full description + progress
- Today's stats:
  * Tasks completed
  * Success rate
  * Average response time
  * Token usage (if applicable)
- Recent outputs (last 3 items)
- Quick actions: Run Now, Test, Pause

TAB 2: ACTIVITY LOG
- Scrollable list
- Filter: All, Success, Error, Info
- Each log entry:
  * Timestamp (relative)
  * Level icon (success/error/info)
  * Message
  * Expandable for details
- Search logs input
- Export logs button

TAB 3: PERFORMANCE
- Charts (last 7 days):
  * Tasks completed (bar chart)
  * Response time (line chart)
  * Success rate (area chart)
- Key metrics:
  * Total tasks (all time)
  * Average response time
  * Error rate
  * Uptime percentage

TAB 4: SETTINGS
- Enable/Disable toggle
- Schedule configuration
- Parameters/inputs
- Output destinations
- Notification preferences
- Advanced: API keys, webhooks
- Danger zone: Delete agent

FOOTER:
- Last updated timestamp
- Save changes button (if settings modified)
```

## 5.3 Activity Feed

### Prompt 5.3.1: Real-Time Activity Feed

```
Create the global activity feed component:

STRUCTURE:
- Scrollable list
- Filter bar at top:
  * Activity type dropdown
  * Agent filter (multi-select)
  * Date range picker
  * Search input

ACTIVITY ITEM:
┌─────────────────────────────────────────────────────┐
│ [Icon] Activity Description                    Time │
│       Agent: Quill Agent | Deal: DeepSite           │
│       [Preview of output]                           │
└─────────────────────────────────────────────────────┘

ACTIVITY TYPES & ICONS:
- 📝 IC Memo Generated (file-text icon, purple)
- 🔍 Deal Screened (search icon, blue)
- 📧 LP Alert Triggered (bell icon, green)
- 🌐 News Detected (globe icon, cyan)
- ✅ Task Completed (check-circle icon, green)
- ⚠️ Error Occurred (alert-triangle icon, red)
- 🔄 Agent Restarted (refresh-cw icon, amber)
- 💾 Data Synced (database icon, gray)

VISUAL DESIGN:
- Left border color based on type
- Alternating subtle background (zebra striping)
- Hover: Highlight background
- Unread: Left accent border

REAL-TIME FEATURES:
- "Live" indicator at top (pulsing green dot)
- New items slide in from top with animation
- Unread count badge
- "Mark all as read" button
- Auto-scroll to top on new items (optional)

EXAMPLE ITEMS:
"Quill Agent generated IC memo for DeepSite (Seed, AgTech) - 2 min ago"
"Scout Agent detected Series B announcement for CompetitorX - 15 min ago"
"LP Research Agent flagged new mandate at PensionFund Y - 1 hour ago"
"Screening Agent passed on 3 deals (thesis misalignment) - 2 hours ago"
"Content Agent published LinkedIn post (847 impressions) - 3 hours ago"

PAGINATION:
- "Load more" button at bottom
- Loads 20 more items
- Shows total count
```

## 5.4 Agent Orchestration Visualizer

### Prompt 5.4.1: Agent Flow Diagram

```
Create a visual agent orchestration diagram:

PURPOSE:
Show how data flows between agents and the orchestrator

VISUALIZATION TYPE:
- Node-based flow diagram
- Animated data packets moving along connections
- Interactive nodes

LAYOUT:
┌──────────────────────────────────────────────┐
│           [ORCHESTRATOR]                     │
│              (Center)                        │
│                   ↑                          │
│    ┌──────────────┼──────────────┐           │
│    ↓              ↓              ↓           │
│ [SCOUT]      [QUILL]      [LP RESEARCH]      │
│    ↑              ↑              ↑           │
│    └──────────────┴──────────────┘           │
│                   ↓                          │
│            [SCREENING]                       │
│                   ↓                          │
│            [CONTENT]                         │
└──────────────────────────────────────────────┘

NODES:
- Each agent is a node
- Orchestrator is central, larger node
- Different colors per agent type
- Status indicator on each node (same as agent cards)

CONNECTIONS:
- Animated dashed lines
- Data packets move along paths
- Speed indicates activity level
- Direction arrows show flow

INTERACTIONS:
- Click node: Open agent detail
- Hover connection: Show data type/volume
- Play/Pause animation
- Zoom and pan (for large diagrams)
- Legend toggle

MODES:
1. Real-time: Shows live data flow
2. Last Hour: Replay of recent activity
3. Architecture: Static view of connections

METRICS OVERLAY:
- Data volume per connection
- Messages per minute
- Queue depths
```

---

# PART 6: DEAL PIPELINE

## 6.1 Pipeline Kanban Board

### Prompt 6.1.1: Deal Pipeline Board

```
Create a Kanban-style deal pipeline board:

PAGE HEADER:
- Title: "Deal Pipeline" (text-3xl, font-bold)
- Subtitle: "Track deals from inbound to decision"
- Actions:
  * "Add Deal" button (accent)
  * View toggle (board/list)
  * Filter by: stage, sector, source, partner
  * Search input

BOARD LAYOUT:
- Horizontal scrollable container
- 5 columns (fixed width: 320px each)
- Column gap: 16px
- Padding: 24px

COLUMNS:
1. INBOUND (gray)
   - Count badge
   - "New submissions and intros"
   
2. SCREENING (blue)
   - Count badge
   - "Initial review and triage"
   
3. DILIGENCE (amber)
   - Count badge
   - "Deep dive and IC memo"
   
4. IC REVIEW (purple)
   - Count badge
   - "Investment committee review"
   
5. DECISION (green/red)
   - Count badge
   - "Proceed or pass"

COLUMN HEADER:
- Stage name (bold)
- Deal count (badge)
- Average days in stage (small text)
- Add deal button (small)

DEAL CARD:
┌─────────────────────────────────────┐
│ Company Name                    [Menu]│
│ [Seed] [AgTech]                     │
│                                     │
│ Source: Warm Intro                  │
│ Assigned: [Avatar] Yu Wen           │
│ Days: 5                             │
│                                     │
│ [IC Memo] [Notes]                   │
└─────────────────────────────────────┘

CARD CONTENT:
- Company name (bold, clickable)
- Stage badge (seed/series A)
- Sector tag (colored)
- Source indicator (inbound/warm intro/scout/referral)
- Assigned partner avatar + name
- Days in current stage (amber if >7, red if >14)
- Quick links: IC Memo preview, Notes

DRAG & DROP:
- Cards draggable between columns
- Visual feedback: Ghost card while dragging
- Drop zone highlight
- Confirmation modal for moves to DECISION
- Update timestamp on move

QUICK ACTIONS (hover):
- View details
- Edit
- Move to...
- Assign to...
- Add note

EMPTY STATE:
- Illustration + "No deals in this stage"
- "Add deal" CTA

LIST VIEW ALTERNATIVE:
- Table format
- Sortable columns
- Bulk actions
- Export CSV
```

## 6.2 Deal Detail Drawer

### Prompt 6.2.1: Deal Detail Slide-out

```
Create deal detail drawer (slides from right):

WIDTH: 560px (desktop), 100% (mobile)

HEADER:
- Company logo (if available) or placeholder
- Company name (text-xl, bold)
- Stage badge
- Close button
- Actions: Edit, Move Stage, Archive

SECTIONS:

1. COMPANY INFO
   - Website link
   - Location
   - Founded date
   - Sector/tags
   - Stage (seed/series A)
   - Check size sought

2. FOUNDERS
   - List of founders with:
     * Name
     * Title
     * LinkedIn link
     * Background summary

3. DEAL DETAILS
   - Source (how they came in)
   - Date received
   - Assigned partner
   - Co-investors (if any)
   - Expected close date

4. IC MEMO
   - Status: Draft/Complete/Not Started
   - Last updated
   - Preview (expandable)
   - "View Full Memo" button
   - "Generate with Quill" button (if not started)

5. SCREENING REPORT
   - Score (1-100)
   - Thesis fit (yes/no/partial)
   - Red flags (if any)
   - Recommendation (proceed/pass)
   - Generated by Screening Agent

6. ACTIVITY TIMELINE
   - Chronological list:
     * Deal received
     * Screening completed
     * IC memo generated
     * Partner meeting
     * Stage changes
     * Notes added

7. DOCUMENTS
   - Pitch deck (PDF)
   - One-pager
   - Financial model
   - Cap table
   - Data room link

8. NOTES
   - Free-form text area
   - Timestamped entries
   - Author attribution
   - Edit/delete own notes

FOOTER:
- Last updated timestamp
- Stage change buttons (Move to...)
```

---

# PART 7: PORTFOLIO MONITORING

## 7.1 Portfolio Dashboard

### Prompt 7.1.1: Portfolio Overview

```
Create portfolio monitoring dashboard:

PAGE HEADER:
- Title: "Portfolio" (text-3xl, font-bold)
- Subtitle: "Track performance and health of investments"
- Actions:
  * "Generate Report" button
  * View toggle (grid/list)
  * Filter by: sector, stage, health
  * Search

STATS ROW (4 cards):
1. Total Companies
   - Number: 18
   - Breakdown: "12 active, 3 exited, 3 written off"
   
2. Fund TVPI
   - Multiple: 1.8x
   - Trend: +0.2x this quarter
   
3. Fund DPI
   - Multiple: 0.4x
   - Trend: +0.1x this quarter
   
4. Attention Needed
   - Count: 2 (amber if 1-2, red if >2)
   - "Companies requiring support"

MAIN CONTENT:
Two view options: GRID (default) or LIST

GRID VIEW:
- 3 columns desktop, 2 tablet, 1 mobile
- Company cards:

COMPANY CARD:
┌─────────────────────────────────────┐
│ [Logo] Company Name             [Status]│
│                                     │
│ Valuation: $12M → $45M (+275%)      │
│ Revenue: +180% YoY                  │
│                                     │
│ Next Milestone:                     │
│ Series B Q3 2026                    │
│                                     │
│ [Dashboard] [Reports] [Contact]     │
└─────────────────────────────────────┘

CARD ELEMENTS:
- Logo (or company initials)
- Company name
- Health status indicator (green/yellow/red)
- Current valuation with change
- Revenue growth
- Next milestone
- Quick action links

HEALTH STATUS:
- Green: On track, no concerns
- Yellow: Needs attention, minor issues
- Red: Requires immediate support

ATTENTION REQUIRED SECTION (if any):
- Separate list above main grid
- Red/yellow cards
- Specific issues flagged
- Suggested actions

LIST VIEW:
- Table with columns:
  * Company
  * Sector
  * Stage
  * Investment Date
  * Valuation
  * Revenue Growth
  * Health
  * Actions

CHARTS SECTION (optional):
- Portfolio value over time
- Revenue growth by company
- Sector allocation pie chart
- Stage distribution
```

## 7.2 Company Detail View

### Prompt 7.2.1: Portfolio Company Detail

```
Create detailed company view:

LAYOUT:
- Full page (not drawer, dedicated route)
- Back button to portfolio
- Tabs for different sections

HEADER:
- Large company logo
- Company name
- One-line description
- Health status badge
- Quick stats row

TABS:
1. OVERVIEW
2. FINANCIALS
3. MILESTONES
4. REPORTS
5. DOCUMENTS

TAB 1: OVERVIEW
- Company description
- Founders/team
- Investment details (date, amount, round)
- Board seats
- Key metrics (revenue, users, etc.)
- Recent updates/notes

TAB 2: FINANCIALS
- Revenue chart (monthly/quarterly)
- Burn rate
- Runway
- Key financial metrics table
- Comparison to plan

TAB 3: MILESTONES
- Timeline of achievements
- Upcoming goals
- Missed milestones (if any)
- Board meeting dates

TAB 4: REPORTS
- Monthly/quarterly reports
- Auto-generated summaries
- Custom report builder
- Download options

TAB 5: DOCUMENTS
- Investment docs (term sheet, SPA)
- Cap table
- Financial models
- Board decks
- Data room access

SIDEBAR:
- Quick contacts (founder, CFO)
- Next meeting date
- Recent support provided
- Related deals (competitors, partners)
```

---

# PART 8: LP INTELLIGENCE

## 8.1 LP Intelligence Feed

### Prompt 8.1.1: LP Research Dashboard

```
Create LP intelligence monitoring interface:

PAGE HEADER:
- Title: "LP Intelligence" (text-3xl, font-bold)
- Subtitle: "Monitor limited partners and fundraising signals"
- Actions:
  * "Add LP" button
  * "Export Report" button
  * Filter sidebar toggle

LAYOUT:
- Three-column layout:
  * Left sidebar: Filters (collapsible)
  * Center: Intelligence feed
  * Right: Selected LP details (optional)

FILTER SIDEBAR:
- LP Type (checkboxes):
  * Pension Funds
  * Family Offices
  * Fund of Funds
  * Corporate VCs
  * Endowments
  
- Geography (checkboxes):
  * North America
  * Europe
  * Asia
  * Other
  
- Mandate (checkboxes):
  * Early Stage
  * Ag/Food Focus
  * AI/ML Focus
  * Generalist
  
- Signal Type (checkboxes):
  * New Mandate
  * Personnel Change
  * RFP Released
  * Portfolio Announcement
  * Mandate Shift
  
- Date Range: Last 7/30/90 days
- Search LPs

INTELLIGENCE FEED:
- Sortable: Newest first, Relevance, Priority
- Group by date (Today, Yesterday, This Week, etc.)

INTELLIGENCE CARD:
┌─────────────────────────────────────────────────────────────┐
│ [LP Logo] LP Name                                    [Score]│
│ [Signal Type Badge]                                         │
│                                                             │
│ Signal: "New $200M agtech mandate announced"                │
│ Source: Press Release, LinkedIn                             │
│                                                             │
│ Relevance: 95/100  [Why? tooltip]                           │
│                                                             │
│ Detected: 2 hours ago by LP Research Agent                  │
│                                                             │
│ [Save] [Share] [Mark as Contacted] [View LP Profile]        │
└─────────────────────────────────────────────────────────────┘

SIGNAL TYPES & COLORS:
- 🎯 New Mandate (green)
- 👤 Personnel Change (blue)
- 📋 RFP Released (red - high priority)
- 💼 Portfolio Announcement (purple)
- 🔔 Mandate Shift (amber)

RELEVANCE SCORE:
- 90-100: Critical (red accent)
- 70-89: High (amber accent)
- 50-69: Medium (blue accent)
- <50: Low (gray)

SCORE FACTORS (tooltip):
- Mandate alignment with Fund II
- Geography match
- Check size fit
- Timing relevance
- Relationship history

QUICK ACTIONS:
- Save to watchlist
- Share with team (Slack/email)
- Mark as contacted
- Add note
- View full LP profile

FCC TRACKING SECTION (dedicated area):
- Countdown to RFP timeline
- Key dates checklist
- Document preparation status
- Stakeholder mapping
- Meeting tracker
```

## 8.2 LP Profile View

### Prompt 8.2.1: LP Detail Panel

```
Create LP profile detail view:

STRUCTURE:
- Slide-out panel (480px) or full page

HEADER:
- LP logo
- LP name
- Type badge (Pension, Family Office, etc.)
- Actions: Edit, Archive, Add Note

SECTIONS:

1. FIRM DETAILS
   - AUM
   - Vintage (if applicable)
   - Geography
   - Investment team size
   - Website link

2. INVESTMENT CRITERIA
   - Stage focus
   - Sector preferences
   - Check size range
   - Geography focus
   - Co-investment preferences

3. PORTFOLIO
   - Current VC investments
   - Ag/food investments (if any)
   - AI/ML investments (if any)
   - Performance (if known)

4. KEY CONTACTS
   - Name, title, email, phone
   - LinkedIn profiles
   - Relationship strength indicator
   - Last contact date

5. INTERACTION HISTORY
   - Chronological list:
     * Meetings
     * Calls
     * Emails
     * Conference encounters
   - Notes from each interaction
   - Follow-up reminders

6. SIGNALS & ALERTS
   - All detected signals for this LP
   - Saved items
   - Custom alerts configured

7. NOTES
   - Free-form notes area
   - Strategy thoughts
   - Next steps
   - Reminders

RELATIONSHIP STRENGTH:
- Strong: Regular contact, expressed interest
- Warm: Some contact, aware of fund
- Cold: No prior contact
- Existing: Current LP in Fund I
```

---

# PART 9: CONTENT STUDIO

## 9.1 Content Generation Interface

### Prompt 9.1.1: Content Studio Dashboard

```
Create content generation workspace:

PAGE HEADER:
- Title: "Content Studio" (text-3xl, font-bold)
- Subtitle: "Generate and manage fund communications"
- Actions:
  * "New Content" button (accent)
  * View toggle (calendar/list)

LAYOUT:
- Tabbed interface:
  1. Create (default)
  2. Drafts
  3. Scheduled
  4. Published

TAB 1: CREATE
Three-panel layout:

LEFT PANEL: Content Type
- Cards for each type:
  * LinkedIn Post
  * LP Update Insert
  * Blog Article
  * Email Newsletter
  * Investment Thesis Update
  * Fund Announcement

CENTER PANEL: Editor
- Selected template preview
- Context inputs:
  * Topic/Subject
  * Key points to include
  * Target audience
  * Tone (professional, casual, thought leadership)
  * Length (short, medium, long)
- "Generate Draft" button (accent)
- Generated content area (editable)
- Formatting toolbar
- Regenerate options

RIGHT PANEL: Context & Settings
- Related portfolio companies
- Recent market signals
- Fund performance metrics
- Brand voice guidelines
- Schedule settings
- Approval workflow

TAB 2: DRAFTS
- List of draft content
- Status: In Progress, Pending Review, Approved
- Last edited date
- Author
- Quick actions: Edit, Preview, Delete

TAB 3: SCHEDULED
- Calendar view (month/week)
- Scheduled posts with:
  * Content preview
  * Platform (LinkedIn, Email, etc.)
  * Scheduled date/time
  * Status (scheduled, sending, sent)
- Drag to reschedule

TAB 4: PUBLISHED
- History of published content
- Performance metrics:
  * LinkedIn: Impressions, engagements, clicks
  * Email: Open rate, click rate
- Repurpose option

APPROVAL WORKFLOW:
- Submit for review button
- Reviewer assignment
- Approval status tracking
- Comments/feedback thread
- Revision history
```

---

# PART 10: SYSTEM SETTINGS

## 10.1 Settings Dashboard

### Prompt 10.1.1: System Configuration

```
Create comprehensive settings interface:

PAGE HEADER:
- Title: "Settings" (text-3xl, font-bold)
- Subtitle: "Configure your command center"

LAYOUT:
- Left sidebar: Settings categories
- Right: Settings content

CATEGORIES:

1. AGENT CONFIGURATION
   - List of all agents
   - Enable/disable toggles
   - Schedule settings
   - Parameter configuration
   - API key management
   - Webhook endpoints
   
2. NOTIFICATIONS
   - Email preferences
   - Slack integration
   - In-app notifications
   - Alert thresholds
   - Quiet hours
   
3. INTEGRATIONS
   - Otter.ai (transcripts)
   - CRM (HubSpot, Salesforce)
   - Data sources (Crunchbase, PitchBook)
   - Communication (Slack, Email)
   - Cloud storage (Google Drive, Dropbox)
   - Webhook URLs
   
4. TEAM MANAGEMENT
   - User list
   - Invite new member
   - Role assignment:
     * Admin (full access)
     * Operator (agent management)
     * Viewer (read-only)
   - Permission settings
   - Activity log
   
5. BILLING & USAGE
   - Token consumption (OpenAI, etc.)
   - API usage breakdown
   - Cost per agent
   - Monthly spend
   - Usage limits and alerts
   
6. APPEARANCE
   - Theme: Dark/Light/System
   - Density: Compact/Comfortable
   - Accent color picker
   - Font size: Small/Medium/Large
   - Animation: On/Reduced
   
7. DATA & PRIVACY
   - Data export
   - Backup settings
   - Retention policies
   - Privacy settings
   - Delete account

IMPORT/EXPORT:
- Export configuration (JSON)
- Import settings
- Reset to defaults
- Backup/restore
```

---

# PART 11: GLOBAL COMPONENTS

## 11.1 Search & Command Palette

### Prompt 11.1.1: Global Search

```
Create command palette search:

TRIGGER:
- Keyboard: ⌘/Ctrl + K
- Button in header
- Floating action button (optional)

INTERFACE:
- Modal overlay with backdrop blur
- Centered search container (max-width: 640px)
- Search input at top with icon
- Results below, categorized

SEARCH INPUT:
- Placeholder: "Search agents, deals, companies, LPs..."
- Clear button (X) when has content
- Loading spinner when searching

RESULT CATEGORIES:
1. AGENTS
   - Agent name
   - Status
   - Quick action: Run/Stop
   
2. DEALS
   - Company name
   - Current stage
   - Quick action: View
   
3. PORTFOLIO COMPANIES
   - Company name
   - Health status
   - Quick action: View Dashboard
   
4. LPS
   - LP name
   - Type
   - Quick action: View Profile
   
5. ACTIONS/COMMANDS
   - Create new deal
   - Run all agents
   - Generate report
   - Open settings

RESULT ITEM:
- Icon (type-specific)
- Title (bold)
- Subtitle (context)
- Keyboard shortcut (if applicable)
- Preview on hover

EMPTY STATE:
- "No results found"
- Suggested searches
- Create new option

RECENT SEARCHES:
- Save last 10 searches
- Show below search input
- Clear history option
```

## 11.2 Notification System

### Prompt 11.2.1: Notification Center

```
Create notification dropdown/panel:

TRIGGER:
- Bell icon in header
- Badge with unread count

DROPDOWN:
- Width: 400px
- Max-height: 500px
- Scrollable

HEADER:
- "Notifications" title
- "Mark all as read" link
- Settings gear icon

NOTIFICATION ITEM:
┌─────────────────────────────────────────┐
│ [Icon] Title                       Time │
│ Description                             │
│ [Action button - optional]              │
└─────────────────────────────────────────┘

TYPES:
- Agent completed task (green)
- Agent error (red)
- New deal submitted (blue)
- LP signal detected (purple)
- Pipeline moved (amber)
- System message (gray)

STATES:
- Unread: Accent left border, subtle background
- Read: No border, normal background

GROUPING:
- Today
- Yesterday
- Earlier this week
- Earlier

ACTIONS:
- Click: Navigate to relevant page
- Hover: Show timestamp
- Dismiss: Remove notification
- Settings: Configure preferences

EMPTY STATE:
- Illustration
- "No notifications"
- "You're all caught up!"
```

## 11.3 Toast Notifications

### Prompt 11.3.1: Toast System

```
Create toast notification system:

TYPES:
- Success (green checkmark)
- Error (red X)
- Warning (amber triangle)
- Info (blue info icon)

POSITION:
- Bottom-right (desktop)
- Top-center (mobile)

STRUCTURE:
┌─────────────────────────────────────┐
│ [Icon] Message                [X]   │
│ Optional description                │
│ [Action button]                     │
└─────────────────────────────────────┘

BEHAVIOR:
- Auto-dismiss: 5 seconds (configurable)
- Pause on hover
- Swipe to dismiss (mobile)
- Max 5 toasts visible
- Stack with offset

ANIMATIONS:
- Enter: Slide in from right + fade
- Exit: Slide out to right + fade
- Dismiss: Scale down + fade

USAGE EXAMPLES:
- "Agent started successfully"
- "Deal moved to Diligence"
- "Error: Unable to connect to API"
- "IC memo generated and saved"
```

---

# PART 12: RESPONSIVE & ACCESSIBILITY

## 12.1 Responsive Design

```
Implement responsive behavior:

DESKTOP (1280px+):
- Full sidebar (240px)
- Three-column layouts where applicable
- Hover interactions
- Drag and drop

TABLET (768-1279px):
- Collapsible sidebar (72px icons only)
- Two-column layouts
- Touch-friendly targets
- Swipe gestures

MOBILE (<768px):
- Bottom tab navigation
- Single column layouts
- Full-screen drawers
- Pull-to-refresh
- Swipe actions

TOUCH TARGETS:
- Minimum 44x44px
- Adequate spacing between elements
- Visual feedback on tap

PERFORMANCE:
- Lazy load below-fold content
- Optimize images
- Minimize animations on mobile
- Reduce polling frequency
```

## 12.2 Accessibility Requirements

```
Implement accessibility features:

KEYBOARD NAVIGATION:
- All interactive elements focusable
- Visible focus indicators (2px accent outline)
- Logical tab order
- Escape closes modals/drawers
- Arrow keys for navigation within components

SCREEN READERS:
- Semantic HTML elements
- ARIA labels for icons
- Role attributes for custom components
- Live regions for updates
- Alt text for images

COLOR CONTRAST:
- Minimum 4.5:1 for normal text
- Minimum 3:1 for large text
- Don't rely on color alone (icons + text)
- High contrast mode support

MOTION:
- Respect prefers-reduced-motion
- Disable animations if requested
- Provide static alternatives
- No auto-playing video with sound

FORMS:
- Associated labels
- Error messages linked to inputs
- Required field indicators
- Clear validation feedback
- Focus management

TESTING:
- Keyboard-only navigation test
- Screen reader test (NVDA, VoiceOver)
- Color contrast check
- Focus order verification
```

---

# APPENDIX: CONTENT & COPY

## A.1 Agent Descriptions

```
SCOUT AGENT:
"Continuously monitors your pipeline companies, funding news, 
hiring signals, and competitor moves. Delivers daily intelligence 
briefings so you never miss what matters."

QUILL AGENT:
"Transforms founder call transcripts into structured first-draft 
IC memos in minutes, not days. Maintains persistent context on 
your thesis, criteria, and portfolio composition."

LP RESEARCH AGENT:
"Monitors your LP universe 24/7, surfacing mandate changes, 
personnel shifts, and RFP signals. Dedicated FCC tracking 
keeps you ahead of the procurement timeline."

SCREENING AGENT:
"Automates first-pass deal triage, evaluating inbound decks 
against Fund II criteria in under 60 seconds. Builds a 
searchable deal database over time."

CONTENT AGENT:
"Drafts thesis-aligned content for LinkedIn and LP updates. 
Maintains your brand voice while scaling your thought 
leadership output."

ORCHESTRATOR:
"The chief of staff layer that coordinates all agents into 
a unified system. One information flow, not five separate tools."
```

## A.2 Empty States

```
NO AGENTS RUNNING:
"No agents currently active. Start an agent to begin automated 
monitoring and analysis."

EMPTY PIPELINE:
"No deals in this stage. Add a deal or adjust filters."

NO PORTFOLIO COMPANIES:
"No portfolio companies match your filters."

NO LP SIGNALS:
"No new signals detected. Check back later or adjust monitoring 
settings."

NO CONTENT:
"No content yet. Create your first piece to get started."
```

---

*Document Version: 2.0 (Internal Only)*  
*Last Updated: March 2026*  
*Prepared for: Kimi Code (Antigravity)*
