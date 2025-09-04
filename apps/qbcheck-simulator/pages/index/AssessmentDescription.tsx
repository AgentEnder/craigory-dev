import { useState, useEffect } from 'react';
import { Link } from '../../components/Link';

export function AssessmentDescription() {
  const [hasSavedResults, setHasSavedResults] = useState(false);
  const [savedResultsCount, setSavedResultsCount] = useState(0);

  useEffect(() => {
    // Check if there are any saved results
    const savedRuns = JSON.parse(localStorage.getItem('qbcheck-saved-runs') || '[]');
    setHasSavedResults(savedRuns.length > 0);
    setSavedResultsCount(savedRuns.length);
  }, []);
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          QBCheck ADHD Assessment Simulator
        </h1>
        <p className="text-xl text-gray-600">
          A simulation of the QBCheck continuous performance test
        </p>
      </div>

      {/* Saved Results Link */}
      {hasSavedResults && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 rounded-full p-2">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm2 2h10v6H5v-6z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-blue-900">
                  Previous Assessment Results
                </h3>
                <p className="text-sm text-blue-700">
                  You have {savedResultsCount} saved assessment{savedResultsCount !== 1 ? 's' : ''} available to review
                </p>
              </div>
            </div>
            <Link
              href="/results"
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium no-underline"
            >
              View Results
            </Link>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          About the QBCheck Assessment
        </h2>

        <div className="space-y-6 text-gray-700">
          <p>
            The QBCheck test is a computer-based assessment tool used to
            evaluate attention and concentration. This simulator recreates the
            core mechanics of the original test for educational purposes.
          </p>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              How it works:
            </h3>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Shapes appear on screen one at a time for a brief duration
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Press{' '}
                <kbd className="px-2 py-1 bg-gray-100 rounded text-sm">
                  SPACEBAR
                </kbd>{' '}
                when the current shape matches the previous shape
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Shapes can be blue or red circles or squares
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                The test monitors your accuracy and reaction times
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Your webcam tracks movement during the assessment
              </li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">
              Important Notes:
            </h4>
            <ul className="space-y-1 text-yellow-700 text-sm">
              <li>• The full assessment takes 20 minutes</li>
              <li>• Find a quiet, well-lit environment</li>
              <li>• Ensure your webcam has permission to access</li>
              <li>• Keep your hands on the keyboard during the test</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Practice Mode
          </h3>
          <p className="text-gray-600 mb-6">
            Try a shorter version of the test to familiarize yourself with the
            format. You can choose the duration from 30 seconds to 5 minutes.
          </p>
          <Link
            href="/practice"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium inline-block text-center no-underline"
          >
            Start Practice Session
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Full Assessment
          </h3>
          <p className="text-gray-600 mb-6">
            Take the complete 20-minute assessment. Make sure you have enough
            time and won't be interrupted.
          </p>
          <Link
            href="/assessment"
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium inline-block text-center no-underline"
          >
            Start Full Assessment
          </Link>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          This is a simulation for educational purposes only and is not intended
          for clinical diagnosis.
        </p>
      </div>
    </div>
  );
}
