import {React, useState} from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/auth';
import { FaFireAlt, FaSearch, FaSun, FaMoon, FaBolt } from 'react-icons/fa';

const Header = () => {
  const [auth, setAuth] = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuth({ user: null, token: '' });
    toast.success('Logged out successfully');
    navigate('/login');
  };

    const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3 sticky-top shadow-sm">
      <div className="container-fluid">
        {/* Logo */}
        <NavLink className="navbar-brand fw-bold fs-4 d-flex align-items-center gap-2" to="/">
          <FaBolt className="text-warning" />
          Trendkari
        </NavLink>

        {/* Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Content */}
        <div className="collapse navbar-collapse" id="navbarContent">
          {/* Left Navigation */}
          <ul className="navbar-nav ms-auto me-3 align-items-center gap-2">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">Home</NavLink>
            </li>

            <li className="nav-item dropdown">
              <span
                className="nav-link dropdown-toggle"
                id="categoryDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ cursor: 'pointer' }}
              >
                Categories
              </span>
              <ul className="dropdown-menu" aria-labelledby="categoryDropdown">
                <li><NavLink className="dropdown-item" to="/category/tech">Tech</NavLink></li>
                <li><NavLink className="dropdown-item" to="/category/fashion">Fashion</NavLink></li>
                <li><NavLink className="dropdown-item" to="/category/startup-news">Startups</NavLink></li>
              </ul>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/explore">Explore</NavLink>
            </li>

            {/* <li className="nav-item">
              <NavLink className="nav-link" to="/reels">Reels</NavLink>
            </li> */}

            <li className="nav-item">
              <NavLink className="nav-link" to="/about">About</NavLink>
            </li>
          </ul>

          {/* Search Bar */}
          <form className="d-flex me-3" role="search" onSubmit={(e) => e.preventDefault()}>
            <input
              className="form-control form-control-sm bg-light text-dark"
              type="search"
              placeholder="Search trends..."
              aria-label="Search" 
            />
            <button className="btn btn-outline-light btn-sm ms-2" type="submit">
              <FaSearch />
            </button>
          </form>

          {/* Right Side Controls */}
          <ul className="navbar-nav align-items-center gap-2">
            {/* Trending Badge */}
            <li className="nav-item">
              <span className="badge bg-warning text-dark small fw-semibold">
                <FaFireAlt className="me-1" /> Trending
              </span>
            </li>

            {/* Optional Dark Mode Toggle (Uncomment to Use) */}
            {/* 
            <li className="nav-item">
              <button className="btn btn-sm btn-outline-light">
                <FaMoon /> 
              </button>
            </li> 
            */}

            {!auth?.user ? (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">Login</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/register">Register</NavLink>
                </li>
              </>
            ) : (
              <li className="nav-item dropdown">
                <span
                  className="nav-link dropdown-toggle text-capitalize"
                  id="userDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ cursor: 'pointer' }}
                >
                  {auth?.user?.name?.split(' ')[0] || 'User'}
                </span>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                  {/* <li><NavLink className="dropdown-item" to="/dashboard">Dashboard</NavLink></li> */}
                  <li><button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button></li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
