import { Bell, User } from "lucide-react";
import "./header.css";
import { useLocation } from "../context/LocationContext.jsx";
import NotificationBell from "../Components/NotificationBell.jsx";
import {
  useLocation as useRouterLocation,
  useNavigate,
} from "react-router-dom";
import { requestNotificationPermission } from "../notification.js";

const CITIES = [
  { key: "kota", label: "Kota" },
  { key: "ramganjmandi", label: "Ramganjmandi" },
  { key: "sangod", label: "Sangod" },
  { key: "ladpura", label: "Ladpura" },
 // { key: "kaithoon", label: "Kaithoon" },
  { key: "rural-kota", label: "Rural Kota" },
];
const pushEnabled = localStorage.getItem("pushEnabled") === "true";

const Header = () => {
  const { location, changeLocation } = useLocation();

  const navigate = useNavigate(); // ✅ MISSING LINE
  const routerLocation = useRouterLocation();

  const handleCityChange = (cityKey) => {
    changeLocation(cityKey);

    // ✅ Redirect to homepage if not already there
  //   if (routerLocation.pathname !== "/") {
  //     navigate("/");
  //   }
  // };

  if (routerLocation.pathname !== "/") {
  navigate("/", { replace: true });
}
};

  return (
    <header className="tk-header">
      
      {/* Logo */}
      <div className="tk-logo" onClick={() => navigate("/")}>
        Trendkari
      </div>

      <button onClick={requestNotificationPermission}>
  {pushEnabled ? <BellRing /> : <Bell />}

    </button>

      {/* City Selector */}
      <div className="tk-city-scroll">
        {CITIES.map((city) => (
          <span
            key={city.key}
            className={`tk-city ${
              location === city.key ? "active" : ""
            }`}
            onClick={() => handleCityChange(city.key)}
          >
            {city.label}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="tk-actions">
        <NotificationBell />
        {/* <User className="tk-icon" /> */}

        <User
  className="tk-icon"
  onClick={() => navigate("/about")}
  title="About Trendkari"
/>

      </div>

    </header>
  );
};

export default Header;

