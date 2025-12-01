import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';

// FIX: Must start with VITE_ to be visible in React
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Debug log to verify ID is loaded
console.log("Google Client ID Loaded:", clientId);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
)