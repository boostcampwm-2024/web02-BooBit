import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { AuthProvider } from '../shared/store/auth/authContext';
import { ToastProvider } from '../shared/store/ToastContext';

async function enableMocking() {
  if (import.meta.env.MODE !== 'development') return;

  const { worker } = await import('../__mocks/browser');

  return worker.start();
}

enableMocking().then(() =>
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </React.StrictMode>
  )
);
