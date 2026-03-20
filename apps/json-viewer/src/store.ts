import { create } from 'zustand';
import { applyVisibilityFilter, findSiblingPaths } from './visibility-filter';

type Tab = 'jq' | 'typescript' | 'visibility';

interface AppError {
  location: Tab | 'output';
  message: string;
}

interface JsonViewerState {
  jsonData: unknown;
  activeTab: Tab;
  output: unknown;
  errors: AppError[];
  hiddenPaths: Set<string>;
}

interface JsonViewerActions {
  setJsonData: (data: unknown) => void;
  setActiveTab: (tab: Tab) => void;
  setOutput: (output: unknown) => void;
  setError: (location: AppError['location'], message: string) => void;
  clearError: (location: AppError['location']) => void;
  togglePath: (path: string) => void;
}

export type JsonViewerStore = JsonViewerState & JsonViewerActions;

export const useJsonViewerStore = create<JsonViewerStore>((set, get) => ({
  jsonData: null,
  activeTab: 'typescript',
  output: null,
  errors: [],
  hiddenPaths: new Set(),

  setJsonData: (data) =>
    set({
      jsonData: data,
      output: data,
      hiddenPaths: new Set(),
      errors: [],
    }),

  setActiveTab: (tab) => {
    const { jsonData, hiddenPaths } = get();
    const updates: Partial<JsonViewerState> = {
      activeTab: tab,
      errors: get().errors.filter((e) => e.location !== get().activeTab),
    };

    try {
      if (tab === 'visibility' && jsonData !== null) {
        updates.output = applyVisibilityFilter(jsonData, hiddenPaths);
      } else if (tab !== 'jq' && jsonData !== null) {
        updates.output = jsonData;
      }
    } catch {
      updates.output = jsonData;
    }

    set(updates);
  },

  setOutput: (output) => set({ output }),

  setError: (location, message) =>
    set((state) => ({
      errors: [
        ...state.errors.filter((e) => e.location !== location),
        { location, message },
      ],
    })),

  clearError: (location) =>
    set((state) => ({
      errors: state.errors.filter((e) => e.location !== location),
    })),

  togglePath: (path) => {
    const { jsonData, activeTab, hiddenPaths } = get();
    if (jsonData === null) return;
    if (!(hiddenPaths instanceof Set)) {
      set({ hiddenPaths: new Set() });
      return;
    }

    try {
      const next = new Set(hiddenPaths);
      const siblings = findSiblingPaths(jsonData, path);
      const isHiding = !hiddenPaths.has(path);
      for (const sibling of siblings) {
        if (isHiding) {
          next.add(sibling);
        } else {
          next.delete(sibling);
        }
      }

      const updates: Partial<JsonViewerState> = { hiddenPaths: next };
      if (activeTab === 'visibility') {
        updates.output = applyVisibilityFilter(jsonData, next);
      }
      set(updates);
    } catch {
      // Silently keep current state on failure
    }
  },
}));
