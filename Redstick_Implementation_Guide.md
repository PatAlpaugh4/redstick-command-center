# Redstick Ventures Website - Implementation Guide
## For Kimi Code (Antigravity Environment)

---

## Quick Start: Phase-Based Implementation

### Phase 1: Foundation (Week 1)
**Goal:** Public website shell + basic styling

**Prompt Sequence:**

```
PROMPT 1.1 - PROJECT SETUP:
"Create a new Next.js 14 project with TypeScript, Tailwind CSS, 
and shadcn/ui. Set up the folder structure for a dual-mode 
website (public + authenticated command center). Configure 
dark theme as default with the following color palette:
- Primary: #1a1a2e (deep navy)
- Accent: #e94560 (redstick red)
- Background: #0f0f1a (near-black)
- Surface: #1a1a2e
- Text: #ffffff (primary), #a0a0b0 (secondary)"
```

```
PROMPT 1.2 - DESIGN SYSTEM:
"Create a comprehensive design system file (design-system.ts) 
exporting:
- Color tokens
- Typography scale (Inter font family)
- Spacing system
- Border radius values
- Shadow definitions
- Animation presets

Also create CSS custom properties in globals.css and set up 
Tailwind config to use these tokens."
```

```
PROMPT 1.3 - LAYOUT SHELL:
"Create the root layout component with:
- Metadata configuration for Redstick Ventures
- Font loading (Inter from Google Fonts)
- Theme provider setup
- Global navigation component (responsive)
- Footer component

The navigation should have two states:
1. Public: Standard VC website nav (About, Thesis, Portfolio, Team, Contact)
2. Authenticated: Command Center button visible"
```

```
PROMPT 1.4 - HERO SECTION:
"Build the homepage hero section with:
- Full viewport height
- Animated headline text reveal (staggered lines)
- Eyebrow text: 'EARLY-STAGE VENTURE CAPITAL'
- Headline: 'We invest at the intersection of food systems, 
  agriculture, and artificial intelligence.'
- Subheadline about backing founders
- Two CTAs: 'Submit Your Deck' (primary) and 'Learn Our Thesis' (secondary)
- Subtle background animation (particles or gradient mesh)

Use Framer Motion for text animations with the specified easing."
```

---

### Phase 2: Public Website (Week 1-2)
**Goal:** Complete public-facing pages

```
PROMPT 2.1 - ABOUT SECTION:
"Create the About/Firm Story section with:
- Two-column layout (text left, visual right)
- Section label 'ABOUT REDSTICK'
- Headline about the firm's mission
- Paragraphs explaining:
  * Fund II focus on food systems + AI
  * Deep sector conviction
  * Canadian agriculture pipeline advantage
  * Team background
- Key stats display (animated count-up)
- Team member highlight cards"
```

```
PROMPT 2.2 - INVESTMENT THESIS:
"Build the Investment Thesis section:
- Section header with 'OUR THESIS' label
- Headline: 'The Future of Food is Intelligent'
- Three-pillar explanation:
  1. Food systems transformation opportunity
  2. AI/ML enabling new capabilities
  3. Canadian market advantages
- Interactive diagram showing the intersection
- Key statistics with animated counters
- Download thesis PDF button"
```

```
PROMPT 2.3 - PORTFOLIO SHOWCASE:
"Create portfolio grid section:
- Filter tabs: All, Agriculture, Food Tech, AI/ML, Supply Chain
- Responsive grid (3 cols desktop, 2 tablet, 1 mobile)
- Company cards with:
  * Logo on brand-colored background
  * Hover overlay with description
  * Stage and sector tags
  * Link to company
- Smooth filter transitions
- Load more pagination"
```

```
PROMPT 2.4 - TEAM SECTION:
"Build team member showcase:
- Grid layout for team cards
- Each card: Photo, name, title, brief bio, social links
- Photo treatment: Consistent filter (B&W or duotone)
- Hover effects on cards
- Click to expand full bio (modal or drawer)"
```

```
PROMPT 2.5 - DECK SUBMISSION FORM:
"Create founder deck submission page:
- Two-column layout (form left, info right)
- Form fields:
  * Company name (required)
  * Founder name (required)
  * Email (required, validated)
  * Website (optional)
  * Stage select (pre-seed, seed, series A, other)
  * Sector select (agriculture, food tech, AI/ML, supply chain, other)
  * Elevator pitch textarea
  * Deck upload (PDF, max 20MB)
  * How did you hear about us?
- Real-time validation
- Submit with loading state
- Success confirmation page"
```

```
PROMPT 2.6 - CONTACT & FOOTER:
"Complete contact page and global footer:
- Contact form (name, email, message)
- Office address and contact info
- Social media links
- Global footer with site links, social icons, copyright"
```

---

### Phase 3: Command Center Shell (Week 2)
**Goal:** Authenticated dashboard layout and navigation

```
PROMPT 3.1 - AUTHENTICATION SETUP:
"Set up authentication system:
- Login page with email/password
- Protected route middleware
- Mock auth provider (can be replaced later)
- User context for auth state
- Logout functionality"
```

```
PROMPT 3.2 - COMMAND CENTER LAYOUT:
"Create the Command Center shell layout:
- Full-height layout (100vh)
- Collapsible left sidebar (280px expanded, 72px collapsed)
- Fixed top header (64px)
- Scrollable main content area
- Right detail panel (320px, collapsible)

Sidebar navigation sections:
- MAIN: Dashboard, AI Agents, Pipeline, Portfolio
- INTELLIGENCE: LP Research, Market Signals, Content Studio
- SYSTEM: Settings, Help, Logout

Include collapse/expand toggle and responsive behavior 
(bottom tabs on mobile)."
```

```
PROMPT 3.3 - DASHBOARD OVERVIEW:
"Build the main dashboard overview:
- Welcome header with user name
- Stats cards row (4 cards):
  * Active Agents count
  * Tasks Completed Today
  * Pipeline Deals
  * Portfolio Health Score
- Recent activity feed (last 10 items)
- Quick action buttons
- System status indicator"
```

---

### Phase 4: AI Agent Management (Week 2-3)
**Goal:** Core agent management features

```
PROMPT 4.1 - AGENT GRID:
"Create the AI Agent management grid:
- Responsive grid of agent cards (3 cols desktop)
- Each agent card shows:
  * Agent icon/avatar (unique per type)
  * Agent name (Scout, Quill, LP Research, Screening, Content)
  * Status badge (Active, Idle, Paused, Error)
  * Current task or last activity
  * Progress bar if running
  * Quick action buttons (pause/resume, view logs)
  * Toggle for auto-run

Include visual status indicators:
- Green pulsing dot for active
- Amber for paused
- Red for error
- Blue for idle

Cards should be draggable for reordering."
```

```
PROMPT 4.2 - AGENT DETAIL PANEL:
"Build agent detail slide-out panel:
- Full configuration view
- Activity log (scrollable, timestamped)
- Performance metrics (charts)
- Settings/parameters form
- Test/run button
- Delete/disable options

Include tabs: Overview, Logs, Performance, Settings"
```

```
PROMPT 4.3 - ACTIVITY FEED:
"Create real-time activity feed component:
- Scrollable list of activity items
- Each item shows:
  * Icon (based on activity type)
  * Description with highlighted entities
  * Timestamp (relative)
  * Agent attribution
- Filter by activity type
- Real-time updates with new items sliding in
- 'Load more' for history

Activity types: IC Memo, Deal Screened, LP Alert, 
News Detected, Task Complete, Error"
```

```
PROMPT 4.4 - AGENT ORCHESTRATION VISUALIZER:
"Build agent flow visualizer:
- Node-based diagram showing agent interactions
- Orchestrator at center
- Data flow animations between nodes
- Click nodes for details
- Play/pause animation control
- Zoom and pan capabilities

Show: Scout → Orchestrator → Quill → Output
      ↓
   LP Research → Content Agent"
```

---

### Phase 5: Deal Pipeline (Week 3)
**Goal:** Pipeline management interface

```
PROMPT 5.1 - KANBAN BOARD:
"Create deal pipeline Kanban board:
- Horizontal scrollable columns
- 5 stages: Inbound, Screening, Diligence, IC Review, Decision
- Each column has deal cards
- Drag and drop between columns
- Column headers with deal count

Deal card content:
- Company name
- Stage badge
- Sector tag
- Source indicator
- Assigned partner avatar
- Days in stage

Include quick filters and search."
```

```
PROMPT 5.2 - DEAL DETAIL DRAWER:
"Build deal detail slide-out panel:
- Company overview
- IC memo preview
- Activity history
- Documents list
- Partner notes
- Stage change buttons
- Related deals"
```

---

### Phase 6: Portfolio & LP Intelligence (Week 3-4)
**Goal:** Portfolio monitoring and LP research

```
PROMPT 6.1 - PORTFOLIO DASHBOARD:
"Create portfolio monitoring dashboard:
- Overview stats (total companies, TVPI, DPI)
- Portfolio grid with company cards
- Company card: logo, name, valuation, growth, health status
- Attention required section (red status companies)
- Performance charts (IRR, revenue growth)
- Generate report button"
```

```
PROMPT 6.2 - LP INTELLIGENCE FEED:
"Build LP intelligence interface:
- Filter sidebar (LP type, geography, signals)
- Intelligence cards in main area
- Each card: LP name, signal type, description, 
  relevance score, date, actions
- Detail panel for LP profiles
- FCC tracking section with countdown

Signal types: New Mandate, Personnel Change, 
RFP Released, Portfolio Announcement"
```

---

### Phase 7: Content Studio & Polish (Week 4)
**Goal:** Content generation and final polish

```
PROMPT 7.1 - CONTENT STUDIO:
"Create content generation interface:
- Three-panel layout
- Left: Content type selector (LinkedIn, LP Update, Blog)
- Center: Editor with AI-generated draft
- Right: Context panel (topic, tone, key points)
- Generate, edit, schedule workflow
- Content queue view
- Performance tracking"
```

```
PROMPT 7.2 - SETTINGS:
"Build comprehensive settings:
- Agent configuration
- Notification preferences
- Integrations (Otter, CRM, etc.)
- Team management
- Billing/usage
- Appearance (theme, density)
- Import/export"
```

```
PROMPT 7.3 - SEARCH & COMMAND PALETTE:
"Implement global search:
- Cmd/Ctrl+K trigger
- Modal with search input
- Categorized results (agents, deals, companies, LPs)
- Recent searches
- Action commands
- Keyboard navigation"
```

```
PROMPT 7.4 - ANIMATIONS & POLISH:
"Add final animations and polish:
- Scroll-triggered section reveals
- Card hover effects
- Button micro-interactions
- Loading states and skeletons
- Toast notifications
- Page transitions
- Reduced motion support"
```

---

## Implementation Checklist

### Pre-Implementation
- [ ] Review all design references
- [ ] Set up development environment
- [ ] Initialize project repository
- [ ] Configure deployment pipeline

### Phase 1: Foundation
- [ ] Project setup complete
- [ ] Design system implemented
- [ ] Layout shell working
- [ ] Hero section animated

### Phase 2: Public Website
- [ ] All public pages created
- [ ] Content populated
- [ ] Forms functional
- [ ] Responsive design verified

### Phase 3: Command Center
- [ ] Authentication working
- [ ] Sidebar navigation functional
- [ ] Dashboard overview complete
- [ ] Mobile responsive

### Phase 4: AI Agents
- [ ] Agent grid displaying
- [ ] Status indicators working
- [ ] Detail panels functional
- [ ] Activity feed updating

### Phase 5: Pipeline
- [ ] Kanban board working
- [ ] Drag and drop functional
- [ ] Deal details accessible

### Phase 6: Portfolio & LP
- [ ] Portfolio dashboard complete
- [ ] LP intelligence feed working
- [ ] Charts and visualizations rendering

### Phase 7: Polish
- [ ] Content studio functional
- [ ] Settings complete
- [ ] Search implemented
- [ ] All animations added
- [ ] Accessibility verified
- [ ] Performance optimized

---

## Testing Checklist

### Functionality
- [ ] All navigation links work
- [ ] Forms submit correctly
- [ ] Authentication flow works
- [ ] Agent status updates
- [ ] Pipeline drag and drop
- [ ] Search returns results

### Responsive
- [ ] Mobile layout correct
- [ ] Tablet layout correct
- [ ] Desktop layout correct
- [ ] Touch targets adequate
- [ ] No horizontal scroll

### Accessibility
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Color contrast adequate
- [ ] Screen reader compatible
- [ ] Reduced motion respected

### Performance
- [ ] LCP under 2.5s
- [ ] No layout shift
- [ ] Images optimized
- [ ] Animations smooth (60fps)

---

## Deployment Notes

### Environment Variables Required:
```
NEXT_PUBLIC_APP_URL=
DATABASE_URL=
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
OPENAI_API_KEY=
SLACK_WEBHOOK_URL=
```

### Build Commands:
```bash
# Development
npm run dev

# Production build
npm run build

# Start production
npm start
```

### Recommended Hosting:
- Vercel (optimal for Next.js)
- Environment: Node.js 18+

---

*This guide provides a structured approach to implementing the Redstick Ventures website. Each prompt can be fed directly into Kimi Code for implementation.*
