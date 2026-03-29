# Redstick Internal Command Center - Implementation Guide
## Phase-by-Phase Prompts for Kimi Code

---

## Overview

This guide provides a sequential series of prompts to build the Redstick Ventures internal command center. Each prompt is designed to be fed directly into Kimi Code in the Antigravity environment.

**Project Type:** Internal fund operations platform (no public-facing pages)  
**Users:** Redstick team only (authenticated)  
**Architecture:** Single-page application with authenticated routes

---

## Phase 1: Foundation & Authentication (Day 1)

### Prompt 1.1: Project Initialization

```
Initialize a new Next.js 14 project with the following specifications:

PROJECT NAME: redstick-command-center

TECH STACK:
- Next.js 14 (App Router)
- TypeScript (strict mode)
- Tailwind CSS 3.4+
- shadcn/ui components
- Framer Motion for animations
- Zustand for state management
- React Query for server state

FOLDER STRUCTURE:
app/
  (auth)/
    login/page.tsx
    layout.tsx
  (dashboard)/
    layout.tsx
    page.tsx (dashboard)
    agents/page.tsx
    pipeline/page.tsx
    portfolio/page.tsx
    lp-intelligence/page.tsx
    content-studio/page.tsx
    settings/page.tsx
  api/
components/
  ui/ (shadcn components)
  layout/ (sidebar, header, etc.)
  agents/
  pipeline/
  portfolio/
  lp/
  content/
  shared/
lib/
  utils.ts
  constants.ts
  types.ts
hooks/
store/
public/

DESIGN SYSTEM SETUP:
Create design-system.ts with these color tokens:
- background: #0a0a12
- surface: #141425
- surface-elevated: #1e1e35
- border: #2a2a45
- accent: #e94560
- success: #22c55e
- warning: #f59e0b
- error: #ef4444
- info: #3b82f6
- text-primary: #ffffff
- text-secondary: #a0a0b8
- text-tertiary: #6b6b80

Install and configure all dependencies.
```

### Prompt 1.2: Authentication System

```
Create the authentication system:

LOGIN PAGE (app/(auth)/login/page.tsx):
- Full-screen dark background with subtle gradient animation
- Centered login card (max-width: 420px)
- Form fields:
  * Email (with validation)
  * Password (with show/hide toggle)
  * Remember me checkbox
- Submit button with loading state
- Error handling with shake animation
- "Forgot password" link

AUTH CONTEXT:
- Create AuthContext with:
  * user state
  * login/logout functions
  * loading state
  * error handling
- Mock authentication (can integrate real auth later)
- Protected route middleware
- Session persistence (localStorage)

TEST USERS:
- cam@redstick.vc / password
- yuwen@redstick.vc / password

REDIRECT:
- After login → /dashboard
- Unauthenticated → /login

STYLING:
- Use design system colors
- Professional, secure appearance
- Subtle background animation (particles or gradient)
```

### Prompt 1.3: Main Layout Shell

```
Create the main authenticated layout:

ROOT LAYOUT (app/(dashboard)/layout.tsx):
- Check authentication (redirect to login if not authenticated)
- Apply dark theme by default
- Load Inter font

HEADER COMPONENT (components/layout/Header.tsx):
- Fixed position, height: 64px
- Left: Page title + breadcrumb
- Center: Global search bar (⌘K shortcut)
- Right:
  * Notification bell with badge
  * Theme toggle (dark/light)
  * User avatar dropdown

SIDEBAR COMPONENT (components/layout/Sidebar.tsx):
- Fixed position, left side
- Width: 240px (expanded), 72px (collapsed)
- Collapsible with toggle button
- Navigation sections:
  * MAIN: Dashboard, AI Agents, Pipeline, Portfolio
  * INTELLIGENCE: LP Research, Market Signals, Content Studio
  * SYSTEM: Settings, Help, Sign Out
- Active state: Left accent border, elevated background
- Badge support for counts

MAIN CONTENT AREA:
- Margin-left: 240px (sidebar width)
- Margin-top: 64px (header height)
- Padding: 24px
- Scrollable independently

MOBILE:
- Sidebar hidden
- Bottom tab bar navigation

RESPONSIVE:
- Desktop: Full layout
- Tablet: Collapsible sidebar
- Mobile: Bottom tabs
```

---

## Phase 2: Dashboard & Navigation (Day 1-2)

### Prompt 2.1: Dashboard Overview

```
Create the main dashboard page:

HEADER SECTION:
- Greeting: "Good [morning/afternoon], [Name]"
- Current date
- Quick actions: "Run All Agents", "New Deal"

STATS GRID (4 cards, responsive):
1. Active Agents
   - Icon: Robot
   - Number: 4/6
   - Label: "agents running"
   - Sparkline chart
   - Trend indicator

2. Pipeline Activity
   - Icon: GitBranch
   - Number: 12
   - Label: "deals this week"
   - Breakdown: 3 new, 5 moved, 4 decisions

3. Portfolio Health
   - Icon: Activity
   - Score: 94%
   - Label: "average health"
   - Attention needed indicator

4. LP Intelligence
   - Icon: Radio
   - Number: 8
   - Label: "new signals today"
   - Priority count

QUICK ACCESS CARDS (4 cards):
- Scout Agent Status (with live indicator)
- Recent Deal Activity (last 3)
- Upcoming Tasks
- Content Drafts Pending

ACTIVITY FEED (bottom):
- Title: "Recent Activity"
- Last 7-10 items
- Each item: icon, description, timestamp, agent
- "View All" link

MOCK DATA:
- Populate with realistic sample data
- Show variety of activity types

ANIMATIONS:
- Cards fade in on load
- Numbers count up
- Activity items slide in
```

### Prompt 2.2: Global Search & Command Palette

```
Create global search functionality:

TRIGGER:
- Keyboard shortcut: ⌘/Ctrl + K
- Search icon in header

COMMAND PALETTE COMPONENT:
- Modal overlay with backdrop blur
- Centered container (max-width: 640px)
- Search input at top
- Results categorized:
  * Agents
  * Deals
  * Portfolio Companies
  * LPs
  * Actions/Commands

SEARCH INPUT:
- Auto-focus on open
- Clear button
- Loading state

RESULTS:
- Group by category
- Each result: icon, title, subtitle, shortcut
- Keyboard navigation (arrow keys, enter)
- Click to navigate

RECENT SEARCHES:
- Show last 5 searches
- Clear history option

EMPTY STATE:
- "No results found"
- Suggested searches

MOCK SEARCH DATA:
- 6 agents
- 10 deals
- 8 portfolio companies
- 5 LPs
- 5 commands

IMPLEMENTATION:
- Use cmdk library or custom implementation
- Debounce search input
- Highlight matching text
```

### Prompt 2.3: Notification System

```
Create notification system:

NOTIFICATION CONTEXT:
- Global notification state
- Add/remove/clear functions
- Unread count

NOTIFICATION DROPDOWN (in header):
- Bell icon with unread badge
- Click to open dropdown
- Width: 400px

NOTIFICATION ITEM:
- Icon (type-specific color)
- Title
- Description
- Timestamp
- Unread indicator

TYPES:
- Agent completed (green)
- Agent error (red)
- New deal (blue)
- LP signal (purple)
- Pipeline moved (amber)

ACTIONS:
- Click to navigate
- Mark as read
- Dismiss
- Mark all as read

TOAST NOTIFICATIONS:
- Position: bottom-right
- Types: success, error, warning, info
- Auto-dismiss: 5 seconds
- Pause on hover
- Manual dismiss (X button)

MOCK NOTIFICATIONS:
- 5-7 sample notifications
- Mix of read/unread
- Various types
```

---

## Phase 3: AI Agent Management (Day 2-3)

### Prompt 3.1: Agent Grid View

```
Create the AI Agent management page:

PAGE HEADER:
- Title: "AI Agents"
- Subtitle: "Manage and monitor your AI workforce"
- Actions: "Create Agent" button, view toggle, filter

AGENT GRID (3 columns desktop, 2 tablet, 1 mobile):
6 agent cards:

1. SCOUT AGENT
   - Icon: Globe
   - Color: Blue
   - Status: Active/Idle/Paused/Error
   - Current task description
   - Progress bar (if running)
   - Today's metrics
   - Quick actions: Play/Pause, Logs, Configure

2. QUILL AGENT
   - Icon: FileText
   - Color: Purple
   - Similar structure

3. LP RESEARCH AGENT
   - Icon: Users
   - Color: Green

4. SCREENING AGENT
   - Icon: Filter
   - Color: Orange

5. CONTENT AGENT
   - Icon: PenTool
   - Color: Pink

6. ORCHESTRATOR
   - Icon: Cpu
   - Color: Red (accent)

STATUS INDICATORS:
- Active: Green pulsing dot
- Idle: Blue static dot
- Paused: Amber static dot
- Error: Red fast-pulsing dot
- Offline: Gray empty dot

CARD INTERACTIONS:
- Hover: Lift effect, border accent
- Click: Open detail panel
- Menu: Dropdown actions
- Draggable: Reorder priority

MOCK DATA:
- 4 active, 1 idle, 1 paused
- Realistic task descriptions
- Metrics for each agent
```

### Prompt 3.2: Agent Detail Panel

```
Create agent detail slide-out panel:

PANEL:
- Width: 480px
- Slides in from right
- Dark elevated background

HEADER:
- Large agent icon
- Agent name
- Status badge
- Close button
- Start/Stop/Restart actions

TABS (4):
1. OVERVIEW
   - Description
   - Current status
   - Current task with progress
   - Today's stats
   - Recent outputs
   - Quick actions

2. ACTIVITY LOG
   - Scrollable list
   - Filter: All, Success, Error, Info
   - Each entry: timestamp, level, message
   - Expandable details
   - Search logs

3. PERFORMANCE
   - Charts (7 days):
     * Tasks completed (bar)
     * Response time (line)
     * Success rate (area)
   - Key metrics

4. SETTINGS
   - Enable/disable toggle
   - Schedule config
   - Parameters
   - Output destinations
   - Notifications
   - Delete agent (danger zone)

ANIMATIONS:
- Slide in/out
- Tab content fade
- Log entries slide in
```

### Prompt 3.3: Activity Feed Component

```
Create global activity feed:

STRUCTURE:
- Scrollable list
- Filter bar: type, agent, date range
- Group by date

ACTIVITY ITEM:
- Icon (type-based)
- Description (with highlighted entities)
- Timestamp (relative)
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

REAL-TIME:
- "Live" indicator
- New items slide in
- Unread badge
- "Mark all as read"

MOCK DATA:
- 15-20 sample activities
- Various types
- Mix of timestamps
- Different agents
```

### Prompt 3.4: Agent Orchestration Visualizer

```
Create agent flow diagram:

VISUALIZATION:
- Node-based diagram
- Orchestrator at center
- Agents as surrounding nodes
- Animated connections

NODES:
- Scout (top-left)
- Quill (top-right)
- LP Research (right)
- Screening (bottom-right)
- Content (bottom-left)
- Orchestrator (center)

CONNECTIONS:
- Animated data flow lines
- Packets moving along paths
- Direction indicators
- Speed based on activity

INTERACTIONS:
- Click node: Open agent detail
- Hover connection: Show data info
- Play/Pause animation
- Zoom/pan

MODES:
- Real-time (live)
- Last hour (replay)
- Architecture (static)

MOCK DATA:
- Show realistic flow patterns
- Varying activity levels
- Different data types
```

---

## Phase 4: Deal Pipeline (Day 3-4)

### Prompt 4.1: Pipeline Kanban Board

```
Create deal pipeline board:

PAGE HEADER:
- Title: "Deal Pipeline"
- Actions: "Add Deal", view toggle, filter, search

BOARD:
- 5 columns (horizontal scroll)
- Column width: 320px
- Gap: 16px

COLUMNS:
1. INBOUND (gray)
2. SCREENING (blue)
3. DILIGENCE (amber)
4. IC REVIEW (purple)
5. DECISION (green/red)

COLUMN HEADER:
- Name + count badge
- Average days in stage
- Add deal button

DEAL CARD:
- Company name
- Stage badge
- Sector tag
- Source indicator
- Assigned partner avatar
- Days in stage
- Quick links

DRAG & DROP:
- Cards draggable between columns
- Visual feedback
- Confirmation for decision moves
- Update on drop

MOCK DATA:
- 12-15 deals across stages
- Various sectors
- Different sources
- Mix of assigned partners
```

### Prompt 4.2: Deal Detail Drawer

```
Create deal detail slide-out:

WIDTH: 560px

HEADER:
- Company name
- Stage badge
- Close button
- Actions: Edit, Move, Archive

SECTIONS:
1. Company Info
   - Website, location, founded
   - Sector, stage, check size

2. Founders
   - List with LinkedIn links

3. Deal Details
   - Source, date, assigned partner

4. IC Memo
   - Status, preview
   - Generate button

5. Screening Report
   - Score, thesis fit, red flags

6. Activity Timeline
   - Chronological events

7. Documents
   - Deck, one-pager, model

8. Notes
   - Free-form area

MOCK DATA:
- Complete deal information
- Sample IC memo
- Activity history
- Documents list
```

---

## Phase 5: Portfolio Monitoring (Day 4)

### Prompt 5.1: Portfolio Dashboard

```
Create portfolio overview:

PAGE HEADER:
- Title: "Portfolio"
- Actions: "Generate Report", view toggle, filter

STATS ROW (4 cards):
1. Total Companies (18)
2. Fund TVPI (1.8x)
3. Fund DPI (0.4x)
4. Attention Needed (2)

GRID VIEW:
- 3 columns desktop
- Company cards:
  * Logo/name
  * Health status
  * Valuation change
  * Revenue growth
  * Next milestone
  * Quick links

HEALTH INDICATORS:
- Green: On track
- Yellow: Needs attention
- Red: Immediate support

ATTENTION SECTION:
- List companies needing help
- Specific issues
- Suggested actions

LIST VIEW:
- Table format
- Sortable columns
- Bulk actions

MOCK DATA:
- 18 portfolio companies
- Mix of health statuses
- Various sectors/stages
```

### Prompt 5.2: Company Detail View

```
Create company detail page:

LAYOUT:
- Full page (dedicated route)
- Back button
- Tabs navigation

HEADER:
- Large logo
- Company name
- Health badge
- Quick stats

TABS:
1. OVERVIEW
   - Description, founders, investment details
   
2. FINANCIALS
   - Revenue chart
   - Burn rate, runway
   - Key metrics
   
3. MILESTONES
   - Timeline
   - Upcoming goals
   
4. REPORTS
   - Monthly/quarterly
   - Auto-generated
   
5. DOCUMENTS
   - Investment docs
   - Board decks

MOCK DATA:
- Complete company profile
- Financial charts
- Milestone history
- Document list
```

---

## Phase 6: LP Intelligence (Day 4-5)

### Prompt 6.1: LP Intelligence Feed

```
Create LP research interface:

PAGE HEADER:
- Title: "LP Intelligence"
- Actions: "Add LP", "Export Report"

LAYOUT:
- Filter sidebar (left)
- Intelligence feed (center)
- LP details (right, optional)

FILTERS:
- LP type
- Geography
- Mandate
- Signal type
- Date range
- Search

INTELLIGENCE CARDS:
- LP logo/name
- Signal type badge
- Description
- Relevance score
- Timestamp
- Actions: Save, Share, Contact, Profile

SIGNAL TYPES:
- New Mandate (green)
- Personnel Change (blue)
- RFP Released (red)
- Portfolio Announcement (purple)
- Mandate Shift (amber)

FCC TRACKING:
- Dedicated section
- Countdown timer
- Key dates
- Document checklist

MOCK DATA:
- 10-15 intelligence items
- Various signal types
- Different LPs
- Mix of priorities
```

### Prompt 6.2: LP Profile Panel

```
Create LP detail view:

STRUCTURE:
- Slide-out or full page

SECTIONS:
1. Firm Details
   - AUM, vintage, geography
   
2. Investment Criteria
   - Stage, sector, check size
   
3. Portfolio
   - Current investments
   - Ag/food focus
   
4. Key Contacts
   - Names, titles, LinkedIn
   
5. Interaction History
   - Meetings, calls, emails
   
6. Signals
   - All detected signals
   
7. Notes
   - Strategy, next steps

MOCK DATA:
- 5-6 LP profiles
- Complete information
- Interaction history
- Multiple contacts
```

---

## Phase 7: Content Studio (Day 5)

### Prompt 7.1: Content Generation Interface

```
Create content studio:

PAGE HEADER:
- Title: "Content Studio"
- Actions: "New Content"

TABS:
1. CREATE
   - Content type selector
   - Context inputs
   - Generate button
   - Editor
   - Preview

2. DRAFTS
   - List of drafts
   - Status indicators
   - Quick actions

3. SCHEDULED
   - Calendar view
   - Scheduled posts
   - Drag to reschedule

4. PUBLISHED
   - History
   - Performance metrics

CONTENT TYPES:
- LinkedIn Post
- LP Update Insert
- Blog Article
- Email Newsletter
- Thesis Update

EDITOR:
- AI-generated draft
- Editable
- Formatting toolbar
- Regenerate options

APPROVAL WORKFLOW:
- Submit for review
- Reviewer assignment
- Comments
- Revision history

MOCK DATA:
- 3-4 drafts
- 2-3 scheduled
- 5-6 published
```

---

## Phase 8: Settings & Polish (Day 5-6)

### Prompt 8.1: System Settings

```
Create settings page:

CATEGORIES (sidebar):
1. Agent Configuration
2. Notifications
3. Integrations
4. Team Management
5. Billing & Usage
6. Appearance
7. Data & Privacy

AGENT CONFIG:
- Enable/disable toggles
- Schedule settings
- Parameters
- API keys

NOTIFICATIONS:
- Email prefs
- Slack integration
- Alert thresholds

INTEGRATIONS:
- Otter.ai
- CRM
- Data sources
- Webhooks

TEAM:
- User list
- Invite member
- Roles/permissions

BILLING:
- Token usage
- Cost breakdown
- Limits

APPEARANCE:
- Theme
- Density
- Accent color
- Font size

MOCK DATA:
- Realistic settings
- Connected integrations
- Team members
- Usage stats
```

### Prompt 8.2: Final Polish

```
Add final polish and optimizations:

ANIMATIONS:
- Page transitions
- Card hover effects
- Button micro-interactions
- Scroll-triggered reveals
- Loading skeletons

RESPONSIVE:
- Mobile bottom tabs
- Tablet layouts
- Touch-friendly targets

ACCESSIBILITY:
- Keyboard navigation
- Focus indicators
- ARIA labels
- Color contrast
- Reduced motion support

PERFORMANCE:
- Image optimization
- Lazy loading
- Code splitting
- Caching

TESTING:
- Cross-browser test
- Mobile test
- Keyboard-only test
- Screen reader test
```

---

## Implementation Checklist

### Phase 1
- [ ] Project initialized
- [ ] Design system configured
- [ ] Authentication working
- [ ] Login page styled
- [ ] Protected routes

### Phase 2
- [ ] Header component
- [ ] Sidebar navigation
- [ ] Dashboard overview
- [ ] Global search
- [ ] Notifications

### Phase 3
- [ ] Agent grid
- [ ] Agent detail panel
- [ ] Activity feed
- [ ] Orchestration visualizer

### Phase 4
- [ ] Pipeline board
- [ ] Drag and drop
- [ ] Deal cards
- [ ] Deal detail drawer

### Phase 5
- [ ] Portfolio grid
- [ ] Company cards
- [ ] Health indicators
- [ ] Company detail view

### Phase 6
- [ ] LP intelligence feed
- [ ] Filter sidebar
- [ ] Signal cards
- [ ] LP profile panel

### Phase 7
- [ ] Content studio
- [ ] AI generation interface
- [ ] Drafts/scheduled/published
- [ ] Approval workflow

### Phase 8
- [ ] Settings pages
- [ ] All categories
- [ ] Final polish
- [ ] Responsive fixes
- [ ] Accessibility

---

## Technical Notes

### Recommended Libraries
- **UI Components:** shadcn/ui (built on Radix)
- **Animations:** Framer Motion
- **State:** Zustand
- **Server State:** React Query
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts
- **Drag & Drop:** @dnd-kit
- **Date Handling:** date-fns

### Performance Targets
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Lighthouse Score: > 90

### Security Considerations
- All routes protected
- Session management
- Input validation
- XSS prevention
- CSRF protection

---

*This implementation guide provides a complete roadmap for building the Redstick internal command center. Each prompt can be executed sequentially in Kimi Code.*
