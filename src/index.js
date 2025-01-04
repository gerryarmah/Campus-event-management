import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // You can create this file for your CSS styles (optional)
import App from './App'; // This imports your main app component


// This renders the root App component inside the div with id="root" in your index.html
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

