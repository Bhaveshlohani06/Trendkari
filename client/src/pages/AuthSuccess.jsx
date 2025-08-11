import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/auth'; // your AuthContext hook

const AuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [, setAuth] = useAuth();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");
    const name = query.get("name");
    const email = query.get("email");
    const id = query.get("id"); // or "_id" based on your backend

    if (token && id) {
      const user = { _id: id, name, email };

      // Save to context and localStorage
      setAuth({ token, user });
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      localStorage.setItem("userId", user._id);

      navigate("/");
    } else {
      navigate("/login");
    }
  }, [location.search, navigate, setAuth]);

  return <div>Logging in via Google...</div>;
};

export default AuthSuccess;
