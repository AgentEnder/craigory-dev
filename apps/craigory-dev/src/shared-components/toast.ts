/**
 * The toast API, split out from <Toaster> so that toaster.tsx exports nothing
 * but a component. A module mixing component and non-component exports can't
 * be a React Fast Refresh boundary, so editing it invalidates every importer
 * up to +Layout — which remounts the whole shell on the next navigation.
 */

declare global {
  interface GlobalEventHandlersEventMap {
    toast: CustomEvent<ToastOptions>;
  }
}

export type ToastContent = string | JSX.Element;

export type ToastOptions = {
  content: ToastContent;
  style?: 'success' | 'error' | 'info';
  duration?: number;
  ephemeral?: boolean;
};

export type Toast = ToastOptions & {
  id: string;
};

export function toast(options: ToastOptions) {
  window.dispatchEvent(
    new CustomEvent('toast', {
      detail: options,
    })
  );
}
