import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/auth';
import {
  Navbar,
  Container,
  Nav,
  Button,
  NavDropdown,
} from 'react-bootstrap';
import {
  FaBolt,
  FaBars,
  FaSearch,
} from 'react-icons/fa';

const Header = ({ toggleSidebar }) => {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

 const handleLogout = () => {
  // Clear auth state
  setAuth({ user: null, token: '' });
  localStorage.removeItem('token'); // Clear token from localStorage
  localStorage.removeItem('user'); // Clear user data from localStorage
  localStorage.removeItem('auth'); // or use localStorage.clear() if needed
  toast.success('Logged out successfully');
  navigate('/login');
};


  return (
    <Navbar bg="dark" variant="dark" className="shadow-sm px-3 sticky-top">
      <Container fluid className="d-flex justify-content-between align-items-center">
        {/* LEFT: Hamburger + Logo */}
        <div className="d-flex align-items-center gap-3">
          {/* Hamburger */}
          <Button
            variant="outline-light"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            className="d-flex align-items-center"
          >
            <FaBars />
          </Button>

          {/* Logo */}
          <Navbar.Brand
            as={NavLink}
            to="/"
            className="d-flex align-items-center gap-2 fw-bold fs-4 m-0"
          >
            Trendkari
          </Navbar.Brand>
        </div>

        {/* RIGHT: Search + Auth */}
        <div className="d-flex align-items-center ms-2 gap-3">
          {/* Search Icon Only */}
          <Button
            variant="outline-light"
            size="sm"
            aria-label="Search"
            onClick={() => navigate('/search')} // or trigger modal
          >
            <FaSearch />  
          </Button>

          {/* Auth Links or User Dropdown */}
          {!auth?.user ? (
            <>
              <Nav.Link as={NavLink} to="/login" className="text-white">
                Login
              </Nav.Link>
              <Nav.Link as={NavLink} to="/register" className="text-white">
                Register
              </Nav.Link>
            </>
          ) : (
            <NavDropdown
              title={auth?.user?.name?.split(' ')[0] || 'User'}
              id="user-nav-dropdown"
              text="white"
              className="text-white"
              align="end"
            >
              <NavDropdown.Item as={NavLink} to="/dashboard">
                Profile
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout} className="text-danger">
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          )}
        </div>
      </Container>
    </Navbar>
  );
};

export default Header;
