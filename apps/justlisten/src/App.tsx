import { Route, Routes } from 'react-router-dom';
import { ErrorBoundary, PageShell } from '@new-personal-monorepo/small-app-design-system';
import { HomePage } from './pages/HomePage';
import { SongPage } from './pages/SongPage';
import { ImportPage } from './pages/ImportPage';
import { PlaylistPage } from './pages/PlaylistPage';

export function App() {
  return (
    <ErrorBoundary>
      <PageShell>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/song/:provider/:id" element={<SongPage />} />
          <Route path="/import" element={<ImportPage />} />
          <Route path="/playlist/:id" element={<PlaylistPage />} />
        </Routes>
      </PageShell>
    </ErrorBoundary>
  );
}
