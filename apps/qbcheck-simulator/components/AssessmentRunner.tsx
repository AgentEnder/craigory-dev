import { useState, useEffect, useRef, useCallback } from 'react';
import type { AssessmentResults, TimelineEvent } from '../src/types';
import { Link, navigate } from './Link';
import { WebcamMonitor } from './WebcamMonitor';
import { WebcamPreview } from './WebcamPreview';

interface AssessmentRunnerProps {
  isPractice: boolean;
  practiceDuration?: number;
  onComplete: (results: AssessmentResults) => void;
}

type ShapeType = 'circle' | 'square';
type ShapeColor = 'blue' | 'red';

interface Shape {
  type: ShapeType;
  color: ShapeColor;
  id: string;
}

interface Response {
  timestamp: number;
  correct: boolean;
  reactionTime: number;
}

export function AssessmentRunner({
  isPractice,
  practiceDuration = 60,
  onComplete,
}: AssessmentRunnerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [webcamReady, setWebcamReady] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  // Canvas and shape state (not React state)
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentShapeRef = useRef<Shape | null>(null);
  const previousShapeRef = useRef<Shape | null>(null);

  const responsesRef = useRef<Response[]>([]);
  const currentShapeTimeRef = useRef<number>(0);
  const totalShapesRef = useRef<number>(0);
  const missedResponsesRef = useRef<number>(0);
  const movementDataRef = useRef<number[]>([]);
  const isRunningRef = useRef<boolean>(false);
  const loopIdRef = useRef<number>(0); // Track unique loop instances
  const timelineRef = useRef<TimelineEvent[]>([]);
  const assessmentStartTimeRef = useRef<number>(0);

  const testDuration = isPractice ? practiceDuration : 1200; // practice duration or 20 minutes

  // Randomized timing functions - made more generous for visibility
  const getRandomShapeDisplayTime = () => 500 + Math.random() * 350; // 150ms - 500ms
  const getRandomBlankInterval = () => 1500 + Math.random() * 2500; // 1.5s - 4.0s

  // Helper function for delays
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  // Canvas drawing functions
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const drawShape = (shape: Shape) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas first
    clearCanvas();

    // Calculate center position
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const size = 60; // Shape size in pixels

    // Set color
    ctx.fillStyle = shape.color === 'blue' ? '#3b82f6' : '#ef4444';

    if (shape.type === 'circle') {
      ctx.beginPath();
      ctx.arc(centerX, centerY, size / 2, 0, 2 * Math.PI);
      ctx.fill();
    } else {
      // Square
      ctx.fillRect(centerX - size / 2, centerY - size / 2, size, size);
    }
  };

  const shapes: Shape[] = [
    { type: 'circle', color: 'blue', id: 'blue-circle' },
    { type: 'circle', color: 'red', id: 'red-circle' },
    { type: 'square', color: 'blue', id: 'blue-square' },
    { type: 'square', color: 'red', id: 'red-square' },
  ];

  const getRandomShape = useCallback((): Shape => {
    return shapes[Math.floor(Math.random() * shapes.length)];
  }, []);

  // Shapes always appear in center consistently

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      // Debug logging
      if (event.code === 'Space') {
        console.log('Space pressed:', {
          hasCurrentShape: !!currentShapeRef.current,
          isRunning: isRunningRef.current,
          currentShape: currentShapeRef.current,
          previousShape: previousShapeRef.current,
        });
      }

      if (event.code !== 'Space' || !isRunningRef.current) return;

      event.preventDefault();

      // Always record the response, even if no shape is currently visible
      const responseTime = Date.now();
      const reactionTime = responseTime - currentShapeTimeRef.current;

      // Determine if this was a correct response
      let correct = false;
      if (currentShapeRef.current && previousShapeRef.current) {
        // We have both a current shape and a previous shape to compare
        const shouldMatch =
          currentShapeRef.current.type === previousShapeRef.current.type &&
          currentShapeRef.current.color === previousShapeRef.current.color;
        correct = shouldMatch;
      } else {
        // No shape visible or no previous shape - pressing space is incorrect
        correct = false;
      }

      const response: Response = {
        timestamp: responseTime,
        correct: correct,
        reactionTime,
      };

      responsesRef.current.push(response);

      // Add to timeline
      const timelineEvent: TimelineEvent = {
        type: 'response',
        timestamp: responseTime - assessmentStartTimeRef.current,
        data: {
          responseTime,
          correct,
          reactionTime,
        },
      };
      timelineRef.current.push(timelineEvent);

      // Debug info for practice mode
      if (isPractice) {
        setDebugInfo(
          `Response: ${correct ? '✓ Correct' : '✗ Incorrect'} (${Math.round(
            reactionTime
          )}ms)`
        );
      }
    },
    [isPractice]
  );

  const startCountdown = useCallback(async () => {
    // Enter fullscreen before starting countdown to avoid jarring transitions
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
    } catch (error) {
      console.warn('Could not enter fullscreen:', error);
    }

    setShowCountdown(true);
    setCountdown(3);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setShowCountdown(false);
          setIsRunning(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const endAssessment = useCallback(() => {
    setIsRunning(false);
    isRunningRef.current = false; // Stop the async loop immediately
    loopIdRef.current++; // Invalidate any running loops
    clearCanvas(); // Clear the canvas
    currentShapeRef.current = null;
    previousShapeRef.current = null;

    const responses = responsesRef.current;
    const totalShapes = totalShapesRef.current;
    const correctResponses = responses.filter((r) => r.correct).length;
    const incorrectResponses = responses.filter((r) => !r.correct).length;
    const missedResponses = missedResponsesRef.current;

    // Accuracy should be based on total decision opportunities, not total shapes
    // Total decisions = all responses made + missed responses (should have responded but didn't)
    const totalDecisionOpportunities =
      correctResponses + incorrectResponses + missedResponses;

    // If no decisions were required (no matches occurred), accuracy is 100% if no incorrect responses
    const accuracy =
      totalDecisionOpportunities > 0
        ? (correctResponses / totalDecisionOpportunities) * 100
        : incorrectResponses === 0
        ? 100
        : 0;
    const reactionTimes = responses.map((r) => r.reactionTime);
    const averageReactionTime =
      reactionTimes.length > 0
        ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length
        : 0;

    const movementScore =
      movementDataRef.current.length > 0
        ? movementDataRef.current.reduce((a, b) => a + b, 0) /
          movementDataRef.current.length
        : 0;

    const results: AssessmentResults = {
      accuracy,
      correctResponses,
      incorrectResponses,
      missedResponses,
      averageReactionTime,
      reactionTimes,
      movementScore,
      totalShapes,
      duration: testDuration,
      timeline: timelineRef.current.slice(), // Copy the timeline
    };

    // Exit fullscreen
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }

    onComplete(results);
  }, [onComplete, testDuration]);

  const handleMovementData = useCallback((movementLevel: number) => {
    movementDataRef.current.push(movementLevel);
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    // Reset counters for new assessment
    responsesRef.current = [];
    currentShapeTimeRef.current = 0;
    totalShapesRef.current = 0;
    missedResponsesRef.current = 0;
    movementDataRef.current = [];
    timelineRef.current = [];
    assessmentStartTimeRef.current = Date.now();

    // Maintain fullscreen mode (entry already handled by countdown)
    const enterFullscreen = async () => {
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
        }
      } catch (error) {
        console.warn('Could not enter fullscreen:', error);
      }
    };

    // Handle fullscreen changes and maintain fullscreen mode
    const handleFullscreenChange = () => {
      if (isRunning && !document.fullscreenElement) {
        // Re-enter fullscreen if we accidentally left it during assessment
        enterFullscreen();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    setTimeRemaining(testDuration);
    const startTime = Date.now();

    // Timer countdown
    const timerInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, testDuration - Math.floor(elapsed / 1000));
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        clearInterval(timerInterval);
        endAssessment();
      }
    }, 1000);

    // Prevent multiple loops by using a unique ID
    const currentLoopId = ++loopIdRef.current;
    isRunningRef.current = true;

    // Async shape display logic with overlap prevention
    const runAssessmentLoop = async () => {
      try {
        // Initial delay before first shape
        await delay(2000);

        // Debug info
        if (isPractice) {
          setDebugInfo('Starting assessment loop...');
        }

        while (
          isRunningRef.current &&
          isRunning &&
          loopIdRef.current === currentLoopId
        ) {
          // Generate random timings for this cycle
          const shapeDisplayTime = getRandomShapeDisplayTime();
          const blankInterval = getRandomBlankInterval();
          const totalCycleTime = shapeDisplayTime + blankInterval;

          // Check if we have enough time remaining for a complete cycle
          const elapsed = Date.now() - startTime;
          const remaining = testDuration - Math.floor(elapsed / 1000);

          if (remaining * 1000 < totalCycleTime + 1000) {
            // Add 1s buffer
            // Not enough time for complete cycle, end assessment gracefully
            break;
          }

          const newShape = getRandomShape();

          // Debug info for development
          if (isPractice) {
            setDebugInfo(
              `Next: Shape ${Math.round(
                shapeDisplayTime
              )}ms | Blank ${Math.round(blankInterval)}ms`
            );
          }

          // Show the shape using canvas
          previousShapeRef.current = currentShapeRef.current;
          currentShapeRef.current = newShape;
          drawShape(newShape); // Draw on canvas
          currentShapeTimeRef.current = Date.now();
          totalShapesRef.current++;

          // Check if this shape should match the previous one
          const shouldMatch =
            previousShapeRef.current &&
            newShape.type === previousShapeRef.current.type &&
            newShape.color === previousShapeRef.current.color;

          // Add shape event to timeline
          const shapeEvent: TimelineEvent = {
            type: 'shape',
            timestamp:
              currentShapeTimeRef.current - assessmentStartTimeRef.current,
            data: {
              shape: {
                type: newShape.type,
                color: newShape.color,
                id: newShape.id,
              },
              displayDuration: shapeDisplayTime,
              shouldMatch: !!shouldMatch,
            },
          };
          timelineRef.current.push(shapeEvent);

          if (isPractice) {
            setDebugInfo(`Showing shape for ${Math.round(shapeDisplayTime)}ms`);
          }

          // Wait for shape display duration
          await delay(shapeDisplayTime);

          // Double-check we're still the active loop
          if (
            !isRunningRef.current ||
            !isRunning ||
            loopIdRef.current !== currentLoopId
          )
            break;

          // Store the shape display end time before blank period
          const shapeEndTime = Date.now();

          // Hide the shape (blank period starts)
          clearCanvas(); // Clear canvas for blank period
          // Note: Don't clear currentShapeRef - we need it for scoring responses during blank periods

          // Debug info during blank period
          if (isPractice) {
            setDebugInfo(
              `Blank period: ${Math.round(
                blankInterval
              )}ms | Total responses: ${responsesRef.current.length}`
            );
          }

          // Wait for blank interval
          await delay(blankInterval);

          // After the full cycle (shape + blank), check if this was a missed response
          const shouldHaveMatched =
            previousShapeRef.current &&
            newShape.type === previousShapeRef.current.type &&
            newShape.color === previousShapeRef.current.color;

          if (shouldHaveMatched) {
            // Check if user responded during the full response window (shape display + blank period)
            const userResponded = responsesRef.current.some(
              (r) =>
                r.timestamp >= currentShapeTimeRef.current &&
                r.timestamp <= shapeEndTime + blankInterval
            );

            if (!userResponded) {
              missedResponsesRef.current++;

              // Mark this shape event as missed in the timeline
              const lastShapeEvent = timelineRef.current
                .slice()
                .reverse()
                .find((e) => e.type === 'shape');
              if (lastShapeEvent) {
                lastShapeEvent.data.wasMissed = true;
              }

              if (isPractice) {
                console.log('Missed response - should have pressed space');
              }
            } else if (isPractice) {
              console.log('User responded correctly to matching shape');
            }
          } else if (isPractice) {
            console.log('No match - user should NOT press space');
          }
        }

        // Ensure we end on a blank screen - add final blank period
        clearCanvas();
        currentShapeRef.current = null;
        previousShapeRef.current = null;

        if (isPractice) {
          setDebugInfo('Assessment ending - blank screen');
        }

        // Final blank period to ensure clean ending
        await delay(1000);
      } catch (error) {
        console.error('Assessment loop error:', error);
      }
    };

    // Start the assessment loop
    console.log(`Starting assessment loop ${currentLoopId}`);
    runAssessmentLoop();

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      clearInterval(timerInterval);
      isRunningRef.current = false; // Stop the async loop
      loopIdRef.current++; // Invalidate any running loops
      clearCanvas(); // Clear any displayed shape
      currentShapeRef.current = null;
      previousShapeRef.current = null;
      // Don't exit fullscreen here - let endAssessment handle it
    };
  }, [isRunning, getRandomShape, endAssessment, testDuration]);

  // Set up canvas size on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && typeof window !== 'undefined') {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isRunning) {
        event.preventDefault();
        setIsRunning(false);
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
        navigate('/');
      }
    },
    [isRunning]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [handleEscape]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (showCountdown) {
    return (
      <div className="fullscreen-assessment flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl font-bold text-gray-800 mb-4">
            {countdown}
          </div>
          <div className="text-2xl text-gray-600">Get ready...</div>
        </div>
      </div>
    );
  }

  if (!isRunning && !showCountdown) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {isPractice ? 'Practice Session' : 'Full Assessment'}
          </h1>
          <p className="text-lg text-gray-600">
            Duration: {formatTime(testDuration)}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Instructions
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li>• Watch for shapes appearing in the center of the screen</li>
              <li>
                • Press{' '}
                <kbd className="px-2 py-1 bg-gray-100 rounded text-sm">
                  SPACEBAR
                </kbd>{' '}
                when current shape matches the previous one
              </li>
              <li>
                • Shapes appear for random durations with random intervals
              </li>
              <li>• Keep your attention focused on the center</li>
              <li>
                • Press{' '}
                <kbd className="px-2 py-1 bg-gray-100 rounded text-sm">ESC</kbd>{' '}
                to exit early
              </li>
            </ul>
          </div>

          <WebcamPreview onPermissionGranted={() => setWebcamReady(true)} />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex gap-4">
            <Link
              href="/"
              className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors font-medium inline-block text-center no-underline"
            >
              Back
            </Link>
            <button
              onClick={startCountdown}
              className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Start {isPractice ? 'Practice' : 'Assessment'}
            </button>
          </div>

          {!webcamReady && (
            <p className="text-sm text-gray-500 text-center mt-2">
              Webcam setup recommended for movement tracking
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fullscreen-assessment">
      <WebcamMonitor onMovementData={handleMovementData} />

      {/* Timer in top right */}
      <div className="absolute top-4 right-4 text-xl font-mono text-gray-600">
        {formatTime(timeRemaining)}
      </div>

      {/* Debug info for practice mode */}
      {isPractice && debugInfo && (
        <div className="absolute top-4 left-4 text-sm font-mono text-gray-500">
          {debugInfo}
        </div>
      )}

      {/* Canvas for shape rendering */}
      <canvas
        ref={canvasRef}
        width={typeof window !== 'undefined' ? window.innerWidth : 1920}
        height={typeof window !== 'undefined' ? window.innerHeight : 1080}
        className="absolute inset-0 pointer-events-none"
        style={{ width: '100vw', height: '100vh' }}
      />

      {/* Instructions at bottom */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center text-gray-500">
        <p>Press SPACEBAR when shapes match | Press ESC to exit</p>
      </div>
    </div>
  );
}
