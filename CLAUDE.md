# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a simple static website for mtbonde.dev - a personal landing page with minimal dependencies. The site consists of:

- `index.html` - Main HTML page with embedded JavaScript
- `styles.css` - CSS styling with dark theme (#101820 background, #fdb927 accent color)

## Architecture

This is a basic static website with no build process, dependencies, or frameworks. The site uses:

- Vanilla HTML5 with responsive viewport meta tag
- CSS with flexbox for centering and basic styling
- Minimal JavaScript for console logging on DOM load
- No external dependencies or package managers

## Development

Since this is a static site with no build process:

- Open `index.html` directly in a browser to preview changes
- Edit HTML in `index.html` and CSS in `styles.css` directly
- No compilation, bundling, or server required for development
- Changes are immediately visible on browser refresh

## Color Scheme

- Background: #101820 (dark blue-gray)
- Text: #f0f0f0 (light gray)
- Accent/Links: #fdb927 (gold/yellow)
- Footer text: #888 (medium gray)