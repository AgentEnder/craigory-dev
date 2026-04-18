import jsQR from 'jsqr';

export interface ValidationResult {
  valid: boolean;
  decoded: string | null;
  expected: string;
}

function decodeFromImageElement(img: HTMLImageElement): string | null {
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const result = jsQR(imageData.data, canvas.width, canvas.height);
  return result ? result.data : null;
}

/**
 * Decodes a QR code from a data URL and validates its content matches the expected text.
 */
export function validateQRCode(
  dataUrl: string,
  expectedText: string
): Promise<ValidationResult> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const decoded = decodeFromImageElement(img);
      if (decoded === null) {
        resolve({ valid: false, decoded: null, expected: expectedText });
      } else {
        resolve({
          valid: decoded === expectedText,
          decoded,
          expected: expectedText,
        });
      }
    };
    img.onerror = () => {
      resolve({ valid: false, decoded: null, expected: expectedText });
    };
    img.src = dataUrl;
  });
}

/**
 * Attempts to decode QR content from an image Blob/File.
 * Returns the decoded string, or null if no QR code is detected.
 */
export function decodeQRFromImageBlob(blob: Blob): Promise<string | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      try {
        resolve(decodeFromImageElement(img));
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    img.src = url;
  });
}
