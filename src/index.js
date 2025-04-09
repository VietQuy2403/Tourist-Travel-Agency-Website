// Polyfills for browser compatibility
import 'process';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import process from 'process/browser';
import { Buffer } from 'buffer';

// Cấu hình các polyfill toàn cục
window.process = window.process || process;
window.Buffer = window.Buffer || Buffer;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
