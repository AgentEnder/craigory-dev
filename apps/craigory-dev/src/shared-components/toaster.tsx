import { useEffect, useState } from 'react';

import { IoClose } from 'react-icons/io5';

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

      // If the toast is ephemeral, remove it after a duration
      if (e.detail.ephemeral !== false) {
        setTimeout(() => {
          setToasts((prev) => prev.slice(0, -1));
        }, e.detail.duration ?? 3000);
      }
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
            ...((style) => {
              switch (style) {
                case 'success':
                  return { backgroundColor: '#282', color: 'white' };
                case 'error':
                  return { backgroundColor: '#822', color: 'white' };
                case 'info':
                  return { backgroundColor: '#228', color: 'white' };
                default:
                  return {
                    backgroundColor: '#434',
                    color: 'white',
                  };
              }
            })(toast.style),
            opacity: 0.7,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <button
            style={{
              display: 'inline-block',
              appearance: 'none',
              border: 'none',
              padding: 0,
              background: 'none',
            }}
            onClick={() => {
              setToasts((prev) => prev.filter((t) => t.id !== toast.id));
            }}
          >
            <IoClose color="white" fontSize={'2em'}></IoClose>
          </button>
          {toast.content}
        </div>
      ))}
    </div>
  );
}
