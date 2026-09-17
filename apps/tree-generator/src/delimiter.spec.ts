import { describe, expect, it } from 'vitest';
import { DEFAULT_TOKEN, changeDelimiter, delimiterFor } from './delimiter';

describe('delimiterFor', () => {
  it('pads the token with a space either side', () => {
    expect(delimiterFor('--')).toBe(' -- ');
    expect(delimiterFor('#')).toBe(' # ');
  });

  it('is what keeps a flag from reading as an annotation', () => {
    expect('nx build --verbose'.includes(delimiterFor('--'))).toBe(false);
    expect('nx build -- verbose'.includes(delimiterFor('--'))).toBe(true);
  });

  it('falls back while the custom field is still being typed into', () => {
    expect(delimiterFor('')).toBe(delimiterFor(DEFAULT_TOKEN));
    expect(delimiterFor('   ')).toBe(delimiterFor(DEFAULT_TOKEN));
  });

  it('ignores whitespace the user typed around a token', () => {
    expect(delimiterFor(' # ')).toBe(' # ');
  });
});

describe('changeDelimiter', () => {
  it('rewrites an annotation to the new token', () => {
    expect(changeDelimiter('a.ts -- does a thing', '--', '#')).toBe(
      'a.ts # does a thing'
    );
  });

  it('rewrites every line that has one', () => {
    expect(changeDelimiter('a -- one\nb\nc -- two', '--', '#')).toBe(
      'a # one\nb\nc # two'
    );
  });

  it('touches only the first delimiter, the way the parser reads it', () => {
    expect(changeDelimiter('a -- one -- two', '--', '#')).toBe(
      'a # one -- two'
    );
  });

  it('leaves an unpadded occurrence alone, since it is not a delimiter', () => {
    expect(changeDelimiter('nx build --verbose', '--', '#')).toBe(
      'nx build --verbose'
    );
  });

  it('is reversible', () => {
    const source = 'src/\n  a.ts -- one\n  b.ts -- two';
    const switched = changeDelimiter(source, '--', '#');
    expect(changeDelimiter(switched, '#', '--')).toBe(source);
  });

  it('does nothing when the tokens render the same delimiter', () => {
    const source = 'a -- one';
    expect(changeDelimiter(source, '--', '--')).toBe(source);
    // Empty falls back to the default, so this is the same delimiter twice.
    expect(changeDelimiter(source, '--', '')).toBe(source);
  });

  it('carries annotations out of the fallback once a custom token is typed', () => {
    expect(changeDelimiter('a -- one', '', '//')).toBe('a // one');
  });
});
