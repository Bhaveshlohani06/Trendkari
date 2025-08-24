import React, { useState } from 'react';
import Layout from '../../Layout/Layout';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/auth';
import API from '../../../utils/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [, setAuth] = useAuth(); // We only need setAuth here
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const res = await API.post('/auth/login', { email, password });

    const { user, message } = res.data;

    if (user?.token) {
      toast.success(message || 'Login successful');

        // ✅ Save token
      localStorage.setItem("token", user.token);
      localStorage.setItem("userId", user._id); // ✅ MongoDB userId

      // optional: also store user data
      localStorage.setItem("user", JSON.stringify(user));

      // ✅ Update auth context
      setAuth({
        user,
        token: user.token,
      });

      // ✅ navigate to intended page or default
      navigate(location.state?.from || '/');   
    } else {
      toast.error('Invalid login response (missing token)');
    }
  } catch (error) {
    toast.error('Login failed');
    console.error(error);
  } finally {
    setLoading(false);
  }
};

const BACKEND_URL = "https://trendkari.onrender.com/api/v1";

const handleGoogleLogin = () => {
  window.location.href = `${BACKEND_URL}/auth/google`;
};


  return (
    <Layout>
      <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
        <div className="card shadow p-4 border-0" style={{ maxWidth: '450px', width: '100%', borderRadius: '1rem' }}>
          <h2 className="text-center fw-bold mb-4 text-primary">Welcome Back!</h2>
          <p className="text-center text-muted mb-4">
            Login to continue exploring <strong>Trendkari</strong>
          </p>

           <button
            type="button"
            className="btn btn-outline-dark btn-lg w-100 mb-2"
            onClick={handleGoogleLogin}
          >
            <img
              src="https://img.icons8.com/color/16/000000/google-logo.png"
              alt="Google"
              className="me-2"
            />
            Continue with Google
          </button>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold">Email address</label>
              <input
                type="email"
                className="form-control form-control-lg"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-semibold">Password</label>
              <input
                type="password"
                className="form-control form-control-lg"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <a href='/forgotpassword' className='m-2 pb-2 style={"text-decoration": "none";}'>Forgot Password</a>

            <button
              type="submit"
              className="btn btn-primary btn-lg w-100 mb-3"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

         
        </div>
      </div>
    </Layout>
  );
};

export default Login;