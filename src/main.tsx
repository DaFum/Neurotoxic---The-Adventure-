/**
 * #1: UPDATES
 * - Initialized React root.
 * 
 * #2: NEXT STEPS & IDEAS
 * - No further changes planned.
 * 
 * #3: ERRORS & SOLUTIONS
 * - No major errors found.
 */
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const originalWarn = console.warn.bind(console);
console.warn = (...args: unknown[]) => {
  const message = String(args[0] ?? '');
  if (message.includes('using deprecated parameters for the initialization function; pass a single object instead')) {
    return;
  }
  originalWarn(...args);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
