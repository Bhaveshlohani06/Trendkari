import { useState, useEffect } from "react";
import { useAuth } from "../context/auth";
import { Outlet, Navigate } from "react-router-dom";
import API from "../../utils/api";

const PrivateRoute = () => {
  const [ok, setOk] = useState(false);
  const [auth] = useAuth();

  useEffect(() => {
    const authCheck = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await API.get("/auth/user-auth", {
  headers: {
    Authorization: `Bearer ${auth?.token}`,
  }
});
        if (res.data.ok) {
          setOk(true);
        } else {
          setOk(false);
        }
      } catch (error) {
        setOk(false);
      } finally{
        setLoading(false);
      }
    };

    if (auth?.token) authCheck();
  }, [auth?.token]);
 
return ok ? <Outlet /> : <Navigate to="/" />;

};

export default PrivateRoute;
