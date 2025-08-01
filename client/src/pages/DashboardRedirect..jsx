// src/pages/DashboardRedirect.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';

const DashboardRedirect = () => {
  const [auth] = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth?.user?.role === "admin") {
      navigate('/dashboard/admin');
    } else {
      navigate('/dashboard/user');
    }
  }, [auth, navigate]);

  return null; // nothing visible
};

export default DashboardRedirect;
