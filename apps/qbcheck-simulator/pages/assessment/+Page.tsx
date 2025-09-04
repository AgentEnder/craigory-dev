import '../../src/style.css';
import { AssessmentRunner } from '../../components/AssessmentRunner';
import { navigate } from '../../components/Link';
import type { AssessmentResults } from '../../src/types';

export default function Page() {
  const handleAssessmentComplete = (results: AssessmentResults) => {
    // Store results in sessionStorage and navigate to results view
    sessionStorage.setItem('qbcheck-results', JSON.stringify(results));
    navigate('/results/view');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AssessmentRunner
        isPractice={false}
        onComplete={handleAssessmentComplete}
      />
    </div>
  );
}
