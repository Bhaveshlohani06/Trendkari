// import { Bell, User } from "lucide-react";
// import "./header.css";
// import { useLocation } from "../context/LocationContext.jsx";
// import NotificationBell from "../Components/NotificationBell.jsx";
// import {
//   useLocation as useRouterLocation,
//   useNavigate,
// } from "react-router-dom";
// import { requestNotificationPermission } from "../notification.js";
// import { use, useState } from "react";

// const CITIES = [
//   { key: "kota", label: "Kota" },
//   { key: "ramganjmandi", label: "Ramganjmandi" },
//   { key: "sangod", label: "Sangod" },
//   { key: "ladpura", label: "Ladpura" },
//  // { key: "kaithoon", label: "Kaithoon" },
//   { key: "rural-kota", label: "Rural Kota" },
// ];

// const pushEnabled = localStorage.getItem("pushEnabled") === "true";

// const Header = () => {
//   const { location, changeLocation } = useLocation();
//   const [weather, setWeather] = useState(null);

//   const navigate = useNavigate(); // ✅ MISSING LINE
//   const routerLocation = useRouterLocation();

//   const handleCityChange = (cityKey) => {
//     changeLocation(cityKey);

//     // ✅ Redirect to homepage if not already there
//   //   if (routerLocation.pathname !== "/") {
//   //     navigate("/");
//   //   }
//   // };



//   if (routerLocation.pathname !== "/") {
//   navigate("/", { replace: true });  
// }
// };

//   const fetchWeather = async (city) => {
//     try {
//       const { data } = await API.get(`/weather?city=${city}`);
//       setWeather(data);
//     } catch {
//       setWeather(null);
//     }

//     useEffect(() => {
//       if (location) {
//         fetchWeather(location);
//       } 
//     }, [location]);
//   };

//     const getWeatherIcon = () => {
//       if (!weather?.condition) return <FiSun />;
//       const text = weather.condition.toLowerCase();
//       if (text.includes("rain")) return <FiCloudRain />;
//       if (text.includes("cloud")) return <FiCloud />;
//       return <FiSun />;
//     };


//   return (
//     <header className="tk-header">
      
//       {/* Logo */}
//       <div className="tk-logo" onClick={() => navigate("/")}>
//         Trendkari
//       </div>

//         {weather && <small>{getWeatherIcon()} {weather.temp}°C | {weather.condition}</small>}


//       {/* <button onClick={requestNotificationPermission}>
//   {pushEnabled ? <BellRing /> : <Bell />}

//     </button> */}

//       {/* City Selector */}
//       <div className="tk-city-scroll">
//         {CITIES.map((city) => (
//           <span
//             key={city.key}
//             className={`tk-city ${
//               location === city.key ? "active" : ""
//             }`}
//             onClick={() => handleCityChange(city.key)}
//           >
//             {city.label}
//           </span>
//         ))}
//       </div>

//       {/* Actions */}
//       <div className="tk-actions">
//         <NotificationBell />
//         {/* <User className="tk-icon" /> */}

//         <User
//   className="tk-icon"
//   onClick={() => navigate("/about")}
//   title="About Trendkari"
// />

//       </div>

//     </header>
//   );
// };

// export default Header;


// import { User } from "lucide-react";
// import "./header.css";
// import { useLocation } from "../context/LocationContext.jsx";
// import NotificationBell from "../Components/NotificationBell.jsx";
// import {
//   useLocation as useRouterLocation,
//   useNavigate,
// } from "react-router-dom";
// import { useEffect, useState } from "react";
// import API from "../../utils/api"; // ✅ ADD THIS

// const CITIES = [
//   { key: "kota", label: "Kota" },
//   { key: "ramganjmandi", label: "Ramganjmandi" },
//   { key: "sangod", label: "Sangod" },
//   { key: "ladpura", label: "Ladpura" },
//   { key: "rural-kota", label: "Rural Kota" },
// ];

// const Header = () => {
//   const { location, changeLocation } = useLocation();
//   const [weather, setWeather] = useState(null);

//   const navigate = useNavigate();

//   /* ---------------- FETCH WEATHER ---------------- */
//   useEffect(() => {
//     const fetchWeather = async () => {
//       try {
//         const { data } = await API.get(`/weather?city=${location}`);
//         setWeather(data);
//       } catch {
//         setWeather(null);
//       }
//     };

//     if (location) fetchWeather();
//   }, [location]);

//   /* ---------------- HANDLE CITY ---------------- */
//   const handleCityChange = (e) => {
//     changeLocation(e.target.value);
//   };

//   return (
//     <header className="tk-header d-flex align-items-center justify-content-between px-3">

//       {/* Logo */}
//       <div className="tk-logo" onClick={() => navigate("/")}>
//         Trendkari
//       </div>

//       {/* CITY DROPDOWN */}
//       <select
//         value={location}
//         onChange={handleCityChange}
//         className="form-select w-auto mx-3"
//         style={{ maxWidth: "180px" }}
//       >
//         {CITIES.map((city) => (
//           <option key={city.key} value={city.key}>
//             {city.label}
//           </option>
//         ))}
//       </select>

//       {/* WEATHER */}
//       {weather && (
//         <div className="small text-muted">
//           🌤 {weather.temp}°C | {weather.condition}
//         </div>
//       )}

//       {/* ACTIONS */}
//       <div className="tk-actions d-flex align-items-center gap-3">
//         <NotificationBell />

//         <User
//           className="tk-icon"
//           onClick={() => navigate("/about")}
//           title="About Trendkari"
//         />
//       </div>

//     </header>
//   );
// };

// export default Header;


// import { User } from "lucide-react";
// import "./header.css";
// import { useLocation } from "../context/LocationContext.jsx";
// import NotificationBell from "../Components/NotificationBell.jsx";
// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import API from "../../utils/api";

// const CITIES = [
//   { key: "kota", label: "Kota" },
//   { key: "ramganjmandi", label: "Ramganjmandi" },
//   { key: "sangod", label: "Sangod" },
//   { key: "ladpura", label: "Ladpura" },
//   { key: "rural-kota", label: "Rural Kota" },
// ];



// const Header = () => {
//   const { location, changeLocation } = useLocation();
//   const [weather, setWeather] = useState(null);
//   const navigate = useNavigate();

//   /* ================= WEATHER FETCH ================= */
//      const fetchWeather = async () => {
//       try {
//         const { data } = await API.get(`/weather?city=${location}`);
//         setWeather(data);
//       } catch (err) {
//         console.log("Weather error:", err);
//         setWeather(null);
//       }
//     };

//   useEffect(() => {
//     if (location) fetchWeather();
//   }, [location]);

//   /* ================= CITY CHANGE ================= */
//   const handleCityChange = (e) => {
//     const selectedCity = e.target.value;
//     changeLocation(selectedCity);

//     // ✅ Navigate to homepage so content refreshes
//     navigate("/");
//   };

//   return (
//     <header className="tk-header">

//       {/* LEFT SECTION */}
//       <div className="d-flex align-items-center gap-2">

//         {/* LOGO */}
//         <div
//           className="tk-logo"
//           onClick={() => navigate("/")}
//         >
//           Trendkari
//         </div>

//         {/* CITY DROPDOWN */}
//         <select
//           value={location}
//           onChange={handleCityChange}
//           className="form-select form-select-sm"
//           style={{ maxWidth: "140px" }}
//         >
//           {CITIES.map((city) => (
//             <option key={city.key} value={city.key}>
//               {city.label}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* CENTER SECTION (WEATHER) */}
//       {weather && (
//         <div
//           className="small d-none d-md-block"
//           style={{ color: "var(--text)" }}
//         >
//           🌤 {weather.temp}°C | {weather.condition}
//         </div>
//       )}

//       {/* RIGHT SECTION */}
//       <div className="tk-actions">

//         {/* 🔔 Notification Bell */}
//         <NotificationBell />

//         {/* 👤 User */}
//         <User
//           className="tk-icon"
//           onClick={() => navigate("/about")}
//           title="About Trendkari"
//         />

//       </div>
//     </header>
//   );
// };

// export default Header;



// import { Bell, User } from "lucide-react";
// import "./header.css";
// import { useLocation } from "../context/LocationContext.jsx";
// import NotificationBell from "../Components/NotificationBell.jsx";
// import {
//   useLocation as useRouterLocation,
//   useNavigate,
// } from "react-router-dom";
// import { requestNotificationPermission } from "../notification.js";
// import { use, useState } from "react";

// const CITIES = [
//   { key: "kota", label: "Kota" },
//   { key: "ramganjmandi", label: "Ramganjmandi" },
//   { key: "sangod", label: "Sangod" },
//   { key: "ladpura", label: "Ladpura" },
//  // { key: "kaithoon", label: "Kaithoon" },
//   { key: "rural-kota", label: "Rural Kota" },
// ];

// const pushEnabled = localStorage.getItem("pushEnabled") === "true";

// const Header = () => {
//   const { location, changeLocation } = useLocation();
//   const [weather, setWeather] = useState(null);

//   const navigate = useNavigate(); // ✅ MISSING LINE
//   const routerLocation = useRouterLocation();

//   const handleCityChange = (cityKey) => {
//     changeLocation(cityKey);

//     // ✅ Redirect to homepage if not already there
//   //   if (routerLocation.pathname !== "/") {
//   //     navigate("/");
//   //   }
//   // };



//   if (routerLocation.pathname !== "/") {
//   navigate("/", { replace: true });  
// }
// };

//   const fetchWeather = async (city) => {
//     try {
//       const { data } = await API.get(`/weather?city=${city}`);
//       setWeather(data);
//     } catch {
//       setWeather(null);
//     }

//     useEffect(() => {
//       if (location) {
//         fetchWeather(location);
//       } 
//     }, [location]);
//   };

//     const getWeatherIcon = () => {
//       if (!weather?.condition) return <FiSun />;
//       const text = weather.condition.toLowerCase();
//       if (text.includes("rain")) return <FiCloudRain />;
//       if (text.includes("cloud")) return <FiCloud />;
//       return <FiSun />;
//     };


//   return (
//     <header className="tk-header">
      
//       {/* Logo */}
//       <div className="tk-logo" onClick={() => navigate("/")}>
//         Trendkari
//       </div>

//         {weather && <small>{getWeatherIcon()} {weather.temp}°C | {weather.condition}</small>}


//       {/* <button onClick={requestNotificationPermission}>
//   {pushEnabled ? <BellRing /> : <Bell />}

//     </button> */}

//       {/* City Selector */}
//       <div className="tk-city-scroll">
//         {CITIES.map((city) => (
//           <span
//             key={city.key}
//             className={`tk-city ${
//               location === city.key ? "active" : ""
//             }`}
//             onClick={() => handleCityChange(city.key)}
//           >
//             {city.label}
//           </span>
//         ))}
//       </div>

//       {/* Actions */}
//       <div className="tk-actions">
//         <NotificationBell />
//         {/* <User className="tk-icon" /> */}

//         <User
//   className="tk-icon"
//   onClick={() => navigate("/about")}
//   title="About Trendkari"
// />

//       </div>

//     </header>
//   );
// };

// export default Header;




// import { User } from "lucide-react";
// import "./header.css";
// import { useLocation } from "../context/LocationContext.jsx";
// import NotificationBell from "../Components/NotificationBell.jsx";
// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import API from "../../utils/api";

// const CITIES = [
//   { key: "kota", label: "Kota" },
//   { key: "ramganjmandi", label: "Ramganjmandi" },
//   { key: "sangod", label: "Sangod" },
//   { key: "ladpura", label: "Ladpura" },
//   { key: "rural-kota", label: "Rural Kota" },
// ];

// const Header = () => {
//   const { location, changeLocation } = useLocation();
//   const [weather, setWeather] = useState(null);
//   const navigate = useNavigate();

//   /* ================= WEATHER FETCH ================= */
//   useEffect(() => {
//     const fetchWeather = async () => {
//       try {
//         const { data } = await API.get(`/weather?city=${city}`);
//         setWeather(data);
//       } catch (err) {
//         console.log("Weather error:", err);
//         setWeather(null);
//       }
//     };

//     if (location) fetchWeather(location);
//   }, [location]);

//   /* ================= CITY CHANGE ================= */
//   const handleCityChange = (e) => {
//     const selectedCity = e.target.value;
//     changeLocation(selectedCity);

//     // ✅ Important: redirect to homepage
//     navigate("/");
//   };

//   return (
//     <header className="tk-header d-flex justify-content-between align-items-center">

//       {/* LEFT */}
//       <div className="d-flex align-items-center gap-2">

//         <div className="tk-logo" onClick={() => navigate("/")}>
//           Trendkari
//         </div>

//         <select
//           value={location}
//           onChange={handleCityChange}
//           className="form-select form-select-sm"
//           style={{ maxWidth: "140px" }}
//         >
//           {CITIES.map((city) => (
//             <option key={city.key} value={city.key}>
//               {city.label}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* CENTER - WEATHER */}
//       {weather && (
//         <div className="small d-none d-md-block">
//           🌤 {weather.temp}°C | {weather.condition}
//         </div>
//       )}

//       {/* RIGHT */}
//       <div className="tk-actions">

//         {/* 🔔 Notification */}
//         <NotificationBell />

//         {/* 👤 User */}
//         <User
//           className="tk-icon"
//           onClick={() => navigate("/about")}
//         />

//       </div>

//     </header>
//   );
// };

// export default Header;




import { User } from "lucide-react";
import "./header.css";
import { useLocation } from "../context/LocationContext.jsx";
import NotificationBell from "../Components/NotificationBell.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiSun, FiCloud, FiCloudRain } from "react-icons/fi";
import API from "../../utils/api";
import { FaBars } from "react-icons/fa";
import Sidebar from "./Sidebar.jsx";

const CITIES = [
  { key: "kota", label: "Kota" },
  { key: "ramganjmandi", label: "Ramganjmandi" },
  { key: "sangod", label: "Sangod" },
  { key: "ladpura", label: "Ladpura" },
  { key: "rural-kota", label: "Rural Kota" },
];

const Header = () => {
  const { location, changeLocation } = useLocation();
  const [weather, setWeather] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();


    const getWeatherIcon = () => {
      if (!weather?.condition) return <FiSun />;
      const text = weather.condition.toLowerCase();
      if (text.includes("rain")) return <FiCloudRain />;
      if (text.includes("cloud")) return <FiCloud />;
      return <FiSun />;
    };

  /* ================= WEATHER FETCH ================= */
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // FIXED: Use location instead of undefined 'city' variable
        const { data } = await API.get(`/weather?city=${location}`);
        setWeather(data);
      } catch (err) {
        console.log("Weather error:", err);
        setWeather(null);
      }
    };

    if (location) {
      fetchWeather(location);
    }
  }, [location]);

  /* ================= CITY CHANGE ================= */
  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    changeLocation(selectedCity);

    // ✅ Important: redirect to homepage
    navigate("/");
  };

  return (
    <header className="tk-header d-flex justify-content-between align-items-center">

      {/* LEFT */}
      <div className="d-flex align-items-center gap-2">
   <button
    className="btn p-0 border-0"
    onClick={() => setSidebarOpen(true)}
  >
    <FaBars size={20} />
  </button>

  <div
  className="tk-logo"
  onClick={() => {
    window.location.href = `/feed/${location}`;
  }}
>
  Trendkari
</div>

<select
  value={location}
  onChange={handleCityChange}
  className="form-select form-select-sm"
  style={{ maxWidth: "140px" }}
>
  {CITIES.map((city) => (
    <option key={city.key} value={city.key}>
      {city.label}
    </option>
  ))}
</select>
      </div>

      {/* CENTER - WEATHER */}
        {weather && <small>{getWeatherIcon()} {weather.temp}°C | {weather.condition}</small>}
       {/* <p>Kota</p>  */}



      {/* RIGHT */}
      <div className="tk-actions d-flex align-items-center gap-2">
        {/* 🔔 Notification */}

        <NotificationBell />
        {/* 👤 User */}
        <User
          className="tk-icon"
          onClick={() => navigate("/about")}
          style={{ cursor: "pointer" }}
        />
      </div>
      <Sidebar
  isOpen={sidebarOpen}
  onClose={() => setSidebarOpen(false)}
/>

    </header>

);
};

export default Header;