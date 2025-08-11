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
      const user = { _id: id, name, email };

      // Save to context
      setAuth({ token, user }); 

      // Save to localStorage

      const authData = JSON.parse(localStorage.getItem("auth"));
if (authData?.token) {
  localStorage.setItem("token", authData.token); // Ensure it's accessible globally
}
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token); // Save token for future requests
      localStorage.setItem("userId", user._id);

      // Redirect to homepage or dashboard
      navigate("/");  
    } else {
      navigate("/login");
    }
  }, [location.search, navigate, setAuth]);

  return <div>Logging in via Google...</div>;
};

export default AuthSuccess;

