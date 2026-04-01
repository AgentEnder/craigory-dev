import jsQR from 'jsqr';

export interface ValidationResult {
  valid: boolean;
  decoded: string | null;
  expected: string;
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
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const result = jsQR(imageData.data, canvas.width, canvas.height);

      if (!result) {
        resolve({ valid: false, decoded: null, expected: expectedText });
      } else {
        resolve({
          valid: result.data === expectedText,
          decoded: result.data,
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
