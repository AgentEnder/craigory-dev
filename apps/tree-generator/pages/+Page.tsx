import { useMemo, useState } from 'react';
import {
  AppHeader,
  Card,
  PageShell,
  TextArea,
} from '@new-personal-monorepo/small-app-design-system';
import '../src/style.css';
import { parseTree } from '../src/tree';
import { renderTree } from '../src/render';
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
      <div className="grid gap-6 md:grid-cols-2 items-start">
        <Card>
          <h2 className="text-sm font-medium text-gray-700 mb-4">Source</h2>
          <TextArea
            mono
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder={PLACEHOLDER}
            spellCheck={false}
            rows={16}
            className="text-sm"
            aria-label="Tree source"
          />
          <p className="mt-3 text-xs text-gray-500">
            Indent to nest. Annotate a node with{' '}
            <code className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700">
              --
            </code>{' '}
            — long annotations wrap into an aligned block.
          </p>
        </Card>
        <Card>
          <TreeOutput tree={tree} />
        </Card>
      </div>
    </PageShell>
  );
}
