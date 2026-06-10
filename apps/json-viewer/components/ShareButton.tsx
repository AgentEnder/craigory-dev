import { useEffect, useRef, useState } from 'react';
import { useJsonViewerStore } from '../src/store';
import { buildShareUrl, encodeShare } from '../src/share-url';

type Status =
  | { kind: 'idle' }
  | { kind: 'copied' }
  | { kind: 'error'; message: string };

export function ShareButton() {
  const jsonData = useJsonViewerStore((s) => s.jsonData);
  const activeTab = useJsonViewerStore((s) => s.activeTab);
  const jqExpression = useJsonViewerStore((s) => s.jqExpression);
  const tsCode = useJsonViewerStore((s) => s.tsCode);
  const hiddenPaths = useJsonViewerStore((s) => s.hiddenPaths);

  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [busy, setBusy] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  const flash = (next: Status, ms = 2500) => {
    setStatus(next);
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(() => setStatus({ kind: 'idle' }), ms);
  };

  const handleClick = async () => {
    if (busy || jsonData === null) return;
    setBusy(true);
    try {
      const encoded = await encodeShare({
        data: jsonData,
        tab: activeTab,
        jq: jqExpression,
        ts: tsCode,
        hidden: Array.from(hiddenPaths),
      });

      // Verify the browser will actually accept a URL this large. Some browsers
      // silently truncate the hash on history.replaceState / address-bar paste.
      const expected = `#share=${encoded}`;
      const previousHash = window.location.hash;
      window.history.replaceState(null, '', expected);
      const actual = window.location.hash;
      if (actual !== expected) {
        // Roll back so we don't leave the URL in a broken state.
        window.history.replaceState(null, '', previousHash || ' ');
        throw new Error(
          `Browser truncated the URL: tried to write ${expected.length.toLocaleString()} chars, got back ${actual.length.toLocaleString()}. The data is too large to share via URL in this browser.`
        );
      }

      const url = buildShareUrl(encoded);
      await navigator.clipboard.writeText(url);

      // The clipboard itself can truncate on some platforms (macOS appears to
      // cap text payloads around 512K chars). Read back what we just wrote and
      // verify it matches — otherwise the URL we copied won't paste intact.
      try {
        const readBack = await navigator.clipboard.readText();
        if (readBack.length !== url.length) {
          throw new Error(
            `Clipboard truncated the URL: wrote ${url.length.toLocaleString()} chars, read back ${readBack.length.toLocaleString()}. The data is too large for this OS's clipboard.`
          );
        }
      } catch (e) {
        // Some browsers/permission states block clipboard reads. If reading is
        // blocked, fall through silently — we did our best.
        if (
          e instanceof Error &&
          e.message.startsWith('Clipboard truncated')
        ) {
          throw e;
        }
        console.warn('[share] clipboard readback skipped:', e);
      }

      flash({ kind: 'copied' });
    } catch (e) {
      const message =
        e instanceof Error
          ? `Could not create share link: ${e.message}`
          : 'Could not create share link.';
      flash({ kind: 'error', message }, 6000);
    } finally {
      setBusy(false);
    }
  };

  const label =
    status.kind === 'copied'
      ? 'Copied!'
      : busy
        ? 'Encoding…'
        : 'Copy share URL';

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={busy || jsonData === null}
        className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 active:scale-95 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {label}
      </button>
      {status.kind === 'error' && (
        <p className="text-xs text-red-500 max-w-xs text-right">
          {status.message}
        </p>
      )}
    </div>
  );
}
