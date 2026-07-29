/**
 * Minimal shim for the subset of `bun:sqlite` this build step uses.
 *
 * Deliberately not `@types/bun`: those types redefine a number of globals and
 * would apply to every project that resolves this workspace's type roots, to fix
 * one import in one build script.
 */
declare module 'bun:sqlite' {
  export interface Statement<T = unknown> {
    all(...params: unknown[]): T[];
    get(...params: unknown[]): T | null;
    run(...params: unknown[]): void;
  }

  export class Database {
    constructor(filename: string);
    static setCustomSQLite(path: string): void;
    run(sql: string, ...params: unknown[]): void;
    prepare<T = unknown>(sql: string): Statement<T>;
    loadExtension(path: string): void;
    close(): void;
  }
}
