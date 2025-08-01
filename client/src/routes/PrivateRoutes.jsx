import { useState, useEffect } from "react";
import { useAuth } from "../context/auth";
import { Outlet } from "react-router-dom";
import axios from "axios";

const PrivateRoute = () => {
  const [ok, setOk] = useState(false);
  const [auth] = useAuth();

  useEffect(() => {
    const authCheck = async () => {
      try {
        const res = await axios.get("/api/v1/auth/user-auth", {
  headers: {
    Authorization: auth?.token
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
