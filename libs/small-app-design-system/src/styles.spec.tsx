import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const styles = readFileSync(join(__dirname, 'styles.css'), 'utf8');

/** The stylesheet's usage docs quote the directives they describe, so any
 *  assertion about what this file *declares* has to ignore comments. */
const declarations = styles.replace(/\/\*[\s\S]*?\*\//g, '');

/*
 * Tailwind's automatic content detection skips node_modules, so the components'
 * classes are invisible to a consuming app's scan even though pnpm links this
 * package into apps/<app>/node_modules. The @source below is the only thing
 * pulling them in, and losing it fails silently — the build succeeds and the
 * styles just vanish. Hence a test rather than a comment.
 */
describe('shared stylesheet', () => {
  it('registers the component directory as a Tailwind source', () => {
    expect(declarations).toMatch(/@source\s+['"]\.\/lib['"]/);
  });

  it('does not import Tailwind itself', () => {
    // Doing so would re-root class scanning at this library and drop every
    // app-specific class from the consuming app's built CSS.
    expect(declarations).not.toMatch(/@import\s+['"]tailwindcss['"]/);
  });

  it('carries the shared animation and base treatment', () => {
    expect(styles).toContain('@keyframes fade-in');
    expect(styles).toContain('.animate-fade-in');
    expect(styles).toContain("font-feature-settings: 'cv01'");
  });
});
