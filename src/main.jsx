import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

window.addEventListener('error', (e) => {
  document.body.innerHTML = `<div style="color: red; padding: 20px;">
    <h2>Runtime Error</h2>
    <pre>${e.error?.stack || e.message}</pre>
  </div>`;
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
