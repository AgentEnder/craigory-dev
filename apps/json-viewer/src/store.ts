import { create } from 'zustand';
import { applyVisibilityFilter, findSiblingPaths } from './visibility-filter';
import type { SharePayload } from './share-url';

type Tab = 'jq' | 'typescript' | 'visibility';

interface AppError {
  location: Tab | 'output';
  message: string;
}

const DEFAULT_JQ = '.';
const DEFAULT_TS = `export default function transform(data: DataType) {
  return data;
}
`;

interface JsonViewerState {
  jsonData: unknown;
  rawJsonText: string;
  activeTab: Tab;
  output: unknown;
  errors: AppError[];
  hiddenPaths: Set<string>;
  jqExpression: string;
  tsCode: string;
}

interface JsonViewerActions {
  setJsonData: (data: unknown, rawText?: string) => void;
  setRawJsonText: (text: string) => void;
  setActiveTab: (tab: Tab) => void;
  setOutput: (output: unknown) => void;
  setError: (location: AppError['location'], message: string) => void;
  clearError: (location: AppError['location']) => void;
  togglePath: (path: string) => void;
  setJqExpression: (expr: string) => void;
  setTsCode: (code: string) => void;
  restoreShare: (payload: SharePayload) => void;
}

export type JsonViewerStore = JsonViewerState & JsonViewerActions;

export const DEFAULT_TS_CODE = DEFAULT_TS;
export const DEFAULT_JQ_EXPRESSION = DEFAULT_JQ;

export const useJsonViewerStore = create<JsonViewerStore>((set, get) => ({
  jsonData: null,
  rawJsonText: '',
  activeTab: 'typescript',
  output: null,
  errors: [],
  hiddenPaths: new Set(),
  jqExpression: DEFAULT_JQ,
  tsCode: DEFAULT_TS,

  setJsonData: (data, rawText) =>
    set({
      jsonData: data,
      rawJsonText: rawText ?? '',
      output: data,
      hiddenPaths: new Set(),
      errors: [],
    }),

  setRawJsonText: (text) => set({ rawJsonText: text }),

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

  setJqExpression: (expr) => set({ jqExpression: expr }),
  setTsCode: (code) => set({ tsCode: code }),

  restoreShare: (payload) => {
    const hiddenPaths = new Set(payload.hidden);
    let output: unknown = payload.data;
    if (payload.tab === 'visibility' && payload.data !== null) {
      try {
        output = applyVisibilityFilter(payload.data, hiddenPaths);
      } catch {
        output = payload.data;
      }
    }
    set({
      jsonData: payload.data,
      rawJsonText:
        payload.data === null
          ? ''
          : JSON.stringify(payload.data, null, 2),
      activeTab: payload.tab,
      hiddenPaths,
      jqExpression: payload.jq || DEFAULT_JQ,
      tsCode: payload.ts || DEFAULT_TS,
      output,
      errors: [],
    });
  },
}));
