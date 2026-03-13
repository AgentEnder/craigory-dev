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
  return (
    <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === tab.id
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
