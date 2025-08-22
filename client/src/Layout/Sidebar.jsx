import React from 'react';
import { NavLink } from 'react-router-dom';
import { Offcanvas, Nav, Badge, Dropdown } from 'react-bootstrap';
import {
  FaFireAlt, FaBolt, FaBars, FaNewspaper, FaGavel, FaFilm,
  FaPlane, FaMicrochip, FaVideo, FaLaugh, FaHeartbeat,
  FaRobot, FaGamepad
} from 'react-icons/fa';
import { useAuth } from '../context/auth';

const Sidebar = ({ isOpen, onClose }) => {
  const [auth, setAuth] = useAuth();

  const handleLogout = () => {
    setAuth({ user: null, token: '' });
    onClose();
  };

  const categories = [
    { name: 'News', icon: <FaNewspaper /> },
    { name: 'Politics', icon: <FaGavel /> },
    { name: 'Entertainment', icon: <FaFilm /> },
    { name: 'Travel', icon: <FaPlane /> },
    { name: 'Tech', icon: <FaMicrochip /> },
    { name: 'Reels', icon: <FaVideo /> },
    { name: 'Meme', icon: <FaLaugh /> },
    { name: 'Health', icon: <FaHeartbeat /> },
    { name: 'AI Trends', icon: <FaRobot /> },
    { name: 'Gaming', icon: <FaGamepad /> }
  ];

  return (
    <Offcanvas
      show={isOpen}
      onHide={onClose}
      backdrop="static"
      scroll={false}
      placement="start"
      style={{ width: "250px" }}
      className="bg-light text-dark"
    >
      <Offcanvas.Header className="justify-content-between ms-2">
        <button
          onClick={onClose}
          className="btn bg-transparent border-0 p-0"
          aria-label="Close sidebar"
        >
          <FaBars className="fs-4 text-dark" />
        </button>
        <Offcanvas.Title className="fw-bold fs-4">Trendkari</Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body>
        {/* User Info */}
        {auth?.user && (
          <div className="d-flex align-items-center mb-4 p-2 bg-white rounded shadow-sm">
            <div
              className="rounded-circle bg-warning d-flex align-items-center justify-content-center me-2"
              style={{ width: "40px", height: "40px", fontWeight: "bold" }}
            >
              {auth.user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="fw-semibold">{auth.user.name}</div>
              <small className="text-muted">Welcome back!</small>
            </div>
          </div>
        )}

        {/* Navigation */}
        <Nav className="flex-column">
          <Nav.Item>
            <NavLink
              to="/"
              onClick={onClose}
              className={({ isActive }) =>
                `nav-link px-2 py-2 rounded ${isActive ? 'fw-bold bg-warning text-dark' : 'text-dark'} sidebar-link`
              }
            >
              <FaBolt className="me-2" /> Home
            </NavLink>
          </Nav.Item>

          {/* Dropdown Categories */}
          <Dropdown className="mt-3">
            <Dropdown.Toggle variant="light" className="w-100 text-start fw-semibold">
              Categories
            </Dropdown.Toggle>
            <Dropdown.Menu className="w-100">
              {categories.map((cat, idx) => (
                <Dropdown.Item
                  key={idx}
                  as={NavLink}
                  to={`/category/${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={onClose}
                  className="d-flex align-items-center"
                >
                  {cat.icon} <span className="ms-2">{cat.name}</span>
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          <Nav.Item className="mt-4">
            <NavLink
              to="/explore"
              onClick={onClose}
              className={({ isActive }) =>
                `nav-link px-2 py-2 rounded ${isActive ? 'fw-bold bg-warning text-dark' : 'text-dark'} sidebar-link`
              }
            >
              Explore
            </NavLink>
          </Nav.Item>


          <Nav.Item className="">
            <NavLink
              to="/horoscope"
              onClick={onClose}
              className={({ isActive }) =>
                `nav-link px-2 py-2 rounded ${isActive ? 'fw-bold bg-warning text-dark' : 'text-dark'} sidebar-link`
              }
            >
              Horoscope
            </NavLink>
          </Nav.Item>


          <Nav.Item>
            <NavLink
              to="/about"
              onClick={onClose}
              className={({ isActive }) =>
                `nav-link px-2 py-2 rounded ${isActive ? 'fw-bold bg-warning text-dark' : 'text-dark'} sidebar-link`
              }
            >
              About
            </NavLink>
          </Nav.Item>

          <Nav.Item className="mt-4">
            <Badge bg="warning" text="dark" className="fw-semibold px-3 py-2 w-100 text-start">
              <FaFireAlt className="me-2" /> Trending
            </Badge>
          </Nav.Item>

          {auth?.user && (
            <Nav.Item className="mt-4">
              <button
                className="btn btn-outline-danger w-100"
                onClick={handleLogout}
              >
                Logout
              </button>
            </Nav.Item>
          )}
        </Nav>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default Sidebar;
