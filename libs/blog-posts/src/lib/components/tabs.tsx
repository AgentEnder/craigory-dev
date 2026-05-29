import {
  Children,
  isValidElement,
  ReactElement,
  ReactNode,
  useEffect,
  useId,
  useState,
} from 'react';
import classes from './tabs.module.scss';

const STORAGE_PREFIX = 'craigory-dev:tabs:';
const CHANGE_EVENT = 'craigory-dev:tabs-change';

interface TabChangeDetail {
  groupId: string;
  label: string;
}

function storageKey(groupId: string): string {
  return STORAGE_PREFIX + groupId;
}

function useSyncedLabel(
  groupId: string | undefined,
  availableLabels: string[],
  fallback: string
): [string, (next: string) => void] {
  const [label, setLabel] = useState<string>(fallback);

  useEffect(() => {
    if (!groupId) return;

    const stored = window.localStorage.getItem(storageKey(groupId));
    if (stored && availableLabels.includes(stored)) {
      setLabel(stored);
    }

    const onChange = (event: Event) => {
      const detail = (event as CustomEvent<TabChangeDetail>).detail;
      if (detail?.groupId === groupId && availableLabels.includes(detail.label)) {
        setLabel(detail.label);
      }
    };
    window.addEventListener(CHANGE_EVENT, onChange);
    return () => window.removeEventListener(CHANGE_EVENT, onChange);
  }, [groupId, availableLabels.join('|')]);

  const select = (next: string) => {
    setLabel(next);
    if (groupId) {
      window.localStorage.setItem(storageKey(groupId), next);
      window.dispatchEvent(
        new CustomEvent<TabChangeDetail>(CHANGE_EVENT, {
          detail: { groupId, label: next },
        })
      );
    }
  };

  return [label, select];
}

export interface TabProps {
  label: string;
  children?: ReactNode;
}

export function Tab({ children }: TabProps) {
  return <>{children}</>;
}

export interface TabsProps {
  /**
   * Optional sync group. Tabs blocks sharing a groupId mirror each other's
   * selection and persist the choice across page loads.
   */
  groupId?: string;
  children?: ReactNode;
}

export function Tabs({ groupId, children }: TabsProps) {
  const instanceId = useId();
  const panels = Children.toArray(children).filter(
    (child): child is ReactElement<TabProps> =>
      isValidElement(child) && child.type === Tab
  );

  const labels = panels.map((panel) => panel.props.label);
  const fallback = labels[0] ?? '';
  const [selected, setSelected] = useSyncedLabel(groupId, labels, fallback);
  const active = labels.includes(selected) ? selected : fallback;

  if (panels.length === 0) {
    return null;
  }

  return (
    <div className={classes['tabs']}>
      <div className={classes['tabList']} role="tablist">
        {labels.map((label) => {
          const isActive = label === active;
          const tabId = `${instanceId}-tab-${label}`;
          const panelId = `${instanceId}-panel-${label}`;
          return (
            <button
              key={label}
              type="button"
              role="tab"
              id={tabId}
              aria-selected={isActive}
              aria-controls={panelId}
              tabIndex={isActive ? 0 : -1}
              className={`${classes['tabButton']} ${
                isActive ? classes['tabButtonActive'] : ''
              }`}
              onClick={() => setSelected(label)}
            >
              {label}
            </button>
          );
        })}
      </div>
      {panels.map((panel) => {
        const isActive = panel.props.label === active;
        const tabId = `${instanceId}-tab-${panel.props.label}`;
        const panelId = `${instanceId}-panel-${panel.props.label}`;
        return (
          <div
            key={panel.props.label}
            id={panelId}
            role="tabpanel"
            aria-labelledby={tabId}
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
