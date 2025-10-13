# Portfolio Redesign Plan V2

## Goal
Create a clean, professional portfolio inspired by amitabh.engineer, specifically targeted for DevOps/GitOps/DevSecOps/Homelab positions.

## Inspiration Source
**Reference Site**: https://amitabh.engineer/

**What We Like About His Site:**
- Clean, minimalist design that feels professional and modern
- Excellent visual hierarchy - easy to scan and find information quickly
- Icon-based skills section allows immediate recognition of technical competencies
- Professional color scheme that works well in both light and dark themes
- Project cards are clean and well-spaced without feeling cluttered
- Content is focused and purposeful - no distracting elements
- Typography is consistent and readable across all sections
- Overall aesthetic is corporate-friendly while maintaining personality

**Key Elements to Emulate:**
- Clean, minimalist design with professional color palette
- Icon-based skills section for quick visual scanning of technical competencies
- Clear visual hierarchy with consistent typography
- Subtle theme toggle implementation
- Professional project presentation with clean cards
- Focused content without visual distractions
- Modern, corporate-friendly aesthetic suitable for DevOps roles

## Current Issues Identified
- Dark theme (#101820) with bright gold (#fdb927) creates harsh, unprofessional contrast
- Boids animation system adds cognitive overload and distracts from professional content
- Complex visual elements detract from showcasing technical competencies
- Current "What I Do" text-based skills section is less effective than icon-based approach

## Design Strategy

### 1. Professional Color Scheme & Theme System
- Keep theme toggle functionality but with professional colors
- **Light Theme**: Clean whites (#ffffff/#fafafa) with professional blue accent (#2563eb)
- **Dark Theme**: Professional dark grays (#0f172a/#1e293b) with adjusted accent colors
- Replace bright gold (#fdb927) with subtle, corporate-friendly accent colors
- Use proper text hierarchy with professional grays (#1f2937, #374151, #6b7280)

### 2. Remove Distracting Elements
- Completely remove boids animation system (canvas, controls, JavaScript files)
- Eliminate complex animations and hover effects that detract from professional focus
- Keep only subtle, professional hover states and transitions

### 3. Content Restructuring for DevOps Focus
- Streamline hero section emphasizing DevOps/infrastructure expertise
- **Icon-based skills section** showcasing: Docker, Kubernetes, AWS, Terraform, Git, Python, CI/CD tools, etc.
- Reorganize projects to highlight: Homelab, CI/CD pipelines, Infrastructure as Code, Monitoring solutions
- Frame any game dev projects as technical achievements demonstrating relevant skills (algorithms, performance optimization, etc.)

### 4. Professional Layout & Design
- Clean navigation following modern professional standards
- Improved project cards with subtle shadows and professional spacing
- Better visual hierarchy and consistent spacing throughout
- Mobile-responsive design optimized for recruiters and hiring managers

### 5. DevOps-Focused Messaging
- Tailor all copy toward DevOps/infrastructure roles
- Highlight automation, reliability, and scalability experience
- Emphasize continuous learning and improvement mindset
- Present diverse background (including game dev) as technical problem-solving strength

## Implementation Notes
- Maintain current project structure and file organization
- Keep existing SEO optimization and meta tags
- Preserve contact form functionality
- Ensure all changes maintain accessibility standards

## Success Criteria
- Professional appearance suitable for DevOps role applications
- Fast visual scanning of technical competencies through icons
- Clean, distraction-free user experience
- Mobile-responsive design
- Maintains personality while projecting professionalism

---

*This redesign focuses on creating a portfolio that positions the candidate as a serious DevOps professional while their diverse technical background naturally enhances their story.*

## Reference Implementation Details

### CSS Color Palette & Variables (from amitabh.engineer)

See: [reference-css.css](./reference-css.css)

### Key Technical Highlights from Reference Site
- **Modern CSS Features**: Uses `color-mix()`, `clamp()`, CSS custom properties
- **Professional Color Palette**: Blue-based (#2563eb) instead of harsh gold
- **Typography System**: Inter font with proper weight hierarchy (400-800)
- **Responsive Design**: Mobile-first with grid system
- **Theme System**: Both auto-detection and manual toggle support
- **Accessibility**: Proper focus states and semantic structure