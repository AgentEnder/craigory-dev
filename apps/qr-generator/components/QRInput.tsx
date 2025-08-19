interface QRInputProps {
  value: string
  onChange: (value: string) => void
  onKeyDown: (e: React.KeyboardEvent) => void
}

export function QRInput({ value, onChange, onKeyDown }: QRInputProps) {
  return (
    <div className="mb-6">
      <div className="relative">
        <textarea
          id="textInput"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Enter text, URL, or any content..."
          className="w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 text-gray-900 placeholder-gray-400"
          style={{ fontFeatureSettings: 'normal' }}
          rows={3}
        />
        {value && (
          <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
            {value.length}
          </div>
        )}
      </div>
    </div>
  )
}