export interface JqApi {
  json: (data: unknown, filter: string) => unknown;
  raw: (jsonString: string, filter: string, flags?: string[]) => string;
}

// jq-web's `module.exports` is itself a Promise<{ json, raw }>. Bundlers build
// their CJS namespace wrapper with Object.create(Object.getPrototypeOf(exports)),
// so for this package the wrapper inherits Promise.prototype while owning none of
// a promise's internal slots. `await import('jq-web')` adopts that wrapper as a
// thenable and dies with "Method Promise.prototype.then called on incompatible
// receiver #<Promise>" — the wrapper only looks like a promise.
//
// A static default import reads `.default` synchronously, so nothing ever awaits
// the wrapper and we get the real promise. Reach this module through a dynamic
// import to keep jq's 2.7 MB wasm out of the initial bundle.
import jqReady from 'jq-web';

export const jq = jqReady as Promise<JqApi>;
