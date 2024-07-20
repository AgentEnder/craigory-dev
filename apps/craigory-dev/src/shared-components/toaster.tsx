import { useEffect, useState } from 'react';

declare global {
  interface GlobalEventHandlersEventMap {
    toast: CustomEvent<ToastOptions>;
  }
}

export type ToastContent = string | JSX.Element;

export type ToastOptions = {
  content: ToastContent;
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

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (e: CustomEvent<ToastOptions>) => {
      const id = performance.now() + Math.random().toFixed(4);
      setToasts((prev) => [
        {
          ...e.detail,
          id,
        },
        ...prev,
      ]);

      setTimeout(() => {
        setToasts((prev) => prev.slice(0, -1));
      }, 3000);
    };
    window.addEventListener('toast', listener);

    return () => {
      window.removeEventListener('toast', listener);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        margin: 16,
        borderRadius: 8,
        width: 'min(100%, 400px)',
      }}
    >
      {toasts.map((toast, i) => (
        <div
          key={toast.id}
          style={{
            transition: 'bottom 0.3s',
            bottom: `${i * 64}px`,
            right: 0,
            position: 'absolute',
            textAlign: 'right',
            padding: '1em',
            borderRadius: 8,
            backgroundColor: 'rgba(64, 48, 64, 0.6)',
            color: 'white',
          }}
        >
          {toast.content}
        </div>
      ))}
    </div>
  );
}
