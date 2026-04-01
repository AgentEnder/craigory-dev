export interface QRSettings {
  foreground: string;
  background: string;
  errorCorrection: 'L' | 'M' | 'Q' | 'H';
  margin: number;
  outputSize: number;
}

interface QRSettingsControlsProps {
  settings: QRSettings;
  onChange: (settings: QRSettings) => void;
  hasEmbeddedImage: boolean;
}

const OUTPUT_SIZE_OPTIONS = [256, 512, 1024, 2048];

const ERROR_CORRECTION_LABELS: Record<string, string> = {
  L: 'L — 7%',
  M: 'M — 15%',
  Q: 'Q — 25%',
  H: 'H — 30%',
};

export function QRSettingsControls({
  settings,
  onChange,
  hasEmbeddedImage,
}: QRSettingsControlsProps) {
  const effectiveErrorCorrection = hasEmbeddedImage
    ? 'H'
    : settings.errorCorrection;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700">QR Code</h3>

      {/* Colors */}
      <div className="flex gap-4">
        <ColorPicker
          label="Foreground"
          value={settings.foreground}
          onChange={(foreground) => onChange({ ...settings, foreground })}
        />
        <ColorPicker
          label="Background"
          value={settings.background}
          onChange={(background) => onChange({ ...settings, background })}
        />
      </div>

      {/* Error Correction */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs text-gray-500">Error Correction</label>
          {hasEmbeddedImage && (
            <span className="text-xs text-gray-400">Forced H for image</span>
          )}
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {(['L', 'M', 'Q', 'H'] as const).map((level) => (
            <button
              key={level}
              onClick={() =>
                onChange({ ...settings, errorCorrection: level })
              }
              disabled={hasEmbeddedImage}
              className={`py-1.5 text-xs font-medium rounded-lg transition-all duration-150 ${
                effectiveErrorCorrection === level
                  ? 'bg-black text-white'
                  : hasEmbeddedImage
                    ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={ERROR_CORRECTION_LABELS[level]}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Margin */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs text-gray-500">Margin</label>
          <span className="text-xs text-gray-400 tabular-nums">
            {settings.margin}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={8}
          value={settings.margin}
          onChange={(e) =>
            onChange({ ...settings, margin: Number(e.target.value) })
          }
          className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-black"
        />
      </div>

      {/* Output Size */}
      <div>
        <label className="text-xs text-gray-500 mb-1.5 block">
          Output Size
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {OUTPUT_SIZE_OPTIONS.map((size) => (
            <button
              key={size}
              onClick={() => onChange({ ...settings, outputSize: size })}
              className={`py-1.5 text-xs font-medium rounded-lg transition-all duration-150 ${
                settings.outputSize === size
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ColorPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex-1">
      <label className="text-xs text-gray-500 mb-1.5 block">{label}</label>
      <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-2.5 py-1.5 border border-gray-200">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => {
            const v = e.target.value;
            if (/^#[0-9a-fA-F]{0,6}$/.test(v)) onChange(v);
          }}
          className="text-xs text-gray-600 font-mono bg-transparent w-full focus:outline-none"
          maxLength={7}
        />
      </div>
    </div>
  );
}
