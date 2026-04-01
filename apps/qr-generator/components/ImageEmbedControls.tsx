import { useRef } from 'react';

export interface ImageEmbedSettings {
  file: File | null;
  previewUrl: string | null;
  monochromeEnabled: boolean;
  threshold: number;
  contrast: number;
  imagePadding: number;
}

interface ImageEmbedControlsProps {
  settings: ImageEmbedSettings;
  onChange: (settings: ImageEmbedSettings) => void;
}

export function ImageEmbedControls({
  settings,
  onChange,
}: ImageEmbedControlsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    onChange({
      ...settings,
      file,
      previewUrl,
    });
  };

  const handleRemove = () => {
    if (settings.previewUrl) {
      URL.revokeObjectURL(settings.previewUrl);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onChange({
      file: null,
      previewUrl: null,
      monochromeEnabled: true,
      threshold: 128,
      contrast: 0,
      imagePadding: 4,
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700">Embed Image</h3>
        {settings.file && (
          <button
            onClick={handleRemove}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            Remove
          </button>
        )}
      </div>

      {!settings.file ? (
        <UploadArea fileInputRef={fileInputRef} onFileSelect={handleFileSelect} />
      ) : (
        <ImageControls
          settings={settings}
          onChange={onChange}
        />
      )}
    </div>
  );
}

function UploadArea({
  fileInputRef,
  onFileSelect,
}: {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <button
      onClick={() => fileInputRef.current?.click()}
      className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 cursor-pointer"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onFileSelect}
        className="hidden"
      />
      <div className="text-center">
        <svg
          className="w-8 h-8 text-gray-300 mx-auto mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="text-gray-400 text-sm">Upload logo or image</p>
        <p className="text-gray-300 text-xs mt-0.5">PNG, JPG, SVG</p>
      </div>
    </button>
  );
}

function ImageControls({
  settings,
  onChange,
}: {
  settings: ImageEmbedSettings;
  onChange: (settings: ImageEmbedSettings) => void;
}) {
  return (
    <div className="space-y-4 animate-fade-in">
      {/* Preview */}
      <div className="flex items-center gap-3">
        <img
          src={settings.previewUrl!}
          alt="Embedded image preview"
          className="w-12 h-12 rounded-lg object-cover border border-gray-200"
        />
        <div className="text-sm text-gray-500 truncate">{settings.file!.name}</div>
      </div>

      {/* Monochrome toggle */}
      <div className="flex items-center justify-between">
        <label className="text-sm text-gray-600">Monochrome</label>
        <button
          onClick={() =>
            onChange({ ...settings, monochromeEnabled: !settings.monochromeEnabled })
          }
          className={`relative w-10 h-5.5 rounded-full transition-colors duration-200 ${
            settings.monochromeEnabled ? 'bg-black' : 'bg-gray-300'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform duration-200 ${
              settings.monochromeEnabled ? 'translate-x-[18px]' : ''
            }`}
          />
        </button>
      </div>

      {/* Monochrome sliders */}
      {settings.monochromeEnabled && (
        <div className="space-y-3 animate-fade-in">
          <SliderControl
            label="Threshold"
            value={settings.threshold}
            min={0}
            max={255}
            onChange={(threshold) => onChange({ ...settings, threshold })}
          />
          <SliderControl
            label="Contrast"
            value={settings.contrast}
            min={-100}
            max={100}
            onChange={(contrast) => onChange({ ...settings, contrast })}
          />
        </div>
      )}

      {/* Image padding */}
      <SliderControl
        label="Image Padding"
        value={settings.imagePadding}
        min={0}
        max={20}
        onChange={(imagePadding) => onChange({ ...settings, imagePadding })}
      />
    </div>
  );
}

function SliderControl({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs text-gray-500">{label}</label>
        <span className="text-xs text-gray-400 tabular-nums">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-black"
      />
    </div>
  );
}
