import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AppHeader,
  Card,
  PageShell,
  TextArea,
} from '@new-personal-monorepo/small-app-design-system';
import '../src/style.css';
import { parseTree } from '../src/tree';
import { renderTree } from '../src/render';
import { shiftIndent } from '../src/indent';
import { useSettings } from '../src/settings';
import { WrapControls } from '../components/WrapControls';
import { TreeOutput } from '../components/TreeOutput';

const PLACEHOLDER = [
  'packages/',
  '  three-js-pipeline/',
  '    src/',
  '      components/',
  '        malagan-statue-1/',
  '          REFERENCES/',
  '            readme.md -- contains links to the cultural docs we have already created, textures, materials, etc',
  '            specific-real-artifact.png',
  '          mesh.scad',
].join('\n');

export default function Page() {
  const [source, setSource] = useState('');
  const [settings, setSettings] = useSettings();

  // Where the selection should land once React has committed a Tab-driven
  // edit. Holding the element here avoids guessing at commit timing.
  const pendingSelection = useRef<{
    el: HTMLTextAreaElement;
    start: number;
    end: number;
  } | null>(null);

  useEffect(() => {
    const pending = pendingSelection.current;
    if (!pending) return;
    pending.el.setSelectionRange(pending.start, pending.end);
    pendingSelection.current = null;
  }, [source]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Escape releases focus. Tab is indentation here, so it can no longer be
    // the way out of the field, and keyboard users need one.
    if (e.key === 'Escape') {
      e.currentTarget.blur();
      return;
    }
    if (e.key !== 'Tab') return;

    e.preventDefault();
    const el = e.currentTarget;
    const next = shiftIndent(
      { value: source, start: el.selectionStart, end: el.selectionEnd },
      e.shiftKey
    );
    if (next.value === source) return;

    pendingSelection.current = { el, start: next.start, end: next.end };
    setSource(next.value);
  };

  const tree = useMemo(
    () =>
      renderTree(parseTree(source), {
        width: settings.width,
        wrap: settings.wrap,
      }),
    [source, settings.width, settings.wrap]
  );

  return (
    <PageShell width="wide">
      <AppHeader
        title="Tree Generator"
        tagline="Turn indented text into a copyable ASCII tree"
        actions={<WrapControls settings={settings} onChange={setSettings} />}
      />
      {/* No items-start: the panes stretch to a shared height, and each one
          hands the slack to its field rather than leaving a ragged edge. */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="flex flex-col">
          <h2 className="text-sm font-medium text-gray-700 mb-4">Source</h2>
          <TextArea
            mono
            value={source}
            onChange={(e) => setSource(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={PLACEHOLDER}
            spellCheck={false}
            rows={16}
            className="flex-1 min-h-0 text-sm"
            aria-label="Tree source"
            aria-describedby="source-hint"
          />
          <p id="source-hint" className="mt-3 text-xs text-gray-500">
            <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700">
              Tab
            </kbd>{' '}
            /{' '}
            <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700">
              Shift&nbsp;+&nbsp;Tab
            </kbd>{' '}
            indent,{' '}
            <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700">
              Esc
            </kbd>{' '}
            leaves the field. Annotate a node with{' '}
            <code className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700">
              --
            </code>{' '}
            — long annotations wrap into an aligned block.
          </p>
        </Card>
        <Card className="flex flex-col">
          <TreeOutput tree={tree} />
        </Card>
      </div>
    </PageShell>
  );
}
