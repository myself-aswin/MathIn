// main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';

import './styles/fontfaces.css';
import './index.css';

import DisableNavigations from './components/disableNavigations';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <DisableNavigations />
      <App />
    </HashRouter>
  </React.StrictMode>
);