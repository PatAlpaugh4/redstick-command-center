# Deployment Guide

## Overview

This guide covers deploying the Redstick Ventures Command Center to Vercel.

## Prerequisites

- Vercel account
- GitHub repository connected to Vercel
- Environment variables configured
- Database provisioned (Vercel Postgres or external)

## Vercel Deployment

### Automatic Deployments

1. Connect GitHub repo to Vercel
2. Configure build settings:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. Configure environment variables (see Environment Variables section)

4. Deploy:
   ```bash
   git push origin main
   # Vercel automatically deploys
   ```

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Preview Deployments

Every pull request gets a preview deployment:
- URL: `https://<project>-<branch>.vercel.app`
- Automatically updated on push

## Environment Variables

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` |
| `NEXTAUTH_SECRET` | Random secret for JWT | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | App URL | `https://redstick.vc` |

### Optional

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | API base URL | `/api` |
| `UPSTASH_REDIS_REST_URL` | Redis URL (caching) | - |
| `UPSTASH_REDIS_REST_TOKEN` | Redis token | - |

## Database Setup

### Option 1: Vercel Postgres

1. Create Postgres database in Vercel dashboard
2. Copy connection string to DATABASE_URL
3. Run migrations: `npx prisma migrate deploy`

### Option 2: External Postgres (Supabase, Railway, etc.)

1. Provision database
2. Add connection string to env vars
3. Whitelist Vercel IP addresses if needed
4. Run migrations

## Build Configuration

### next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static optimization where possible
  output: 'standalone',
  
  // Image optimization
  images: {
    domains: ['avatars.githubusercontent.com'],
  },
  
  // Experimental features
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

module.exports = nextConfig;
```

## Production Checklist

Before going live:
- [ ] Environment variables set
- [ ] Database migrated
- [ ] Build passes locally
- [ ] Tests passing
- [ ] Lighthouse score > 90
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Analytics enabled

## Domain Configuration

### Custom Domain

1. In Vercel dashboard: Settings → Domains
2. Add domain: `redstick.vc`
3. Configure DNS:
   - A Record: `76.76.21.21`
   - Or CNAME: `cname.vercel-dns.com`

### SSL

- Automatically provisioned by Vercel
- Auto-renews

## Monitoring

### Vercel Analytics

Built-in analytics dashboard shows:
- Page views
- Core Web Vitals
- Audience demographics

### Error Tracking

Configure error tracking (Sentry recommended):

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

## Rollback

### Via Vercel Dashboard

1. Go to Deployments
2. Find previous working deployment
3. Click "Promote to Production"

### Via CLI

```bash
vercel --prod --force
```

## Troubleshooting

### Build Failures

```bash
# Check build locally
npm run build

# Clear cache and retry
vercel --force
```

### Database Connection Issues

- Verify DATABASE_URL format
- Check IP whitelist
- Test connection locally
