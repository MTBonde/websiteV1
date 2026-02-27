# Portfolio Feedback - Action Plan

Date: 2026-02-27

---

## 1. BROKEN LINKS (fix immediately)

### 1.1 CV Download - 404

**Problem:** CV links point to a file that does not exist. The `static/assets/docs/` directory is empty.

**Locations (7 links total):**

| File | Line | Current href |
|------|------|-------------|
| `index.html` | 172 | `static/assets/docs/cv.pdf` |
| `contact.html` | 96 | `assets/docs/cv.pdf` |
| `contact.html` | 170 | `static/assets/docs/cv.pdf` |
| `about.html` | 107 | `assets/docs/cv.pdf` |
| `about.html` | 124 | `static/assets/docs/cv.pdf` |
| `404.html` | 130 | `static/assets/docs/cv.pdf` |
| `projects.html` | 566 | `static/assets/docs/cv.pdf` |

**Note:** Inconsistent paths - some use `assets/docs/cv.pdf`, others use `static/assets/docs/cv.pdf`.

**Decision:** CV is not ready for public display. Replace download links with "CV tilgængeligt på forespørgsel" (no link/download).

**Action:**
- [ ] Replace CV download link with plain text "CV tilgængeligt på forespørgsel" in all 7 locations
- [ ] In footers: replace the `<a>` with a `<span>` or similar non-clickable element
- [ ] In contact.html Professional Links and about.html Let's Connect: same approach

---

### 1.2 MyFoodBudget GitHub Link - 404

**Problem:** Links to `https://github.com/MTBonde/MyFoodBudget_v0.1` which returns 404.

**Location:** `projects.html` line 164

**Action (choose one):**
- [ ] Update to correct repo URL (if public)
- [ ] Replace with "Privat repository - tilgængeligt på forespørgsel" + screenshots/case study

---

## 2. CONTENT ISSUES

### 2.1 MyFoodBudget - Underselling / Mismatched Positioning

**Current copy (projects.html lines 130-133):**
> "A web app for managing recipes, calculating costs, and handling user accounts.
> Built with layered architecture using Flask Blueprints and prepared for CI/CD.
> A hobby project focusing on delivering a functional product with DevOps workflows."

**Current copy (index.html lines 89-91):**
> "Web application for recipe management and cost calculation built with Flask.
> Features modular architecture using Blueprints and prepared for CI/CD deployment."

**Problem:** Described as "hobby project" and "recipe management" - undersells it if this is the entrepreneurship internship product (meal plan + offer matching).

**Action:**
- [ ] Decide: Is this the internship product? If yes, rewrite to reflect meal planning, offer matching, and the entrepreneurial angle
- [ ] Remove "hobby project" phrasing
- [ ] Align description across index.html and projects.html

---

### 2.2 Skill Claims - AWS + Prometheus/Grafana

**Current copy (contact.html lines 150-152):**
> "I work primarily with Docker, Kubernetes, Terraform, GitHub Actions, and Python for automation.
> I'm also experienced with AWS, monitoring tools (Prometheus, Grafana), and CI/CD best practices."

**Problem:** "experienced with AWS" and "Prometheus, Grafana" must be defensible in an interview.

**Action:**
- [ ] If concrete implementations exist: keep as-is
- [ ] If not: rephrase to "familiar with" / "used in homelab" / "learning"
- [ ] Consider: "Exploring AWS and monitoring stacks (Prometheus, Grafana) in my homelab environment"

---

### 2.3 Homepage Hero Text - Generic

**Current copy (index.html lines 59-63):**
> "Building reliable infrastructure and streamlining deployment pipelines.
> Passionate about automation, containerization, and continuous improvement.
> From homelab experiments to production systems, I focus on creating scalable
> solutions that empower development teams."

**Problem:** Reads like a template. "Passionate about" and "continuous improvement" are filler words.

**Action:**
- [ ] Replace with 1-2 specific proof points (GitOps/CI/CD, Cloudflare Tunnel, homelab deployments, testability, etc.)
- [ ] Example direction: "I build GitOps pipelines, automate infrastructure with Terraform, and run a homelab where I test deployments end-to-end before they hit production."

---

## 3. QUICK WINS

### 3.1 Student Status on Homepage

**Action:**
- [ ] Add a single line clarifying status, e.g.: "Professionsbachelorstuderende i Softwareudvikling, dimitterer 2026"
- [ ] Keep the headline role-focused, status line as subtitle or small text

### 3.2 Partner Page (Danske Kartofler etc.)

**Context:** This feedback was along the lines of "if you don't clean up the portfolio, at least create a separate outreach page so partners don't land on a messy DevOps page." If we fix items 1-2 properly, this becomes unnecessary.

**Status:** Low priority - drop if the rest of the feedback gets implemented.

---

## Executive Summary

Two broken links (CV + MyFoodBudget GitHub) are immediate trust killers - fix first. Then update MyFoodBudget copy to match actual scope, tone down undefensible skill claims, and replace generic hero text with concrete proof points. Quick wins: add student status line and consider a dedicated partner outreach page.
