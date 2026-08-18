// Uint8Array's base64 methods (TC39 stage 3; Chrome 133+, Safari 18.2+,
// Firefox 133+) are not in TypeScript 5.9's bundled libs yet.
interface Uint8ArrayBase64Options {
  alphabet?: 'base64' | 'base64url';
}

interface Uint8Array<TArrayBuffer extends ArrayBufferLike = ArrayBufferLike> {
  toBase64(
    options?: Uint8ArrayBase64Options & { omitPadding?: boolean }
  ): string;
}

interface Uint8ArrayConstructor {
  fromBase64(
    base64: string,
    options?: Uint8ArrayBase64Options & {
      lastChunkHandling?: 'loose' | 'strict' | 'stop-before-partial';
    }
  ): Uint8Array<ArrayBuffer>;
}
