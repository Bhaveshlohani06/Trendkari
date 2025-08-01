import { Layout } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';




const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

 const handleSubmit = async (e) => {
  e.preventDefault();

  // Clear previous messages
  setStatus('');
  setError('');
  setLoading(true);

  try {
    const { data } = await axios.post('/api/v1/auth/forgot-password', { email });

    setStatus(data.message || 'OTP has been sent to your email. Please check your inbox.');
  } catch (error) {
    // Handle both server errors and unexpected ones
    const message =
      error.response?.data?.message || error.message || 'Something went wrong';
    setError(message);
  } finally {
    setLoading(false);
  }
};

  return (
    <>
    <div className="container mt-5" style={{ maxWidth: '450px' }}>
      <h2 className="text-center mb-4">Forgot Password</h2>

      {status && <div className="alert alert-success">{status}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Enter your email address</label>
          <input
            type="email"
            id="email"
            className="form-control"
            placeholder="example@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
    </div>
    </>
  );
};

export default ForgotPassword;
