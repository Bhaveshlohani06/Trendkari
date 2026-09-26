// src/utils/api.js or src/axios.js

// import axios from "axios";




// const API = axios.create({
//   baseURL: import.meta.env.VITE_PRO_BASE_URL,
//   withCredentials: true,
// });




// export default API;


// If you store it in localStorage after login, e.g.:
// localStorage.setItem("token", res.data.token)

// client/src/utils/api.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_PRO_BASE_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // ✅ matches Login.jsx & AuthSuccess.jsx
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;