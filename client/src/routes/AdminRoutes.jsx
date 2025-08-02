import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/auth';
import API from '../../utils/api';

const AdminRoute = () => {
  const [ok, setOk] = useState(null); // null = loading, true/false = result
  const [auth] = useAuth();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await API.get('/auth/admin-auth', {
          headers: {
          Authorization: `Bearer ${auth?.token}`
          },
        });
        setOk(res.data.ok);
      } catch (error) {
        console.error('Admin check failed', error);
        setOk(false);
      }
    };

    if (auth?.token) checkAdmin();
  }, [auth?.token]);

  // While loading, don't render anything
  if (ok === null) return null;

  // If admin check passes, render nested routes
  return ok ? <Outlet /> : <h1>Unauthorized - Admin Access Only</h1>;
};

export default AdminRoute;
