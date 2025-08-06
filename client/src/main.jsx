import React from 'react';
import ReactDOM from 'react-dom/client';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/auth.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>

  <BrowserRouter>
    <AuthProvider>
    <App />
     </AuthProvider>
  </BrowserRouter>  
 
  </>
)
