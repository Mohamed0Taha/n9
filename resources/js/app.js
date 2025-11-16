import './bootstrap';
import '../css/app.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App.jsx';

const root = document.getElementById('root');

if (root) {
    createRoot(root).render(React.createElement(App));
}
