# Static Site Template

A simple static site generator pattern for building fast, lightweight websites. No frameworks, no dependencies in production.

## Features

- **Markdown Support** - Write content in Markdown
- **Template Partials** - Reusable header, footer, navigation
- **Frontmatter** - Metadata for each page
- **Asset Pipeline** - Automatic asset copying
- **Fast Builds** - Simple Node.js build script
- **Zero Runtime** - Pure static HTML output

## Quick Start

```bash
# Install dependencies
npm install

# Build the site
npm run build

# Serve locally
npm run serve

# Watch for changes (development)
npm run watch
```

## Project Structure

```
static-site-template/
├── src/
│   ├── content/           # Page content (Markdown/HTML)
│   ├── templates/         # HTML templates
│   │   ├── partials/      # Reusable components
│   │   └── default.html   # Default layout
│   ├── assets/            # Static assets
│   │   ├── css/
│   │   ├── js/
│   │   └── images/
│   └── styles/            # Source styles (optional)
├── scripts/
│   └── build.js           # Build script
├── dist/                  # Output directory
└── package.json
```

## Creating Pages

### 1. Add Content

Create a Markdown file in `src/content/`:

```markdown
---
title: My Page
description: A description of my page
---

# My Page

This is my page content written in **Markdown**.
```

### 2. Use Templates

Templates use `{{ variable }}` syntax:

```html
<!-- src/templates/default.html -->
<!DOCTYPE html>
<html>
<head>
  <title>{{ title }}</title>
  <meta name="description" content="{{ description }}">
</head>
<body>
  {{ partial:header }}
  <main>{{ content }}</main>
  {{ partial:footer }}
</body>
</html>
```

### 3. Include Partials

Create reusable components in `src/templates/partials/`:

```html
<!-- src/templates/partials/header.html -->
<header>
  <nav>
    <a href="/">Home</a>
    <a href="/about.html">About</a>
  </nav>
</header>
```

## Available Variables

| Variable | Description |
|----------|-------------|
| `{{ title }}` | Page title from frontmatter |
| `{{ description }}` | Page description |
| `{{ content }}` | Main content (HTML) |
| `{{ partial:name }}` | Include partial template |

## Kimi Prompts

### Add New Page
```
Create a new page called "contact" with a contact form.
Add it to src/content/contact.md with appropriate frontmatter.
```

### Add New Partial
```
Create a navigation partial at src/templates/partials/nav.html.
Include links to Home, About, and Contact pages.
```

### Customize Styles
```
Update the CSS in src/assets/css/styles.css.
Add a modern, clean design with responsive breakpoints.
```

## Deployment

The `dist/` folder contains your static site. Deploy to:

- **Netlify**: Drag and drop `dist/` folder
- **Vercel**: `vercel --prod dist`
- **GitHub Pages**: Push `dist/` to `gh-pages` branch
- **Any static host**: Upload `dist/` contents

## License

MIT License - Free for personal and commercial use.

---

Built with ❤️ by Kimi Code
