# Plan: Portfolio Feedback Implementation

## Context

External feedback identified two broken links (CV, MyFoodBudget GitHub), generic/inaccurate content, and undefensible skill claims. Additionally, the Alexor GitOps platform project (the user's second strongest project) is missing from the portfolio entirely. This plan addresses all actionable items. Full feedback doc: `docs/portfolio-feedback-2026-02-27.md`.

---

## Changes

### 1. CV Links -> "CV tilgaengeligt paa forespoergsel" (all pages)

Replace all 7 CV download `<a>` tags with non-clickable text.

**Files & locations:**
- `index.html` ~line 172 (footer)
- `contact.html` ~line 96 (Professional Links) + ~line 170 (footer)
- `about.html` ~line 107 (Let's Connect) + ~line 124 (footer)
- `404.html` ~line 130 (footer)
- `projects.html` ~line 566 (footer)

**Approach:** In footers, replace `<a href="static/assets/docs/cv.pdf" ...>CV</a>` with `<span>CV på forespørgsel</span>`. In content sections (contact, about), replace the button-styled link with a styled `<span>` using the same `btn-secondary` class but no href.

### 2. MyFoodBudget GitHub Link -> Remove button

**File:** `projects.html` line 164

Remove the `<a href="https://github.com/MTBonde/MyFoodBudget_v0.1" ...>GitHub</a>` button. Repo is private (internship + bachelor work).

### 3. MyFoodBudget Description -> Accurate, upgraded copy

**Files:** `projects.html` lines 129-161, `index.html` lines 88-99, `docs/Projects.md` line 7-12

**Current problems:**
- Says MongoDB -> actually SQLAlchemy + SQLite
- Says Blueprints -> not implemented, listed as "Future" in repo
- Says "hobby project" -> it's entrepreneur internship + bachelor work
- Described as "recipe management and cost calculation" -> actually a meal planning platform with offer matching, store-grouped shopping lists, and savings estimates
- Missing: guest-first architecture, offer matching across 4 chains, canonical ingredient system (52 CI, 349 aliases, 34 rules), single compute endpoint, 180+ tests, Playwright E2E, international scaling strategy

**New description (projects.html):**
> Meal planning web app that turns recipe intent into store-grouped shopping lists
> with real deal matching and savings estimates across Danish grocery chains.
> Guest-first architecture: the full core flow (browse recipes, plan week, view
> shopping list, see savings) works without an account. Built with a modular
> monolith architecture designed for future microservice boundaries.
> Developed as entrepreneur internship project, forming the foundation for bachelor thesis.

**New "What I Learned":**
> Building a product from scratch taught me that architecture decisions must serve the user,
> not the developer. The pivot to guest-first -- making the entire core flow work without
> an account -- required rethinking how data flows through the system. A single authoritative
> compute endpoint eliminated data mismatches structurally, not through bug fixes.

**New "Challenges & Solutions":**
> Matching recipe ingredients to real store offers required a canonical ingredient system
> (52 ingredients, 349 aliases, 34 match rules) that normalizes across different naming
> conventions. Designing this system to be transparent about its limitations (showing
> coverage and match status per item) was critical for user trust.

**New tags:** `Python`, `Flask`, `SQLAlchemy`, `pytest`, `Playwright`, `REST API`, `Offer Matching`, `Guest-first`

**index.html featured card (shorter):**
> Meal planning platform that generates store-grouped shopping lists with real
> deal matching across Danish grocery chains. Guest-first: full core flow without account.
> 180+ tests, canonical ingredient matching, single compute endpoint architecture.

Tags for index: `Python`, `Flask`, `SQLAlchemy`, `pytest`, `REST API`, `Offer Matching`

**docs/Projects.md:** Update description and tags to match.

### 4. Add Alexor Platform as Project (NEW)

**Source material:** `siuss-projekt-sammendrag.md` + `PB_Alexor-GitOps` repo

**Files:**
- `projects.html` -- Add new project card after MyFoodBudget (position #2, as user's second strongest project)
- `index.html` -- Add as 4th featured project card (after MFB, Homelab, CDM)
- `docs/Projects.md` -- Add entry

**Project card content (projects.html):**

Title: Alexor Platform - GitOps Microservice Backend

Description:
> Backend platform for an Unreal Engine multiplayer game, built as a scalable microservice architecture
> with a fully automated GitOps delivery pipeline. Five .NET services (Auth, Session, Registry, Relay,
> GameServer) running in Kubernetes, managed by Flux CD with automated promotion through
> dev/staging/prod environments.

What I Learned:
> Designing a GitOps workflow from scratch taught me that automation is as much about organizational
> discipline as it is about tooling. Conventional commits, manifest ownership, and review processes
> are what make the pipeline trustworthy.

Challenges & Solutions:
> Coordinating multiple independently versioned services required a centralized CI/CD architecture.
> I built a shared workflow repository and a custom NuGet package (HAGI.Robust) with retry,
> circuit breaker, and timeout patterns, applied consistently across all services.

Tags: `.NET`, `Kubernetes`, `Flux CD`, `GitOps`, `GitHub Actions`, `Prometheus`, `Grafana`, `RabbitMQ`, `Docker`, `Microservices`

Links: GitHub buttons to `PB_Alexor-GitOps` and `PB_Alexor-Workflows`

data-job-roles: `devops` (matching existing pattern)

**index.html featured card:** Shorter version with core tags.

### 5. Skill Claims -> Remove AWS, keep Prometheus/Grafana, add Flux CD

**File:** `contact.html` lines 150-152

**Justification:** Alexor project deploys Prometheus + Grafana via GitOps with Flux CD on Kubernetes. Defensible. AWS was not pursued.

**New copy:**
> I work primarily with Docker, Kubernetes, Terraform, GitHub Actions, and Python for automation.
> I'm also experienced with monitoring (Prometheus, Grafana), GitOps (Flux CD), and CI/CD best practices.
> I believe in using the right tools for each challenge.

### 6. Homepage Hero Text -> Specific proof points

**File:** `index.html` lines 59-63

**Focus:** GitOps + homelab (user's choice)

**New copy:**
> I build GitOps pipelines with Flux CD, automate infrastructure with Terraform,
> and run a homelab where I deploy and monitor containerized services end-to-end.
> From Cloudflare Tunnels to Kubernetes clusters, I focus on reliable,
> reproducible infrastructure.

### 7. Student Status Line on Homepage

**File:** `index.html` ~line 57 (after subtitle)

**Add small text line (Danish, user-facing):**
> Professionsbachelorstuderende i Softwareudvikling -- dimitterer 2026

Style as smaller/muted text below the subtitle.

### 8. Core Technologies Section -> Restore icons with Devicons/Simple Icons

**File:** `index.html` lines 141-159, `static/css/main.css`

**Current state:** Plain text `<a>` tags without icons (emojis were removed in commit b709465 because they rendered inconsistently).

**Previous state (commit 4ceb7d0):** Had `skills-grid` with emoji icons + links to `projects.html?tag=...`

**New approach:** Download individual SVG files from [Devicons](https://devicon.dev/) and store locally in `static/assets/icons/devicons/`. No CDN dependency, no external requests.

**Updated tech list** (aligned with actual skills, AWS removed):
- Docker (docker-original.svg)
- Kubernetes (kubernetes-plain.svg)
- Terraform (terraform-plain.svg)
- Python (python-original.svg)
- Git (git-original.svg)
- GitHub Actions (githubactions-plain.svg)
- Linux (linux-original.svg)
- .NET / C# (csharp-original.svg)
- Flask (flask-original.svg)
- Grafana (grafana-original.svg)
- Prometheus (prometheus-original.svg)

Technologies without devicon (concepts, not brands):
- Flux CD, CI/CD, IaC, Networking, Security -- keep as text-only tags without icon, or find Simple Icons SVGs.

**Implementation:**
- Download ~11 SVG files to `static/assets/icons/devicons/`
- Use `<img src="static/assets/icons/devicons/docker-original.svg" alt="Docker">` in skill items
- No external CSS or CDN link needed

**Structure:** Restore `skills-grid` layout with icon + name + link to filtered projects page.

**CSS:** Restore `.skills-grid`, `.skill-item`, `.skill-icon`, `.skill-name`, `.skill-link` classes from commit 4ceb7d0 (check if still in main.css or need re-adding).

---

## Files Modified

| File | Changes |
|------|---------|
| `index.html` | Hero text, student status, MFB description+tags, Alexor featured card, CV footer link, Core Tech icons |
| `projects.html` | MFB description+tags, remove MFB GitHub button, Alexor project card, CV footer link |
| `contact.html` | Skill claims (AWS->Flux CD), CV links x2 |
| `about.html` | CV links x2 |
| `404.html` | CV footer link |
| `docs/Projects.md` | MFB description+tags, Alexor entry |
| `docs/portfolio-feedback-2026-02-27.md` | Update with decisions made |

## Verification

- Open each HTML page in browser and verify:
  - No broken links (CV shows text, MFB has no GitHub button)
  - Alexor project card renders correctly with GitHub links that work
  - Alexor appears as 4th featured project on index.html
  - Hero text is updated with specific proof points
  - Student status line visible below subtitle
  - MFB description accurate (SQLAlchemy, not MongoDB; no "hobby project")
  - Contact FAQ mentions Flux CD, not AWS
  - Core Technologies shows Devicon brand logos, not emojis or plain text
- Check responsive layout on mobile viewport

## Executive Summary

Nine changes across 7 files. Two broken links fixed (CV -> text, MFB GitHub -> removed). MFB description completely rewritten -- from "recipe management hobby project" to what it actually is: a meal planning platform with guest-first architecture, offer matching across 4 chains, canonical ingredient system, and 180+ tests. Tags corrected (SQLAlchemy, not MongoDB). Alexor Platform added as new project with links to public repos. AWS removed from skill claims, replaced with Flux CD (defensible via Alexor). Hero text replaced with concrete GitOps/homelab proof points. Student status added to homepage.
