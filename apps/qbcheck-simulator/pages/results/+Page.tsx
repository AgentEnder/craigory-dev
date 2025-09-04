import { useState, useEffect } from 'react';
import '../../src/style.css';
import { navigate, Link } from '../../components/Link';
import type { AssessmentResults } from '../../src/types';

interface SavedRun {
  id: string;
  results: AssessmentResults;
  personName?: string;
  savedAt: string;
  completedAt: string;
}

export default function Page() {
  const [savedRuns, setSavedRuns] = useState<SavedRun[]>([]);
  const [filteredRuns, setFilteredRuns] = useState<SavedRun[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);
  const [nameFilter, setNameFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'practice' | 'assessment'>('all');

  useEffect(() => {
    // Check if there's a fresh result in sessionStorage that should be viewed
    const storedResults = sessionStorage.getItem('qbcheck-results');
    if (storedResults) {
      // Fresh results available, redirect to view page
      navigate('/results/view');
      return;
    }

    // Load saved runs from localStorage
    loadSavedRuns();
  }, []);

  const loadSavedRuns = () => {
    const runs = JSON.parse(localStorage.getItem('qbcheck-saved-runs') || '[]') as SavedRun[];
    // Sort by most recent first
    runs.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
    setSavedRuns(runs);
  };

  // Filter runs whenever filters or savedRuns change
  useEffect(() => {
    let filtered = [...savedRuns];

    // Filter by name
    if (nameFilter.trim()) {
      filtered = filtered.filter(run => {
        const name = run.personName?.toLowerCase() || '';
        return name.includes(nameFilter.toLowerCase()) || 
               (nameFilter.toLowerCase() === 'anonymous' && !run.personName);
      });
    }

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(run => {
        const isPractice = run.results.duration < 300; // Less than 5 minutes is practice
        return typeFilter === 'practice' ? isPractice : !isPractice;
      });
    }

    setFilteredRuns(filtered);
  }, [savedRuns, nameFilter, typeFilter]);

  const clearFilters = () => {
    setNameFilter('');
    setTypeFilter('all');
  };

  const getUniqueNames = () => {
    const names = savedRuns.map(run => run.personName).filter(Boolean);
    const uniqueNames = [...new Set(names)] as string[];
    return uniqueNames.sort();
  };

  const deleteRun = (id: string) => {
    const runs = JSON.parse(localStorage.getItem('qbcheck-saved-runs') || '[]') as SavedRun[];
    const filtered = runs.filter(run => run.id !== id);
    localStorage.setItem('qbcheck-saved-runs', JSON.stringify(filtered));
    loadSavedRuns();
    setShowDeleteDialog(null);
  };

  const clearAllRuns = () => {
    localStorage.removeItem('qbcheck-saved-runs');
    setSavedRuns([]);
  };

  const formatDateTime = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getRunTypeLabel = (duration: number): string => {
    return duration < 300 ? 'Practice' : 'Assessment'; // Less than 5 minutes is practice
  };

  const getAccuracyColor = (accuracy: number): string => {
    if (accuracy >= 90) return 'text-green-600';
    if (accuracy >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Assessment Results</h1>
              <p className="text-gray-600 mt-1">View and manage your saved assessment runs</p>
            </div>
            <div className="flex gap-3">
              <Link 
                href="/"
                className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors font-medium no-underline"
              >
                Home
              </Link>
              {savedRuns.length > 0 && (
                <>
                  <Link
                    href={`/results/aggregate${(() => {
                      const params = new URLSearchParams();
                      if (nameFilter) params.set('name', nameFilter);
                      if (typeFilter !== 'all') params.set('type', typeFilter);
                      return params.toString() ? '?' + params.toString() : '';
                    })()}`}
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium no-underline"
                  >
                    View Analytics
                  </Link>
                  <button
                    onClick={() => setShowDeleteDialog('all')}
                    className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Clear All
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Filters Section */}
        {savedRuns.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="name-filter" className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Name
                </label>
                <div className="relative">
                  <input
                    id="name-filter"
                    type="text"
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                    placeholder="Enter name or 'anonymous'"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {nameFilter && (
                    <button
                      onClick={() => setNameFilter('')}
                      className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-2">
                  Assessment Type
                </label>
                <select
                  id="type-filter"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as 'all' | 'practice' | 'assessment')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="practice">Practice Only</option>
                  <option value="assessment">Full Assessment Only</option>
                </select>
              </div>
              
              <div className="flex flex-col justify-end">
                <div className="flex gap-2 items-center h-10">
                  {(nameFilter || typeFilter !== 'all') && (
                    <button
                      onClick={clearFilters}
                      className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Clear Filters
                    </button>
                  )}
                  <div className="text-sm text-gray-500 whitespace-nowrap">
                    {filteredRuns.length} of {savedRuns.length} results
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Name Filters */}
            {getUniqueNames().length > 0 && (
              <div className="pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-500 mb-2">Quick name filters:</div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setNameFilter('anonymous')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      nameFilter === 'anonymous'
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Anonymous
                  </button>
                  {getUniqueNames().slice(0, 6).map(name => (
                    <button
                      key={name}
                      onClick={() => setNameFilter(name)}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        nameFilter === name
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
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
        )}

        {savedRuns.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm2 2h10v6H5v-6z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No saved results yet</h3>
            <p className="text-gray-600 mb-4">
              Complete an assessment and choose to save it to see your results here.
            </p>
            <Link 
              href="/"
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium no-underline"
            >
              Start Assessment
            </Link>
          </div>
        ) : filteredRuns.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.243 3.03a1 1 0 01.727 1.213L9.53 6h2.94l.56-2.243a1 1 0 111.94.486L14.53 6H16a1 1 0 110 2h-1.97l-1 4H15a1 1 0 110 2h-2.47l-.56 2.242a1 1 0 11-1.94-.485L10.47 14H7.53l-.56 2.242a1 1 0 11-1.94-.485L5.47 14H4a1 1 0 110-2h1.97l1-4H5a1 1 0 110-2h2.47l.56-2.243a1 1 0 011.213-.727zM9.03 8l-1 4h2.94l1-4H9.03z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results match your filters</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or clearing them to see all results.
            </p>
            <button
              onClick={clearFilters}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRuns.map((run) => (
              <div key={run.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {run.personName || 'Anonymous User'}
                      </h3>
                      <span className={`px-2 py-1 rounded text-sm font-medium ${
                        getRunTypeLabel(run.results.duration) === 'Practice' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {getRunTypeLabel(run.results.duration)}
                      </span>
                    </div>
                    
                    <div className="grid md:grid-cols-4 gap-4 mb-3 text-sm">
                      <div>
                        <span className="text-gray-600">Completed:</span>
                        <div className="font-medium">{formatDateTime(run.completedAt)}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Duration:</span>
                        <div className="font-medium">{formatDuration(run.results.duration)}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Accuracy:</span>
                        <div className={`font-medium ${getAccuracyColor(run.results.accuracy)}`}>
                          {run.results.accuracy.toFixed(1)}%
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Avg Reaction:</span>
                        <div className="font-medium">{Math.round(run.results.averageReactionTime)}ms</div>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500">
                      Saved: {formatDateTime(run.savedAt)}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Link
                      href={`/results/view?id=${run.id}`}
                      className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium no-underline"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => setShowDeleteDialog(run.id)}
                      className="bg-red-100 text-red-700 py-2 px-3 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {showDeleteDialog === 'all' ? 'Clear All Results' : 'Delete Result'}
              </h2>
              <p className="text-gray-600 mb-6">
                {showDeleteDialog === 'all' 
                  ? 'Are you sure you want to delete all saved assessment results? This action cannot be undone.'
                  : 'Are you sure you want to delete this assessment result? This action cannot be undone.'
                }
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteDialog(null)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (showDeleteDialog === 'all') {
                      clearAllRuns();
                    } else {
                      deleteRun(showDeleteDialog);
                    }
                  }}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
