import type { AssessmentResults, TimelineEvent } from '../../src/types';
import { Link } from '../../components/Link';
import {
  InteractiveLineChart,
  type ChartDataPoint as InteractiveChartDataPoint,
  type ChartLine,
} from '../../components/InteractiveLineChart';

interface ResultsDisplayProps {
  results: AssessmentResults;
}

function ResponseTimeChart({ reactionTimes }: { reactionTimes: number[] }) {
  if (reactionTimes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Response Times
        </h2>
        <p className="text-gray-500 text-center py-8">
          No response times to display
        </p>
      </div>
    );
  }

  // Calculate statistics for reference lines
  const mean =
    reactionTimes.reduce((sum, time) => sum + time, 0) / reactionTimes.length;
  const sortedTimes = [...reactionTimes].sort((a, b) => a - b);
  const p95Index = Math.floor(0.95 * sortedTimes.length);
  const p95 = sortedTimes[p95Index];
  const minTime = Math.min(...reactionTimes);
  const maxTime = Math.max(...reactionTimes);

  // Transform data for InteractiveLineChart
  const chartData: InteractiveChartDataPoint[] = reactionTimes.map(
    (time, index) => ({
      x: index,
      xLabel: `Response ${index + 1}`,
      values: {
        reactionTime: time,
        mean: mean,
        p95: p95,
      },
      metadata: {
        fastest: minTime === time ? 'Yes' : 'No',
        slowest: maxTime === time ? 'Yes' : 'No',
      },
    })
  );

  const lines: ChartLine[] = [
    {
      key: 'reactionTime',
      label: 'Response Time',
      color: '#10b981',
      strokeWidth: 2,
      pointRadius: 3,
      unit: 'ms',
    },
    {
      key: 'mean',
      label: 'Mean',
      color: '#3b82f6',
      strokeWidth: 2,
      strokeDasharray: '5,5',
      pointRadius: 0, // Don't show points for reference lines
      unit: 'ms',
    },
    {
      key: 'p95',
      label: '95th Percentile',
      color: '#ef4444',
      strokeWidth: 2,
      strokeDasharray: '3,3',
      pointRadius: 0,
      unit: 'ms',
    },
  ];

  const timeRange = maxTime - minTime;
  const yMin = Math.max(0, minTime - timeRange * 0.1);
  const yMax = maxTime + timeRange * 0.1;

  return (
    <InteractiveLineChart
      data={chartData}
      lines={lines}
      title="Response Times"
      subtitle="Individual response times with statistical benchmarks"
      yAxisLabel="Time (ms)"
      xAxisLabel="Response Number"
      yRange={{ min: yMin, max: yMax }}
      height={350}
      interpretation="Each point shows your reaction time for a correct response. The dashed lines show your average (mean) and 95th percentile times for reference. Consistent times indicate steady attention, while high variability may suggest attention fluctuations."
    />
  );
}

function TimelineComponent({ timeline }: { timeline: TimelineEvent[] }) {
  const formatTimeMs = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getShapeIcon = (shape: { type: string; color: string }) => {
    const colorClass =
      shape.color === 'blue' ? 'text-blue-500' : 'text-red-500';
    return (
      <span
        className={`inline-flex items-center justify-center w-6 h-6 ${colorClass}`}
      >
        {shape.type === 'circle' ? '●' : '■'}
      </span>
    );
  };

  // Group events by time periods (every 30 seconds)
  const groupedEvents: { [key: string]: TimelineEvent[] } = {};
  timeline.forEach((event) => {
    const timeGroup = Math.floor(event.timestamp / 30000) * 30; // Group by 30-second intervals
    const key = formatTimeMs(timeGroup * 1000);
    if (!groupedEvents[key]) groupedEvents[key] = [];
    groupedEvents[key].push(event);
  });

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Assessment Timeline
      </h2>
      <div className="max-h-96 overflow-y-auto">
        <div className="space-y-4">
          {Object.entries(groupedEvents).map(([timeGroup, events]) => (
            <div key={timeGroup} className="border-l-2 border-gray-200 pl-4">
              <h3 className="font-medium text-gray-700 mb-2">{timeGroup}</h3>
              <div className="space-y-1">
                {events.map((event, index) => (
                  <div
                    key={`${event.timestamp}-${index}`}
                    className="flex items-center gap-3 text-sm"
                  >
                    <span className="text-gray-400 font-mono w-12 text-xs">
                      {formatTimeMs(event.timestamp)}
                    </span>
                    {event.type === 'shape' ? (
                      <div className="flex items-center gap-2">
                        {getShapeIcon(event.data.shape!)}
                        <span className="text-gray-600">
                          {event.data.shape!.color} {event.data.shape!.type}
                        </span>
                        {event.data.shouldMatch && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                            Should Match
                          </span>
                        )}
                        {event.data.wasMissed && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded font-medium">
                            Miss
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 flex items-center justify-center">
                          ⏎
                        </span>
                        <span
                          className={`font-medium ${
                            event.data.correct
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {event.data.correct ? '✓ Correct' : '✗ Incorrect'}{' '}
                          Response
                        </span>
                        <span className="text-xs text-gray-500">
                          ({Math.round(event.data.reactionTime!)}ms)
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ResultsDisplay({ results }: ResultsDisplayProps) {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatReactionTime = (ms: number): string => {
    return `${Math.round(ms)}ms`;
  };

  const getAccuracyColor = (accuracy: number): string => {
    if (accuracy >= 90) return 'text-green-600';
    if (accuracy >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMovementLevel = (score: number): string => {
    if (score < 10) return 'Very Low';
    if (score < 25) return 'Low';
    if (score < 50) return 'Moderate';
    if (score < 75) return 'High';
    return 'Very High';
  };

  const getMovementColor = (score: number): string => {
    if (score < 25) return 'text-green-600';
    if (score < 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const isPractice = results.duration < 300; // Less than 5 minutes is practice

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {isPractice ? 'Practice Session' : 'Assessment'} Results
        </h1>
        <p className="text-lg text-gray-600">
          Duration: {formatTime(results.duration)}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Accuracy Metrics */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Accuracy Metrics
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Overall Accuracy:</span>
              <span
                className={`text-2xl font-bold ${getAccuracyColor(
                  results.accuracy
                )}`}
              >
                {results.accuracy.toFixed(1)}%
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Correct Responses:</span>
                <span className="font-medium text-green-600">
                  {results.correctResponses}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Incorrect Responses:</span>
                <span className="font-medium text-red-600">
                  {results.incorrectResponses}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Missed Responses:</span>
                <span className="font-medium text-yellow-600">
                  {results.missedResponses}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-600">Total Shapes:</span>
                <span className="font-medium">{results.totalShapes}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reaction Time Metrics */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Reaction Time
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Average:</span>
              <span className="text-2xl font-bold text-blue-600">
                {formatReactionTime(results.averageReactionTime)}
              </span>
            </div>

            {results.reactionTimes.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Fastest:</span>
                  <span className="font-medium text-green-600">
                    {formatReactionTime(Math.min(...results.reactionTimes))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Slowest:</span>
                  <span className="font-medium text-red-600">
                    {formatReactionTime(Math.max(...results.reactionTimes))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Responses:</span>
                  <span className="font-medium">
                    {results.reactionTimes.length}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Response Time Chart */}
      <div className="mb-8">
        <ResponseTimeChart reactionTimes={results.reactionTimes} />
      </div>

      {/* Movement Analysis */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Movement Analysis
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-700">Movement Level:</span>
              <span
                className={`text-xl font-bold ${getMovementColor(
                  results.movementScore
                )}`}
              >
                {getMovementLevel(results.movementScore)}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Based on webcam analysis during the assessment. Lower movement
              typically indicates better sustained attention.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">
              Movement Score: {results.movementScore.toFixed(1)}
            </h3>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${
                  results.movementScore < 25
                    ? 'bg-green-500'
                    : results.movementScore < 50
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(100, results.movementScore)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="mb-8">
        <TimelineComponent timeline={results.timeline} />
      </div>

      {/* Performance Summary */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Performance Summary
        </h2>

        <div className="prose text-gray-700">
          <p>
            {isPractice ? 'In this practice session' : 'During the assessment'},
            you responded to <strong>{results.totalShapes}</strong> shapes over{' '}
            <strong>{formatTime(results.duration)}</strong>.
          </p>

          <p>
            Your accuracy was{' '}
            <strong className={getAccuracyColor(results.accuracy)}>
              {results.accuracy.toFixed(1)}%
            </strong>
            , with an average reaction time of{' '}
            <strong>{formatReactionTime(results.averageReactionTime)}</strong>.
          </p>

          <p>
            Movement analysis indicates{' '}
            <strong className={getMovementColor(results.movementScore)}>
              {getMovementLevel(results.movementScore).toLowerCase()}
            </strong>{' '}
            levels of physical movement during the test.
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <p className="text-yellow-800 text-sm">
          <strong>Important:</strong> This is a simulation for educational
          purposes only. These results should not be used for clinical diagnosis
          or medical decisions. Consult a healthcare professional for proper
          ADHD assessment.
        </p>
      </div>

      <div className="text-center space-x-4">
        <Link
          href="/results"
          className="bg-gray-600 text-white py-3 px-8 rounded-lg hover:bg-gray-700 transition-colors font-medium inline-block no-underline"
        >
          Back to Results
        </Link>
        <Link
          href="/"
          className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors font-medium inline-block no-underline"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
