import React from 'react';
import { createRoot } from 'react-dom/client';
import MainApp from './MainApp.jsx';

const rootEl = document.getElementById('root');
if (rootEl) {
    createRoot(rootEl).render(<MainApp />);
}
