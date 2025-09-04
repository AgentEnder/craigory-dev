import { useEffect, useRef, useState } from 'react';

interface WebcamPreviewProps {
  onPermissionGranted: () => void;
}

export function WebcamPreview({ onPermissionGranted }: WebcamPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [permissionState, setPermissionState] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [isLoading, setIsLoading] = useState(false);

  const requestWebcamAccess = async () => {
    setIsLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 320, 
          height: 240,
          facingMode: 'user'
        } 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      setPermissionState('granted');
      onPermissionGranted();
    } catch (error) {
      console.warn('Could not access webcam:', error);
      setPermissionState('denied');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Auto-request webcam access when component mounts
    requestWebcamAccess();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleRetry = () => {
    setPermissionState('pending');
    requestWebcamAccess();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Webcam Setup</h3>
      
      <div className="space-y-4">
        {permissionState === 'pending' || isLoading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Requesting webcam access...</p>
          </div>
        ) : permissionState === 'granted' ? (
          <div>
            <div className="mb-3">
              <video
                ref={videoRef}
                className="w-full max-w-xs mx-auto rounded border bg-gray-100"
                muted
                playsInline
                autoPlay
              />
            </div>
            <div className="flex items-center justify-center text-green-600">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Webcam connected</span>
            </div>
            <p className="text-xs text-gray-500 text-center mt-2">
              Movement tracking will be active during the assessment
            </p>
          </div>
        ) : (
          <div>
            <div className="text-center mb-4">
              <div className="w-full max-w-xs mx-auto h-40 bg-gray-100 rounded border flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}/>
                  </svg>
                  <p className="text-sm text-gray-500">Webcam access denied</p>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> The assessment can continue without webcam access, 
                but movement tracking will not be available.
              </p>
            </div>
            
            <button
              onClick={handleRetry}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors text-sm"
            >
              Retry Webcam Access
            </button>
          </div>
        )}
      </div>
    </div>
  );
}