import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import type { ReportData } from './types';

const dataEl = document.getElementById('report-data');
const data: ReportData = dataEl
  ? JSON.parse(dataEl.textContent ?? '{}')
  : { date: '', results: [], generatedAt: '' };

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App data={data} />
  </StrictMode>
);
