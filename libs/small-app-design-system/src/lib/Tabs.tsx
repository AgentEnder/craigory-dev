import {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { cx } from './cx';

export interface TabProps<T extends string = string> {
  id: T;
  label: string;
  children: ReactNode;
}

/**
 * Declares one tab: its button label and its panel content in a single place.
 *
 * Never rendered directly -- Tabs reads these as configuration and renders the
 * active one itself, so the panel of an inactive tab is never mounted.
 */
export function Tab<T extends string = string>(_props: TabProps<T>): null {
  return null;
}

interface TabsProps<T extends string> {
  /**
   * Controlled selection. Pass this when the active tab also matters outside
   * the component -- persisted, encoded into a share link, filtered against --
   * so there is only ever one copy of that state.
   */
  value?: T;
  /** Uncontrolled starting tab. Defaults to the first one declared. */
  defaultValue?: T;
  /** Fires on every change, in both modes. */
  onChange?: (id: T) => void;
  children: ReactNode;
  className?: string;
  panelClassName?: string;
}

function readTabs<T extends string>(children: ReactNode): TabProps<T>[] {
  return Children.toArray(children)
    .filter((child): child is ReactElement<TabProps<T>> => isValidElement(child))
    .map((child) => child.props);
}

export function Tabs<T extends string>({
  value,
  defaultValue,
  onChange,
  children,
  className,
  panelClassName,
}: TabsProps<T>) {
  const tabs = readTabs<T>(children);
  const [internal, setInternal] = useState<T | undefined>(defaultValue);

  // Controlled the moment a value is supplied; otherwise the component keeps
  // its own, seeded from defaultValue or the first tab declared.
  const controlled = value !== undefined;
  const active = (controlled ? value : internal ?? tabs[0]?.id) as T;

  const select = useCallback(
    (id: T) => {
      if (!controlled) setInternal(id);
      onChange?.(id);
    },
    [controlled, onChange]
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [pill, setPill] = useState<{ width: number; left: number } | null>(null);

  const measure = useCallback(() => {
    const btn = buttonRefs.current.get(active);
    if (!btn) return;
    setPill({ width: btn.offsetWidth, left: btn.offsetLeft });
  }, [active]);

  useEffect(() => {
    measure();
    const observer = new ResizeObserver(measure);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [measure]);

  // Arrow-key movement between tabs, which is what role="tablist" promises.
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const delta = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const at = tabs.findIndex((t) => t.id === active);
    const next = tabs[(at + delta + tabs.length) % tabs.length];
    if (next) {
      select(next.id);
      buttonRefs.current.get(next.id)?.focus();
    }
  };

  const activeTab = tabs.find((t) => t.id === active);

  return (
    <>
      <div
        ref={containerRef}
        role="tablist"
        onKeyDown={handleKeyDown}
        className={cx(
          'relative flex gap-1 bg-gray-100 p-1 rounded-xl mb-4',
          className
        )}
      >
        {pill && (
          <div
            className="absolute left-0 top-1 bottom-1 rounded-lg bg-white shadow-sm transition-all duration-200 ease-in-out"
            style={{ width: pill.width, transform: `translateX(${pill.left}px)` }}
          />
        )}
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={tab.id === active}
            tabIndex={tab.id === active ? 0 : -1}
            ref={(el) => {
              if (el) buttonRefs.current.set(tab.id, el);
              else buttonRefs.current.delete(tab.id);
            }}
            onClick={() => {
              if (tab.id !== active) select(tab.id);
            }}
            className={cx(
              'relative z-10 flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
              tab.id === active
                ? 'text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" className={panelClassName}>
        {/* Keyed on the active tab so switching away from a panel that threw
            gives the next one a clean mount instead of a stuck error. */}
        <ErrorBoundary key={active}>{activeTab?.children}</ErrorBoundary>
      </div>
    </>
  );
}
