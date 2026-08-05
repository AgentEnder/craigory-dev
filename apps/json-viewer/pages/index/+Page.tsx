import { useEffect, useMemo, useState } from 'react';
import {
  AppHeader,
  Card,
  ErrorBoundary,
  ErrorPill,
  PageShell,
} from '@new-personal-monorepo/small-app-design-system';
import '../../src/style.css';
import { useJsonViewerStore } from '../../src/store';
import { decodeShare, readShareFromHash } from '../../src/share-url';
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
    <PageShell width="wide">
      <AppHeader
        title="JSON Viewer"
        tagline="Explore, filter, and transform JSON data"
        actions={jsonData !== null && <ShareButton />}
      />
      {shareError && <ErrorPill className="mb-6">{shareError}</ErrorPill>}
      <JsonInput />
      {jsonData !== null && (
        <>
          <Card className="mb-6">
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
          </Card>
          {errors.map((err) => (
            <ErrorPill key={err.location} className="mb-6">
              {err.message}
            </ErrorPill>
          ))}
          <ErrorBoundary>
            <JsonOutput data={output} />
          </ErrorBoundary>
        </>
      )}
    </PageShell>
  );
}
