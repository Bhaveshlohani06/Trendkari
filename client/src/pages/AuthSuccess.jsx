// src/pages/AuthSuccess.jsx (or wherever your routing points)

import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/auth'; // your AuthContext hook
import { useParams } from 'react-router-dom';


const AuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [, setAuth] = useAuth();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");
    const name = query.get("name");
    const email = query.get("email");
    const id = query.get("id");



    if (token && name ) {
      const user = { id: id, name, email };

      // Save to context
      setAuth({ token, user });

      // Save to localStorage
      localStorage.setItem("auth", JSON.stringify({ token, user }));
      console.log("Auth context set:", { token, user });

      // Redirect to homepage or dashboard
      navigate("/");
    } else {
      navigate("/login");
    }
  }, [location.search, navigate, setAuth]);

  return <div>Logging in via Google...</div>;
};

export default AuthSuccess;
