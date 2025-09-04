import { useState, useEffect } from 'react';
import '../../../src/style.css';
import { ResultsDisplay } from '../ResultsDisplay';
import { navigate, Link } from '../../../components/Link';
import type { AssessmentResults } from '../../../src/types';

interface SavedRun {
  id: string;
  results: AssessmentResults;
  personName?: string;
  savedAt: string;
  completedAt: string;
}

export default function Page() {
  const [results, setResults] = useState<AssessmentResults | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [personName, setPersonName] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Check for query params first (for viewing saved runs)
    const urlParams = new URLSearchParams(window.location.search);
    const runId = urlParams.get('id');

    if (runId) {
      // Load from localStorage
      const savedRuns = JSON.parse(localStorage.getItem('qbcheck-saved-runs') || '[]') as SavedRun[];
      const savedRun = savedRuns.find(run => run.id === runId);
      
      if (savedRun) {
        setResults(savedRun.results);
        setPersonName(savedRun.personName || '');
        setIsSaved(true);
        return;
      }
    }

    // Otherwise, get results from sessionStorage (new run)
    const storedResults = sessionStorage.getItem('qbcheck-results');
    if (storedResults) {
      try {
        const parsedResults = JSON.parse(storedResults);
        setResults(parsedResults);
      } catch (error) {
        console.error('Error parsing results:', error);
        navigate('/');
      }
    } else {
      // No results found, redirect home
      navigate('/');
    }
  }, []);

  const loadSavedNames = () => {
    const savedRuns = JSON.parse(localStorage.getItem('qbcheck-saved-runs') || '[]') as SavedRun[];
    const names = [...new Set(savedRuns.map(run => run.personName).filter(Boolean))];
    return names as string[];
  };

  const handleNameChange = (value: string) => {
    setPersonName(value);
    
    if (value.trim()) {
      const allNames = loadSavedNames();
      const filtered = allNames.filter(name => 
        name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (name: string) => {
    setPersonName(name);
    setShowSuggestions(false);
  };

  const handleSave = () => {
    if (!results) return;

    const savedRuns = JSON.parse(localStorage.getItem('qbcheck-saved-runs') || '[]') as SavedRun[];
    
    const newRun: SavedRun = {
      id: crypto.randomUUID(),
      results,
      personName: personName.trim() || undefined,
      savedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };

    savedRuns.push(newRun);
    localStorage.setItem('qbcheck-saved-runs', JSON.stringify(savedRuns));
    
    // Update URL to reflect saved state
    const newUrl = `${window.location.pathname}?id=${newRun.id}`;
    window.history.replaceState(null, '', newUrl);
    
    setIsSaved(true);
    setShowSaveDialog(false);
    
    // Clear sessionStorage since we've saved it
    sessionStorage.removeItem('qbcheck-results');
  };

  if (!results) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-gray-600">Loading results...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link 
              href="/results"
              className="text-blue-600 hover:text-blue-800 font-medium no-underline"
            >
              ← All Results
            </Link>
            <Link 
              href="/"
              className="text-gray-600 hover:text-gray-800 no-underline"
            >
              Home
            </Link>
          </div>
          
          {!isSaved && (
            <button
              onClick={() => setShowSaveDialog(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Save Run
            </button>
          )}
          
          {isSaved && (
            <div className="flex items-center gap-2 text-green-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Saved
            </div>
          )}
        </div>
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Save Assessment Run
              </h2>
              
              <div className="space-y-4">
                <div className="relative">
                  <label htmlFor="person-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Person Name (Optional)
                  </label>
                  <input
                    id="person-name"
                    type="text"
                    value={personName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    onFocus={() => {
                      if (personName.trim()) {
                        const allNames = loadSavedNames();
                        setSuggestions(allNames);
                        setShowSuggestions(allNames.length > 0);
                      }
                    }}
                    onBlur={() => {
                      // Delay hiding to allow for click on suggestion
                      setTimeout(() => setShowSuggestions(false), 200);
                    }}
                    placeholder="Enter name or leave blank"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  
                  {/* Autocomplete Suggestions */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => selectSuggestion(suggestion)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-gray-600">
                  This will save the run to your browser's local storage for future viewing.
                </p>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowSaveDialog(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Display */}
      <ResultsDisplay results={results} />
    </div>
  );
}