# Workflow: Full-Stack Website Build

## Objective

Build a complete, production-ready website from a specification or design reference.

## Required Inputs

| Input | Description | Format |
|-------|-------------|--------|
| `spec` | Website specification or description | String/Markdown |
| `design` | Design reference (optional) | Image URL/File |
| `tech_stack` | Preferred technologies | Enum |
| `features` | Required features list | Array |
| `deploy_target` | Deployment platform | Enum (default: Vercel) |

## Tech Stack Options

| Option | Frontend | Backend | Database | Styling |
|--------|----------|---------|----------|---------|
| `nextjs-full` | Next.js 16 | API Routes | PostgreSQL | Tailwind |
| `react-express` | React 18 | Express.js | MongoDB | Tailwind |
| `static-html` | HTML/CSS/JS | None | None | CSS |
| `vue-nuxt` | Vue 3 | Nuxt | Supabase | Tailwind |

## Workflow Steps

### Step 1: Requirements Analysis

**Tool:** `rethink` (Kimi thinking mode)

Analyze specification and extract requirements:

```
Analyze the website specification and identify:
1. Page structure (home, about, contact, etc.)
2. Components needed (header, footer, cards, forms)
3. Data models and relationships
4. User flows and interactions
5. Third-party integrations
6. Performance requirements
7. Accessibility needs

Output: requirements.json
```

### Step 2: Design System Creation

**Tool:** `file_write`

Create design tokens and component library:

```
Generate:
1. Color palette (primary, secondary, accent, neutral)
2. Typography scale (fonts, sizes, weights)
3. Spacing system (4px base grid)
4. Component specifications (buttons, inputs, cards)
5. Breakpoints (mobile, tablet, desktop)
6. Animation guidelines

Output: design-system.md + tailwind.config.js
```

### Step 3: Database Schema Design

**Tool:** `file_write`

Design database schema:

```prisma
// schema.prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  // ...
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  // ...
}
```

### Step 4: Project Initialization

**Tool:** `shell_execute`

Initialize project with chosen stack:

```bash
# Next.js example
npx create-next-app@latest my-app --typescript --tailwind --eslint --app --src-dir

# React example
npm create vite@latest my-app -- --template react-ts
cd my-app && npm install
```

### Step 5: Component Development

**Tool:** `file_write` (multiple files)

Build components following atomic design:

```
Atoms:
- Button.tsx
- Input.tsx
- Card.tsx
- Badge.tsx

Molecules:
- FormField.tsx
- SearchBar.tsx
- NavItem.tsx

Organisms:
- Header.tsx
- Footer.tsx
- HeroSection.tsx
- FeatureGrid.tsx

Templates:
- PageLayout.tsx
- DashboardLayout.tsx
```

### Step 6: Page Development

**Tool:** `file_write`

Build pages:

```
Pages:
- page.tsx (Home)
- about/page.tsx
- contact/page.tsx
- dashboard/page.tsx
- login/page.tsx
- register/page.tsx
```

### Step 7: API Development

**Tool:** `file_write`

Build API routes:

```typescript
// app/api/users/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  // Implementation
}

export async function POST(request: Request) {
  // Implementation
}
```

### Step 8: Authentication

**Tool:** `file_write`

Implement auth system:

```typescript
// lib/auth.ts
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions = {
  providers: [
    CredentialsProvider({
      // Configuration
    })
  ]
}
```

### Step 9: Testing

**Tool:** `code_runner`

Write and run tests:

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Build verification
npm run build
```

### Step 10: Deployment

**Tool:** `shell_execute`

Deploy to target platform:

```bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod

# Railway
railway up
```

## Expected Outputs

| Output | Location | Description |
|--------|----------|-------------|
| Source code | `/output/my-app/` | Complete project |
| README.md | `/output/my-app/README.md` | Setup instructions |
| Design system | `/output/design-system.md` | Design documentation |
| Database schema | `/output/schema.prisma` | DB schema |
| Tests | `/output/my-app/__tests__/` | Test files |
| Deployed URL | Vercel/Netlify URL | Live website |

## Edge Cases

### Build Failure

**Issue:** TypeScript or build errors

**Solution:**
1. Check error logs
2. Fix type definitions
3. Update dependencies
4. Verify import paths

### Database Connection Failure

**Issue:** Can't connect to database

**Solution:**
1. Verify DATABASE_URL format
2. Check network access
3. Confirm credentials
4. Test with direct connection

### Deployment Failure

**Issue:** Build succeeds but deployment fails

**Solution:**
1. Check platform logs
2. Verify environment variables
3. Check build output settings
4. Confirm domain configuration

## Performance Considerations

- **Time:** 10-30 minutes depending on complexity
- **Tokens:** ~100K-500K for full website
- **Cost:** $0.30-1.50 depending on features
- **Parallelization:** Use Agent Swarm for component development

## Agent Swarm Optimization

```
Activate Agent Swarm with 6 agents:
1. Design Agent: Create design system
2. Frontend Agent 1: Build core components
3. Frontend Agent 2: Build page layouts
4. Backend Agent: Design API and database
5. Auth Agent: Implement authentication
6. Testing Agent: Write tests and verify

Coordination: Shared design system, parallel component development
```

## Improvements Log

| Date | Issue | Solution | Status |
|------|-------|----------|--------|
| 2024-01-10 | Slow builds | Added build caching | ✅ Fixed |
| 2024-01-25 | Type errors | Stricter type checking | ✅ Fixed |
| 2024-02-05 | Auth issues | Standardized auth flow | ✅ Improved |

## Usage Example

```python
from kimi_agent_sdk import prompt

async def build_website():
    async for msg in prompt("""
        Execute workflow: website-build
        Inputs:
        - spec: "Build a SaaS landing page with pricing, features, 
                 testimonials, and contact form"
        - tech_stack: "nextjs-full"
        - features: ["dark_mode", "responsive", "animations"]
        - deploy_target: "vercel"
    """, yolo=True):
        print(msg.extract_text())
```

## Success Criteria

- [ ] All pages built and functional
- [ ] Responsive on mobile, tablet, desktop
- [ ] Dark mode toggle works
- [ ] All forms validate and submit
- [ ] Authentication flows work
- [ ] Deployed and accessible via URL
- [ ] Lighthouse score > 90
