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
import { duplicateLines, moveLines, shiftIndent } from '../src/edits';
import { useSettings } from '../src/settings';
import { WrapControls } from '../components/WrapControls';
import { TreeOutput } from '../components/TreeOutput';

const PLACEHOLDER = [
  'src/',
  '  components/',
  '    Button.tsx -- every variant lives here, so restyling is one file',
  '    Card.tsx',
  '  utils/',
  '    format.ts',
  'README.md',
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
    const el = e.currentTarget;
    const selection = {
      value: source,
      start: el.selectionStart,
      end: el.selectionEnd,
    };

    const arrow =
      e.key === 'ArrowUp' ? -1 : e.key === 'ArrowDown' ? 1 : 0;

    // Alt+Arrow moves lines, Shift+Alt+Arrow copies them -- the bindings
    // editors already use, so the muscle memory carries over.
    const next =
      e.key === 'Tab'
        ? shiftIndent(selection, e.shiftKey)
        : e.altKey && arrow
          ? e.shiftKey
            ? duplicateLines(selection, arrow)
            : moveLines(selection, arrow)
          : null;

    if (!next) return;
    e.preventDefault();
    // moveLines is a no-op at either end of the document.
    if (next.value === source) return;

    pendingSelection.current = { el, start: next.start, end: next.end };
    setSource(next.value);
  };

  const options = { width: settings.width, wrap: settings.wrap };

  const tree = useMemo(
    () => renderTree(parseTree(source), options),
    [source, settings.width, settings.wrap]
  );

  // Rendered with the live wrap settings, so changing them while the field is
  // empty still demonstrates what they do.
  const placeholderTree = useMemo(
    () => renderTree(parseTree(PLACEHOLDER), options),
    [settings.width, settings.wrap]
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
          {/* h-9 matches the output pane's header, whose height is set by the
              Copy button -- otherwise the two titles sit 8px apart. */}
          <div className="flex items-center h-9 mb-4">
            <h2 className="text-sm font-medium text-gray-700">Source</h2>
          </div>
          <TextArea
            mono
            value={source}
            onChange={(e) => setSource(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={PLACEHOLDER}
            spellCheck={false}
            rows={16}
            // border-gray-300 over the shared field's gray-200: a 1px hairline
            // lands on a single device pixel at fractional DPR, where the
            // lighter grey all but disappears against the white card.
            className="flex-1 min-h-0 text-sm border-gray-300"
            aria-label="Tree source"
            aria-describedby="source-hint"
          />
        </Card>
        <Card className="flex flex-col">
          <TreeOutput tree={tree} placeholder={placeholderTree} />
        </Card>
      </div>
      <p
        id="source-hint"
        className="mt-6 text-center text-xs text-gray-400 text-balance"
      >
        Indent to nest a node. Annotate one with{' '}
        <code className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">
          --
        </code>
        .{' '}
        <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">
          Tab
        </kbd>{' '}
        and{' '}
        <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">
          Shift&nbsp;+&nbsp;Tab
        </kbd>{' '}
        indent,{' '}
        <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">
          Alt&nbsp;+&nbsp;↑/↓
        </kbd>{' '}
        moves lines,{' '}
        <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">
          Shift&nbsp;+&nbsp;Alt&nbsp;+&nbsp;↑/↓
        </kbd>{' '}
        copies them,{' '}
        <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">
          Esc
        </kbd>{' '}
        leaves the field.
      </p>
    </PageShell>
  );
}
