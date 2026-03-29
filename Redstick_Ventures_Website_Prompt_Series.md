# Redstick Ventures: AI-Powered VC Hub Website
## Comprehensive Prompt Series for Kimi Code (Antigravity)

---

# PART 1: MASTER DESIGN BRIEF

## 1.1 Project Overview

**Client:** Redstick Ventures  
**Type:** Early-stage Venture Capital Firm (Fund II)  
**Thesis:** Food systems, agriculture, and AI intersection  
**Primary Goal:** Create a unified command center hub that serves as:
- Public-facing VC firm website (founder/LP-facing)
- Internal AI agent management dashboard
- Fund operations control center
- Deal pipeline and portfolio monitoring system

**Core Value Proposition:** "See everything in your business. Manage all your AI agents. From one hub."

---

## 1.2 Design Philosophy & References

### Primary Visual References (VC Websites)

| Reference | URL | Key Elements to Emulate |
|-----------|-----|------------------------|
| **Sequoia Capital** | sequoiacap.com | Animated "marker pen" effect, colorful tiles, bold headlines, motion toggle |
| **Radical Ventures** | radical.vc | Minimalist restraint, clarity without over-explaining, calm confidence |
| **Union Square Ventures** | usv.com | Crystal-clear grid structure, editorial density, search functionality |
| **Atomico** | atomico.com | Sleek modern design, large immersive imagery, excellent video use |
| **Founders Fund** | foundersfund.com | Bold minimalism, dark theme option, edgy positioning |

### Dashboard/Interface References (AI Agent Management)

| Reference | Source | Key Elements to Emulate |
|-----------|--------|------------------------|
| **Mission Control** | github.com/builderz-labs/mission-control | 32-panel SPA shell, real-time WebSocket updates, role-based access |
| **AgentCenter** | agentcenter.cloud | Live agent status, task board, activity feed, deliverables view |
| **Illuin Orchestration** | Wolfox case study | Chain-of-thought transparency, token usage tracking, dark mode optimization |
| **Kubiya AI** | kubiya.ai | Orchestrator visualization, LLM/memory/agent flow diagrams |

---

## 1.3 Design System Specification

### Color Palette

```css
/* Primary Colors */
--color-primary: #1a1a2e;        /* Deep navy - main brand */
--color-primary-light: #16213e;  /* Lighter navy - secondary */
--color-accent: #e94560;         /* Redstick red - energy, action */
--color-accent-hover: #ff6b6b;   /* Lighter red for hover states */

/* Neutral Colors */
--color-background: #0f0f1a;     /* Near-black background */
--color-surface: #1a1a2e;        /* Card/surface background */
--color-surface-elevated: #252542; /* Elevated surfaces */
--color-border: #2d2d4a;         /* Subtle borders */

/* Text Colors */
--color-text-primary: #ffffff;   /* Primary text */
--color-text-secondary: #a0a0b0; /* Secondary/muted text */
--color-text-tertiary: #6b6b7b;  /* Tertiary text */

/* Semantic Colors */
--color-success: #4ade80;        /* Green - agent active/healthy */
--color-warning: #fbbf24;        /* Amber - attention needed */
--color-error: #ef4444;          /* Red - error/stopped */
--color-info: #60a5fa;           /* Blue - informational */
```

### Typography System

```css
/* Font Families */
--font-heading: 'Inter', -apple-system, sans-serif;  /* Clean, modern headings */
--font-body: 'Inter', -apple-system, sans-serif;     /* Readable body text */
--font-mono: 'JetBrains Mono', 'Fira Code', monospace; /* Code/agent logs */

/* Type Scale */
--text-hero: 4rem;        /* 64px - Main hero headlines */
--text-h1: 2.5rem;        /* 40px - Page titles */
--text-h2: 2rem;          /* 32px - Section headers */
--text-h3: 1.5rem;        /* 24px - Card titles */
--text-h4: 1.25rem;       /* 20px - Subsection headers */
--text-body: 1rem;        /* 16px - Body text */
--text-small: 0.875rem;   /* 14px - Captions, metadata */
--text-xs: 0.75rem;       /* 12px - Labels, timestamps */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Spacing System

```css
/* Base unit: 4px */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-24: 6rem;     /* 96px */
```

### Border Radius & Shadows

```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-full: 9999px;

/* Shadows for dark theme */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.5);
--shadow-glow: 0 0 20px rgba(233, 69, 96, 0.3); /* Accent glow */
```

---

## 1.4 Site Architecture

### Dual-Mode Architecture

The website operates in TWO distinct modes:

#### Mode A: Public Website (Founder/LP Facing)
- Homepage with firm positioning
- Investment thesis section
- Portfolio showcase
- Team section
- Contact/Submit deck
- Insights/Content

#### Mode B: Command Center (Authenticated Internal)
- AI Agent Management Dashboard
- Deal Pipeline View
- Portfolio Monitoring
- LP Intelligence Feed
- Content Generation Studio
- System Settings

### URL Structure

```
/                           → Public Homepage
/about                      → About/Firm Story
/thesis                     → Investment Thesis
/portfolio                  → Portfolio Companies
/team                       → Team Members
/contact                    → Contact/Submit Deck
/insights                   → Blog/Content

/app                        → Command Center (auth required)
/app/dashboard              → Main Command Center
/app/agents                 → AI Agent Management
/app/pipeline               → Deal Pipeline
/app/portfolio              → Portfolio Monitoring
/app/lp-intelligence        → LP Research Feed
/app/content-studio         → Content Generation
/app/settings               → System Settings
```

---

## 1.5 Animation & Motion Specification

### Scroll-Triggered Animations

```javascript
// Hero section - text reveal
{
  trigger: '.hero-headline',
  animation: 'fadeInUp',
  duration: 800,
  easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
  stagger: 100 // ms between elements
}

// Section reveals
{
  trigger: '.section-content',
  animation: 'fadeInUp',
  duration: 600,
  threshold: 0.2 // trigger when 20% visible
}

// Card stagger
{
  trigger: '.card-grid',
  animation: 'fadeInUp',
  duration: 500,
  stagger: 80,
  easing: 'ease-out'
}
```

### Micro-Interactions

```css
/* Button hover */
.button {
  transition: all 200ms cubic-bezier(0.16, 1, 0.3, 1);
}
.button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}

/* Card hover */
.card {
  transition: all 300ms ease;
}
.card:hover {
  transform: translateY(-4px);
  border-color: var(--color-accent);
}

/* Agent status pulse */
.agent-status.active {
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Loading skeleton */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-surface) 25%,
    var(--color-surface-elevated) 50%,
    var(--color-surface) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
```

### Performance Requirements

- All animations must be GPU-accelerated (transform, opacity only)
- Implement `prefers-reduced-motion` media query
- Lazy load below-fold animations
- Maximum 60fps on mid-tier devices

---

# PART 2: COMPONENT-LEVEL IMPLEMENTATION PROMPTS

---

## 2.1 Public Website Components

### Prompt 2.1.1: Hero Section

```
Create a hero section for Redstick Ventures homepage with the following specifications:

LAYOUT:
- Full viewport height (100vh)
- Centered content with max-width 1200px
- Background: Gradient from --color-background to --color-primary-light
- Optional: Subtle animated particle network or grid pattern overlay at 5% opacity

CONTENT STRUCTURE:
1. Eyebrow text (small, uppercase, tracking wide): "EARLY-STAGE VENTURE CAPITAL"
2. Main headline (split into animated lines):
   - "We invest at the intersection of"
   - "food systems, agriculture,"
   - "and artificial intelligence."
3. Subheadline: "Backing founders building the future of how the world eats."
4. CTA Button Group:
   - Primary: "Submit Your Deck" (accent color)
   - Secondary: "Learn Our Thesis" (outline style)

ANIMATIONS:
- Text reveal: Staggered fadeInUp animation (100ms delay between lines)
- Duration: 800ms per element
- Easing: cubic-bezier(0.16, 1, 0.3, 1)
- Particles: Subtle floating animation (if implemented)

RESPONSIVE:
- Mobile: Reduce headline to 2.5rem, stack CTAs vertically
- Tablet: Adjust spacing, maintain side-by-side CTAs

ACCESSIBILITY:
- Respect prefers-reduced-motion
- Ensure 4.5:1 contrast ratio for all text
- Keyboard-navigable CTAs
```

### Prompt 2.1.2: Navigation Component

```
Create a responsive navigation component for Redstick Ventures:

STRUCTURE:
- Fixed position at top
- Height: 72px desktop, 64px mobile
- Background: Transparent → solid on scroll (glassmorphism effect)
- Max-width container: 1400px, centered

LEFT SIDE:
- Logo: "REDSTICK" wordmark (custom font weight 700, letter-spacing -0.02em)
- Optional: Small "VENTURES" below in smaller text

RIGHT SIDE (Desktop):
- Links: About, Thesis, Portfolio, Team, Insights, Contact
- Each link has subtle hover underline animation
- Active state: Accent color underline

MOBILE:
- Hamburger menu icon (animated to X)
- Full-screen overlay menu
- Links stack vertically with stagger animation

SCROLL BEHAVIOR:
- Initially transparent
- After 50px scroll: Add backdrop-blur(12px) and solid background
- Transition: 300ms ease

AUTHENTICATED STATE:
- Show "Command Center" button with accent background
- User avatar dropdown for logged-in users
```

### Prompt 2.1.3: Investment Thesis Section

```
Create an Investment Thesis section with the following:

LAYOUT:
- Two-column grid on desktop (40% text, 60% visual)
- Single column on mobile
- Section padding: 96px vertical

LEFT COLUMN (Content):
- Section label: "OUR THESIS" (small, uppercase, accent color)
- Headline: "The Future of Food is Intelligent"
- Body paragraphs (2-3) explaining:
  1. Food systems + AI intersection opportunity
  2. Deep sector conviction in Canadian agriculture
  3. Proprietary pipeline advantages
- Key stats row (3 stats with large numbers)

RIGHT COLUMN (Visual):
- Interactive diagram or animated illustration
- Show: Food system → AI/ML → Optimized outcomes
- Use connecting lines with animated data flow
- Color-coded nodes matching brand palette

INTERACTION:
- Scroll-triggered reveal for each element
- Stats count up animation when visible
- Diagram elements animate in sequence

STATS TO DISPLAY:
- "1000+" → "Deals screened annually"
- "$XXM" → "Fund II target"
- "XX" → "Portfolio companies"
```

### Prompt 2.1.4: Portfolio Showcase

```
Create a portfolio company showcase section:

LAYOUT:
- Section header with "PORTFOLIO" label and headline
- Filter tabs: All, Agriculture, Food Tech, AI/ML, Supply Chain
- Grid: 3 columns desktop, 2 tablet, 1 mobile
- Gap: 24px

CARD DESIGN:
- Aspect ratio: 4:3
- Background: Company brand color (fallback to gradient)
- Company logo centered (white or dark based on contrast)
- Hover overlay with:
  - Company name
  - Brief description (2 lines max)
  - Tags (stage, sector)
  - "Learn More" link

INTERACTIONS:
- Cards fade in with stagger on scroll
- Hover: Scale 1.02, overlay slides up from bottom
- Filter: Smooth fade transition between categories

FEATURED COMPANY (Optional):
- First card spans 2 columns
- Larger logo, more description
- "Featured Investment" badge

RESPONSIVE:
- Maintain touch-friendly tap targets (min 44px)
- Reduce grid columns appropriately
```

### Prompt 2.1.5: Team Section

```
Create a team member showcase:

LAYOUT:
- Section header
- Grid: 4 columns desktop, 2 tablet, 1 mobile
- Gap: 32px

MEMBER CARD:
- Photo: Square aspect ratio, rounded corners (12px)
- Name: Bold, 1.25rem
- Title: Secondary color, 0.875rem
- Bio: 2-3 lines, truncated with ellipsis
- Social links: LinkedIn, Twitter (icon buttons)

PHOTO TREATMENT:
- Consistent black and white or duotone filter
- Subtle zoom on hover
- Optional: Color reveal on hover

INTERACTIONS:
- Cards stagger in on scroll
- Hover: Photo scales 1.05, name color changes to accent

MEMBERS TO FEATURE:
- Cameron Fenton (Managing Partner)
- Yu Wen (Partner/Research Lead)
- [Additional team members as needed]
```

### Prompt 2.1.6: Contact/Deck Submission Form

```
Create a founder deck submission form:

LAYOUT:
- Two-column layout (form left, info right)
- Or centered single column for simplicity

FORM FIELDS:
1. Company Name (text input)
2. Your Name (text input)
3. Email (email input with validation)
4. Company Website (url input, optional)
5. Stage (select: Pre-seed, Seed, Series A, Other)
6. Sector (select: Agriculture, Food Tech, AI/ML, Supply Chain, Other)
7. Elevator Pitch (textarea, 500 chars max)
8. Deck Upload (file input, PDF only, max 20MB)
9. How did you hear about us? (select)

SUBMIT BUTTON:
- Full width on mobile
- Loading state with spinner
- Success state with checkmark animation
- Error state with inline validation messages

VALIDATION:
- Real-time validation on blur
- Clear error messages below each field
- Prevent submission until valid

RIGHT COLUMN (Info):
- "What happens next?" timeline
- Typical response time
- Contact email for questions
- Links to: Investment Criteria, FAQ

SUCCESS STATE:
- Thank you message
- What to expect next
- Optional: Add to calendar for follow-up
```

---

## 2.2 Command Center Components (Authenticated)

### Prompt 2.2.1: Command Center Layout Shell

```
Create the main Command Center layout shell:

OVERALL STRUCTURE:
- Full-height layout (100vh)
- Left sidebar (collapsible): 280px expanded, 72px collapsed
- Top header: 64px fixed
- Main content area: scrollable
- Right panel (optional): 320px for details/inspector

SIDEBAR:
- Logo at top (simplified version)
- Navigation sections:
  
  MAIN:
  - Dashboard (home icon)
  - AI Agents (robot icon)
  - Pipeline (funnel icon)
  - Portfolio (grid icon)
  
  INTELLIGENCE:
  - LP Research (users icon)
  - Market Signals (trending-up icon)
  - Content Studio (edit icon)
  
  SYSTEM:
  - Settings (gear icon)
  - Help (question icon)
  - Logout (log-out icon)

- Each nav item has:
  - Icon (24x24)
  - Label (hidden when collapsed)
  - Badge for notifications (optional)
  - Active state indicator (left border accent)

- Collapse toggle at bottom

TOP HEADER:
- Left: Current page title + breadcrumb
- Center: Global search bar
- Right:
  - Notification bell with badge
  - User avatar dropdown
  - Theme toggle (light/dark)

MAIN CONTENT:
- Padding: 24px
- Scrollable independently
- Breadcrumb navigation

RESPONSIVE:
- Mobile: Sidebar becomes bottom tab bar
- Tablet: Collapsible sidebar
```

### Prompt 2.2.2: AI Agent Management Dashboard

```
Create the AI Agent Management dashboard - THE CORE FEATURE:

OVERVIEW SECTION (Top):
- Agent status summary cards (4 cards):
  1. "Active Agents" - number with trend indicator
  2. "Tasks Completed Today" - count with sparkline
  3. "Avg Response Time" - time with status
  4. "System Health" - percentage with progress bar

AGENT GRID (Main):
- Grid of agent cards (3 columns desktop, 2 tablet, 1 mobile)
- Each agent card contains:

  HEADER:
  - Agent icon/avatar (unique per agent type)
  - Agent name: "Scout Agent", "Quill Agent", etc.
  - Status badge: Active/Idle/Paused/Error (colored)
  - Menu button (3 dots)

  BODY:
  - Current task description (1 line)
  - Progress bar if running
  - Last activity timestamp
  - Today's metrics (tasks completed, avg time)

  FOOTER:
  - Quick actions: Pause/Resume, View Logs, Configure
  - Toggle switch for auto-run

AGENT TYPES TO DISPLAY:
1. Scout Agent (deal monitoring)
2. Quill Agent (IC memo generation)
3. LP Research Agent (investor intelligence)
4. Screening Agent (deal triage)
5. Content Agent (LinkedIn/posts)
6. Orchestrator (meta-agent coordination)

INTERACTIONS:
- Click card → Open agent detail panel
- Drag cards to reorder priority
- Real-time status updates (WebSocket simulation)
- Hover: Subtle lift effect

DETAIL PANEL (Right sidebar):
- Full agent configuration
- Activity log (scrollable)
- Performance charts
- Settings/Parameters

CREATE AGENT BUTTON:
- Floating action button (FAB) bottom-right
- Opens agent creation wizard
```

### Prompt 2.2.3: Agent Activity Feed

```
Create a real-time activity feed component:

LAYOUT:
- Full-width within content area
- Filter bar at top (activity types, date range)
- Scrollable list
- Load more at bottom

ACTIVITY ITEM STRUCTURE:
- Icon (based on activity type)
- Activity description with highlighted entities
- Timestamp (relative: "2 min ago")
- Agent attribution (which agent performed action)
- Expandable for details

ACTIVITY TYPES & ICONS:
- 📝 IC Memo Generated (file-text icon)
- 🔍 Deal Screened (search icon)
- 📧 LP Alert Triggered (bell icon)
- 🌐 News Detected (globe icon)
- ✅ Task Completed (check-circle icon)
- ⚠️ Error Occurred (alert-triangle icon)
- 🔄 Agent Restarted (refresh-cw icon)

VISUAL DESIGN:
- Alternating subtle background
- Left border color based on type
- Hover: Highlight background

EXAMPLE ITEMS:
"Quill Agent generated IC memo for DeepSite (Seed, AgTech)"
"Scout Agent detected Series B announcement for CompetitorX"
"LP Research Agent flagged new mandate at PensionFund Y"
"Screening Agent passed on 3 deals (thesis misalignment)"

REAL-TIME INDICATOR:
- "Live" badge at top with pulsing dot
- New items slide in from top
- Unread count badge
```

### Prompt 2.2.4: Deal Pipeline View

```
Create a deal pipeline Kanban board:

LAYOUT:
- Horizontal scrollable columns
- 5 columns: Inbound → Screening → Diligence → IC Review → Decision
- Each column: 320px width
- Column header with count badge

DEAL CARD:
- Company name (bold)
- Stage badge (seed/series A)
- Sector tag
- Source (inbound/warm intro/scout)
- Assigned partner avatar
- Days in stage indicator
- Quick actions on hover

DRAG & DROP:
- Cards draggable between columns
- Visual feedback during drag
- Confirmation for significant moves (to Decision)

COLUMN ACTIONS:
- Add deal button
- Filter/sort options
- Collapse/expand

DETAIL DRAWER:
- Slides in from right
- Full deal information
- IC memo preview
- Activity history
- Related documents

STATS BAR (Top):
- Total deals in pipeline
- Average days to decision
- Conversion rate by stage
- New deals this week

EMPTY STATES:
- Illustration + message per column
- CTA to add deal or adjust filters
```

### Prompt 2.2.5: Portfolio Monitoring Dashboard

```
Create a portfolio monitoring dashboard:

OVERVIEW CARDS (Top row):
- Total Portfolio Companies
- Fund TVPI
- Fund DPI
- Average Revenue Growth
- Companies Needing Attention (red if >0)

MAIN VISUALIZATION:
- Portfolio grid or chart view toggle
- Grid: Company cards with key metrics
- Chart: Bubble chart (x=valuation, y=growth, size=investment)

COMPANY CARD:
- Logo
- Company name
- Investment date
- Current valuation
- Revenue growth %
- Next milestone
- Health indicator (green/yellow/red)
- Quick links: Dashboard, Reports, Contact

ATTENTION REQUIRED SECTION:
- Companies with red health status
- Specific issues flagged
- Suggested actions

PERFORMANCE CHARTS:
- Fund-level IRR over time
- Revenue growth by company
- Valuation trends
- Sector allocation pie chart

REPORTING:
- Generate LP report button
- Schedule report dropdown
- Template selection
```

### Prompt 2.2.6: LP Intelligence Feed

```
Create an LP intelligence monitoring interface:

LAYOUT:
- Filter sidebar (left): LP type, geography, mandate, signals
- Main feed (center): Intelligence cards
- Detail panel (right): Selected LP profile

INTELLIGENCE CARD:
- LP name and logo
- Signal type badge (new mandate, personnel change, RFP, portfolio announcement)
- Signal description
- Relevance score (1-100)
- Date detected
- Source link
- Actions: Save, Share, Mark as Reached Out

SIGNAL TYPES:
- 🎯 New Mandate Detected
- 👤 Personnel Change
- 📋 RFP Released
- 💼 Portfolio Announcement
- 🔔 Mandate Shift Rumor

PRIORITY INDICATORS:
- High priority: Red accent, top of feed
- Medium: Yellow accent
- Low: Default styling

LP PROFILE PANEL:
- Fund details (AUM, vintage, geography)
- Investment criteria
- Portfolio companies
- Key contacts
- Interaction history
- Notes field

FCC TRACKING:
- Dedicated section for FCC RFP
- Countdown to key dates
- Document checklist
- Stakeholder mapping
```

### Prompt 2.2.7: Content Generation Studio

```
Create a content generation interface:

LAYOUT:
- Three-panel layout:
  - Left: Content templates/types
  - Center: Editor/preview
  - Right: Context & settings

CONTENT TYPES:
- LinkedIn Post
- LP Update Insert
- Blog Article
- Email Newsletter
- Investment Thesis Update

EDITOR:
- AI-generated draft display
- Edit toolbar (formatting)
- Regenerate button
- Tone selector (professional, casual, thought leadership)
- Length selector (short, medium, long)

CONTEXT PANEL:
- Topic input
- Key points to include
- Target audience
- Related portfolio companies
- Market signals to reference

WORKFLOW:
1. Select content type
2. Enter topic/context
3. AI generates draft
4. Edit/refine
5. Schedule or publish
6. Track performance

QUEUE VIEW:
- Scheduled content calendar
- Drafts in progress
- Published content with metrics

APPROVAL WORKFLOW:
- Submit for review button
- Approval status indicator
- Comments/feedback thread
```

---

# PART 3: FEATURE-SPECIFIC PROMPTS

---

## 3.1 AI Agent Status Indicators

```
Create comprehensive agent status indicator system:

STATUS STATES:
1. ACTIVE (green)
   - Pulsing dot animation
   - "Running" label
   - Current task visible
   
2. IDLE (blue)
   - Static dot
   - "Waiting" label
   - Last completed task
   
3. PAUSED (amber)
   - Static dot
   - "Paused" label
   - Pause reason (if applicable)
   
4. ERROR (red)
   - Pulsing dot, faster
   - "Error" label
   - Error message preview
   - Retry button
   
5. OFFLINE (gray)
   - Empty dot
   - "Offline" label
   - Last seen timestamp

HEALTH METRICS:
- Response time sparkline (last 24h)
- Success rate percentage
- Error count (if any)
- Token usage (if applicable)

VISUAL INDICATORS:
- Color-coded borders
- Status icon in agent avatar
- Tooltip on hover with detailed status
- Sound notification on status change (optional)
```

## 3.2 Real-Time Updates System

```
Implement real-time update patterns:

WEBSOCKET SIMULATION:
- Use EventSource or polling fallback
- Connection status indicator
- Reconnect logic with backoff

UPDATE TYPES:
1. Agent Status Change
2. New Activity Log Entry
3. Pipeline Card Move
4. Portfolio Metric Update
5. New LP Intelligence

VISUAL FEEDBACK:
- Toast notifications for important updates
- Subtle highlight on updated elements
- Unread badges increment
- Sound effects (optional, muted by default)

OPTIMISTIC UPDATES:
- Immediate UI feedback on user actions
- Rollback on error
- Sync indicator

OFFLINE SUPPORT:
- Queue actions when offline
- Sync when reconnected
- Conflict resolution UI
```

## 3.3 Search & Command Palette

```
Create a global search and command palette:

TRIGGER:
- Keyboard shortcut: Cmd/Ctrl + K
- Search icon in header
- Floating search bar option

INTERFACE:
- Modal overlay with blur backdrop
- Search input at top
- Results categorized:
  - Agents
  - Deals
  - Portfolio Companies
  - LPs
  - Actions/Commands
  - Recent

RESULT ITEM:
- Icon (type indicator)
- Title
- Subtitle/context
- Keyboard shortcut (if applicable)
- Preview on hover

ACTIONS:
- Navigate to page
- Run agent
- Create new item
- Execute command

RECENT SEARCHES:
- Save recent queries
- Quick access to frequent items

EMPTY STATE:
- Helpful message
- Suggested searches
- Create new option
```

---

# PART 4: INTEGRATION & ORCHESTRATION PROMPTS

---

## 4.1 Agent Orchestration Visualizer

```
Create an agent orchestration flow visualizer:

PURPOSE:
Show how agents interact and data flows between them

VISUALIZATION:
- Node-based diagram
- Agents as nodes (different shapes/colors by type)
- Data flows as animated connecting lines
- Orchestrator at center

NODES:
- Scout Agent (input gathering)
- Quill Agent (processing)
- LP Research Agent (monitoring)
- Content Agent (output)
- Orchestrator (coordination)

INTERACTIONS:
- Click node: Show details panel
- Hover connection: Show data type
- Play/pause animation
- Zoom and pan

REAL-TIME MODE:
- Show live data packets moving
- Highlight active pathways
- Pulse nodes when processing

HISTORY MODE:
- Scroll through past orchestrations
- Show success/failure rates
- Performance metrics per pathway
```

## 4.2 System Settings & Configuration

```
Create comprehensive settings interface:

SECTIONS:
1. AGENT CONFIGURATION
   - Enable/disable agents
   - Set run schedules
   - Configure parameters
   - API key management

2. NOTIFICATIONS
   - Email preferences
   - Slack integration
   - In-app notifications
   - Alert thresholds

3. INTEGRATIONS
   - Otter.ai (transcripts)
   - CRM connections
   - Data sources
   - Webhook endpoints

4. TEAM MANAGEMENT
   - User roles (admin, operator, viewer)
   - Invite team members
   - Permission settings

5. BILLING & USAGE
   - Token consumption
   - API usage
   - Cost breakdown
   - Usage limits

6. APPEARANCE
   - Theme (dark/light/system)
   - Density (compact/comfortable)
   - Accent color
   - Font size

IMPORT/EXPORT:
- Export configuration
- Import settings
- Reset to defaults
```

---

# PART 5: RESPONSIVE & ACCESSIBILITY REQUIREMENTS

---

## 5.1 Responsive Breakpoints

```css
/* Mobile First */
--breakpoint-sm: 640px;   /* Large phones */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Small laptops */
--breakpoint-xl: 1280px;  /* Desktops */
--breakpoint-2xl: 1536px; /* Large screens */

/* Layout adjustments */
/* < 640px: Single column, stacked navigation */
/* 640-768px: Two columns where applicable */
/* 768-1024px: Sidebar becomes collapsible */
/* > 1024px: Full layout with all panels */
```

## 5.2 Accessibility Requirements

```
MANDATORY IMPLEMENTATIONS:

1. KEYBOARD NAVIGATION
   - All interactive elements focusable
   - Visible focus indicators
   - Logical tab order
   - Escape closes modals

2. SCREEN READER SUPPORT
   - Semantic HTML elements
   - ARIA labels where needed
   - Alt text for images
   - Live regions for updates

3. COLOR CONTRAST
   - Minimum 4.5:1 for normal text
   - Minimum 3:1 for large text
   - Don't rely on color alone

4. MOTION PREFERENCES
   - Respect prefers-reduced-motion
   - Provide static alternatives
   - No auto-playing videos with sound

5. FORM ACCESSIBILITY
   - Associated labels
   - Error messages linked to inputs
   - Required field indicators
   - Clear validation feedback
```

---

# PART 6: TECHNICAL IMPLEMENTATION NOTES

---

## 6.1 Recommended Tech Stack

```
FRAMEWORK:
- Next.js 14+ (App Router)
- React 18+ with Server Components
- TypeScript (strict mode)

STYLING:
- Tailwind CSS 3.4+
- CSS Variables for theming
- Tailwind merge for class composition

STATE MANAGEMENT:
- Zustand for global state
- React Query for server state
- Context for theme/auth

ANIMATIONS:
- Framer Motion for React animations
- GSAP for complex scroll animations
- CSS transitions for micro-interactions

UI COMPONENTS:
- Radix UI primitives (accessible)
- shadcn/ui component patterns
- Custom components for unique features

CHARTS:
- Recharts for React charts
- D3 for custom visualizations

FORMS:
- React Hook Form
- Zod for validation
```

## 6.2 Performance Targets

```
CORE WEB VITALS:
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1
- TTFB (Time to First Byte): < 600ms

OPTIMIZATIONS:
- Image optimization (WebP, responsive)
- Code splitting by route
- Lazy load below-fold content
- Prefetch critical resources
- Service worker for caching
```

---

# PART 7: CONTENT & COPY

---

## 7.1 Key Messaging

```
TAGLINE OPTIONS:
- "Intelligent capital for the future of food."
- "Where food systems meet artificial intelligence."
- "Backing founders building intelligent food systems."

VALUE PROPOSITIONS:
1. Deep sector expertise in ag + AI
2. Proprietary pipeline into Canadian agriculture
3. AI-powered diligence and decision support
4. Founder-first, long-term partnership

DIFFERENTIATORS:
- Thesis-specific focus (not generalist)
- AI-native fund operations
- Canadian market advantage
- Technical team background
```

## 7.2 Agent Descriptions

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
"Generates thesis-aligned content for LinkedIn and LP updates. 
Maintains your brand voice while scaling your thought 
leadership output."

ORCHESTRATOR:
"The chief of staff layer that coordinates all agents into 
a unified system. One information flow, not five separate tools."
```

---

# APPENDIX: VISUAL REFERENCE INVENTORY

## A.1 Screenshot References

| ID | Source | Description | Usage |
|----|--------|-------------|-------|
| VC-01 | Sequoia Capital | Hero with animated text, colorful tiles | Public homepage hero |
| VC-02 | Radical Ventures | Minimalist layout, calm typography | Overall design restraint |
| VC-03 | USV | Grid structure, editorial content | Content organization |
| VC-04 | Atomico | Immersive imagery, video integration | Portfolio showcase |
| AI-01 | Mission Control | 32-panel dashboard, dark theme | Command center layout |
| AI-02 | AgentCenter | Agent status cards, activity feed | Agent management UI |
| AI-03 | Kubiya | Orchestration diagram | Agent flow visualization |
| DB-01 | Dribbble | Dark mode dashboard with charts | Analytics displays |
| DB-02 | Dribbble | Command center with metrics | Overview dashboard |

## A.2 Design Patterns to Emulate

1. **Sequoia's Motion Toggle**: Allow users to disable animations for performance
2. **Radical's Restraint**: Every element must earn its place
3. **USV's Grid Clarity**: Information hierarchy through spacing, not decoration
4. **Mission Control's Density**: Rich information without clutter
5. **AgentCenter's Real-Time**: Live updates that feel alive

---

*Document Version: 1.0*  
*Last Updated: March 2026*  
*Prepared for: Kimi Code (Antigravity)*
