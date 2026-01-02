import React from 'react';
import { NavLink } from 'react-router-dom';
import { Offcanvas, Nav, Badge } from 'react-bootstrap';
import {
  FaHome,
  FaMapMarkerAlt,
  FaCity,
  FaFireAlt,
  FaUserFriends,
  FaBars,
  FaRegCompass,
  FaInfoCircle,
  FaSignOutAlt,
  FaRegNewspaper,
  FaRegCalendarAlt,
  FaWhatsapp,
  FaTelegram
} from 'react-icons/fa';
import { MdLocalFireDepartment, MdOutlineLocalOffer } from 'react-icons/md';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { useAuth } from '../context/auth';

const Sidebar = ({ isOpen, onClose }) => {
  const [auth, setAuth] = useAuth();

  const handleLogout = () => {
    setAuth({ user: null, token: '' });
    onClose();
  };

  // Cities in Kota district (could be fetched from API later)
  const kotaCities = [
    { name: 'Kota City', slug: 'kota', count: 125 },
    { name: 'Ramganjmandi', slug: 'ramganjmandi', count: 42 },
    { name: 'Ladpura', slug: 'ladpura', count: 38 },
    { name: 'Sangod', slug: 'sangod', count: 31 },
    { name: 'Rural Kota', slug: 'rural-kota', count: 56 }
  ];

  const hyperlocalSections = [
    { name: 'Local News', icon: <FaRegNewspaper />, path: '/local-news' },
    { name: 'City Events', icon: <FaRegCalendarAlt />, path: '/events' },
    { name: 'Local Businesses', icon: <MdOutlineLocalOffer />, path: '/businesses' },
    { name: 'Community', icon: <FaUserFriends />, path: '/community' }
  ];

  return (
    <Offcanvas
      show={isOpen}
      onHide={onClose}
      backdrop="static"
      scroll={false}
      placement="start"
      style={{ width: "280px" }}
      className="bg-white text-dark border-end"
    >
      <Offcanvas.Header className="border-bottom">
        <div className="d-flex align-items-center w-100 justify-content-between">
          <div className="d-flex align-items-center">
            <button
              onClick={onClose}
              className="btn bg-transparent border-0 p-0 me-2"
              aria-label="Close sidebar"
            >
              <FaBars className="fs-4 text-dark" />
            </button>
            <div className="d-flex flex-column">
              <Offcanvas.Title className="fw-bold fs-5 mb-0">Trendkari</Offcanvas.Title>
              <small className="text-muted">Hyperlocal • Kota District</small>
            </div>
          </div>
        </div>
      </Offcanvas.Header>

      <Offcanvas.Body className="p-0">
        {/* User Info */}
        {auth?.user && (
          <div className="p-3 border-bottom bg-light">
            <div className="d-flex align-items-center">
              <div
                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
                style={{ width: "44px", height: "44px", fontWeight: "600" }}
              >
                {auth.user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-grow-1">
                <div className="fw-semibold">{auth.user.name}</div>
                <small className="text-muted d-flex align-items-center">
                  <HiOutlineLocationMarker className="me-1" size={12} />
                  {auth.user.location || 'Kota'}
                </small>
              </div>
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <Nav className="flex-column p-3">
          <div className="mb-3">
            <small className="text-uppercase text-muted fw-semibold d-block mb-2">Navigation</small>
            <Nav.Item>
              <NavLink
                to="/"
                onClick={onClose}
                className={({ isActive }) =>
                  `nav-link px-3 py-2 rounded mb-1 d-flex align-items-center ${isActive ? 'fw-bold bg-primary text-white' : 'text-dark hover-bg-light'}`
                }
              >
                <FaHome className="me-3" /> Home
              </NavLink>
            </Nav.Item>

            <Nav.Item>
              <NavLink
                to="/explore"
                onClick={onClose}
                className={({ isActive }) =>
                  `nav-link px-3 py-2 rounded mb-1 d-flex align-items-center ${isActive ? 'fw-bold bg-primary text-white' : 'text-dark hover-bg-light'}`
                }
              >
                <FaRegCompass className="me-3" /> Explore
              </NavLink>
            </Nav.Item>

            {/* <Nav.Item>
              <NavLink
                to="/trending"
                onClick={onClose}
                className={({ isActive }) =>
                  `nav-link px-3 py-2 rounded mb-1 d-flex align-items-center ${isActive ? 'fw-bold bg-primary text-white' : 'text-dark hover-bg-light'}`
                }
              >
                <MdLocalFireDepartment className="me-3" /> Trending Now
              </NavLink>
            </Nav.Item> */}
          </div>

          {/* Kota District Cities */}
          <div className="mb-3">
            <small className="text-uppercase text-muted fw-semibold d-block mb-2">
              <FaMapMarkerAlt className="me-1" /> Kota District
            </small>
            {kotaCities.map((city) => (
              <Nav.Item key={city.slug}>
                <NavLink
                  to={`/city/${city.slug}`}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `nav-link px-3 py-2 rounded mb-1 d-flex align-items-center justify-content-between ${isActive ? 'fw-bold bg-info-subtle text-info border-start border-info border-3' : 'text-dark hover-bg-light'}`
                  }
                >
                  <div className="d-flex align-items-center">
                    <FaCity className="me-3 text-muted" size={14} />
                    <span>{city.name}</span>
                  </div>
                  <Badge bg="light" text="dark" className="fw-normal">
                    {city.count}
                  </Badge>
                </NavLink>
              </Nav.Item>
            ))}
          </div>

          {/* Hyperlocal Sections */}
          {/* <div className="mb-3">
            <small className="text-uppercase text-muted fw-semibold d-block mb-2">Local Guide</small>
            {hyperlocalSections.map((section) => (
              <Nav.Item key={section.path}>
                <NavLink
                  to={section.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `nav-link px-3 py-2 rounded mb-1 d-flex align-items-center ${isActive ? 'fw-bold bg-warning-subtle text-warning-emphasis border-start border-warning border-3' : 'text-dark hover-bg-light'}`
                  }
                >
                  {section.icon}
                  <span className="ms-3">{section.name}</span>
                </NavLink>
              </Nav.Item>
            ))}
          </div> */}

          {/* Join Community */}
          <div className="mb-4 p-3 bg-light rounded">
            <small className="text-uppercase text-muted fw-semibold d-block mb-2">Join Community</small>
            <div className="d-flex gap-2">
              <a
  href="https://chat.whatsapp.com/DHQzCIaKx2m3g4kGBu9Iml"
  target="_blank"
  rel="noopener noreferrer"
  className="btn btn-success btn-sm flex-grow-1 d-flex align-items-center justify-content-center"
>
  <FaWhatsapp className="me-1" /> Join WhatsApp
</a>

              {/* <a 
                href="#" 
                className="btn btn-primary btn-sm flex-grow-1 d-flex align-items-center justify-content-center"
                onClick={(e) => {
                  e.preventDefault();
                  window.open('https://t.me/', '_blank');
                }}
              >
                <FaTelegram className="me-1" /> Telegram
              </a> */}
            </div>
          </div>

          {/* Footer Links */}
          <div className="border-top pt-3">
            <Nav.Item>
              <NavLink
                to="/about"
                onClick={onClose}
                className={({ isActive }) =>
                  `nav-link px-3 py-2 rounded mb-1 d-flex align-items-center ${isActive ? 'fw-bold' : 'text-muted'}`
                }
              >
                <FaInfoCircle className="me-3" /> About Us
              </NavLink>
            </Nav.Item>

            {auth?.user && (
              <Nav.Item className="mt-2">
                <button
                  className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt className="me-2" /> Logout
                </button>
              </Nav.Item>
            )}

            {/* {!auth?.user && (
              <div className="mt-3">
                <NavLink
                  to="/login"
                  onClick={onClose}
                  className="btn btn-primary w-100"
                >
                  Login / Register
                </NavLink>
              </div>
            )} */}
          </div>
        </Nav>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default Sidebar;