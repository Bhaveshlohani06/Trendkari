import React from 'react';
import ReactDOM from 'react-dom/client';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import App from './App.jsx'
import './index.css'; 

import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/auth.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { LocationProvider } from './context/LocationContext.jsx';
import { initForegroundNotifications } from "../src/notification.js";

initForegroundNotifications();



// ✅ REGISTER SERVICE WORKER HERE
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then((registration) => {
        console.log(
          "Firebase Service Worker registered:",
          registration
        );
      })
      .catch((error) => {
        console.error(
          "Service Worker registration failed:",
          error
        );
      });
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>

  <BrowserRouter>
    <AuthProvider>
      <ThemeProvider>
        <LocationProvider>
    <App />
    
    </LocationProvider>
     </ThemeProvider>
     </AuthProvider>
    
  </BrowserRouter>  
 
  </>
)
