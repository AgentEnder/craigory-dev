import { useState, useEffect } from 'react';
import '../../../src/style.css';
import { AssessmentRunner } from '../../../components/AssessmentRunner';
import { navigate } from '../../../components/Link';
import type { AssessmentResults } from '../../../src/types';

export default function Page() {
  const [practiceDuration, setPracticeDuration] = useState<number>(60);

  useEffect(() => {
    // Get duration from sessionStorage
    const storedDuration = sessionStorage.getItem('qbcheck-practice-duration');
    if (storedDuration) {
      setPracticeDuration(parseInt(storedDuration));
    }
  }, []);

  const handleAssessmentComplete = (results: AssessmentResults) => {
    // Store results in sessionStorage and navigate to results view
    sessionStorage.setItem('qbcheck-results', JSON.stringify(results));
    navigate('/results/view');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AssessmentRunner
        isPractice={true}
        practiceDuration={practiceDuration}
        onComplete={handleAssessmentComplete}
      />
    </div>
  );
}
