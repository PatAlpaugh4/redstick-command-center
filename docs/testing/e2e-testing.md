# E2E Testing Guide

## Overview

End-to-End (E2E) tests verify that critical user flows work correctly from start to finish. We use Playwright for E2E testing due to its speed, reliability, and modern API.

## Philosophy

> "E2E tests should verify critical user journeys, not every possible interaction."

### When to Write E2E Tests

✅ **Write E2E tests for:**
- Authentication flows (login, logout, registration)
- Critical business operations (create deal, update pipeline)
- Payment/financial transactions
- Multi-step workflows
- Cross-page navigation

❌ **Don't write E2E tests for:**
- Pure UI components (use component tests)
- Utility functions (use unit tests)
- Edge cases already covered by unit tests
- Third-party integrations (mock these)

## Setup

### Installation

```bash
# Install Playwright
npm install -D @playwright/test

# Install browsers
npx playwright install

# Install additional dependencies
npm install -D @faker-js/faker   # For generating test data
```

### Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['list'],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Project Structure

```
e2e/
├── fixtures/
│   └── test-data.ts         # Test data factories
├── helpers/
│   ├── auth.ts              # Authentication helpers
│   ├── navigation.ts        # Navigation helpers
│   └── selectors.ts         # Common selectors
├── pages/
│   ├── LoginPage.ts         # Page Object Models
│   ├── DashboardPage.ts
│   └── PipelinePage.ts
├── specs/
│   ├── auth.spec.ts
│   ├── dashboard.spec.ts
│   └── pipeline.spec.ts
└── global-setup.ts          # Global test setup
```

## Writing Tests

### Basic Test Structure

```typescript
// e2e/specs/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('user can login with valid credentials', async ({ page }) => {
    // Arrange
    await page.fill('[name="email"]', 'user@example.com');
    await page.fill('[name="password"]', 'password123');
    
    // Act
    await page.click('button[type="submit"]');
    
    // Assert
    await expect(page).toHaveURL('/app/dashboard');
    await expect(page.locator('text=Welcome back')).toBeVisible();
  });

  test('shows error for invalid credentials', async ({ page }) => {
    await page.fill('[name="email"]', 'invalid@example.com');
    await page.fill('[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Invalid credentials')).toBeVisible();
    await expect(page).toHaveURL('/login');
  });

  test('validates required fields', async ({ page }) => {
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();
  });
});
```

### Page Object Model Pattern

```typescript
// e2e/pages/LoginPage.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('[name="email"]');
    this.passwordInput = page.locator('[name="password"]');
    this.submitButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('[role="alert"]');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectError(message: string) {
    await expect(this.errorMessage).toContainText(message);
  }
}

// Usage in tests
import { test } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

test('user can login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('user@example.com', 'password123');
  await expect(page).toHaveURL('/app/dashboard');
});
```

### Component-Specific Page Objects

```typescript
// e2e/pages/PipelinePage.ts
import { Page, Locator } from '@playwright/test';

export class PipelinePage {
  readonly page: Page;
  readonly addDealButton: Locator;
  readonly dealCards: Locator;
  readonly stageColumns: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addDealButton = page.locator('button:has-text("Add Deal")');
    this.dealCards = page.locator('[data-testid="deal-card"]');
    this.stageColumns = page.locator('[data-testid="stage-column"]');
  }

  async goto() {
    await this.page.goto('/app/pipeline');
  }

  async addDeal(dealData: { name: string; amount: string; stage: string }) {
    await this.addDealButton.click();
    await this.page.fill('[name="companyName"]', dealData.name);
    await this.page.fill('[name="amount"]', dealData.amount);
    await this.page.selectOption('[name="stage"]', dealData.stage);
    await this.page.click('button:has-text("Create")');
  }

  async getDealCountInStage(stageName: string): Promise<number> {
    const column = this.page.locator(`[data-stage="${stageName}"]`);
    return await column.locator('[data-testid="deal-card"]').count();
  }

  async moveDealToStage(dealName: string, targetStage: string) {
    const deal = this.page.locator(`[data-testid="deal-card"]:has-text("${dealName}")`);
    const targetColumn = this.page.locator(`[data-stage="${targetStage}"]`);
    
    await deal.dragTo(targetColumn);
  }
}
```

## Common Test Patterns

### Authentication Helper

```typescript
// e2e/helpers/auth.ts
import { Page } from '@playwright/test';

export async function login(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.fill('[name="email"]', email);
  await page.fill('[name="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL('/app/dashboard');
}

export async function logout(page: Page) {
  await page.click('[data-testid="user-menu"]');
  await page.click('text=Logout');
  await page.waitForURL('/login');
}

// Usage in tests
test.describe('Authenticated Routes', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, 'user@example.com', 'password123');
  });

  test('can access dashboard', async ({ page }) => {
    await page.goto('/app/dashboard');
    await expect(page.locator('h1')).toContainText('Dashboard');
  });
});
```

### Test Data Factories

```typescript
// e2e/fixtures/test-data.ts
import { faker } from '@faker-js/faker';

export function createDeal(overrides = {}) {
  return {
    companyName: faker.company.name(),
    amount: faker.number.int({ min: 100000, max: 10000000 }),
    stage: faker.helpers.arrayElement(['INBOUND', 'NEGOTIATION', 'CLOSED']),
    contactEmail: faker.internet.email(),
    ...overrides,
  };
}

export function createUser(overrides = {}) {
  return {
    email: faker.internet.email(),
    password: faker.internet.password({ length: 12 }),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    ...overrides,
  };
}

// Usage in tests
test('can create deal with generated data', async ({ page }) => {
  const deal = createDeal({ stage: 'INBOUND' });
  
  await pipelinePage.addDeal({
    name: deal.companyName,
    amount: deal.amount.toString(),
    stage: deal.stage,
  });
  
  await expect(page.locator(`text=${deal.companyName}`)).toBeVisible();
});
```

### API Integration Helpers

```typescript
// e2e/helpers/api.ts
import { APIRequestContext } from '@playwright/test';

export async function createDealViaAPI(
  request: APIRequestContext, 
  dealData: object
) {
  const response = await request.post('/api/deals', {
    data: dealData,
    headers: {
      'Authorization': `Bearer ${process.env.TEST_API_TOKEN}`,
    },
  });
  
  expect(response.ok()).toBeTruthy();
  return await response.json();
}

export async function cleanupTestDeals(request: APIRequestContext) {
  const response = await request.delete('/api/deals?test=true', {
    headers: {
      'Authorization': `Bearer ${process.env.TEST_API_TOKEN}`,
    },
  });
  
  expect(response.ok()).toBeTruthy();
}
```

## Critical User Flows

### Deal Creation Flow

```typescript
// e2e/specs/deal-creation.spec.ts
test.describe('Deal Creation Flow', () => {
  test('complete deal creation process', async ({ page }) => {
    // Login
    await login(page, 'vc@firm.com', 'password');
    
    // Navigate to pipeline
    await page.goto('/app/pipeline');
    
    // Open deal creation modal
    await page.click('button:has-text("Add Deal")');
    
    // Fill deal information
    await page.fill('[name="companyName"]', 'Acme Corp');
    await page.fill('[name="website"]', 'https://acme.com');
    await page.fill('[name="contactName"]', 'John Doe');
    await page.fill('[name="contactEmail"]', 'john@acme.com');
    await page.fill('[name="amount"]', '5000000');
    await page.selectOption('[name="stage"]', 'INBOUND');
    
    // Submit form
    await page.click('button:has-text("Create Deal")');
    
    // Verify deal appears in pipeline
    await expect(page.locator('text=Acme Corp')).toBeVisible();
    await expect(page.locator('text=$5.0M')).toBeVisible();
    
    // Verify success notification
    await expect(page.locator('text=Deal created successfully')).toBeVisible();
  });
});
```

### Deal Pipeline Management

```typescript
// e2e/specs/pipeline.spec.ts
test.describe('Pipeline Management', () => {
  test('can move deal between stages', async ({ page }) => {
    // Setup: Create a deal via API
    const deal = await createDealViaAPI(request, {
      companyName: 'Move Test Co',
      stage: 'INBOUND',
    });
    
    await login(page, 'vc@firm.com', 'password');
    await page.goto('/app/pipeline');
    
    // Drag deal to different stage
    const dealCard = page.locator(`[data-deal-id="${deal.id}"]`);
    const negotiationColumn = page.locator('[data-stage="NEGOTIATION"]');
    
    await dealCard.dragTo(negotiationColumn);
    
    // Verify deal moved
    await expect(
      negotiationColumn.locator(`[data-deal-id="${deal.id}"]`)
    ).toBeVisible();
    
    // Verify stage change persisted after refresh
    await page.reload();
    await expect(
      negotiationColumn.locator(`text=${deal.companyName}`)
    ).toBeVisible();
  });
});
```

### Dashboard Data Verification

```typescript
// e2e/specs/dashboard.spec.ts
test.describe('Dashboard', () => {
  test('displays correct portfolio metrics', async ({ page }) => {
    await login(page, 'vc@firm.com', 'password');
    await page.goto('/app/dashboard');
    
    // Verify portfolio value
    const portfolioValue = await page.locator('[data-testid="portfolio-value"]').textContent();
    expect(portfolioValue).toMatch(/\$[\d,]+M/);
    
    // Verify deal counts
    await expect(page.locator('text=Active Deals')).toBeVisible();
    const activeDealsCount = await page.locator('[data-testid="active-deals-count"]').textContent();
    expect(parseInt(activeDealsCount)).toBeGreaterThanOrEqual(0);
    
    // Verify chart is rendered
    await expect(page.locator('[data-testid="performance-chart"]')).toBeVisible();
  });
});
```

## Visual Testing

```typescript
// e2e/specs/visual.spec.ts
test.describe('Visual Regression', () => {
  test('dashboard matches screenshot', async ({ page }) => {
    await login(page, 'vc@firm.com', 'password');
    await page.goto('/app/dashboard');
    
    // Wait for all content to load
    await page.waitForSelector('[data-testid="portfolio-value"]');
    
    // Compare screenshot
    await expect(page).toHaveScreenshot('dashboard.png', {
      fullPage: true,
    });
  });

  test('modal screenshot', async ({ page }) => {
    await login(page, 'vc@firm.com', 'password');
    await page.goto('/app/pipeline');
    
    await page.click('button:has-text("Add Deal")');
    
    // Wait for modal animation
    await page.waitForTimeout(300);
    
    await expect(page).toHaveScreenshot('deal-modal.png');
  });
});
```

## Accessibility Testing

```typescript
// e2e/specs/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('dashboard has no violations', async ({ page }) => {
    await login(page, 'vc@firm.com', 'password');
    await page.goto('/app/dashboard');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('[data-testid="main-content"]')
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('keyboard navigation works', async ({ page }) => {
    await login(page, 'vc@firm.com', 'password');
    await page.goto('/app/pipeline');
    
    // Tab through interactive elements
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toHaveAttribute('data-testid', 'add-deal-button');
    
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toHaveAttribute('data-testid', 'filter-button');
  });
});
```

## Test Isolation

```typescript
// e2e/global-setup.ts
import { FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  // Create test database
  // Seed test data
  // Set up test environment
}

export default globalSetup;

// e2e/global-teardown.ts
async function globalTeardown(config: FullConfig) {
  // Clean up test data
  // Drop test database
}

export default globalTeardown;
```

## Running Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run with UI mode
npm run test:e2e:ui

# Run specific test file
npx playwright test auth.spec.ts

# Run specific test
npx playwright test -g "user can login"

# Run on specific project
npx playwright test --project=chromium

# Debug mode
npx playwright test --debug

# Run with trace viewer
npx playwright test --trace on
npx playwright show-trace trace.zip
```

## CI/CD Integration

```yaml
# .github/workflows/e2e.yml
name: E2E Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: npm run test:e2e
        env:
          BASE_URL: ${{ secrets.STAGING_URL }}
          TEST_API_TOKEN: ${{ secrets.TEST_API_TOKEN }}
      
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

## Best Practices

### ✅ DO
- [ ] Use Page Object Model for maintainability
- [ ] Test critical user journeys only
- [ ] Keep tests independent
- [ ] Use data-testid for stable selectors
- [ ] Clean up test data after tests
- [ ] Run tests in parallel when possible
- [ ] Use API for test setup/teardown

### ❌ DON'T
- [ ] Test implementation details
- [ ] Rely on timing/sleep
- [ ] Share state between tests
- [ ] Test third-party services directly
- [ ] Write tests for every UI interaction
