import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../Layout/Layout';
// import { toast } from 'react-toastify';
import toast from 'react-hot-toast';
import API from '../../../utils/api';

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
 

  const navigate = useNavigate(); 

const BACKEND_URL = "https://trendkari.onrender.com/api/v1";

const handleGoogleLogin = () => {
  window.location.href = `${BACKEND_URL}/auth/google`;
};


 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await API.post("/auth/register", {
      name,
      email,
      password,
      bio,
      // avatar,
    });

    const { success, message } = res.data; // ✅ extract message

    if (success) {
      toast.success(message || 'Registration successful'); // ✅ now message is defined
      navigate("/login");
    } else {
      toast.error(message || "Registration failed");
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Something went wrong");
    console.log(error);
  }
};


  return (
    <Layout>
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h2 className="text-center mb-4">Create Your Account</h2>


      {/* {error && <div className="alert alert-danger text-center">{error}</div>}
      {success && <div className="alert alert-success text-center">{success}</div>} */}

          {/* Google Login */}
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

<hr/>



      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            name="name"
            placeholder="Full Name"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            name="email"
            placeholder="Email Address"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            name="password"
            placeholder="Password (min 6 characters)"
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
        </div>

        <div className="mb-3">
          <textarea
            className="form-control"
            name="bio"
            placeholder="Bio (optional)"
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <input
            type="url"
            className="form-control"
            name="avatar"
            placeholder="Avatar URL (optional)"
            onChange={(e) => setAvatar(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Register
        </button>

        <div className="text-center mt-3">
          Already have an account?{' '}
          <button className="btn btn-link p-0" onClick={() => navigate('/login')}>
            Login
          </button>
        </div>
      </form>
    </div>
    </Layout>
  );
};

export default Register;
