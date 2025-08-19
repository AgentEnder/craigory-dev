import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import '../src/style.css';
import { AppHeader } from '../components/AppHeader';
import { QRInput } from '../components/QRInput';
import { QRDisplay } from '../components/QRDisplay';
import { QRActions } from '../components/QRActions';

export default function Page() {
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  const generateQRCode = async (inputText: string) => {
    if (!inputText.trim()) {
      setQrDataUrl(null);
      return;
    }

    try {
      setIsGenerating(true);
      console.time('QR Code Generation');

      const dataUrl = await QRCode.toDataURL(inputText, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });

      setQrDataUrl(dataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
      alert('Error generating QR code. Please try again.');
      setQrDataUrl(null);
    } finally {
      setIsGenerating(false);
      console.timeEnd('QR Code Generation');
    }
  };

  const handleInputChange = (value: string) => {
    setText(value);

    // Debounce the QR code generation
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      generateQRCode(value);
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      generateQRCode(text);
    }
    if (e.key === 'v' && e.ctrlKey) {
      e.preventDefault();
      navigator.clipboard.readText().then((clipboardText) => {
        setText(clipboardText);
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
        generateQRCode(clipboardText);
      });
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

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        <AppHeader />
        <QRInput
          value={text}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <QRDisplay qrDataUrl={qrDataUrl} isGenerating={isGenerating} />
        <QRActions
          qrDataUrl={qrDataUrl || ''}
          onDownload={downloadQRCode}
          onCopy={copyToClipboard}
        />
      </div>
    </div>
  );
}
