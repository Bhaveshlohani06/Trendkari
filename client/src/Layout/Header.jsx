import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Moon, Sun, Menu } from "lucide-react";
import { FiSun, FiCloud, FiCloudRain, FiBell } from "react-icons/fi";
import { getToken } from "firebase/messaging";

import { useLocation } from "../context/LocationContext.jsx";
import { useTheme } from "../context/ThemeContext";
import { messaging } from "../firebase.js";
import API from "../../utils/api";
import NotificationBell from "../Components/NotificationBell.jsx";
import Sidebar from "./Sidebar.jsx";
import "./header.css";

const CITIES = [
  { key: "kota", label: "Kota" },
  { key: "ramganjmandi", label: "Ramganjmandi" },
  { key: "sangod", label: "Sangod" },
  { key: "ladpura", label: "Ladpura" },
  { key: "rural-kota", label: "Rural Kota" },
];

const getWeatherIcon = (condition) => {
  const text = (condition || "").toLowerCase();
  if (text.includes("rain")) return <FiCloudRain aria-hidden="true" />;
  if (text.includes("cloud")) return <FiCloud aria-hidden="true" />;
  return <FiSun aria-hidden="true" />;
};

const Header = () => {
  const { location, changeLocation } = useLocation();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [weather, setWeather] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const headerRef = useRef(null);

  // Publish the header's *actual* rendered height (safe-area padding,
  // weather-chip-hidden breakpoint, etc. all included) as a CSS var so
  // any page — most importantly the SwipeFeed — can size itself to
  // "100dvh minus header" without hardcoding a pixel value that only
  // works on one phone.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const publishHeight = () => {
      document.documentElement.style.setProperty(
        "--app-header-height",
        `${el.offsetHeight}px`
      );
    };

    publishHeight();

    const resizeObserver = new ResizeObserver(publishHeight);
    resizeObserver.observe(el);
    window.addEventListener("orientationchange", publishHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("orientationchange", publishHeight);
    };
  }, []);

  // Weather is decorative header chrome, not core business logic — a
  // failed fetch just hides the chip instead of surfacing an error.
  // (Bug fix: the previous version referenced an undefined `city`
  // variable here instead of `location`, so weather silently never
  // loaded — fixed by using the actual `location` value.)
  useEffect(() => {
    if (!location) return;
    let cancelled = false;

    const fetchWeather = async () => {
      try {
        const { data } = await API.get(`/weather?city=${location}`);
        if (!cancelled) setWeather(data);
      } catch (err) {
        console.log("Weather error:", err);
        if (!cancelled) setWeather(null);
      }
    };

    fetchWeather();
    return () => {
      cancelled = true;
    };
  }, [location]);

  const handleCityChange = (e) => {
    changeLocation(e.target.value);
    navigate("/");
  };

  const handleEnableNotifications = async () => {
    try {
      if (Notification.permission === "granted") return;
      if (Notification.permission === "denied") {
        alert("Please enable notifications from browser settings");
        return;
      }
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const token = await getToken(messaging, { vapidKey: "YOUR_VAPID_KEY" });
        await fetch("/save-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
      }
    } catch (err) {
      console.error("Notification error:", err);
    }
  };

  return (
    <>
      <header className="tk-header" ref={headerRef}>
        <div className="tk-header__start">
          <button
            type="button"
            className="tk-icon-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          <div
            className="tk-logo"
            role="button"
            tabIndex={0}
            onClick={() => {
              window.location.href = `/feed/${location}`;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") window.location.href = `/feed/${location}`;
            }}
          >
            Trendkari
          </div>
        </div>

        <div className="tk-header__center">
          <select
            value={location}
            onChange={handleCityChange}
            className="tk-city-select"
            aria-label="Select city"
          >
            {CITIES.map((city) => (
              <option key={city.key} value={city.key}>
                {city.label}
              </option>
            ))}
          </select>

          {weather && (
            <span className="tk-weather" title={weather.condition}>
              {getWeatherIcon(weather.condition)}
              <span>{weather.temp}°C</span>
            </span>
          )}
        </div>

        <div className="tk-header__end">
          <button
            type="button"
            className="tk-icon-btn"
            onClick={toggleTheme}
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            title={theme === "dark" ? "Light mode" : "Dark mode"}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            type="button"
            className="tk-icon-btn"
            onClick={handleEnableNotifications}
            aria-label="Enable push notifications"
            title="Enable alerts"
          >
            <FiBell size={18} />
          </button>

          <NotificationBell />

          <button
            type="button"
            className="tk-icon-btn"
            onClick={() => navigate("/about")}
            aria-label="About Trendkari"
          >
            <User size={18} />
          </button>
        </div>
      </header>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
};

export default Header;
