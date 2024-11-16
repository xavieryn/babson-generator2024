import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Create the root div dynamically (needed for Chrome extension)
const root = document.createElement("div");
root.id = "root";  // Add an ID for easier styling
root.className = "container";  // Add any Tailwind classes you need
document.body.appendChild(root);

// Create React root using the dynamic div
const reactRoot = ReactDOM.createRoot(root);
reactRoot.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);  
