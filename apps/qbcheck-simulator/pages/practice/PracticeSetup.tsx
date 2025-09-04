import { useState } from 'react';
import { Link } from '../../components/Link';

export function PracticeSetup() {
  const [selectedDuration, setSelectedDuration] = useState(60);

  const durations = [
    { value: 30, label: '30 seconds' },
    { value: 60, label: '1 minute' },
    { value: 120, label: '2 minutes' },
    { value: 300, label: '5 minutes' },
  ];

  const handleStart = (e: React.MouseEvent) => {
    e.preventDefault();
    // Store duration in sessionStorage before navigation
    sessionStorage.setItem(
      'qbcheck-practice-duration',
      selectedDuration.toString()
    );
    // Let the Link handle navigation
    return true;
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Practice Session Setup
        </h1>
        <p className="text-lg text-gray-600">
          Choose how long you'd like to practice
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Select Duration
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {durations.map((duration) => (
            <label
              key={duration.value}
              className={`
                flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all
                ${
                  selectedDuration === duration.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <input
                type="radio"
                name="duration"
                value={duration.value}
                checked={selectedDuration === duration.value}
                onChange={(e) => setSelectedDuration(Number(e.target.value))}
                className="sr-only"
              />
              <span className="text-lg font-medium">{duration.label}</span>
            </label>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">
            Practice Instructions:
          </h3>
          <ul className="space-y-1 text-blue-700 text-sm">
            <li>
              • Press SPACEBAR when the current shape matches the previous one
            </li>
            <li>• Try to respond as quickly and accurately as possible</li>
            <li>• Keep your eyes on the center of the screen</li>
            <li>• The test will start in fullscreen mode</li>
          </ul>
        </div>

        <div className="flex gap-4">
          <Link
            href="/"
            className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors font-medium inline-block text-center no-underline"
          >
            Back
          </Link>
          <Link
            href="/practice/run"
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium inline-block text-center no-underline"
            onClick={handleStart}
          >
            Start Practice ({selectedDuration}s)
          </Link>
        </div>
      </div>
    </div>
  );
}
