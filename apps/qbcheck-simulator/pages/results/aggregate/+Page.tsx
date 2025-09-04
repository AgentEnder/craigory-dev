import { useState, useEffect } from 'react';
import '../../../src/style.css';
import { navigate, Link } from '../../../components/Link';
import {
  InteractiveLineChart,
  type ChartDataPoint as InteractiveChartDataPoint,
  type ChartLine,
} from '../../../components/InteractiveLineChart';
import type { AssessmentResults } from '../../../src/types';

interface SavedRun {
  id: string;
  results: AssessmentResults;
  personName?: string;
  savedAt: string;
  completedAt: string;
}

interface AggregateStats {
  totalRuns: number;
  practiceRuns: number;
  fullAssessments: number;
  averageAccuracy: number;
  averageReactionTime: number;
  bestAccuracy: number;
  worstAccuracy: number;
  fastestReaction: number;
  slowestReaction: number;
  uniqueUsers: number;
  dateRange: { start: string; end: string };
}

interface ChartDataPoint {
  date: string;
  accuracy: number;
  reactionTime: number;
  runType: 'practice' | 'assessment';
  personName: string;
  incorrectRate: number; // Incorrect responses per total shapes (%)
  missedRate: number; // Missed responses per total shapes (%)
  totalShapes: number;
}

export default function Page() {
  const [savedRuns, setSavedRuns] = useState<SavedRun[]>([]);
  const [filteredRuns, setFilteredRuns] = useState<SavedRun[]>([]);
  const [nameFilter, setNameFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState<
    'all' | 'practice' | 'assessment'
  >('all');
  const [stats, setStats] = useState<AggregateStats | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  useEffect(() => {
    // Load saved runs from localStorage
    const runs = JSON.parse(
      localStorage.getItem('qbcheck-saved-runs') || '[]'
    ) as SavedRun[];
    runs.sort(
      (a, b) =>
        new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
    ); // Chronological for charts
    setSavedRuns(runs);

    // Parse query params for filters
    const urlParams = new URLSearchParams(window.location.search);
    const nameParam = urlParams.get('name');
    const typeParam = urlParams.get('type');

    if (nameParam) setNameFilter(nameParam);
    if (typeParam && ['all', 'practice', 'assessment'].includes(typeParam)) {
      setTypeFilter(typeParam as 'all' | 'practice' | 'assessment');
    }
  }, []);

  // Apply filters and calculate stats
  useEffect(() => {
    let filtered = [...savedRuns];

    // Filter by name
    if (nameFilter.trim()) {
      filtered = filtered.filter((run) => {
        const name = run.personName?.toLowerCase() || '';
        return (
          name.includes(nameFilter.toLowerCase()) ||
          (nameFilter.toLowerCase() === 'anonymous' && !run.personName)
        );
      });
    }

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter((run) => {
        const isPractice = run.results.duration < 300;
        return typeFilter === 'practice' ? isPractice : !isPractice;
      });
    }

    setFilteredRuns(filtered);

    // Calculate aggregate stats
    if (filtered.length > 0) {
      const practiceRuns = filtered.filter(
        (run) => run.results.duration < 300
      ).length;
      const fullAssessments = filtered.length - practiceRuns;
      const accuracies = filtered.map((run) => run.results.accuracy);
      const reactionTimes = filtered.map(
        (run) => run.results.averageReactionTime
      );
      const uniqueUsers = new Set(
        filtered.map((run) => run.personName || 'Anonymous')
      ).size;

      const dates = filtered.map((run) => new Date(run.completedAt));
      const dateRange = {
        start: new Date(
          Math.min(...dates.map((d) => d.getTime()))
        ).toLocaleDateString(),
        end: new Date(
          Math.max(...dates.map((d) => d.getTime()))
        ).toLocaleDateString(),
      };

      setStats({
        totalRuns: filtered.length,
        practiceRuns,
        fullAssessments,
        averageAccuracy:
          accuracies.reduce((a, b) => a + b, 0) / accuracies.length,
        averageReactionTime:
          reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length,
        bestAccuracy: Math.max(...accuracies),
        worstAccuracy: Math.min(...accuracies),
        fastestReaction: Math.min(...reactionTimes),
        slowestReaction: Math.max(...reactionTimes),
        uniqueUsers,
        dateRange,
      });

      // Prepare chart data
      const chartPoints: ChartDataPoint[] = filtered.map((run) => ({
        date: new Date(run.completedAt).toISOString().split('T')[0], // YYYY-MM-DD format
        accuracy: run.results.accuracy,
        reactionTime: run.results.averageReactionTime,
        runType: run.results.duration < 300 ? 'practice' : 'assessment',
        personName: run.personName || 'Anonymous',
        incorrectRate:
          (run.results.incorrectResponses / run.results.totalShapes) * 100,
        missedRate:
          (run.results.missedResponses / run.results.totalShapes) * 100,
        totalShapes: run.results.totalShapes,
      }));
      setChartData(chartPoints);
    } else {
      setStats(null);
      setChartData([]);
    }
  }, [savedRuns, nameFilter, typeFilter]);

  const updateFiltersInUrl = (name: string, type: string) => {
    const params = new URLSearchParams();
    if (name) params.set('name', name);
    if (type !== 'all') params.set('type', type);
    const newUrl = `${window.location.pathname}${
      params.toString() ? '?' + params.toString() : ''
    }`;
    window.history.replaceState(null, '', newUrl);
  };

  const handleNameFilterChange = (value: string) => {
    setNameFilter(value);
    updateFiltersInUrl(value, typeFilter);
  };

  const handleTypeFilterChange = (value: 'all' | 'practice' | 'assessment') => {
    setTypeFilter(value);
    updateFiltersInUrl(nameFilter, value);
  };

  const clearFilters = () => {
    setNameFilter('');
    setTypeFilter('all');
    updateFiltersInUrl('', 'all');
  };

  const getUniqueNames = () => {
    const names = savedRuns.map((run) => run.personName).filter(Boolean);
    const uniqueNames = [...new Set(names)] as string[];
    return uniqueNames.sort();
  };

  if (savedRuns.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link
                href="/results"
                className="text-blue-600 hover:text-blue-800 font-medium no-underline"
              >
                ← Back to Results
              </Link>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              No Data Available
            </h2>
            <p className="text-gray-600 mb-6">
              You need at least one saved assessment to view aggregate data.
            </p>
            <Link
              href="/"
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium no-underline"
            >
              Start Assessment
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link
              href="/results"
              className="text-blue-600 hover:text-blue-800 font-medium no-underline"
            >
              ← Back to Results
            </Link>
            <h1 className="text-xl font-bold text-gray-900">
              Aggregate Data Analysis
            </h1>
          </div>
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-800 no-underline"
          >
            Home
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Filters Section - Compact for aggregate view */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid md:grid-cols-4 gap-4 items-end">
            <div>
              <label
                htmlFor="name-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Filter by Name
              </label>
              <input
                id="name-filter"
                type="text"
                value={nameFilter}
                onChange={(e) => handleNameFilterChange(e.target.value)}
                placeholder="Enter name or 'anonymous'"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label
                htmlFor="type-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Assessment Type
              </label>
              <select
                id="type-filter"
                value={typeFilter}
                onChange={(e) =>
                  handleTypeFilterChange(
                    e.target.value as 'all' | 'practice' | 'assessment'
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="practice">Practice Only</option>
                <option value="assessment">Full Assessment Only</option>
              </select>
            </div>

            <div className="flex gap-2">
              {(nameFilter || typeFilter !== 'all') && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>

            <div className="text-right text-sm text-gray-500">
              {filteredRuns.length} of {savedRuns.length} runs analyzed
            </div>
          </div>

          {/* Quick Name Filters */}
          {getUniqueNames().length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs text-gray-500 mr-2">
                  Quick filters:
                </span>
                <button
                  onClick={() => handleNameFilterChange('anonymous')}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    nameFilter === 'anonymous'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Anonymous
                </button>
                {getUniqueNames()
                  .slice(0, 8)
                  .map((name) => (
                    <button
                      key={name}
                      onClick={() => handleNameFilterChange(name)}
                      className={`px-2 py-1 text-xs rounded transition-colors ${
                        nameFilter === name
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {name}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>

        {stats ? (
          <>
            {/* Summary Statistics */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Total Runs
                </h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalRuns}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {stats.practiceRuns} practice, {stats.fullAssessments} full
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Average Accuracy
                </h3>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {stats.averageAccuracy.toFixed(1)}%
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Range: {stats.worstAccuracy.toFixed(1)}% -{' '}
                  {stats.bestAccuracy.toFixed(1)}%
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Avg Reaction Time
                </h3>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {Math.round(stats.averageReactionTime)}ms
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Range: {Math.round(stats.fastestReaction)}ms -{' '}
                  {Math.round(stats.slowestReaction)}ms
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Time Period
                </h3>
                <p className="text-sm font-bold text-gray-900 mt-2">
                  {stats.dateRange.start}
                </p>
                <p className="text-sm font-bold text-gray-900">
                  to {stats.dateRange.end}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {stats.uniqueUsers} unique users
                </p>
              </div>
            </div>

            {/* Interactive Charts */}
            <PerformanceChart data={chartData} />
            <ReactionTimeChart data={chartData} />
          </>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No data matches your filters
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters to see aggregate data.
            </p>
            <button
              onClick={clearFilters}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Performance Chart Component (Accuracy + Error Rates)
function PerformanceChart({ data }: { data: ChartDataPoint[] }) {
  if (data.length === 0) return null;

  // Transform data for InteractiveLineChart
  const chartData: InteractiveChartDataPoint[] = data.map((point, index) => ({
    x: index,
    xLabel: `Assessment ${index + 1}`,
    values: {
      accuracy: point.accuracy,
      incorrectRate: point.incorrectRate,
      missedRate: point.missedRate,
    },
    metadata: {
      type: point.runType === 'practice' ? 'Practice' : 'Full Assessment',
      person: point.personName,
      date: point.date,
      totalShapes: point.totalShapes,
    },
  }));

  const lines: ChartLine[] = [
    {
      key: 'accuracy',
      label: 'Accuracy',
      color: '#3b82f6',
      strokeWidth: 3,
      pointRadius: 4,
      unit: '%',
    },
    {
      key: 'incorrectRate',
      label: 'Incorrect Rate',
      color: '#ef4444',
      strokeWidth: 2,
      strokeDasharray: '5,5',
      pointRadius: 3,
      unit: '%',
    },
    {
      key: 'missedRate',
      label: 'Missed Rate',
      color: '#f97316',
      strokeWidth: 2,
      strokeDasharray: '3,3',
      pointRadius: 3,
      unit: '%',
    },
  ];

  return (
    <InteractiveLineChart
      data={chartData}
      lines={lines}
      title="Performance Metrics Over Time"
      subtitle="All metrics normalized as percentage of total shapes shown"
      yAxisLabel="Percentage (%)"
      yRange={{ min: 0, max: 100 }}
      interpretation="Higher accuracy (blue line) is better. Lower incorrect (red dashed) and missed (orange dotted) rates indicate better performance. All metrics are normalized by total shapes shown, making them comparable across different assessment lengths."
    />
  );
}

// Reaction Time Chart Component
function ReactionTimeChart({ data }: { data: ChartDataPoint[] }) {
  if (data.length === 0) return null;

  // Transform data for InteractiveLineChart
  const chartData: InteractiveChartDataPoint[] = data.map((point, index) => ({
    x: index,
    xLabel: `Assessment ${index + 1}`,
    values: {
      reactionTime: point.reactionTime,
    },
    metadata: {
      type: point.runType === 'practice' ? 'Practice' : 'Full Assessment',
      person: point.personName,
      date: point.date,
      accuracy: `${point.accuracy.toFixed(1)}%`,
      totalShapes: point.totalShapes,
    },
  }));

  const lines: ChartLine[] = [
    {
      key: 'reactionTime',
      label: 'Reaction Time',
      color: '#ef4444',
      strokeWidth: 2,
      pointRadius: 4,
      unit: 'ms',
    },
  ];

  // Find min/max for better scaling
  const reactionTimes = data.map((d) => d.reactionTime);
  const minTime = Math.max(0, Math.min(...reactionTimes) - 50);
  const maxTime = Math.max(...reactionTimes) + 50;

  return (
    <InteractiveLineChart
      data={chartData}
      lines={lines}
      title="Reaction Time Over Time"
      subtitle="Average reaction time for correct responses"
      yAxisLabel="Time (ms)"
      yRange={{ min: minTime, max: maxTime }}
      interpretation="Lower reaction times generally indicate better sustained attention and faster processing speed. Practice sessions may show different patterns than full assessments due to their shorter duration."
    />
  );
}
