import { useCallback, useEffect, useRef, useState } from 'react';

type Tab = 'jq' | 'typescript' | 'visibility';

interface TabBarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string }[] = [
  { id: 'jq', label: 'JQ' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'visibility', label: 'Visibility' },
];

export type { Tab };

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [pillStyle, setPillStyle] = useState<{
    width: number;
    transform: string;
  } | null>(null);

  const updatePill = useCallback(() => {
    const activeBtn = buttonRefs.current.get(activeTab);
    if (!activeBtn) return;

    setPillStyle({
      width: activeBtn.offsetWidth,
      transform: `translateX(${activeBtn.offsetLeft}px)`,
    });
  }, [activeTab]);

  useEffect(() => {
    updatePill();
    const observer = new ResizeObserver(updatePill);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [updatePill]);

  return (
    <div
      ref={containerRef}
      className="relative flex gap-1 bg-gray-100 p-1 rounded-xl mb-4"
    >
      {pillStyle && (
        <div
          className="absolute left-0 top-1 bottom-1 rounded-lg bg-white shadow-sm transition-all duration-200 ease-in-out"
          style={{
            width: pillStyle.width,
            transform: pillStyle.transform,
          }}
        />
      )}
      {tabs.map((tab) => (
        <button
          key={tab.id}
          ref={(el) => {
            if (el) buttonRefs.current.set(tab.id, el);
            else buttonRefs.current.delete(tab.id);
          }}
          onClick={() => {
            if (tab.id !== activeTab) onTabChange(tab.id);
          }}
          className={`relative z-10 flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
            activeTab === tab.id
              ? 'text-gray-900'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
