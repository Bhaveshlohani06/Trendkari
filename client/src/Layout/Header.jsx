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
  FaBars,
  FaSearch,
} from 'react-icons/fa';

const Header = ({ toggleSidebar }) => {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuth({ user: null, token: '' });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('auth');
    localStorage.removeItem('userId');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // Get user and ID (support both _id and id)
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id || user?.id;

  return (
    <Navbar bg="dark" variant="dark" className="shadow-sm px-3 sticky-top">
      <Container fluid className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-3">
          <Button
            variant="outline-light"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            className="d-flex align-items-center"
          >
            <FaBars />
          </Button>

          <Navbar.Brand
            as={NavLink}
            to="/"
            className="d-flex align-items-center gap-2 fw-bold fs-4 m-0"
          >
            Trendkari
          </Navbar.Brand>
        </div>

        <div className="d-flex align-items-center ms-2 gap-3">
          <Button
            variant="outline-light"
            size="sm"
            aria-label="Search"
            onClick={() => navigate('/search')}
          >
            <FaSearch />
          </Button>

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
              className="text-white"
              align="end"
            >
              {userId && (
                <NavDropdown.Item as={NavLink} to={`/profile/${userId}`}>
                  Profile
                </NavDropdown.Item>
              )}

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
