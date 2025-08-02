import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../Layout/Layout';
import API from '../../../utils/api';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage('');
    setError(''); 

    try {
    const { data } = await API.post(`/auth/reset-password/${token}`, {
        token,
        password,
      });

      setMessage(data.message || 'Password has been reset!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed');
    }
  };

  return (
    <Layout>
    <div className="container mt-5" style={{ maxWidth: '450px' }}>
      <h2 className=" text-center">Reset Your Password</h2>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleReset}>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Reset Password
        </button>
      </form>
    </div>
    </Layout>
  );
};

export default ResetPassword;