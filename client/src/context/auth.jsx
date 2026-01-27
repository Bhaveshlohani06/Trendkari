// import { useState, useEffect, useContext, createContext } from "react";
// import API from "../../utils/api"; // your configured axios instance

// const AuthContext = createContext();

// const AuthProvider = ({ children }) => {
//   // Initialize from localStorage
//   const [auth, setAuth] = useState(() => {
//     const stored = localStorage.getItem("auth");
//     return stored ? JSON.parse(stored) : { user: null, token: "" };
//   });

//   // Keep token in axios + localStorage
//   useEffect(() => {
//     if (auth?.token) {
//       API.defaults.headers.common[
//         "Authorization"
//       ] = `Bearer ${auth.token}`;
//       localStorage.setItem("auth", JSON.stringify(auth));
//     } else {
//       delete API.defaults.headers.common["Authorization"];
//       localStorage.removeItem("auth");
//     }
//   }, [auth]);

//   // Fetch user details if token exists but user is missing
//   useEffect(() => {
//     const fetchUser = async () => {
//       if (auth.token && !auth.user) {
//         try {
//           const res = await API.get(`/auth/user/${userId}`); // ✅ endpoint should return current logged-in user
//           setAuth((prev) => ({ ...prev, user: res.data.user }));
//         } catch (err) {
//           console.error("Error fetching user", err);
//           setAuth({ user: null, token: "" }); // reset on error
//         }
//       }
//     };
//     fetchUser();
//   }, [auth.token]);

//   return (
//     <AuthContext.Provider value={[auth, setAuth]}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

// export { AuthProvider, useAuth };



import { useState, useEffect, useContext, createContext } from "react";
import API from "../../utils/api";
import { socket } from "../../utils/socket"; // ✅ ADD THIS

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem("auth");
    return stored ? JSON.parse(stored) : { user: null, token: "" };
  });

  // Keep token in axios + localStorage
  useEffect(() => {
    if (auth?.token) {
      API.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${auth.token}`;
      localStorage.setItem("auth", JSON.stringify(auth));
    } else {
      delete API.defaults.headers.common["Authorization"];
      localStorage.removeItem("auth");
    }
  }, [auth]);

  // Fetch user if token exists but user missing
  useEffect(() => {
    const fetchUser = async () => {
      if (auth.token && !auth.user) {
        try {
          const res = await API.get(`/auth/me`); // recommended endpoint
          setAuth((prev) => ({ ...prev, user: res.data.user }));
        } catch (err) {
          console.error("Error fetching user", err);
          setAuth({ user: null, token: "" });
        }
      }
    };
    fetchUser();
  }, [auth.token]);

  // 🔌 STEP 7: SOCKET USER JOIN
  useEffect(() => {
    if (auth?.user?._id) {
      socket.connect();
      socket.emit("join-user", auth.user._id);
    }

    return () => {
      socket.disconnect();
    };
  }, [auth?.user?._id]);

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
