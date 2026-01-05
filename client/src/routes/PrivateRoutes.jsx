// import { useState, useEffect } from "react";
// import { useAuth } from "../context/auth";
// import { Outlet, Navigate } from "react-router-dom";
// import API from "../../utils/api";

// const PrivateRoute = () => {
//   const [ok, setOk] = useState(false);
//   const [auth] = useAuth();

//   useEffect(() => {
//     const authCheck = async () => {
//       const token = localStorage.getItem("token");
//       try {
//         const res = await API.get("/auth/user-auth", {
//   headers: {
//     Authorization: `Bearer ${auth?.token}`,
//   }
// });
//         if (res.data.ok) {
//           setOk(true);
//         } else {
//           setOk(false);
//         }
//       } catch (error) {
//         setOk(false);
//       } finally{
//         setLoading(false);
//       }
//     };

//     if (auth?.token) authCheck();
//   }, [auth?.token]);
 
// return ok ? <Outlet /> : <Navigate to="/" />;

// };

// export default PrivateRoute;


// src/components/routes/PrivateRoute.jsx
import { useState, useEffect } from "react";
// import { useAuth } from "../../context/auth";

import { useAuth } from "../context/auth";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import API from "../../utils/api";
import { Spinner } from "react-bootstrap";

const PrivateRoute = () => {
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(true);
  const [auth] = useAuth();
  const location = useLocation();

  useEffect(() => {
    const authCheck = async () => {
      // Get token from localStorage or auth context
      const token = localStorage.getItem("token") || auth?.token;
      
      if (!token) {
        setOk(false);
        setLoading(false);
        return;
      }

      try {
        const res = await API.get("/auth/user-auth", {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        
        if (res.data.ok) {
          setOk(true);
        } else {
          setOk(false);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setOk(false);
      } finally {
        setLoading(false);
      }
    };

    authCheck();
  }, [auth?.token, location.pathname]); // Re-run when path changes

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <span className="ms-2">Checking authentication...</span>
      </div>
    );
  }

  return ok ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;