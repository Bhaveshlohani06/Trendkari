// import { useEffect, useRef, useState, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { User, Moon, Sun, Menu, Search, X, Sparkles, FileText, Tag, ArrowRight } from "lucide-react";
// import { useLocation } from "../context/LocationContext.jsx";
// import { useTheme } from "../context/ThemeContext";
// import API from "../../utils/api";
// import NotificationBell from "../Components/NotificationBell.jsx";
// import Sidebar from "./Sidebar.jsx";
// import "./header.css";

// const CITIES = [
//   { key: "kota", label: "Kota" },
//   { key: "ramganjmandi", label: "Ramganjmandi" },
//   { key: "sangod", label: "Sangod" },
//   { key: "ladpura", label: "Ladpura" },
//   { key: "rural-kota", label: "Rural Kota" },
// ];

// const Header = () => {
//   const { location, changeLocation } = useLocation();
//   const { theme, toggleTheme } = useTheme();
//   const navigate = useNavigate();

//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   // Search state
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [isSearching, setIsSearching] = useState(false);

//   const headerRef = useRef(null);
//   const searchInputRef = useRef(null);

//   // Publish height CSS variable
//   useEffect(() => {
//     const el = headerRef.current;
//     if (!el) return;

//     const publishHeight = () => {
//       document.documentElement.style.setProperty(
//         "--app-header-height",
//         `${el.offsetHeight}px`
//       );
//     };

//     publishHeight();
//     const resizeObserver = new ResizeObserver(publishHeight);
//     resizeObserver.observe(el);
//     window.addEventListener("orientationchange", publishHeight);

//     return () => {
//       resizeObserver.disconnect();
//       window.removeEventListener("orientationchange", publishHeight);
//     };
//   }, []);

//   const goHome = () => navigate(`/feed/${location}`);

//   const closeSearch = useCallback(() => {
//     setIsSearchOpen(false);
//     setSearchQuery("");
//     setSuggestions([]);
//   }, []);

//   // Keyboard escape handler to guarantee closing search
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.key === "Escape" && isSearchOpen) {
//         closeSearch();
//       }
//     };
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [isSearchOpen, closeSearch]);

//   // Focus input automatically when search opens
//   useEffect(() => {
//     if (isSearchOpen && searchInputRef.current) {
//       setTimeout(() => searchInputRef.current?.focus(), 50);
//     }
//   }, [isSearchOpen]);

//   // Autocomplete suggestions debounce
//   useEffect(() => {
//     if (!searchQuery.trim() || searchQuery.length < 2) {
//       setSuggestions([]);
//       return;
//     }

//     const timer = setTimeout(async () => {
//       try {
//         const { data } = await API.get(`/search/autocomplete?q=${encodeURIComponent(searchQuery)}`);
//         setSuggestions(data?.suggestions || []);
//       } catch (err) {
//         console.error("Autocomplete search error:", err);
//       }
//     }, 300);

//     return () => clearTimeout(timer);
//   }, [searchQuery]);

//   // Submit search query
//   const handleSearchSubmit = async (e) => {
//     if (e) e.preventDefault();
//     if (!searchQuery.trim()) return;

//     setIsSearching(true);
//     try {
//       const { data } = await API.post("/search/ai-search", {
//         query: searchQuery,
//         location: location,
//       });

//       if (data?.type === "redirect") {
//         closeSearch();
//         navigate(data.route);
//         return;
//       }

//       closeSearch();
//       navigate(`/search?q=${encodeURIComponent(searchQuery)}`, {
//         state: { searchResults: data },
//       });
//     } catch (err) {
//       console.error("AI Search Error:", err);
//       closeSearch();
//       navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
//     } finally {
//       setIsSearching(false);
//     }
//   };

//   const renderBadge = (type) => {
//     switch (type) {
//       case "post":
//         return <span className="tk-badge tk-badge--info"><FileText size={10} /> Post</span>;
//       case "user":
//         return <span className="tk-badge tk-badge--success"><User size={10} /> User</span>;
//       case "category":
//         return <span className="tk-badge tk-badge--warning"><Tag size={10} /> Category</span>;
//       default:
//         return <Search size={14} className="text-muted" />;
//     }
//   };

//   const currentCityLabel = CITIES.find((c) => c.key === location)?.label || "Feed";

//   return (
//     <>
//       <header className={`tk-header ${isSearchOpen ? "tk-header--search-active" : ""}`} ref={headerRef}>
//         {/* ============ SEARCH MODE: FULL HEADER OVERLAY ============ */}
//         {isSearchOpen ? (
//           <div className="tk-header__full-search">
//             <form className="tk-full-search-form" onSubmit={handleSearchSubmit}>
//               <button
//                 type="submit"
//                 className="tk-search-btn-icon"
//                 disabled={isSearching}
//                 title="Search"
//               >
//                 {isSearching ? (
//                   <Sparkles size={18} className="tk-spin-icon text-accent" />
//                 ) : (
//                   <Search size={18} className="text-muted" />
//                 )}
//               </button>

//               <input
//                 ref={searchInputRef}
//                 type="text"
//                 className="tk-full-search-input"
//                 placeholder="Search Trendkari news, topics, or ask AI..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />

//               {/* CLOSE BUTTON PLACED AT THE VERY END */}
//               <button
//                 type="button"
//                 className="tk-search-btn-icon tk-close-search-btn"
//                 onClick={closeSearch}
//                 aria-label="Close search"
//                 title="Close search"
//               >
//                 <X size={20} />
//               </button>
//             </form>

//             {/* AUTOCOMPLETE DROPDOWN */}
//             {suggestions.length > 0 && (
//               <ul className="tk-header__suggestions-menu">
//                 {suggestions.map((item, index) => {
//                   const text = typeof item === "string" ? item : item.text || item.title;
//                   const type = typeof item === "object" ? item.type : null;

//                   return (
//                     <li
//                       key={index}
//                       className="tk-suggestion-row"
//                       onClick={() => {
//                         setSearchQuery(text);
//                         closeSearch();
//                         navigate(`/search?q=${encodeURIComponent(text)}`);
//                       }}
//                     >
//                       <div className="tk-suggestion-info">
//                         {type ? renderBadge(type) : <Search size={14} className="text-muted me-2" />}
//                         <span>{text}</span>
//                       </div>
//                       <ArrowRight size={14} className="text-muted" />
//                     </li>
//                   );
//                 })}
//               </ul>
//             )}
//           </div>
//         ) : (
//           /* ============ STANDARD HEADER MODE ============ */
//           <>
//             <div className="tk-header__start">
//               <button
//                 type="button"
//                 className="tk-icon-btn"
//                 onClick={() => setSidebarOpen(true)}
//                 aria-label="Open menu"
//               >
//                 <Menu size={20} />
//               </button>

//               {/* <nav className="tk-breadcrumb" aria-label="Breadcrumb">
//                 <button type="button" className="tk-breadcrumb__home" onClick={goHome}>
//                   Home
//                 </button>
//                 <span className="tk-breadcrumb__sep" aria-hidden="true"></span>
//               </nav> */}
//             </div>

//             {/* <div className="tk-header__center">
//               <div
//                 className="tk-logo"
//                 role="button"
//                 tabIndex={0}
//                 onClick={goHome}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") goHome();
//                 }}
//               >
//                 Trendkari
//               </div>
//             </div> */}

//             <div className="tk-header__center">
//   <div
//     className="tk-logo"
//     role="button"
//     tabIndex={0}
//     onClick={goHome}
//     onKeyDown={(e) => {
//       if (e.key === "Enter") goHome();
//     }}
//   >
//     <img
//       src="/pwa-192.png"
//       alt="Trendkari"
//       className="tk-logo__image"
//     />
//   </div>
// </div>

//             <div className="tk-header__end">
//               <button
//                 type="button"
//                 className="tk-icon-btn"
//                 onClick={() => setIsSearchOpen(true)}
//                 aria-label="Search"
//                 title="Search"
//               >
//                 <Search size={18} />
//               </button>

//               <button
//                 type="button"
//                 className="tk-icon-btn"
//                 onClick={toggleTheme}
//                 aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
//                 title={theme === "dark" ? "Light mode" : "Dark mode"}
//               >
//                 {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
//               </button>

//               <NotificationBell />

//             </div>
//           </>
//         )}
//       </header>

//       <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
//     </>
//   );
// };

// export default Header;


import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Moon,
  Sun,
  Menu,
  Search,
  X,
  Sparkles,
  FileText,
  Tag,
  ArrowRight,
  LogIn
} from "lucide-react";
import { useLocation } from "../context/LocationContext.jsx";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/auth.jsx"; // Import your Auth context or state check
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

const Header = () => {
  const { location } = useLocation();
  const { theme, toggleTheme } = useTheme();
  
  // Safe Auth Context retrieval with fallback to localStorage token check
  let isAuthenticated = false;
  try {
    const auth = useAuth();
    isAuthenticated = Boolean(auth?.user || auth?.isAuthenticated);
  } catch {
    // Fallback if AuthContext is not wrapped above
    isAuthenticated = Boolean(localStorage.getItem("token") || localStorage.getItem("user"));
  }

  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Search state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const headerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Determine current active logo path based on theme state
  const isDarkMode = theme === "dark" || document.documentElement.classList.contains("dark");
  const logoSrc = isDarkMode ? "/logo-dark.png" : "/pwa-192.png";

  // Publish dynamic header height to CSS root
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

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setSuggestions([]);
  }, []);

  // Keyboard escape handler for search modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isSearchOpen) {
        closeSearch();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, closeSearch]);

  // Focus search input automatically when activated
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      const timeout = setTimeout(() => searchInputRef.current?.focus(), 50);
      return () => clearTimeout(timeout);
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
        const { data } = await API.get(
          `/search/autocomplete?q=${encodeURIComponent(searchQuery)}`
        );
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

  const renderBadge = (type) => {
    switch (type) {
      case "post":
        return (
          <span className="tk-badge tk-badge--info">
            <FileText size={10} /> Post
          </span>
        );
      case "user":
        return (
          <span className="tk-badge tk-badge--success">
            <User size={10} /> User
          </span>
        );
      case "category":
        return (
          <span className="tk-badge tk-badge--warning">
            <Tag size={10} /> Category
          </span>
        );
      default:
        return <Search size={14} className="text-muted" />;
    }
  };

  return (
    <>
      <header
        className={`tk-header ${isSearchOpen ? "tk-header--search-active" : ""}`}
        ref={headerRef}
      >
        {/* ============ SEARCH MODE: FULL HEADER OVERLAY ============ */}
        {isSearchOpen ? (
          <div className="tk-header__full-search">
            <form className="tk-full-search-form" onSubmit={handleSearchSubmit}>
              <button
                type="submit"
                className="tk-search-btn-icon"
                disabled={isSearching}
                title="Search"
                aria-label="Submit search"
              >
                {isSearching ? (
                  <Sparkles size={18} className="tk-spin-icon text-accent" />
                ) : (
                  <Search size={18} className="text-muted" />
                )}
              </button>

              <input
                ref={searchInputRef}
                type="text"
                className="tk-full-search-input"
                placeholder="Search Trendkari news, topics, or ask AI..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <button
                type="button"
                className="tk-search-btn-icon tk-close-search-btn"
                onClick={closeSearch}
                aria-label="Close search"
                title="Close search"
              >
                <X size={20} />
              </button>
            </form>

            {/* AUTOCOMPLETE DROPDOWN */}
            {suggestions.length > 0 && (
              <ul className="tk-header__suggestions-menu" role="listbox">
                {suggestions.map((item, index) => {
                  const text = typeof item === "string" ? item : item.text || item.title;
                  const type = typeof item === "object" ? item.type : null;

                  return (
                    <li
                      key={index}
                      role="option"
                      aria-selected="false"
                      className="tk-suggestion-row"
                      onClick={() => {
                        setSearchQuery(text);
                        closeSearch();
                        navigate(`/search?q=${encodeURIComponent(text)}`);
                      }}
                    >
                      <div className="tk-suggestion-info">
                        {type ? (
                          renderBadge(type)
                        ) : (
                          <Search size={14} className="text-muted me-2" />
                        )}
                        <span>{text}</span>
                      </div>
                      <ArrowRight size={14} className="text-muted" />
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ) : (
          /* ============ STANDARD HEADER MODE ============ */
          <>
            <div className="tk-header__start">
              <button
                type="button"
                className="tk-icon-btn"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open menu"
                aria-expanded={sidebarOpen}
              >
                <Menu size={20} />
              </button>
            </div>

            <div className="tk-header__center">
              <div
                className="tk-logo"
                role="button"
                tabIndex={0}
                onClick={goHome}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") goHome();
                }}
                aria-label="Trendkari Home"
              >
                <img
                  src={logoSrc}
                  alt="Trendkari"
                  className="tk-logo__image"
                />
              </div>
            </div>

            <div className="tk-header__end">
              <button
                type="button"
                className="tk-icon-btn"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search"
                title="Search"
              >
                <Search size={18} />
              </button>

              <button
                type="button"
                className="tk-icon-btn"
                onClick={toggleTheme}
                aria-label={
                  isDarkMode ? "Switch to light mode" : "Switch to dark mode"
                }
                title={isDarkMode ? "Light mode" : "Dark mode"}
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* Render Notification Bell ONLY if user is authenticated */}
              {isAuthenticated ? (
                <NotificationBell />
              ) : (
                <button
                  type="button"
                  className="tk-icon-btn tk-login-btn"
                  onClick={() => navigate("/login")}
                  aria-label="Log in"
                  title="Log in"
                >
                  <LogIn size={18} />
                </button>
              )}
            </div>
          </>
        )}
      </header>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
};

export default Header;