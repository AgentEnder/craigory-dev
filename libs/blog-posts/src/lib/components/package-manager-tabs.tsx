import {
  Children,
  isValidElement,
  ReactElement,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import classes from './package-manager-tabs.module.scss';

const MANAGERS = ['npm', 'pnpm', 'yarn', 'bun'] as const;
export type PackageManager = (typeof MANAGERS)[number];

const LABELS: Record<PackageManager, string> = {
  npm: 'npm',
  pnpm: 'pnpm',
  yarn: 'Yarn',
  bun: 'Bun',
};

const STORAGE_KEY = 'craigory-dev:package-manager-tab';
const CHANGE_EVENT = 'craigory-dev:package-manager-tab-change';
const DEFAULT_MANAGER: PackageManager = 'npm';

function isManager(value: unknown): value is PackageManager {
  return (
    typeof value === 'string' && (MANAGERS as readonly string[]).includes(value)
  );
}

function usePackageManagerSelection(): [
  PackageManager,
  (next: PackageManager) => void
] {
  const [manager, setManager] = useState<PackageManager>(DEFAULT_MANAGER);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isManager(stored)) {
      setManager(stored);
    }

    const onChange = (event: Event) => {
      const next = (event as CustomEvent<PackageManager>).detail;
      if (isManager(next)) {
        setManager(next);
      }
    };
    window.addEventListener(CHANGE_EVENT, onChange);
    return () => window.removeEventListener(CHANGE_EVENT, onChange);
  }, []);

  const select = (next: PackageManager) => {
    window.localStorage.setItem(STORAGE_KEY, next);
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: next }));
  };

  return [manager, select];
}

export interface PackageManagerTabProps {
  manager: PackageManager;
  children?: ReactNode;
}

export function PackageManagerTab({ children }: PackageManagerTabProps) {
  return <>{children}</>;
}

export interface PackageManagerTabsProps {
  children?: ReactNode;
}

export function PackageManagerTabs({ children }: PackageManagerTabsProps) {
  const [selected, setSelected] = usePackageManagerSelection();

  const panels = Children.toArray(children).filter(
    (child): child is ReactElement<PackageManagerTabProps> =>
      isValidElement(child) && child.type === PackageManagerTab
  );

  const availableManagers = panels.map((panel) => panel.props.manager);
  const active = availableManagers.includes(selected)
    ? selected
    : availableManagers[0] ?? DEFAULT_MANAGER;

  return (
    <div className={classes['tabs']}>
      <div
        className={classes['tabList']}
        role="tablist"
        aria-label="Package manager"
      >
        {MANAGERS.filter((manager) => availableManagers.includes(manager)).map(
          (manager) => {
            const isActive = manager === active;
            return (
              <button
                key={manager}
                type="button"
                role="tab"
                id={`pm-tab-${manager}`}
                aria-selected={isActive}
                aria-controls={`pm-panel-${manager}`}
                tabIndex={isActive ? 0 : -1}
                className={`${classes['tabButton']} ${
                  isActive ? classes['tabButtonActive'] : ''
                }`}
                onClick={() => setSelected(manager)}
              >
                {LABELS[manager]}
              </button>
            );
          }
        )}
      </div>
      {panels.map((panel) => {
        const isActive = panel.props.manager === active;
        return (
          <div
            key={panel.props.manager}
            id={`pm-panel-${panel.props.manager}`}
            role="tabpanel"
            aria-labelledby={`pm-tab-${panel.props.manager}`}
            hidden={!isActive}
            className={classes['tabPanel']}
          >
            {panel.props.children}
          </div>
        );
      })}
    </div>
  );
}
