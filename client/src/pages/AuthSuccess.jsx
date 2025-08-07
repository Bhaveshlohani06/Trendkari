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
    const id = query.get("_id");
    console.log("Token:", token);


    if (token && name ) {
      const user = { _id: id, name };

      // Save to context
      setAuth({ user: res.data.user, token: res.data.token });

      // Save to localStorage
      localStorage.setItem("auth", JSON.stringify({ token, user }));

      // Redirect to homepage or dashboard
      navigate("/");
    } else {
      navigate("/login");
    }
  }, [location.search, navigate, setAuth]);

  return <div>Logging in via Google...</div>;
};

export default AuthSuccess;
