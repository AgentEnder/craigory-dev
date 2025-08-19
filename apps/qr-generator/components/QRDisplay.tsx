interface QRDisplayProps {
  qrDataUrl: string | null
  isGenerating?: boolean
}

export function QRDisplay({ qrDataUrl, isGenerating = false }: QRDisplayProps) {
  return (
    <div className="bg-white rounded-3xl p-8 mb-6 border border-gray-100">
      <div className="flex flex-col items-center relative">
        {qrDataUrl ? (
          <div className="animate-fade-in">
            <img
              src={qrDataUrl}
              alt="Generated QR Code"
              className="w-56 h-56 rounded-2xl shadow-sm"
            />
          </div>
        ) : (
          <EmptyState />
        )}
        
        {isGenerating && <LoadingOverlay />}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center animate-fade-in">
      <div className="w-56 h-56 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center mb-4">
        <div className="text-center">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
          </svg>
          <p className="text-gray-400 text-sm font-medium">QR code will appear here</p>
          <p className="text-gray-300 text-xs mt-1">Start typing to generate</p>
        </div>
      </div>
    </div>
  )
}

function LoadingOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl animate-fade-in">
      <div className="text-center">
        <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-gray-600 text-sm font-medium">Generating QR Code...</p>
      </div>
    </div>
  )
}