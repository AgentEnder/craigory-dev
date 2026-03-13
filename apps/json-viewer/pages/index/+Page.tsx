import '../../src/style.css';
import { AppHeader } from '../../components/AppHeader';

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <AppHeader />
        <p className="text-gray-500 text-center">Loading...</p>
      </div>
    </div>
  );
}
