import { useState, useEffect, useContext, createContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  // Initialize state from localStorage if available
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem('auth');
    return stored ? JSON.parse(stored) : { user: null, token: '' };
  });

  // Keep axios headers and localStorage in sync with auth state
  
  useEffect(() => {
    if (auth?.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${auth.token}`;
   const parsed = localStorage.setItem('auth', JSON.stringify(auth));
      console.log("Loaded from localStorage:", parsed);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('auth');
    }
  }, [auth]); 




  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
