import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AppHeader,
  Card,
  PageShell,
} from '@new-personal-monorepo/small-app-design-system';
import '../src/style.css';
import { parseTree } from '../src/tree';
import { renderTree } from '../src/render';
import { duplicateLines, moveLines, shiftIndent } from '../src/edits';
import { useSettings } from '../src/settings';
import { looksRendered, unrenderTree } from '../src/unrender';
import { WrapControls } from '../components/WrapControls';
import { TreeOutput } from '../components/TreeOutput';
import { SourceEditor } from '../components/SourceEditor';
import { SplitPane } from '../components/SplitPane';
import { ToggleChip } from '../components/ToggleChip';

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
  // Set when a paste was rewritten, so the change is announced rather than
  // just happening to the user's clipboard behind their back.
  const [unformatted, setUnformatted] = useState(false);

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

    const arrow = e.key === 'ArrowUp' ? -1 : e.key === 'ArrowDown' ? 1 : 0;

    // Alt+Arrow moves lines, Shift+Alt+Arrow copies them -- the bindings
    // editors already use, so the muscle memory carries over.
    const isLineMove = e.altKey && arrow !== 0;
    if (e.key !== 'Tab' && !isLineMove) return;

    // Claim the key even if the edit turns out to be impossible, so the caret
    // does not also jump the way an unhandled arrow would.
    e.preventDefault();

    const next = isLineMove
      ? e.shiftKey
        ? duplicateLines(selection, arrow)
        : moveLines(selection, arrow)
      : shiftIndent(selection, e.shiftKey);

    // Only moveLines returns null, at the ends of the document.
    if (!next) return;

    if (next.value === source) {
      // The text can be identical while the selection still has to move --
      // swapping two identical lines, or outdenting a line with no indent.
      // React would skip the re-render, so the pending-selection effect would
      // never fire; apply it now instead.
      el.setSelectionRange(next.start, next.end);
      return;
    }

    pendingSelection.current = { el, start: next.start, end: next.end };
    setSource(next.value);
  };

  /**
   * Pasting a rendered tree back in is the obvious way to edit one you made
   * earlier, or one that came out of `tree`. Read literally it would nest a
   * forest of box-drawing characters, so it is turned back into source first.
   *
   * Anything that is not a rendered tree falls through to the browser's own
   * paste, which keeps the native undo entry that a programmatic edit loses.
   */
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pasted = e.clipboardData.getData('text/plain');
    if (!looksRendered(pasted)) return;

    e.preventDefault();
    const el = e.currentTarget;
    const text = unrenderTree(pasted);
    const at = el.selectionStart;
    const next = source.slice(0, at) + text + source.slice(el.selectionEnd);
    const caret = at + text.length;
    setUnformatted(true);

    if (next === source) {
      // Pasting the identical thing over itself: React skips the re-render, so
      // the pending-selection effect would never run to place the caret.
      el.setSelectionRange(caret, caret);
      return;
    }

    pendingSelection.current = { el, start: caret, end: caret };
    setSource(next);
  };

  useEffect(() => {
    if (!unformatted) return;
    const timer = setTimeout(() => setUnformatted(false), 3000);
    return () => clearTimeout(timer);
  }, [unformatted]);

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
    <PageShell width="full">
      <AppHeader
        title="Tree Generator"
        tagline="Turn indented text into a copyable ASCII tree"
        actions={<WrapControls settings={settings} onChange={setSettings} />}
      />
      <SplitPane
        fraction={settings.split}
        onFractionChange={(split) => setSettings({ ...settings, split })}
        label="the source and rendered tree panes"
        // A tall row on a desktop: this is an editor, and both panes are worth
        // more rows than a content page would give them. Bounded below so a
        // short window does not squeeze it to nothing.
        className="md:h-[calc(100vh-15rem)] md:min-h-[26rem]"
        start={
          <Card className="flex flex-col min-w-0">
            {/* h-9 matches the output pane's header, whose height is set by the
                Copy button -- otherwise the two titles sit 8px apart. */}
            <div className="flex items-center h-9 mb-4 gap-3">
              <h2 className="text-sm font-medium text-gray-700 mr-auto">
                Source
              </h2>
              {unformatted && (
                <span
                  role="status"
                  className="text-xs text-gray-400 truncate animate-fade-in"
                >
                  Un-formatted a pasted tree
                </span>
              )}
              <ToggleChip
                label="Wrap"
                pressed={settings.sourceWrap}
                onPressedChange={(sourceWrap) =>
                  setSettings({ ...settings, sourceWrap })
                }
                title="Soft-wrap long lines in this field. Only changes how the source looks -- it does not affect the rendered tree."
              />
            </div>
            <SourceEditor
              value={source}
              onChange={setSource}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              placeholder={PLACEHOLDER}
              wrap={settings.sourceWrap}
              describedBy="source-hint"
            />
          </Card>
        }
        end={
          <Card className="flex flex-col min-w-0">
            <TreeOutput
              tree={tree}
              placeholder={placeholderTree}
              wrap={settings.wrap}
              width={settings.width}
            />
          </Card>
        }
      />
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
        leaves the field. Drag the grip beside a line to move it and everything
        under it.
      </p>
    </PageShell>
  );
}
