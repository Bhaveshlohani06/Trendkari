import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Moon, Sun, Menu, Search, X, Sparkles, FileText, Tag, ArrowRight } from "lucide-react";
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

  // Search state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const headerRef = useRef(null);
  const searchInputRef = useRef(null);

  // ---------------------------------------------------------------------
  // Publish the header's real rendered height as a CSS var so the swipe
  // feed (and any other full-bleed page) can size itself to exactly
  // "100dvh minus header" without hardcoding a pixel value. This has to
  // live here because the header is the only thing that knows its own
  // true height at every breakpoint / state (e.g. search open vs closed).
  // ---------------------------------------------------------------------
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

  const goHome = () => navigate(`/feed/${location}`);

  // Focus input automatically when search opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Autocomplete suggestions debounce
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const { data } = await API.get(`/search/autocomplete?q=${encodeURIComponent(searchQuery)}`);
        setSuggestions(data?.suggestions || []);
      } catch (err) {
        console.error("Autocomplete search error:", err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Submit search query
  const handleSearchSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const { data } = await API.post("/search/ai-search", {
        query: searchQuery,
        location: location,
      });

      if (data?.type === "redirect") {
        closeSearch();
        navigate(data.route);
        return;
      }

      closeSearch();
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`, {
        state: { searchResults: data },
      });
    } catch (err) {
      console.error("AI Search Error:", err);
      closeSearch();
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    } finally {
      setIsSearching(false);
    }
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setSuggestions([]);
  };

  const renderBadge = (type) => {
    switch (type) {
      case "post":
        return <span className="tk-badge tk-badge--info"><FileText size={10} /> Post</span>;
      case "user":
        return <span className="tk-badge tk-badge--success"><User size={10} /> User</span>;
      case "category":
        return <span className="tk-badge tk-badge--warning"><Tag size={10} /> Category</span>;
      default:
        return <Search size={14} className="text-muted" />;
    }
  };

  const currentCityLabel = CITIES.find((c) => c.key === location)?.label || "Feed";

  return (
    <>
      <header className="tk-header" ref={headerRef}>
        {/* ============ START: menu trigger + breadcrumb ============ */}
        <div className="tk-header__start">
          <button
            type="button"
            className="tk-icon-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          {!isSearchOpen && (
            <nav className="tk-breadcrumb" aria-label="Breadcrumb">
              <button type="button" className="tk-breadcrumb__home" onClick={goHome}>
                Home
              </button>
              <span className="tk-breadcrumb__sep" aria-hidden="true">/</span>
              <span className="tk-breadcrumb__current">{currentCityLabel}</span>
            </nav>
          )}
        </div>

        {/* ============ CENTER: logo <-> search crossfade ============
            Both elements are stacked in the exact same box (position:
            absolute; inset:0 on a shared relative parent) so the search
            bar visually "overlaps" the logo's position as it fades in,
            instead of just appearing in an unrelated spot. */}
        <div className="tk-header__center-stack">
          <div className={`tk-logo-slot${isSearchOpen ? " tk-is-hidden" : ""}`}>
            <div
              className="tk-logo"
              role="button"
              tabIndex={isSearchOpen ? -1 : 0}
              onClick={goHome}
              onKeyDown={(e) => {
                if (e.key === "Enter") goHome();
              }}
            >
              Trendkari
            </div>
          </div>

          <div className={`tk-header__search-container${isSearchOpen ? " tk-is-visible" : ""}`}>
            <form className="tk-header__search-form" onSubmit={handleSearchSubmit}>
              <button
                type="submit"
                className="tk-search-btn-icon"
                disabled={isSearching}
              >
                {isSearching ? (
                  <Sparkles size={16} className="tk-spin-icon text-accent" />
                ) : (
                  <Search size={16} className="text-muted" />
                )}
              </button>

              <input
                ref={searchInputRef}
                type="text"
                className="tk-header__search-input"
                placeholder="Search Trendkari…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                tabIndex={isSearchOpen ? 0 : -1}
              />

              <button
                type="button"
                className="tk-search-btn-icon"
                onClick={closeSearch}
                aria-label="Close search"
                tabIndex={isSearchOpen ? 0 : -1}
              >
                <X size={18} />
              </button>
            </form>

            {isSearchOpen && suggestions.length > 0 && (
              <ul className="tk-header__suggestions-menu">
                {suggestions.map((item, index) => {
                  const text = typeof item === "string" ? item : item.text || item.title;
                  const type = typeof item === "object" ? item.type : null;

                  return (
                    <li
                      key={index}
                      className="tk-suggestion-row"
                      onClick={() => {
                        setSearchQuery(text);
                        closeSearch();
                        navigate(`/search?q=${encodeURIComponent(text)}`);
                      }}
                    >
                      <div className="tk-suggestion-info">
                        {type ? renderBadge(type) : <Search size={14} className="text-muted me-2" />}
                        <span>{text}</span>
                      </div>
                      <ArrowRight size={14} className="text-muted" />
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* ============ END: search trigger, notifications, theme, user ============ */}
        <div className="tk-header__end">
          {!isSearchOpen && (
            <button
              type="button"
              className="tk-icon-btn"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search"
              title="Search"
            >
              <Search size={18} />
            </button>
          )}

          {/*
            City / weather selector — kept, intentionally disabled for now
            while the breadcrumb + inline search own this part of the
            header. Re-enable by uncommenting this block (and swapping
            the breadcrumb back out if you want the full dropdown again).

          {!isSearchOpen && (
            <div className="tk-header__center">
              <select
                value={location}
                onChange={(e) => {
                  changeLocation(e.target.value);
                  navigate("/");
                }}
                className="tk-city-select"
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
          )}
          */}

          <button
            type="button"
            className="tk-icon-btn"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Light mode" : "Dark mode"}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
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
