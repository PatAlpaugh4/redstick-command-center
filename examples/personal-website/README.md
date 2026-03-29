# Personal Portfolio Website

A modern, responsive personal portfolio website built with HTML, CSS, and JavaScript.

## Features

- 📱 Fully responsive design (mobile, tablet, desktop)
- 🎨 Modern UI with smooth animations
- ⚡ Fast loading with optimized CSS
- 🌙 Clean, professional design
- 📧 Working contact form (frontend)
- 🔗 Social media links
- 📊 Skills with animated progress bars
- 🖼️ Project showcase section

## File Structure

```
personal-website/
├── index.html      # Main HTML structure
├── styles.css      # All styling (responsive, animations)
├── main.js         # Interactive functionality
└── README.md       # This file
```

## Quick Start

1. **Open the website:**
   Simply open `index.html` in your browser:
   ```bash
   # On macOS
   open index.html
   
   # On Windows
   start index.html
   
   # On Linux
   xdg-open index.html
   ```

2. **Or use a local server (recommended):**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (if you have npx)
   npx serve .
   ```
   Then visit `http://localhost:8000`

## Customization

### Update Personal Information

Edit `index.html` to customize:

```html
<!-- Hero Section -->
<h1 class="hero-title">Your Name</h1>
<p class="hero-subtitle">Your Title</p>

<!-- About Section -->
<div class="about-text">
    <p>Your bio here...</p>
</div>

<!-- Contact Section -->
<p>your.email@example.com</p>
<p>Your Location</p>
```

### Change Colors

Edit CSS variables in `styles.css`:

```css
:root {
    --primary-color: #6366f1;    /* Change to your brand color */
    --secondary-color: #8b5cf6;  /* Accent color */
    /* ... other variables */
}
```

### Add Projects

Add new project cards in the Projects section:

```html
<div class="project-card">
    <div class="project-image">
        <div class="project-placeholder">
            <i class="fas fa-your-icon"></i>
        </div>
    </div>
    <div class="project-content">
        <h3>Project Name</h3>
        <p>Project description...</p>
        <div class="project-tags">
            <span class="tag">Tech1</span>
            <span class="tag">Tech2</span>
        </div>
    </div>
</div>
```

## Deployment

### GitHub Pages
1. Push to a GitHub repository
2. Go to Settings → Pages
3. Select source branch (main)
4. Your site will be live at `https://yourusername.github.io/repo-name`

### Netlify
1. Drag and drop your folder to [Netlify Drop](https://app.netlify.com/drop)
2. Get an instant live URL

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow prompts to deploy

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Credits

- Icons: [Font Awesome](https://fontawesome.com)
- Fonts: [Google Fonts - Inter](https://fonts.google.com/specimen/Inter)
