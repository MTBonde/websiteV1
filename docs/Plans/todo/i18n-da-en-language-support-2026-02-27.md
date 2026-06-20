# Implementation Plan: Danish/English Language Support (Option A -- Subdirectory Duplication)

**Date:** 2026-02-27
**Branch:** v2
**Approach:** Static subdirectory duplication (`/en/` and `/da/`), root as redirect/picker

---

## 1. Target Directory Structure

```
/ (site root)
|-- index.html              <-- Language picker / auto-redirect (NEW purpose)
|-- 404.html                <-- Language-aware 404 (updated)
|-- CNAME
|-- robots.txt
|-- static/                 <-- Shared assets (UNCHANGED location)
|   |-- css/main.css
|   |-- js/navigation.js
|   |-- js/theme-toggle.js
|   |-- js/mobile-nav.js
|   |-- js/profile-carousel.js
|   |-- js/project-filter.js
|   |-- js/boids.js
|   |-- js/language-redirect.js   <-- NEW
|   |-- js/language-toggle.js     <-- NEW
|   |-- assets/icons/...
|   |-- assets/docs/...
|   |-- assets/images/...
|-- docs/                   <-- Shared, stays in place
|-- en/
|   |-- index.html
|   |-- projects.html
|   |-- about.html
|   |-- contact.html
|   |-- fun.html
|   |-- 404.html
|-- da/
|   |-- index.html
|   |-- projects.html
|   |-- about.html
|   |-- contact.html
|   |-- fun.html
|   |-- 404.html
```

Current root-level `about.html`, `projects.html`, `contact.html`, `fun.html` will be removed once the `/en/` and `/da/` copies are in place.

---

## 2. Root index.html -- Language Picker and Auto-Redirect

Root `index.html` becomes a lightweight landing page with two responsibilities:

**A) Auto-redirect:** If the user has a saved language preference in `localStorage`, redirect immediately. If no preference, check `navigator.language` / `navigator.languages`.

**B) Fallback picker:** If JavaScript is disabled, show a minimal two-button language selector via `<noscript>`.

### Logic (inline `<script>` in `<head>` for speed):

```
1. Check localStorage for key "preferredLanguage"
   - If "da" -> redirect to /da/
   - If "en" -> redirect to /en/
2. If no stored preference, check navigator.languages
   - If any entry starts with "da" -> redirect to /da/
   - Otherwise -> redirect to /en/ (English is default)
3. If JS is disabled, noscript shows a picker with two links
```

**Decision: No visible picker page.** The redirect happens inline in `<head>`, so the user never sees the root page.

---

## 3. Asset Path Strategy

When files move into `/en/` and `/da/`, relative paths break because they are one directory deeper.

### Solution: Prefix all asset references with `../`

| Current path | New path (in `/en/` or `/da/`) |
|---|---|
| `static/css/main.css` | `../static/css/main.css` |
| `static/js/navigation.js` | `../static/js/navigation.js` |
| `static/js/theme-toggle.js` | `../static/js/theme-toggle.js` |
| `static/js/mobile-nav.js` | `../static/js/mobile-nav.js` |
| `static/js/profile-carousel.js` | `../static/js/profile-carousel.js` |
| `static/js/project-filter.js` | `../static/js/project-filter.js` |
| `static/js/boids.js` | `../static/js/boids.js` |
| `static/assets/icons/*` | `../static/assets/icons/*` |
| `docs/Pictures/*` | `../docs/Pictures/*` |

**Internal page links** (e.g., `href="projects.html"`) stay as-is (relative within same directory).

**formsubmit.co `_next` value** must change per language:
- `/en/contact.html`: `https://mtbonde.dev/en/contact.html?success=true`
- `/da/contact.html`: `https://mtbonde.dev/da/contact.html?success=true`

---

## 4. Navigation Updates -- Language Toggle

### 4.1 Navigation.js Changes

Update `static/js/navigation.js` to:
- Detect current language from URL path (`/en/` or `/da/`)
- Use translated labels for nav links
- Add a language toggle button next to the theme toggle

### 4.2 Language Toggle Design

Small button showing the *other* language. If user is on `/en/about.html`, toggle shows "DA" and links to `/da/about.html`.

**Desktop:** `[Home] [Projects] [About] [Contact] [sun/moon] [DA]`
**Mobile:** Next to mobile theme toggle, before hamburger.

### 4.3 Navigation Labels

```javascript
var navLabels = {
    en: { home: 'Home', projects: 'Projects', about: 'About', contact: 'Contact', languageToggle: 'DA' },
    da: { home: 'Hjem', projects: 'Projekter', about: 'Om mig', contact: 'Kontakt', languageToggle: 'EN' }
};
```

### 4.4 Persisting Language Choice

On toggle click: `localStorage.setItem('preferredLanguage', targetLanguage)` then navigate.

---

## 5. hreflang Tags for SEO

Every page in both `/en/` and `/da/` gets:

```html
<link rel="alternate" hreflang="en" href="https://mtbonde.dev/en/{page}.html">
<link rel="alternate" hreflang="da" href="https://mtbonde.dev/da/{page}.html">
<link rel="alternate" hreflang="x-default" href="https://mtbonde.dev/en/{page}.html">
```

Set `<html lang="en">` on `/en/` files and `<html lang="da">` on `/da/` files.

---

## 6. Complete Translation Inventory

### 6.1 Shared Elements (navigation + footer, all pages)

| Element | English | Danish |
|---|---|---|
| Nav: Home | Home | Hjem |
| Nav: Projects | Projects | Projekter |
| Nav: About | About | Om mig |
| Nav: Contact | Contact | Kontakt |
| Footer copyright | "2026 Mpho Bonde. All rights reserved." | "2026 Mpho Bonde. Alle rettigheder forbeholdes." |
| Footer: CV | "CV on request" | "CV pa foresporgsel" |

### 6.2 index.html (Homepage)

| Section | Needs translation |
|---|---|
| `<title>`, `<meta description>`, OG/Twitter meta | Yes |
| Hero: subtitle | Yes |
| Hero: student status | EN: translate to English. DA: keep Danish |
| Hero: body paragraph | Yes |
| Hero: buttons ("View Projects", "Get In Touch") | Yes |
| "Featured Projects" heading | Yes |
| Project card descriptions (x4) | Yes |
| "Learn More" buttons | Yes |
| "See All Projects" | Yes |
| "Core Technologies" heading | Yes |

### 6.3 projects.html

| Section | Needs translation |
|---|---|
| `<title>`, `<meta description>` | Yes |
| "Projects & Experience" heading | Yes |
| Page intro paragraph | Yes |
| Filter labels and instructions | Yes |
| Filter role buttons (x3) | Yes |
| Tag category titles (x6) | Yes |
| "Clear All Filters" | Yes |
| 11 project cards: descriptions, "What I Learned"/"What I Am Learning", "Challenges & Solutions" | Yes (~33 paragraphs) |
| "Privat repository" | EN: "Private repository", DA: keep |
| CTA section | Yes |

### 6.4 about.html

| Section | Needs translation |
|---|---|
| `<title>`, `<meta description>` | Yes |
| "About Me" heading, all card headings | Yes |
| All paragraphs (x8) | Yes |
| All list items (x10) | Yes |
| "Let's Connect" + buttons | Yes |

### 6.5 contact.html

| Section | Needs translation |
|---|---|
| `<title>`, `<meta description>` | Yes |
| "Get In Touch" heading | Yes |
| Page intro, form labels, placeholders | Yes |
| "Send Message" button | Yes |
| Success message | Yes |
| "Other Ways to Connect", "Professional Links" | Yes |
| "What to Expect" list items (x4) | Yes |
| FAQ section: 3 questions + answers | Yes |

### 6.6 fun.html

| Section | Needs translation |
|---|---|
| `<title>` | Yes |
| "Boids Simulation" heading | Yes |
| Description paragraphs | Yes |
| Rock-paper-scissors labels | Yes |
| "Back to Portfolio" button | Yes |

### 6.7 404.html

| Section | Needs translation |
|---|---|
| `<title>` | Yes |
| "Page Not Found" heading | Yes |
| Body text | Yes |
| Button labels ("Go Home", "View Projects", "Contact Me") | Yes |
| Popular pages section (x3 cards) | Yes |

**Note:** 404.html has hardcoded nav (not `navigation.js`). Both copies should switch to the shared nav, or the hardcoded nav must be duplicated and translated.

**GitHub Pages 404 concern:** GitHub Pages serves root `404.html` for all paths. Root `404.html` must detect language from URL or localStorage and redirect to `/en/404.html` or `/da/404.html`.

---

## 7. JavaScript Files -- Changes Needed

| File | Changes |
|---|---|
| `navigation.js` | Major: language detection, translated labels, language toggle button |
| `theme-toggle.js` | None |
| `mobile-nav.js` | None |
| `profile-carousel.js` | None |
| `project-filter.js` | None (filter text is in HTML, tag names are tech names) |
| `boids.js` | None |
| `language-redirect.js` | **NEW**: auto-detection + redirect for root `index.html` |

---

## 8. CSS Additions

Language toggle button styles to match existing theme toggle:

```css
.language-toggle {
    background: none;
    border: 2px solid var(--border);
    color: var(--text);
    padding: var(--space-2);
    border-radius: var(--radius);
    cursor: pointer;
    min-width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--size-small);
    font-weight: var(--weight-strong);
    font-family: var(--font-sans);
    text-decoration: none;
    transition: all 0.3s ease;
}
```

---

## 9. Implementation Steps (Sequenced)

### Phase 1: Infrastructure
1. Create `static/js/language-redirect.js`
2. Add language toggle CSS to `main.css`
3. Update `navigation.js` with language detection, translated labels, toggle button

### Phase 2: English subdirectory
4. Create `/en/` directory
5. Copy all 6 HTML files into `/en/`
6. Update all asset paths (`static/...` -> `../static/...`, `docs/...` -> `../docs/...`)
7. Add hreflang tags, confirm `<html lang="en">`
8. Fix English-specific content: "CV pa foresporgsel" -> "CV on request", translate student status line

### Phase 3: Danish subdirectory
9. Create `/da/` directory
10. Copy all 6 HTML files into `/da/`
11. Update all asset paths (same `../` prefix)
12. Translate all user-facing text to Danish (see Section 6)
13. Set `<html lang="da">`, add hreflang tags
14. Update formsubmit `_next` URL

### Phase 4: Root redirect
15. Replace root `index.html` with redirect/picker page
16. Update root `404.html` to be language-aware
17. Remove old root-level content pages

### Phase 5: Verification
18. Test all internal links in `/en/` and `/da/`
19. Test language toggle on every page (desktop + mobile)
20. Test localStorage persistence and browser language auto-detection
21. Test 404 behavior
22. Test contact form submission + success redirect in both languages
23. Test theme toggle still works
24. Test mobile navigation in both languages

---

## 10. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Broken asset paths after subdirectory move | Systematic find-and-replace; browser verification |
| Danish translation quality | Human review; proper characters (ae, o, a) |
| GitHub Pages 404 routing | Root 404.html detects language and redirects |
| Duplicate content maintenance | Document duplication; consider build script if it becomes painful |
| formsubmit.co redirect URLs | Different `_next` values per language |

---

## Executive Summary

Adds Danish/English support via static subdirectory duplication: `/en/` and `/da/` each contain full copies of 6 HTML pages with translated content. Root `index.html` becomes an instant redirect based on localStorage or browser language. Language toggle added to nav bar matching theme toggle style. All shared assets stay in `/static/` with `../` relative paths from subdirectories. Navigation.js updated with translation lookup. Biggest work item: translating ~80-100 text blocks across 6 pages. Implementation in 5 phases: infrastructure, English subdir, Danish subdir, root redirect, verification.
