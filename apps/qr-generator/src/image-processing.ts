/**
 * Loads a File into an HTMLImageElement.
 */
export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    img.src = url;
  });
}

/**
 * Processes an image to monochrome (single-color) with adjustable threshold.
 * - threshold: 0–255, pixels brighter than this become white, darker become black
 * - contrast: -100 to 100, adjusts contrast before thresholding
 * Returns a data URL of the processed image.
 */
export function processImageToMonochrome(
  img: HTMLImageElement,
  options: {
    threshold: number;
    contrast: number;
    enabled: boolean;
    size: number;
  }
): string {
  const canvas = document.createElement('canvas');
  canvas.width = options.size;
  canvas.height = options.size;
  const ctx = canvas.getContext('2d')!;

  // Draw image scaled to fit the target size (center-cropped to square)
  const srcSize = Math.min(img.naturalWidth, img.naturalHeight);
  const srcX = (img.naturalWidth - srcSize) / 2;
  const srcY = (img.naturalHeight - srcSize) / 2;
  ctx.drawImage(img, srcX, srcY, srcSize, srcSize, 0, 0, options.size, options.size);

  if (!options.enabled) {
    return canvas.toDataURL('image/png');
  }

  const imageData = ctx.getImageData(0, 0, options.size, options.size);
  const data = imageData.data;

  // Apply contrast adjustment
  const contrastFactor = (259 * (options.contrast + 255)) / (255 * (259 - options.contrast));

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Apply contrast
    r = clamp(contrastFactor * (r - 128) + 128);
    g = clamp(contrastFactor * (g - 128) + 128);
    b = clamp(contrastFactor * (b - 128) + 128);

    // Convert to grayscale using luminance weights
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;

    // Threshold to black or white
    const mono = gray >= options.threshold ? 255 : 0;
    data[i] = mono;
    data[i + 1] = mono;
    data[i + 2] = mono;
    // Alpha stays unchanged
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL('image/png');
}

/**
 * Composites an embedded image onto the center of a QR code data URL.
 * Returns the final composited data URL.
 */
export function compositeQRWithImage(
  qrDataUrl: string,
  embeddedImageDataUrl: string,
  qrSize: number,
  embedRatio: number = 0.25,
  padding: number = 4,
  backgroundColor: string = '#FFFFFF'
): Promise<string> {
  return new Promise((resolve, reject) => {
    const qrImg = new Image();
    const embedImg = new Image();
    let qrLoaded = false;
    let embedLoaded = false;

    const tryComposite = () => {
      if (!qrLoaded || !embedLoaded) return;

      const canvas = document.createElement('canvas');
      canvas.width = qrSize;
      canvas.height = qrSize;
      const ctx = canvas.getContext('2d')!;

      // Draw the QR code
      ctx.drawImage(qrImg, 0, 0, qrSize, qrSize);

      // Calculate embed bounding box (fixed size based on ratio)
      const embedSize = Math.floor(qrSize * embedRatio);
      const offset = Math.floor((qrSize - embedSize) / 2);

      // Fill the entire bounding box with background
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(offset, offset, embedSize, embedSize);

      // Draw the image inset by padding (shrunk within the bounding box)
      const imageSize = Math.max(0, embedSize - padding * 2);
      const imageOffset = offset + padding;
      ctx.drawImage(embedImg, imageOffset, imageOffset, imageSize, imageSize);

      resolve(canvas.toDataURL('image/png'));
    };

    qrImg.onload = () => {
      qrLoaded = true;
      tryComposite();
    };
    embedImg.onload = () => {
      embedLoaded = true;
      tryComposite();
    };
    qrImg.onerror = () => reject(new Error('Failed to load QR image'));
    embedImg.onerror = () => reject(new Error('Failed to load embed image'));

    qrImg.src = qrDataUrl;
    embedImg.src = embeddedImageDataUrl;
  });
}

function clamp(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}
