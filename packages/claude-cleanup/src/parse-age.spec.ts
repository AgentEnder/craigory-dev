import { describe, it, expect } from 'vitest';
import { parseAge } from './parse-age.js';

describe('parseAge', () => {
  it('parses minutes', () => {
    expect(parseAge('30m')).toBe(30 * 60 * 1000);
  });

  it('parses hours', () => {
    expect(parseAge('2h')).toBe(2 * 60 * 60 * 1000);
  });

  it('parses days', () => {
    expect(parseAge('1d')).toBe(24 * 60 * 60 * 1000);
  });

  it('throws on invalid format', () => {
    expect(() => parseAge('abc')).toThrow('Invalid age format');
    expect(() => parseAge('10x')).toThrow('Invalid age format');
    expect(() => parseAge('')).toThrow('Invalid age format');
  });
});
