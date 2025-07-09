# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a professional portfolio website for mtbonde.dev built as a static site with modern web standards. The site showcases development and DevOps projects with a focus on clean, accessible design.

## Architecture

**Static Site Structure:**
- Vanilla HTML5, CSS3, and JavaScript (no frameworks)
- Responsive design with mobile-first approach
- Dark/light theme toggle with CSS custom properties
- Professional portfolio layout with separate pages

**File Structure:**
```
portfolio/
├── templates/
│   ├── index.html      # Homepage with hero, featured projects, skills
│   ├── about.html      # Personal approach and work philosophy  
│   ├── projects.html   # Detailed project showcase (10 projects)
│   ├── contact.html    # Contact form with formsubmit.co integration
│   └── 404.html        # Custom error page
├── static/
│   ├── css/
│   │   └── main.css    # Complete styling with theme system
│   ├── js/
│   │   └── theme-toggle.js # Theme switching and animations
│   └── assets/
│       ├── images/     # Project screenshots and OG images
│       ├── docs/       # CV and documentation
│       └── icons/      # Favicon and app icons
├── docs/
│   ├── CLAUDE.md       # Development guidance
│   ├── portfolio.md    # Portfolio specification
│   └── projects.md     # Project details
├── robots.txt          # SEO crawler instructions
├── sitemap.xml         # Site structure for search engines
└── CNAME              # Custom domain for GitHub Pages
```

## Development

**Local Development:**
- Open `templates/index.html` directly in browser for immediate preview
- All files are static - no build process required
- Changes are immediately visible on browser refresh
- Test theme toggle and responsive design across devices

**SEO & Performance:**
- Complete meta tags including Open Graph and Twitter cards
- Semantic HTML structure with proper ARIA labels
- Optimized images and minimal external dependencies
- Sitemap and robots.txt for search engine indexing
- Uses `noindex, nofollow` meta tag - this is intentional as the site is a personal portfolio shared manually, not for search discovery

**Deployment:**
- GitHub Pages with custom domain (mtbonde.dev)
- CNAME file configures custom domain
- Contact form uses formsubmit.co (no backend required)

## Design System

**Color Scheme:**
- Primary background: #101820 (dark) / #ffffff (light)
- Text: #f0f0f0 (dark) / #333333 (light)
- Accent: #fdb927 (gold) - consistent across themes
- Secondary text: #888 (dark) / #666 (light)

**Typography:**
- Font family: Inter (with Roboto and Arial fallbacks)
- Responsive font sizing with clear hierarchy
- Consistent spacing and line heights

**Components:**
- Theme toggle with CSS custom properties
- Responsive navigation with sticky positioning
- Project cards with tags and hover effects
- Contact form with validation and success states

## Content Management

**Projects:** Update templates/projects.html and featured projects on templates/index.html based on docs/projects.md
**Contact Form:** Currently configured for formsubmit.co - update email address before deployment
**Social Links:** GitHub, LinkedIn, and CV download links throughout site