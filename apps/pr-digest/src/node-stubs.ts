// Browser stubs for Node.js built-ins imported by pr-digest and its dependencies.
// The actual Node-only code paths (AI log summarization, file I/O, caching) are
// not exercised in the browser — only the GitHub API fetch + markdown formatting.

// child_process
export const spawn = () => {
  throw new Error('child_process is not available in the browser');
};
export const execSync = spawn;

// fs / fs/promises
export function readFile() {
  throw new Error('fs is not available in the browser');
}
export function writeFile() {
  throw new Error('fs is not available in the browser');
}
export function mkdir() {
  throw new Error('fs is not available in the browser');
}
export function stat() {
  throw new Error('fs is not available in the browser');
}
export const promises = { readFile, writeFile, mkdir, stat };

// path
export function join(...args: string[]) {
  return args.join('/');
}
export function resolve(...args: string[]) {
  return args.join('/');
}
export function dirname(p: string) {
  return p.split('/').slice(0, -1).join('/');
}
export function basename(p: string) {
  return p.split('/').pop() ?? '';
}
export function extname(p: string) {
  const base = basename(p);
  const idx = base.lastIndexOf('.');
  return idx > 0 ? base.slice(idx) : '';
}
export const sep = '/';
export const posix = { join, resolve, dirname, basename, extname, sep };

// os
export function tmpdir() {
  return '/tmp';
}
export function homedir() {
  return '/home';
}
export function platform() {
  return 'browser';
}

// crypto
export function createHash() {
  return {
    update() {
      return this;
    },
    digest() {
      return 'stub';
    },
  };
}

// readline
export function createInterface() {
  return {
    question(_q: string, cb: (a: string) => void) {
      cb('');
    },
    close() {},
  };
}

// util
export function inspect(obj: unknown) {
  return String(obj);
}
export function promisify(fn: unknown) {
  return fn;
}

export default {
  spawn,
  execSync,
  readFile,
  writeFile,
  mkdir,
  stat,
  promises,
  join,
  resolve,
  dirname,
  basename,
  extname,
  sep,
  posix,
  tmpdir,
  homedir,
  platform,
  createHash,
  createInterface,
  inspect,
  promisify,
};
