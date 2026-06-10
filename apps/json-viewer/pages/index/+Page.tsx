import { useEffect, useMemo, useState } from 'react';
import '../../src/style.css';
import { useJsonViewerStore } from '../../src/store';
import { decodeShare, readShareFromHash } from '../../src/share-url';
import { AppHeader } from '../../components/AppHeader';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { JsonInput } from '../../components/JsonInput';
import { TabBar } from '../../components/TabBar';
import { JsonOutput } from '../../components/JsonOutput';
import { VisibilityTree } from '../../components/VisibilityTree';
import { JqEditor } from '../../components/JqEditor';
import { TypeScriptEditor } from '../../components/TypeScriptEditor';
import { ShareButton } from '../../components/ShareButton';

export default function Page() {
  const jsonData = useJsonViewerStore((s) => s.jsonData);
  const activeTab = useJsonViewerStore((s) => s.activeTab);
  const output = useJsonViewerStore((s) => s.output);
  const hiddenPaths = useJsonViewerStore((s) => s.hiddenPaths);
  const setActiveTab = useJsonViewerStore((s) => s.setActiveTab);
  const togglePath = useJsonViewerStore((s) => s.togglePath);
  const restoreShare = useJsonViewerStore((s) => s.restoreShare);
  const allErrors = useJsonViewerStore((s) => s.errors);
  const errors = useMemo(
    () => allErrors.filter((e) => e.location === activeTab),
    [allErrors, activeTab]
  );

  const [shareError, setShareError] = useState<string | null>(null);

  useEffect(() => {
    const encoded = readShareFromHash();
    console.log(
      '[share] hash on mount:',
      encoded ? `${encoded.length} chars` : '(none)'
    );
    if (!encoded) return;
    let cancelled = false;
    decodeShare(encoded)
      .then((payload) => {
        if (cancelled) return;
        if (payload) {
          console.log('[share] restoring; tab:', payload.tab);
          restoreShare(payload);
        } else {
          console.warn('[share] decode returned null; not restoring');
          setShareError(
            'This share link could not be decoded. See the browser console for details.'
          );
        }
      })
      .catch((e) => {
        if (cancelled) return;
        console.error('[share] decode threw:', e);
        setShareError(
          `Share link error: ${e instanceof Error ? e.message : String(e)}`
        );
      });
    return () => {
      cancelled = true;
    };
  }, [restoreShare]);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <AppHeader actions={jsonData !== null && <ShareButton />} />
        {shareError && (
          <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 animate-fade-in">
            {shareError}
          </div>
        )}
        <JsonInput />
        {jsonData !== null && (
          <>
            <div className="bg-white rounded-3xl p-6 border border-gray-100 mb-6 animate-fade-in">
              <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
              <div className="min-h-[200px]">
                <ErrorBoundary key={activeTab}>
                  {activeTab === 'jq' ? (
                    <JqEditor />
                  ) : activeTab === 'typescript' ? (
                    <TypeScriptEditor />
                  ) : activeTab === 'visibility' ? (
                    <VisibilityTree
                      data={jsonData}
                      hiddenPaths={hiddenPaths}
                      onTogglePath={togglePath}
                    />
                  ) : null}
                </ErrorBoundary>
              </div>
            </div>
            {errors.map((err) => (
              <div
                key={err.location}
                className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 animate-fade-in"
              >
                {err.message}
              </div>
            ))}
            <ErrorBoundary>
              <JsonOutput data={output} />
            </ErrorBoundary>
          </>
        )}
      </div>
    </div>
  );
}
