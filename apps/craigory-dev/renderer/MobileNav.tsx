import React, { useState, useRef, useEffect } from 'react';
import { usePageContext } from 'vike-react/usePageContext';
import { Link } from './Link';
import './MobileNav.scss';

export function MobileNav({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showFab, setShowFab] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const pageContext = usePageContext();

  const closeDrawer = () => setIsOpen(false);

  // Close drawer on route change
  useEffect(() => {
    closeDrawer();
  }, [pageContext.urlPathname]);

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

  // Focus management - focus toggle button when opening, restore focus when closing
  useEffect(() => {
    if (isOpen) {
      // Focus the toggle button (now acts as close button too)
      const toggleButton =
        document.querySelector<HTMLButtonElement>('.menu-toggle');
      toggleButton?.focus();
    } else if (!isOpen && triggerRef.current) {
      triggerRef.current.focus();
      triggerRef.current = null;
    }
  }, [isOpen]);

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

  const toggleDrawer = () => {
    if (!isOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="mobile-nav-container">
      <MobileHeader ref={headerRef} />
      <div className="mobile-content">{children}</div>
      <MobileDrawer ref={drawerRef} isOpen={isOpen} />
      <MobileOverlay isOpen={isOpen} onClick={closeDrawer} />
      <MenuToggle isOpen={isOpen} onClick={toggleDrawer} />
      <NavFAB visible={showFab && !isOpen} onClick={toggleDrawer} isOpen={isOpen} />
    </div>
  );
}

const MobileHeader = React.forwardRef<HTMLDivElement, object>((_, ref) => (
  <header ref={ref} className="mobile-header">
    <div className="mobile-header-brand">{/* Future: logo/brand */}</div>
    {/* Toggle button is now fixed-position, outside the header */}
  </header>
));
MobileHeader.displayName = 'MobileHeader';

function MenuToggle({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`menu-toggle ${isOpen ? 'menu-toggle--open' : ''}`}
      onClick={onClick}
      aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
      aria-expanded={isOpen}
    >
      <HamburgerIcon />
    </button>
  );
}

const MobileDrawer = React.forwardRef<HTMLElement, { isOpen: boolean }>(
  ({ isOpen }, ref) => {
    // Handle focus trap on Tab key
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key !== 'Tab' || !ref || typeof ref === 'function') return;

      const focusableElements = (
        ref as React.RefObject<HTMLElement>
      ).current?.querySelectorAll<HTMLElement>(
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
);
MobileDrawer.displayName = 'MobileDrawer';

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
  isOpen,
}: {
  visible: boolean;
  onClick: () => void;
  isOpen: boolean;
}) {
  return (
    <button
      className={`nav-fab ${visible ? 'nav-fab--visible' : ''}`}
      onClick={onClick}
      aria-label="Open navigation menu"
      aria-expanded={isOpen}
    >
      <HamburgerIcon />
    </button>
  );
}

function HamburgerIcon() {
  return (
    <svg
      className="hamburger-icon"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line
        className="hamburger-line hamburger-line-top"
        x1="3"
        y1="6"
        x2="21"
        y2="6"
      />
      <line
        className="hamburger-line hamburger-line-middle"
        x1="3"
        y1="12"
        x2="21"
        y2="12"
      />
      <line
        className="hamburger-line hamburger-line-bottom"
        x1="3"
        y1="18"
        x2="21"
        y2="18"
      />
    </svg>
  );
}

