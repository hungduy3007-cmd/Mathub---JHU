// Ensure window.fetch has both getter and setter in sandboxed iframes
try {
  const nativeFetch = window.fetch;
  let _fetch = nativeFetch ? nativeFetch.bind(window) : undefined;
  const desc = Object.getOwnPropertyDescriptor(window, 'fetch');
  if (!desc || !desc.set) {
    Object.defineProperty(window, 'fetch', {
      get() {
        return _fetch;
      },
      set(fn) {
        _fetch = fn;
      },
      configurable: true,
      enumerable: true,
    });
  }
} catch (e) {
  // Ignored in restricted environments
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
