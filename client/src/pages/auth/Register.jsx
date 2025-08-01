import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../Layout/Layout';
import axios from 'axios';
import { toast } from 'react-toastify';

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
 

  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const res = await axios.post("/api/v1/auth/register", {
        name,
        email,
        password,
        bio,
        avatar,
      });

      if (res && res.data.success) {
        toast.success( res.data && res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data.message); 
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);

    }
  };

  return (
    <Layout>
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h2 className="text-center mb-4">Create Your Account</h2>

      {/* {error && <div className="alert alert-danger text-center">{error}</div>}
      {success && <div className="alert alert-success text-center">{success}</div>} */}

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
