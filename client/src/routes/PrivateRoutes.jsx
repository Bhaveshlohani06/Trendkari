import { useState, useEffect } from "react";
import { useAuth } from "../context/auth";
import { Outlet } from "react-router-dom";
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
      }
    };

    if (auth?.token) authCheck();
  }, [auth?.token]);

return ok ? <Outlet /> : <h1>Checking authentication... {auth?.token ? 'Token present' : 'No token'}</h1>;

};

export default PrivateRoute;
