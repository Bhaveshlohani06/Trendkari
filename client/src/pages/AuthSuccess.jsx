// src/pages/AuthSuccess.jsx (or wherever your routing points)

import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/auth'; // your AuthContext hook

const AuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [auth, setAuth] = useAuth();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");
    const name = query.get("name");

    if (token && name && email && role) {
      const user = { name, email, role };

      // Save to context
      setAuth({ token, user });

      // Save to localStorage
      localStorage.setItem("auth", JSON.stringify({ token, user }));

      // Redirect to homepage or dashboard
      navigate("/");
    } else {
      navigate("/login");
    }
  }, []);

  return <div>Logging in via Google...</div>;
};

export default AuthSuccess;
