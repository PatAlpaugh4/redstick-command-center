# Monitoring and Alerting

## Overview
This document describes the monitoring and alerting setup for the Redstick Ventures Command Center.

## Vercel Analytics

### Built-in Monitoring
Vercel provides built-in analytics for all deployments:

- **Web Analytics**: Page views, visitors, bounce rate
- **Performance**: Core Web Vitals (LCP, FID, CLS)
- **Audience**: Device types, browsers, locations

### Enabling Analytics
```bash
# Install Vercel Analytics
npm install @vercel/analytics

# Add to layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

## Error Tracking with Sentry

### Installation
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### Configuration
The wizard automatically creates:
- `sentry.client.config.js`
- `sentry.server.config.js`
- `sentry.edge.config.js`

### Environment Variables
```bash
SENTRY_DSN=your_sentry_dsn
SENTRY_ENVIRONMENT=production
```

## Performance Monitoring

### Custom Metrics
Track custom business metrics:

```typescript
// lib/metrics.ts
import { metrics } from '@vercel/analytics';

export function trackDealCreated(dealValue: number) {
  metrics.track('deal_created', {
    value: dealValue,
    currency: 'USD',
  });
}

export function trackInvestorSignup(investorType: string) {
  metrics.track('investor_signup', {
    type: investorType,
  });
}
```

## Health Checks

### API Health Endpoint
```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.VERCEL_GIT_COMMIT_SHA || 'dev',
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'unhealthy', error: error.message },
      { status: 503 }
    );
  }
}
```

## Alerting

### Sentry Alerts
Configure alerts in Sentry dashboard:

1. **Error Rate Alert**
   - Trigger: > 5% error rate for 5 minutes
   - Action: Email + Slack notification

2. **New Issue Alert**
   - Trigger: New error type detected
   - Action: Email notification

3. **Performance Degradation**
   - Trigger: P95 latency > 2s for 10 minutes
   - Action: Slack notification

### Uptime Monitoring
Using an external service (UptimeRobot or Pingdom):

```
URL: https://redstick.vc/api/health
Interval: 5 minutes
Expected response: {"status":"healthy"}
```

### Slack Integration
```bash
# Set webhook URL
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...

# Alert on deployment
vercel --prod && curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"🚀 Deployment to production successful"}' \
  $SLACK_WEBHOOK_URL
```

## Log Management

### Vercel Logs
Access logs via:
- Vercel Dashboard → Deployments → Logs
- Vercel CLI: `vercel logs --json`

### Structured Logging
```typescript
// lib/logger.ts
export const logger = {
  info: (message: string, meta?: Record<string, unknown>) => {
    console.log(JSON.stringify({ level: 'info', message, ...meta, timestamp: new Date().toISOString() }));
  },
  error: (message: string, error: Error, meta?: Record<string, unknown>) => {
    console.error(JSON.stringify({ 
      level: 'error', 
      message, 
      error: error.message,
      stack: error.stack,
      ...meta, 
      timestamp: new Date().toISOString() 
    }));
  },
};
```

## Dashboard

### Key Metrics to Monitor
| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Uptime | 99.9% | < 99% |
| LCP | < 2.5s | > 4s |
| Error Rate | < 0.1% | > 1% |
| API P95 Latency | < 500ms | > 1s |
| Database Connections | < 80% | > 90% |

## Runbooks

### High Error Rate
1. Check Sentry for error details
2. Review recent deployments
3. Check Vercel status page
4. Consider rollback if needed

### Database Connection Issues
1. Check DATABASE_URL env var
2. Verify connection pool limits
3. Check database server status
4. Review connection leak in code

### Slow Performance
1. Check Vercel Analytics for slow pages
2. Review database query performance
3. Check third-party API latencies
4. Enable Next.js static generation where possible
