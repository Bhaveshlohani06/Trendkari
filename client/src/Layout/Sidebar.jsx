import React from 'react';
import { NavLink } from 'react-router-dom';
import { Offcanvas, Nav, Button, Badge } from 'react-bootstrap';
import { FaFireAlt, FaBolt, FaBars } from 'react-icons/fa';
import { useAuth } from '../context/auth';

const Sidebar = ({ isOpen, onClose }) => {
  const [auth, setAuth] = useAuth();

  const handleLogout = () => {
    setAuth({ user: null, token: '' });
    onClose();
  };

  return (
     <Offcanvas
      show={isOpen}
      onHide={onClose}
      backdrop="static"
      scroll={false}
      placement="start"
      style={{ width: "200px"}}
      className="bg-white text-dark"
    >
      <Offcanvas.Header className="justify-content-between ms-3 ">
        {/* Hamburger icon as custom close button (left aligned) */}
        <button
          onClick={onClose}
          className="btn bg-transparent border-0 p-0"
          aria-label="Close sidebar"
        >
          <FaBars className="fs-4 text-dark" />
        </button>

        {/* Title with icon (right aligned) */}
        <Offcanvas.Title className="d-flex align-items-center ">
          <span className="fw-bold fs-4">Trendkari</span>
        </Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body>
        <Nav className="flex-column col-m-2">

          <Nav.Item>
            <NavLink 
              to="/" 
              onClick={onClose}
              className={({ isActive }) => `nav-link text-dark ${isActive ? 'fw-bold text-warning' : ''}`}
            >
              Home
            </NavLink>
          </Nav.Item>

          <div className="fw-bold text-secondary mt-3 mb-2">Categories</div>
          <Nav.Item>
            <NavLink 
              to="/category/tech" 
              onClick={onClose}
              className={({ isActive }) => `nav-link text-dark ms-2 ${isActive ? 'fw-bold text-warning' : ''}`}
            >
              Tech
            </NavLink>
          </Nav.Item>
          <Nav.Item>
            <NavLink 
              to="/category/fashion" 
              onClick={onClose}
              className={({ isActive }) => `nav-link text-dark ms-2 ${isActive ? 'fw-bold text-warning' : ''}`}
            >
              Fashion
            </NavLink>
          </Nav.Item>
          <Nav.Item>
            <NavLink 
              to="/category/startup-news" 
              onClick={onClose}
              className={({ isActive }) => `nav-link text-dark ms-2 ${isActive ? 'fw-bold text-warning' : ''}`}
            >
              Startups
            </NavLink>
          </Nav.Item>

          <Nav.Item>
            <NavLink 
              to="/category/books" 
              onClick={onClose}
              className={({ isActive }) => `nav-link text-dark ms-2 ${isActive ? 'fw-bold text-warning' : ''}`}
            >
              Books
            </NavLink>
          </Nav.Item>

          <Nav.Item>
            <NavLink 
              to="/category/health" 
              onClick={onClose}
              className={({ isActive }) => `nav-link text-dark ms-2 ${isActive ? 'fw-bold text-warning' : ''}`}
            >
              Health
            </NavLink>
          </Nav.Item>

          <Nav.Item className="mt-3">
            <NavLink 
              to="/explore" 
              onClick={onClose}
              className={({ isActive }) => `nav-link text-dark ${isActive ? 'fw-bold text-warning' : ''}`}
            >
              Explore
            </NavLink>
          </Nav.Item>

          <Nav.Item>
            <NavLink 
              to="/about" 
              onClick={onClose}
              className={({ isActive }) => `nav-link text-dark ${isActive ? 'fw-bold text-warning' : ''}`}
            >
              About
            </NavLink>
          </Nav.Item>

          <Nav.Item className="mt-3">
            <Badge bg="warning" text="dark" className="fw-semibold">
              <FaFireAlt className="me-1" /> Trending
            </Badge>
          </Nav.Item>

        
        </Nav>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default Sidebar;
