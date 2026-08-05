/** @vitest-environment jsdom */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppHeader } from './AppHeader';
import { Card } from './Card';
import { ErrorBoundary } from './ErrorBoundary';
import { ErrorPill } from './ErrorPill';
import { PageShell } from './PageShell';
import { TextArea, TextInput } from './fields';
import { cx } from './cx';

describe('cx', () => {
  it('drops falsy entries', () => {
    expect(cx('a', false, null, undefined, 'b')).toBe('a b');
  });

  it('returns an empty string when nothing survives', () => {
    expect(cx(false, undefined)).toBe('');
  });
});

describe('PageShell', () => {
  it('defaults to the wide container', () => {
    const { container } = render(<PageShell>content</PageShell>);
    expect(container.querySelector('.max-w-4xl')).not.toBeNull();
  });

  it('honours the narrow width', () => {
    const { container } = render(<PageShell width="narrow">x</PageShell>);
    expect(container.querySelector('.max-w-md')).not.toBeNull();
    expect(container.querySelector('.max-w-4xl')).toBeNull();
  });

  it('keeps the shared page background', () => {
    const { container } = render(<PageShell>x</PageShell>);
    const shell = container.firstElementChild;
    expect(shell?.className).toContain('min-h-screen');
    expect(shell?.className).toContain('bg-slate-50');
  });
});

describe('AppHeader', () => {
  it('renders the title as a heading', () => {
    render(<AppHeader title="Tree Generator" />);
    expect(
      screen.getByRole('heading', { name: 'Tree Generator' })
    ).toBeDefined();
  });

  it('renders the tagline when given', () => {
    render(<AppHeader title="T" tagline="Build trees" />);
    expect(screen.getByText('Build trees')).toBeDefined();
  });

  it('omits the tagline paragraph when absent', () => {
    const { container } = render(<AppHeader title="T" />);
    expect(container.querySelector('p')).toBeNull();
  });

  it('renders actions in the trailing cell', () => {
    render(<AppHeader title="T" actions={<button>Settings</button>} />);
    expect(screen.getByRole('button', { name: 'Settings' })).toBeDefined();
  });
});

describe('Card', () => {
  it('carries the shared card treatment', () => {
    const { container } = render(<Card>body</Card>);
    const card = container.firstElementChild;
    expect(card?.className).toContain('bg-white');
    expect(card?.className).toContain('rounded-3xl');
    expect(card?.className).toContain('animate-fade-in');
  });

  it('appends caller classes rather than replacing them', () => {
    const { container } = render(<Card className="mb-6">body</Card>);
    const card = container.firstElementChild;
    expect(card?.className).toContain('mb-6');
    expect(card?.className).toContain('bg-white');
  });

  it('forwards arbitrary div props', () => {
    render(<Card data-testid="pane">body</Card>);
    expect(screen.getByTestId('pane')).toBeDefined();
  });
});

describe('ErrorPill', () => {
  it('exposes itself as an alert', () => {
    render(<ErrorPill>Bad input</ErrorPill>);
    const alert = screen.getByRole('alert');
    expect(alert.textContent).toBe('Bad input');
    expect(alert.className).toContain('bg-red-50');
  });
});

describe('fields', () => {
  it('TextInput omits the monospace class by default', () => {
    render(<TextInput aria-label="plain" />);
    expect(screen.getByLabelText('plain').className).not.toContain('font-mono');
  });

  it('TextInput opts into monospace', () => {
    render(<TextInput mono aria-label="code" />);
    expect(screen.getByLabelText('code').className).toContain('font-mono');
  });

  it('does not leak the mono prop to the DOM', () => {
    render(<TextInput mono aria-label="code" />);
    expect(screen.getByLabelText('code').hasAttribute('mono')).toBe(false);
  });

  it('TextArea carries the shared focus ring and resists resizing', () => {
    render(<TextArea aria-label="src" />);
    const el = screen.getByLabelText('src');
    expect(el.className).toContain('focus:ring-blue-500');
    expect(el.className).toContain('resize-none');
  });

  it('TextArea forwards value and change handlers', () => {
    render(<TextArea aria-label="src" value="hello" readOnly />);
    expect((screen.getByLabelText('src') as HTMLTextAreaElement).value).toBe(
      'hello'
    );
  });
});

describe('ErrorBoundary', () => {
  function Boom(): never {
    throw new Error('kaboom');
  }

  it('renders children when nothing throws', () => {
    render(
      <ErrorBoundary>
        <span>fine</span>
      </ErrorBoundary>
    );
    expect(screen.getByText('fine')).toBeDefined();
  });

  it('shows the default fallback on error', () => {
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>
    );
    expect(screen.getByText('Something went wrong')).toBeDefined();
    expect(screen.getByText('kaboom')).toBeDefined();
  });

  it('uses a custom fallback when provided', () => {
    render(
      <ErrorBoundary fallback={(error) => <p>caught: {error.message}</p>}>
        <Boom />
      </ErrorBoundary>
    );
    expect(screen.getByText(/caught: kaboom/)).toBeDefined();
  });
});
