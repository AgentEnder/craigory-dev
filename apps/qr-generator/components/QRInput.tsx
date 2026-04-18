interface QRInputProps {
  value: string
  onChange: (value: string) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  onImagePaste?: (file: File) => void
}

function extractPastedImage(clipboardData: DataTransfer): File | null {
  for (const item of clipboardData.items) {
    if (item.kind === 'file' && item.type.startsWith('image/')) {
      const file = item.getAsFile()
      if (file) return file
    }
  }
  return null
}

export function QRInput({ value, onChange, onKeyDown, onImagePaste }: QRInputProps) {
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (!onImagePaste) return
    const image = extractPastedImage(e.clipboardData)
    if (image) {
      e.preventDefault()
      onImagePaste(image)
    }
  }

  return (
    <div className="mb-6">
      <div className="relative">
        <textarea
          id="textInput"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          onPaste={handlePaste}
          placeholder="Enter text or a URL — or paste a QR code image to decode it"
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
