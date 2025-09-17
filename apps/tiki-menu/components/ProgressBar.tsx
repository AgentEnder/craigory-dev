import { useOperationsInProgress } from '../src/stores/adminStore';

export function ProgressBar() {
  const isOperationInProgress = useOperationsInProgress();

  if (!isOperationInProgress) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="h-1 bg-tiki-accent/20">
        <div className="h-full bg-tiki-accent animate-progress-indeterminate"></div>
      </div>
    </div>
  );
}