import {
  createContext,
  ReactNode,
  useContext,
  useRef,
  useSyncExternalStore,
} from 'react';
import classes from './citations.module.scss';

export interface CitedSource {
  /** 1-based position, assigned in first-cited order. */
  n: number;
  href: string;
  body?: ReactNode;
}

/**
 * Assigns citation numbers in the order sources are first cited, and keeps the
 * list for `<Citations />` to render.
 *
 * Registration happens during render rather than in an effect, because the blog
 * is server-rendered and effects never run there. That is safe here because
 * `register` is keyed by href and idempotent: re-renders and StrictMode's
 * double render return the number already assigned instead of appending.
 */
class CitationRegistry {
  private order: string[] = [];
  private bodies = new Map<string, ReactNode>();
  private listeners = new Set<() => void>();
  private snapshot: CitedSource[] = [];
  private notifyQueued = false;

  register = (href: string, body?: ReactNode): number => {
    const existing = this.order.indexOf(href);
    if (existing === -1) {
      this.order.push(href);
      this.bodies.set(href, body ?? null);
      this.rebuild();
      return this.order.length;
    }
    // A repeat citation may carry the body that the first one omitted.
    if (body != null && this.bodies.get(href) == null) {
      this.bodies.set(href, body);
      this.rebuild();
    }
    return existing + 1;
  };

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getSnapshot = (): CitedSource[] => this.snapshot;

  private rebuild() {
    this.snapshot = this.order.map((href, i) => ({
      n: i + 1,
      href,
      body: this.bodies.get(href) ?? undefined,
    }));
    // Notifying synchronously would be a state update during another
    // component's render pass, so defer it past the end of this one.
    if (this.notifyQueued) return;
    this.notifyQueued = true;
    queueMicrotask(() => {
      this.notifyQueued = false;
      this.listeners.forEach((listener) => listener());
    });
  }
}

const CitationsContext = createContext<CitationRegistry | null>(null);

export function CitationsProvider({ children }: { children?: ReactNode }) {
  // Lazily constructed so each post page gets its own numbering.
  const ref = useRef<CitationRegistry | null>(null);
  if (!ref.current) {
    ref.current = new CitationRegistry();
  }
  return (
    <CitationsContext.Provider value={ref.current}>
      {children}
    </CitationsContext.Provider>
  );
}

function useRegistry(): CitationRegistry {
  const registry = useContext(CitationsContext);
  if (!registry) {
    throw new Error(
      'Citation components must be rendered inside <CitationsProvider>.'
    );
  }
  return registry;
}

/** Returns this source's citation number, assigning one on first use. */
export function useCitationPosition(href: string, body?: ReactNode): number {
  return useRegistry().register(href, body);
}

/** Every source cited so far, in citation order. */
export function useCitedSources(): CitedSource[] {
  const registry = useRegistry();
  return useSyncExternalStore(
    registry.subscribe,
    registry.getSnapshot,
    registry.getSnapshot
  );
}

export interface CitationsProps {
  /** Heading text. Rendered as an h2, so it joins the sidebar contents list. */
  title?: string;
}

/**
 * The post's source list. Belongs at the end of the MDX: it renders whatever
 * has been cited above it.
 */
export function Citations({ title = 'Sources' }: CitationsProps) {
  const sources = useCitedSources();
  if (sources.length === 0) {
    return null;
  }
  return (
    <section className={classes['citations']}>
      <h2>{title}</h2>
      <ol className={classes['list']}>
        {sources.map((source) => (
          <li key={source.href} id={`source-${source.n}`}>
            {source.body ?? (
              <a href={source.href} target="_blank" rel="noopener noreferrer">
                {source.href}
              </a>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
