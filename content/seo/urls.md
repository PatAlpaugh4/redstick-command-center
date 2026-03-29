# URL Structure

## URL Guidelines
- Use lowercase letters
- Use hyphens (-) to separate words
- Keep URLs concise and descriptive
- Avoid unnecessary parameters
- Use HTTPS

## Canonical URLs

### Public Pages
| Page | URL |
|------|-----|
| Home | https://www.redstick.vc/ |
| About | https://www.redstick.vc/about |
| Pricing | https://www.redstick.vc/pricing |
| Contact | https://www.redstick.vc/contact |
| Blog | https://www.redstick.vc/blog |
| Help | https://www.redstick.vc/help |
| Privacy | https://www.redstick.vc/privacy |
| Terms | https://www.redstick.vc/terms |

### App Pages (Noindex)
| Page | URL |
|------|-----|
| Login | https://app.redstick.vc/login |
| Dashboard | https://app.redstick.vc/dashboard |
| Pipeline | https://app.redstick.vc/pipeline |
| Companies | https://app.redstick.vc/companies |
| Agents | https://app.redstick.vc/agents |
| Analytics | https://app.redstick.vc/analytics |
| Settings | https://app.redstick.vc/settings |

### Dynamic URLs
| Page Pattern | Example |
|--------------|---------|
| Deal Detail | /deals/[deal-id] |
| Company Detail | /companies/[company-id] |
| Agent Detail | /agents/[agent-id] |
| Blog Post | /blog/[slug] |
| Help Article | /help/[category]/[article] |

## URL Redirects
| From | To | Type |
|------|-----|------|
| /app | /app/dashboard | 301 |
| /home | / | 301 |
| /product | / | 301 |
| /features | /#features | 301 |

## Slug Conventions

### Blog Posts
Format: `[primary-keyword]-[context]`
Example: `vc-deal-flow-management-guide`

### Help Articles
Format: `[action]-[topic]`
Example: `create-first-deal`, `understanding-portfolio-metrics`

### Landing Pages
Format: `[use-case]`
Example: `ai-deal-screening`, `lp-reporting`

## Sitemap Structure
```
/sitemap.xml (index)
├── /sitemap-pages.xml (static pages)
├── /sitemap-blog.xml (blog posts)
├── /sitemap-help.xml (help articles)
└── /sitemap-deals.xml (if public - optional)
```

## Robots.txt
```
User-agent: *
Allow: /
Disallow: /app/
Disallow: /api/
Disallow: /_next/
Disallow: /static/

Sitemap: https://www.redstick.vc/sitemap.xml
```
