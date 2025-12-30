import React, { useState, useRef } from 'react';
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
