# Structured Data (Schema.org)

## Organization Schema
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Redstick Ventures",
  "url": "https://www.redstick.vc",
  "logo": "https://www.redstick.vc/logo.png",
  "sameAs": [
    "https://www.linkedin.com/company/redstick-ventures",
    "https://twitter.com/redstickvc"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-XXX-XXX-XXXX",
    "contactType": "customer support",
    "email": "support@redstick.vc"
  }
}
```

## SoftwareApplication Schema
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Redstick Command Center",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "127"
  },
  "description": "Venture capital deal flow and portfolio management platform with AI-powered insights.",
  "featureList": [
    "Deal pipeline management",
    "Portfolio analytics",
    "AI-powered screening",
    "LP reporting",
    "Team collaboration"
  ]
}
```

## WebSite Schema
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Redstick Command Center",
  "url": "https://www.redstick.vc",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.redstick.vc/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

## BreadcrumbList Schema
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://www.redstick.vc"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Pipeline",
      "item": "https://www.redstick.vc/pipeline"
    }
  ]
}
```

## FAQPage Schema
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Redstick Command Center?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Redstick Command Center is a venture capital management platform that helps VCs streamline deal flow, manage portfolios, and leverage AI-powered insights."
      }
    },
    {
      "@type": "Question",
      "name": "How do AI agents work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "AI agents are automated tools that screen deals, research markets, and monitor portfolios based on your investment criteria."
      }
    }
  ]
}
```

## Product Schema (for pricing page)
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Redstick Command Center",
  "description": "Venture capital management platform",
  "brand": {
    "@type": "Brand",
    "name": "Redstick Ventures"
  },
  "offers": [
    {
      "@type": "Offer",
      "name": "Starter",
      "price": "99",
      "priceCurrency": "USD",
      "priceValidUntil": "2024-12-31",
      "availability": "https://schema.org/InStock"
    }
  ]
}
```
