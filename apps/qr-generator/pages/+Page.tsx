import { useState, useEffect, useRef, useCallback } from 'react';
import QRCode from 'qrcode';
import '../src/style.css';
import { AppHeader } from '../components/AppHeader';
import { QRInput } from '../components/QRInput';
import { QRDisplay } from '../components/QRDisplay';
import { QRActions } from '../components/QRActions';
import { SettingsPanel } from '../components/SettingsPanel';
import {
  ImageEmbedControls,
  type ImageEmbedSettings,
} from '../components/ImageEmbedControls';
import {
  QRSettingsControls,
  type QRSettings,
} from '../components/QRSettingsControls';
import {
  loadImageFromFile,
  processImageToMonochrome,
  compositeQRWithImage,
} from '../src/image-processing';
import {
  validateQRCode,
  type ValidationResult,
} from '../src/qr-validation';

const EMBED_RATIO = 0.25;

const defaultQRSettings: QRSettings = {
  foreground: '#000000',
  background: '#FFFFFF',
  errorCorrection: 'M',
  margin: 2,
  outputSize: 512,
};

const defaultImageSettings: ImageEmbedSettings = {
  file: null,
  previewUrl: null,
  monochromeEnabled: true,
  threshold: 128,
  contrast: 0,
  imagePadding: 4,
};

export default function Page() {
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [qrSettings, setQRSettings] = useState<QRSettings>(defaultQRSettings);
  const [imageSettings, setImageSettings] =
    useState<ImageEmbedSettings>(defaultImageSettings);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  const loadedImageRef = useRef<HTMLImageElement | null>(null);

  const generateQRCode = useCallback(
    async (
      inputText: string,
      imgSettings: ImageEmbedSettings,
      qrOpts: QRSettings
    ) => {
      if (!inputText.trim()) {
        setQrDataUrl(null);
        setValidation(null);
        return;
      }

      try {
        setIsGenerating(true);

        const hasEmbed = imgSettings.file !== null;
        const errorCorrectionLevel = hasEmbed
          ? 'H'
          : qrOpts.errorCorrection;

        const rawQrDataUrl = await QRCode.toDataURL(inputText, {
          width: qrOpts.outputSize,
          margin: qrOpts.margin,
          errorCorrectionLevel,
          color: {
            dark: qrOpts.foreground,
            light: qrOpts.background,
          },
        });

        let finalDataUrl: string;

        if (hasEmbed && loadedImageRef.current) {
          const processedImageDataUrl = processImageToMonochrome(
            loadedImageRef.current,
            {
              threshold: imgSettings.threshold,
              contrast: imgSettings.contrast,
              enabled: imgSettings.monochromeEnabled,
              size: Math.floor(qrOpts.outputSize * EMBED_RATIO),
            }
          );

          finalDataUrl = await compositeQRWithImage(
            rawQrDataUrl,
            processedImageDataUrl,
            qrOpts.outputSize,
            EMBED_RATIO,
            imgSettings.imagePadding,
            qrOpts.background
          );
        } else {
          finalDataUrl = rawQrDataUrl;
        }

        setQrDataUrl(finalDataUrl);

        // Validate the final QR code is scannable
        const result = await validateQRCode(finalDataUrl, inputText);
        setValidation(result);
      } catch (error) {
        console.error('Error generating QR code:', error);
        alert('Error generating QR code. Please try again.');
        setQrDataUrl(null);
        setValidation(null);
      } finally {
        setIsGenerating(false);
      }
    },
    []
  );

  const scheduleGenerate = useCallback(
    (
      inputText: string,
      imgSettings: ImageEmbedSettings,
      qrOpts: QRSettings
    ) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        generateQRCode(inputText, imgSettings, qrOpts);
      }, 100);
    },
    [generateQRCode]
  );

  const handleInputChange = (value: string) => {
    setText(value);
    scheduleGenerate(value, imageSettings, qrSettings);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      generateQRCode(text, imageSettings, qrSettings);
    }
    if (e.key === 'v' && e.ctrlKey) {
      e.preventDefault();
      navigator.clipboard.readText().then((clipboardText) => {
        setText(clipboardText);
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
        generateQRCode(clipboardText, imageSettings, qrSettings);
      });
    }
  };

  const handleQRSettingsChange = (newSettings: QRSettings) => {
    setQRSettings(newSettings);
    if (text.trim()) {
      scheduleGenerate(text, imageSettings, newSettings);
    }
  };

  const handleImageSettingsChange = async (newSettings: ImageEmbedSettings) => {
    if (newSettings.file && newSettings.file !== imageSettings.file) {
      try {
        loadedImageRef.current = await loadImageFromFile(newSettings.file);
      } catch {
        console.error('Failed to load image');
        return;
      }
    }

    if (!newSettings.file) {
      loadedImageRef.current = null;
    }

    setImageSettings(newSettings);

    if (text.trim()) {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      generateQRCode(text, newSettings, qrSettings);
    }
  };

  const downloadQRCode = () => {
    if (!qrDataUrl) return;

    const link = document.createElement('a');
    link.download = `qr-code-${Date.now()}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const copyToClipboard = async () => {
    if (!qrDataUrl) return;

    try {
      const response = await fetch(qrDataUrl);
      const blob = await response.blob();
      const item = new ClipboardItem({ 'image/png': blob });
      await navigator.clipboard.write([item]);
      alert('QR Code copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy QR Code:', error);
      alert('Failed to copy QR Code');
    }
  };

  const qrInput = (
    <QRInput
      value={text}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
    />
  );

  const handleResetSettings = () => {
    if (imageSettings.previewUrl) {
      URL.revokeObjectURL(imageSettings.previewUrl);
    }
    loadedImageRef.current = null;
    setQRSettings(defaultQRSettings);
    setImageSettings(defaultImageSettings);
    if (text.trim()) {
      generateQRCode(text, defaultImageSettings, defaultQRSettings);
    }
  };

  const settingsPanel = settingsOpen ? (
    <SettingsPanel qrPreviewUrl={qrDataUrl} onReset={handleResetSettings}>
      {qrInput}
      <QRSettingsControls
        settings={qrSettings}
        onChange={handleQRSettingsChange}
        hasEmbeddedImage={imageSettings.file !== null}
      />
      <ImageEmbedControls
        settings={imageSettings}
        onChange={handleImageSettingsChange}
      />
    </SettingsPanel>
  ) : null;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        <AppHeader
          onSettingsToggle={() => setSettingsOpen((prev) => !prev)}
          settingsOpen={settingsOpen}
        />
      </div>

      <div className="flex justify-center gap-6 items-start">
        {/* Main column */}
        <div className="max-w-md w-full">
          {!settingsOpen && qrInput}

          {/* Mobile: settings inline above QR display */}
          <div className="md:hidden mb-6">{settingsPanel}</div>

          <QRDisplay qrDataUrl={qrDataUrl} isGenerating={isGenerating} validation={validation} />
          <QRActions
            qrDataUrl={qrDataUrl || ''}
            onDownload={downloadQRCode}
            onCopy={copyToClipboard}
            disabled={validation !== null && !validation.valid}
          />
        </div>

        {/* Desktop: settings as side panel */}
        {settingsOpen && (
          <div className="hidden md:block w-72 shrink-0 sticky top-8">
            {settingsPanel}
          </div>
        )}
      </div>
    </div>
  );
}
