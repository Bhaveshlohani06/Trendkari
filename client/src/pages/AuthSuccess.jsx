// src/pages/AuthSuccess.jsx

import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/auth'; // Custom Auth Context

const AuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [, setAuth] = useAuth();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");
    const name = query.get("name");
    const email = query.get("email");
    const id = query.get("id"); // This is your MongoDB _id

    if (token && name && email && id) {
      const user = { _id: id, name, email };

      // Save to context
      setAuth({ token, user });

      // Save to localStorage
      localStorage.setItem("auth", JSON.stringify({ token, user }));
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      console.log("✅ Auth success - user saved:", { token, user });

      // Redirect to homepage
      navigate("/");
    } else {
      console.error("❌ Missing auth details in query params");
      navigate("/login");
    }
  }, [location.search, navigate, setAuth]);

  return <div>Logging in via Google...</div>;
};

export default AuthSuccess;
