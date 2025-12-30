# Project Card Redesign

## Overview

Convert the projects page from `<table>` elements to semantic CSS Grid divs for better responsive control and cleaner mobile layout.

## Design Decisions

- **Info rows (Source URL, etc.)**: Stacked vertical on mobile (label on top, value below)
- **Languages section**: Side-by-side with auto-sizing columns (name sizes to longest)
- **Overall structure**: Unified card with internal section dividers

## Structure

```tsx
<article className="project-card">
  <section className="project-info">
    <h3 className="section-header">Project Info</h3>
    <div className="info-row">
      <span className="info-label"><FaGithub /> Source URL</span>
      <span className="info-value"><a>...</a></span>
    </div>
  </section>

  <section className="project-languages">
    <h3 className="section-header">Languages Used</h3>
    <div className="languages-grid">
      <div className="language-row">
        <span className="language-name">[TS] TypeScript</span>
        <span className="language-bar"><PercentBar /></span>
      </div>
    </div>
  </section>

  <section className="project-packages">
    <!-- similar structure -->
  </section>
</article>
```

## Responsive Behavior

### Desktop (>600px)
- Info rows: `grid-template-columns: auto 1fr` (label sizes to content)
- Language rows: `grid-template-columns: auto 1fr` (name sizes to longest)

### Mobile (≤600px)
- Info rows: Stack vertically (`grid-template-columns: 1fr`)
- Language rows: Stay side-by-side with `minmax(0, auto) minmax(0, 1fr)`

## Visual Styling

- Card: 1px border, 8px radius, subtle shadow
- Section headers: #f5f5f5 background, 0.9rem font
- Rows: 0.75rem padding, bottom border separator
- Alternating row colors for languages/packages
- URL values: `word-break: break-all` to prevent overflow

## Implementation Tasks

1. Create new `ProjectCard` component with CSS Grid structure
2. Create `ProjectCard.module.scss` with responsive styles
3. Update `+Page.tsx` to use new component
4. Remove old table styles from `styles.scss`
5. Test on various screen sizes
