// // src/pages/DashboardRedirect.jsx
// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/auth';

// const DashboardRedirect = () => {
//   const [auth] = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (auth?.user?.role === "admin") {
//       navigate('/dashboard/admin');
//     } else {
//       navigate('/dashboard/user');
//     }
//   }, [auth, navigate]);

//   return null; // nothing visible
// };

// export default DashboardRedirect;


import { Navigate } from "react-router-dom";
import { useAuth } from '../context/auth';

const DashboardRedirect = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  return user.role === "admin"
    ? <Navigate to="/dashboard/admin" />
    : <Navigate to="/dashboard/user" />;
};

export default DashboardRedirect;
