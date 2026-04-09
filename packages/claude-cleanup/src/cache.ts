import { readFileSync, unlinkSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { homedir } from 'node:os';

export interface CacheEntry {
  summary: string;
  mtimeMs: number;
}

export type SummaryCache = Record<string, CacheEntry>;

const CACHE_PATH = join(homedir(), '.claude', 'claude-cleanup-cache.json');

export function loadCache(): SummaryCache {
  try {
    return JSON.parse(readFileSync(CACHE_PATH, 'utf-8'));
  } catch {
    return {};
  }
}

export function saveCache(cache: SummaryCache): void {
  try {
    mkdirSync(dirname(CACHE_PATH), { recursive: true });
    writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
  } catch {
    // Non-critical — cache is best-effort
  }
}

export function clearCache(): boolean {
  try {
    unlinkSync(CACHE_PATH);
    return true;
  } catch {
    return false;
  }
}

export function getCachedSummary(
  cache: SummaryCache,
  conversationFile: string,
  mtimeMs: number
): string | undefined {
  const entry = cache[conversationFile];
  if (entry && entry.mtimeMs === mtimeMs) {
    return entry.summary;
  }
  return undefined;
}

export function setCachedSummary(
  cache: SummaryCache,
  conversationFile: string,
  mtimeMs: number,
  summary: string
): void {
  cache[conversationFile] = { summary, mtimeMs };
}
