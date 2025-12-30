# Mobile Navigation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace stacked mobile navigation with a hamburger drawer that slides from the right, with adaptive overlay behavior and a FAB for access when scrolled.

**Architecture:** New `MobileNav` component conditionally rendered on mobile (≤900px). Desktop sidebar unchanged. Uses React state for drawer, Intersection Observer for FAB visibility. No new dependencies.

**Tech Stack:** React, SCSS, native browser APIs (Intersection Observer)

---

## Task 1: Create MobileNav Component Shell

**Files:**
- Create: `apps/craigory-dev/renderer/MobileNav.tsx`
- Create: `apps/craigory-dev/renderer/MobileNav.scss`

**Step 1: Create the basic MobileNav component structure**

```tsx
// apps/craigory-dev/renderer/MobileNav.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from './Link';
import './MobileNav.scss';

export function MobileNav({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showFab, setShowFab] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  const openDrawer = () => setIsOpen(true);
  const closeDrawer = () => setIsOpen(false);

  return (
    <div className="mobile-nav-container">
      <MobileHeader ref={headerRef} onMenuClick={openDrawer} />
      <div className="mobile-content">{children}</div>
      <MobileDrawer isOpen={isOpen} onClose={closeDrawer} />
      <MobileOverlay isOpen={isOpen} onClick={closeDrawer} />
      <NavFAB visible={showFab} onClick={openDrawer} />
    </div>
  );
}

const MobileHeader = React.forwardRef<
  HTMLDivElement,
  { onMenuClick: () => void }
>(({ onMenuClick }, ref) => (
  <header ref={ref} className="mobile-header">
    <div className="mobile-header-brand">{/* Future: logo/brand */}</div>
    <button
      className="mobile-header-hamburger"
      onClick={onMenuClick}
      aria-label="Open navigation menu"
      aria-expanded={false}
    >
      <HamburgerIcon />
    </button>
  </header>
));
MobileHeader.displayName = 'MobileHeader';

function MobileDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <nav
      className={`mobile-drawer ${isOpen ? 'mobile-drawer--open' : ''}`}
      role="dialog"
      aria-label="Navigation menu"
      aria-hidden={!isOpen}
    >
      <div className="mobile-drawer-header">
        <button
          className="mobile-drawer-close"
          onClick={onClose}
          aria-label="Close navigation menu"
        >
          <CloseIcon />
        </button>
      </div>
      <div className="mobile-drawer-nav">
        <Link className="mobile-navitem" href="/">
          Home
        </Link>
        <Link className="mobile-navitem" href="/projects">
          Projects
        </Link>
        <Link className="mobile-navitem" href="/presentations">
          Speaking + Presentations
        </Link>
        <Link className="mobile-navitem" href={`/blog/1`}>
          Blog
        </Link>
      </div>
      <div className="mobile-drawer-footer">
        <Link className="mobile-footer-link" href="/privacy">
          Privacy Policy
        </Link>
      </div>
    </nav>
  );
}

function MobileOverlay({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`mobile-overlay ${isOpen ? 'mobile-overlay--visible' : ''}`}
      onClick={onClick}
      aria-hidden="true"
    />
  );
}

function NavFAB({
  visible,
  onClick,
}: {
  visible: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`nav-fab ${visible ? 'nav-fab--visible' : ''}`}
      onClick={onClick}
      aria-label="Open navigation menu"
    >
      <HamburgerIcon />
    </button>
  );
}

function HamburgerIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
```

**Step 2: Create the initial SCSS file**

```scss
// apps/craigory-dev/renderer/MobileNav.scss

// Only show on mobile
.mobile-nav-container {
  display: none;
}

@media screen and (max-width: 900px) {
  .mobile-nav-container {
    display: block;
  }
}

// Header
.mobile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;
  padding: 0 16px;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.mobile-header-brand {
  // Future: logo/brand styles
}

.mobile-header-hamburger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  color: #333;

  &:hover {
    color: #000;
  }
}

// Drawer
.mobile-drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 280px;
  height: 100vh;
  background: white;
  transform: translateX(100%);
  transition: transform 300ms ease-out;
  z-index: 1001;
  display: flex;
  flex-direction: column;

  &--open {
    transform: translateX(0);
  }
}

.mobile-drawer-header {
  display: flex;
  justify-content: flex-end;
  padding: 8px;
}

.mobile-drawer-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  color: #333;

  &:hover {
    color: #000;
  }
}

.mobile-drawer-nav {
  display: flex;
  flex-direction: column;
  padding: 16px;
  flex: 1;
}

.mobile-navitem {
  padding: 12px 16px;
  font-size: 1.25rem;
  color: #333;
  text-decoration: none;
  border-radius: 8px;

  &:hover {
    background: #f5f5f5;
  }

  &.is-active {
    background: #eee;
    font-weight: 500;
  }
}

.mobile-drawer-footer {
  padding: 16px;
  border-top: 1px solid #eee;
}

.mobile-footer-link {
  font-size: 0.85rem;
  color: #888;

  &:hover {
    color: #555;
  }
}

// Overlay - dim + blur on larger mobile, hidden on tiny
.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  opacity: 0;
  visibility: hidden;
  transition: opacity 200ms, visibility 200ms;
  z-index: 1000;

  &--visible {
    opacity: 1;
    visibility: visible;
  }
}

// Tiny screens: no overlay, push content instead
@media screen and (max-width: 480px) {
  .mobile-overlay {
    display: none;
  }

  .mobile-nav-container {
    transition: transform 300ms ease-out;
  }

  .mobile-nav-container:has(.mobile-drawer--open) {
    transform: translateX(-280px);
  }
}

// FAB
.nav-fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  opacity: 0;
  visibility: hidden;
  transition: opacity 200ms, visibility 200ms, transform 200ms;
  z-index: 999;

  &--visible {
    opacity: 1;
    visibility: visible;
  }

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  }

  &:active {
    transform: scale(0.95);
  }
}

// Content wrapper
.mobile-content {
  padding: 20px;
  padding-bottom: 50px;
  max-width: 90vw;
  margin: 0 auto;
}
```

**Step 3: Verify files created**

Run: `ls -la apps/craigory-dev/renderer/MobileNav.*`
Expected: Both `.tsx` and `.scss` files listed

**Step 4: Commit**

```bash
git add apps/craigory-dev/renderer/MobileNav.tsx apps/craigory-dev/renderer/MobileNav.scss
git commit -m "feat: add MobileNav component shell with drawer, overlay, and FAB"
```

---

## Task 2: Add Keyboard, Focus Trap, and Body Scroll Lock

**Files:**
- Modify: `apps/craigory-dev/renderer/MobileNav.tsx`

**Step 1: Add ESC key handler**

Add this `useEffect` inside the `MobileNav` component, after the state declarations:

```tsx
// ESC key to close drawer
useEffect(() => {
  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      closeDrawer();
    }
  };
  document.addEventListener('keydown', handleEsc);
  return () => document.removeEventListener('keydown', handleEsc);
}, [isOpen]);
```

**Step 2: Add body scroll lock**

Add this `useEffect` after the ESC handler:

```tsx
// Lock body scroll when drawer is open
useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
  return () => {
    document.body.style.overflow = '';
  };
}, [isOpen]);
```

**Step 3: Add focus trap**

Add a ref to MobileDrawer and focus management:

```tsx
// Add ref for focus trap
const drawerRef = useRef<HTMLElement>(null);

// Focus management
useEffect(() => {
  if (isOpen && drawerRef.current) {
    const closeButton = drawerRef.current.querySelector<HTMLButtonElement>(
      '.mobile-drawer-close'
    );
    closeButton?.focus();
  }
}, [isOpen]);
```

Update MobileDrawer to use forwardRef:

```tsx
const MobileDrawer = React.forwardRef<
  HTMLElement,
  { isOpen: boolean; onClose: () => void }
>(({ isOpen, onClose }, ref) => {
  // Handle focus trap on Tab key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !ref || typeof ref === 'function') return;

    const focusableElements = (ref as React.RefObject<HTMLElement>).current?.querySelectorAll<HTMLElement>(
      'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusableElements || focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  };

  return (
    <nav
      ref={ref}
      className={`mobile-drawer ${isOpen ? 'mobile-drawer--open' : ''}`}
      role="dialog"
      aria-label="Navigation menu"
      aria-hidden={!isOpen}
      onKeyDown={handleKeyDown}
    >
      {/* ... rest unchanged */}
    </nav>
  );
});
MobileDrawer.displayName = 'MobileDrawer';
```

Update the MobileNav to pass the ref:

```tsx
<MobileDrawer ref={drawerRef} isOpen={isOpen} onClose={closeDrawer} />
```

**Step 4: Test manually**

Run: `pnpm nx serve craigory-dev`
Test: Open drawer, press ESC, verify it closes. Tab through links, verify focus stays in drawer.

**Step 5: Commit**

```bash
git add apps/craigory-dev/renderer/MobileNav.tsx
git commit -m "feat: add keyboard support, focus trap, and scroll lock to mobile nav"
```

---

## Task 3: Add Intersection Observer for FAB

**Files:**
- Modify: `apps/craigory-dev/renderer/MobileNav.tsx`

**Step 1: Add Intersection Observer for header visibility**

Add this `useEffect` after the other effects in MobileNav:

```tsx
// Show FAB when header scrolls out of view
useEffect(() => {
  const header = headerRef.current;
  if (!header) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      setShowFab(!entry.isIntersecting);
    },
    { threshold: 0 }
  );

  observer.observe(header);
  return () => observer.disconnect();
}, []);
```

**Step 2: Test manually**

Run: `pnpm nx serve craigory-dev`
Test: Scroll down on mobile viewport, verify FAB appears. Scroll up, verify FAB disappears.

**Step 3: Commit**

```bash
git add apps/craigory-dev/renderer/MobileNav.tsx
git commit -m "feat: show FAB when mobile header scrolls out of view"
```

---

## Task 4: Integrate MobileNav into PageShell

**Files:**
- Modify: `apps/craigory-dev/renderer/PageShell.tsx`
- Modify: `apps/craigory-dev/renderer/PageShell.scss`

**Step 1: Add MobileNav import and conditional rendering**

Update PageShell.tsx:

```tsx
import React from 'react';
import './PageShell.scss';
import { Link } from './Link';
import { Toaster } from '../src/shared-components/toaster';
import { MobileNav } from './MobileNav';

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <React.StrictMode>
      {/* Desktop layout */}
      <Layout>
        <Sidebar>
          <div className="sidebar-nav">
            <Link className="navitem" href="/">
              Home
            </Link>
            <Link className="navitem" href="/projects">
              Projects
            </Link>
            <Link className="navitem" href="/presentations">
              Speaking + Presentations
            </Link>
            <Link className="navitem" href={`/blog/1`}>
              Blog
            </Link>
          </div>
          <div className="sidebar-footer">
            <Link className="footer-link" href="/privacy">
              Privacy Policy
            </Link>
          </div>
        </Sidebar>
        <Content>{children}</Content>
      </Layout>

      {/* Mobile layout */}
      <MobileNav>{children}</MobileNav>

      <Toaster />
    </React.StrictMode>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return <div className="layout">{children}</div>;
}

function Sidebar({ children }: { children: React.ReactNode }) {
  return <div className="sidebar">{children}</div>;
}

function Content({ children }: { children: React.ReactNode }) {
  return <div className="content">{children}</div>;
}
```

**Step 2: Update PageShell.scss to hide desktop layout on mobile**

Replace the mobile media query section (around line 90-119) with:

```scss
@media screen and (max-width: 900px) {
  // Hide desktop layout on mobile
  display: none;
}
```

The full updated `.layout` block:

```scss
.layout {
  display: flex;
  margin: auto;

  .sidebar {
    padding: 20px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 1.8em;
    min-height: 100vh;

    .sidebar-nav {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
    }

    .sidebar-footer {
      margin-top: auto;
      padding-top: 2rem;
      width: 100%;
      text-align: right;
      position: sticky;
      bottom: 1rem;

      .footer-link {
        font-size: 0.85rem;
        color: #888;
        display: inline-block;

        &:hover {
          color: #555;
        }
      }
    }

    @media screen and (max-height: 200px) {
      .sidebar-footer {
        position: unset;
      }
      height: fit-content;
    }
  }

  .content {
    padding: 20px;
    padding-bottom: 50px;
    border-left: 2px solid #eee;
    min-height: 100vh;
    width: 100%;
  }

  @media screen and (min-width: 1600px) {
    max-width: 1200px;
  }

  @media screen and (min-width: 1200px) and (max-width: 1599px) {
    max-width: 900px;
  }

  @media screen and (min-width: 901px) and (max-width: 1199px) {
    max-width: 80vw;
  }

  // Hide desktop layout on mobile - MobileNav takes over
  @media screen and (max-width: 900px) {
    display: none;
  }
}
```

**Step 3: Test the integration**

Run: `pnpm nx serve craigory-dev`
Test:
- Desktop (>900px): See sidebar layout
- Mobile (≤900px): See hamburger header + drawer
- Resize between: Layout switches correctly

**Step 4: Commit**

```bash
git add apps/craigory-dev/renderer/PageShell.tsx apps/craigory-dev/renderer/PageShell.scss
git commit -m "feat: integrate MobileNav into PageShell with responsive switching"
```

---

## Task 5: Add Navigation Close on Route Change

**Files:**
- Modify: `apps/craigory-dev/renderer/MobileNav.tsx`

**Step 1: Close drawer when navigating**

Add `usePageContext` import and effect:

```tsx
import { usePageContext } from 'vike-react/usePageContext';

// Inside MobileNav component, after other hooks:
const pageContext = usePageContext();

// Close drawer on route change
useEffect(() => {
  closeDrawer();
}, [pageContext.urlPathname]);
```

**Step 2: Test manually**

Run: `pnpm nx serve craigory-dev`
Test: Open drawer, click a link, verify drawer closes and page navigates.

**Step 3: Commit**

```bash
git add apps/craigory-dev/renderer/MobileNav.tsx
git commit -m "feat: auto-close mobile drawer on navigation"
```

---

## Task 6: Update aria-expanded State

**Files:**
- Modify: `apps/craigory-dev/renderer/MobileNav.tsx`

**Step 1: Pass isOpen to MobileHeader for aria-expanded**

Update MobileHeader to accept and use `isOpen`:

```tsx
const MobileHeader = React.forwardRef<
  HTMLDivElement,
  { onMenuClick: () => void; isOpen: boolean }
>(({ onMenuClick, isOpen }, ref) => (
  <header ref={ref} className="mobile-header">
    <div className="mobile-header-brand">{/* Future: logo/brand */}</div>
    <button
      className="mobile-header-hamburger"
      onClick={onMenuClick}
      aria-label="Open navigation menu"
      aria-expanded={isOpen}
    >
      <HamburgerIcon />
    </button>
  </header>
));
```

Update the usage:

```tsx
<MobileHeader ref={headerRef} onMenuClick={openDrawer} isOpen={isOpen} />
```

**Step 2: Commit**

```bash
git add apps/craigory-dev/renderer/MobileNav.tsx
git commit -m "fix: update aria-expanded state on hamburger button"
```

---

## Task 7: Final Testing and Polish

**Files:**
- Potentially: `apps/craigory-dev/renderer/MobileNav.scss`

**Step 1: Run full test suite**

Run: `pnpm nx build craigory-dev`
Expected: Build succeeds with no errors

**Step 2: Manual testing checklist**

Test each of these on mobile viewport (≤900px):
- [ ] Header visible at top with hamburger
- [ ] Hamburger opens drawer from right
- [ ] X button closes drawer
- [ ] Overlay appears (≥481px) with blur
- [ ] Clicking overlay closes drawer
- [ ] ESC key closes drawer
- [ ] Tab cycles through drawer only (focus trap)
- [ ] Scroll FAB appears when header scrolls away
- [ ] FAB opens drawer
- [ ] Clicking nav link closes drawer and navigates
- [ ] Active page is highlighted in drawer
- [ ] Push behavior works (≤480px) - content slides left

Test desktop (>900px):
- [ ] Normal sidebar layout appears
- [ ] No hamburger or mobile elements visible

**Step 3: Final commit if any polish needed**

```bash
git add -A
git commit -m "chore: final polish for mobile navigation"
```

---

## Summary

| Task | Description |
|------|-------------|
| 1 | Create MobileNav component with drawer, overlay, FAB |
| 2 | Add keyboard support, focus trap, scroll lock |
| 3 | Add Intersection Observer for FAB visibility |
| 4 | Integrate into PageShell with responsive switching |
| 5 | Auto-close drawer on navigation |
| 6 | Fix aria-expanded state |
| 7 | Final testing and polish |
