interface SettingsPanelProps {
  children: React.ReactNode;
  qrPreviewUrl: string | null;
  onReset: () => void;
}

export function SettingsPanel({ children, qrPreviewUrl, onReset }: SettingsPanelProps) {
  return (
    <>
      <div className="bg-white rounded-2xl p-5 border border-gray-100 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900">Settings</h2>
          <button
            onClick={onReset}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Reset
          </button>
        </div>
        <div className="space-y-5">{children}</div>
      </div>

      {/* Sticky QR preview — mobile only */}
      {qrPreviewUrl && (
        <div className="fixed bottom-4 right-4 z-50 md:hidden animate-fade-in">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-1.5">
            <img
              src={qrPreviewUrl}
              alt="QR Preview"
              className="w-16 h-16 rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
}
