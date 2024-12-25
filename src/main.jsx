// main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';

import DisableNavigations from './components/disableNavigations';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <DisableNavigations />
      <App />
    </HashRouter>
  </React.StrictMode>
);