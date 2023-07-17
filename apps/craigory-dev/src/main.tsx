import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import App from './app/app';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App></App>
  </StrictMode>
);
