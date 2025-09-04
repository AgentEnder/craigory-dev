import { useEffect, useRef } from 'react';

interface WebcamMonitorProps {
  onMovementData: (movementLevel: number) => void;
}

export function WebcamMonitor({ onMovementData }: WebcamMonitorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previousFrameRef = useRef<ImageData | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let animationId: number;
    let isActive = true;

    const startWebcam = async () => {
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

        // Start motion detection
        const detectMotion = () => {
          if (!isActive || !videoRef.current || !canvasRef.current) return;

          const video = videoRef.current;
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');

          if (!ctx || video.videoWidth === 0 || video.videoHeight === 0) {
            animationId = requestAnimationFrame(detectMotion);
            return;
          }

          // Set canvas dimensions to match video
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          // Draw current frame
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const currentFrame = ctx.getImageData(0, 0, canvas.width, canvas.height);

          if (previousFrameRef.current) {
            const movementLevel = calculateMovement(previousFrameRef.current, currentFrame);
            onMovementData(movementLevel);
          }

          previousFrameRef.current = currentFrame;
          animationId = requestAnimationFrame(detectMotion);
        };

        // Wait for video to be ready
        if (videoRef.current) {
          videoRef.current.onloadedmetadata = () => {
            detectMotion();
          };
        }

      } catch (error) {
        console.warn('Could not access webcam:', error);
        // Continue without webcam - provide default movement data
        const fallbackInterval = setInterval(() => {
          if (!isActive) {
            clearInterval(fallbackInterval);
            return;
          }
          onMovementData(0); // No movement detected
        }, 100);
      }
    };

    startWebcam();

    return () => {
      isActive = false;
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [onMovementData]);

  const calculateMovement = (prevFrame: ImageData, currFrame: ImageData): number => {
    let totalDiff = 0;
    const data1 = prevFrame.data;
    const data2 = currFrame.data;
    
    // Sample every 4th pixel for performance
    for (let i = 0; i < data1.length; i += 16) {
      const diff = Math.abs(data1[i] - data2[i]) + 
                   Math.abs(data1[i + 1] - data2[i + 1]) + 
                   Math.abs(data1[i + 2] - data2[i + 2]);
      totalDiff += diff;
    }
    
    // Normalize to 0-100 scale
    return Math.min(100, (totalDiff / (data1.length / 4)) * 100);
  };

  return (
    <>
      {/* Hidden video element for webcam feed */}
      <video
        ref={videoRef}
        style={{
          position: 'absolute',
          top: '-1000px',
          left: '-1000px',
          width: '1px',
          height: '1px',
          opacity: 0,
        }}
        muted
        playsInline
      />
      
      {/* Hidden canvas for motion detection */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: '-1000px',
          left: '-1000px',
          width: '1px',
          height: '1px',
          opacity: 0,
        }}
      />
    </>
  );
}