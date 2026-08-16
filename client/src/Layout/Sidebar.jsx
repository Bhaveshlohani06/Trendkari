// import React from 'react';
// import { NavLink, useNavigate } from 'react-router-dom';
// import { Offcanvas, Nav } from 'react-bootstrap';
// import {
//   FaBars,
//   FaRegCompass,
//   FaInfoCircle,
//   FaSignOutAlt,
//   FaWhatsapp,
//   FaTelegramPlane,
//   FaStar,
//   FaStore,
//   FaPhoneAlt,
//   FaBullhorn
// } from 'react-icons/fa';
// import { HiOutlineLocationMarker } from 'react-icons/hi';
// import { useAuth } from '../context/auth';
// import { useLocation } from '../context/LocationContext.jsx';

// const Sidebar = ({ isOpen, onClose }) => {
//   const [auth, setAuth] = useAuth();
//   const navigate = useNavigate();
//   const { location } = useLocation();

//   const handleLogout = () => {
//     setAuth({ user: null, token: '' });
//     onClose();
//   };

//   const goHome = () => {
//     onClose();
//     navigate(`/feed/${location}`);
//   };

//   const handleQuickAction = (path) => {
//     onClose();
//     navigate(path);
//   };

//   const quickActions = [
//     { icon: <FaStar className="text-warning" />, label: 'Horoscope', path: '/horoscope' },
//     { icon: <FaStore className="text-primary" />, label: 'Market', path: '/market' },
//     { icon: <FaPhoneAlt className="text-danger" />, label: 'Emergency', path: '/emergency' },
//     { icon: <FaBullhorn className="text-info" />, label: 'Advertise', path: '/advertise' }
//   ];

//   return (
//     <Offcanvas
//       show={isOpen}
//       onHide={onClose}
//       backdrop={true}
//       scroll={false}
//       placement="start"
//       style={{ width: '280px' }}
//       className="bg-white text-dark border-end"
//     >
//       <Offcanvas.Header className="border-bottom tk-sidebar-header">
//         <div className="d-flex align-items-center w-100 justify-content-between">
//           <div className="d-flex align-items-center">
//             <button
//               onClick={onClose}
//               className="tk-icon-btn me-2"
//               aria-label="Close sidebar"
//             >
//               <FaBars className="fs-5" />
//             </button>
//             <div className="d-flex flex-column">
//               {/* Same class, same left offset as the header's logo — when
//                   the drawer slides in this lands on top of / in place of
//                   the header logo instead of appearing as a separate brand
//                   mark. Doubles as a hyperlink back to the home feed. */}
//               <Offcanvas.Title
//                 as="div"
//                 className="tk-logo tk-sidebar-logo mb-0"
//                 role="button"
//                 tabIndex={0}
//                 onClick={goHome}
//                 onKeyDown={(e) => {
//                   if (e.key === 'Enter') goHome();
//                 }}
//               >
//                 Trendkari
//               </Offcanvas.Title>
//               <small className="text-muted tk-sidebar-subtitle">Hyperlocal • Kota District</small>
//             </div>
//           </div>
//         </div>
//       </Offcanvas.Header>

//       <Offcanvas.Body className="p-0">
//         {/* User Info */}
//         {auth?.user && (
//           <div className="p-3 border-bottom bg-light">
//             <div className="d-flex align-items-center">
//               <div
//                 className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
//                 style={{ width: '44px', height: '44px', fontWeight: '600' }}
//               >
//                 {auth.user.name?.charAt(0).toUpperCase()}
//               </div>
//               <div className="flex-grow-1">
//                 <div className="fw-semibold">{auth.user.name}</div>
//                 <small className="text-muted d-flex align-items-center">
//                   <HiOutlineLocationMarker className="me-1" size={12} />
//                   {auth.user.location || 'Kota'}
//                 </small>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Main Navigation */}
//         <Nav className="flex-column p-3">
//           <div className="mb-3">
//             <small className="text-uppercase text-muted fw-semibold d-block mb-2">
//               Navigation
//             </small>

//             <Nav.Item>
//               <NavLink
//                 to="/explore"
//                 onClick={onClose}
//                 className={({ isActive }) =>
//                   `nav-link px-3 py-2 rounded mb-1 d-flex align-items-center ${
//                     isActive ? 'fw-bold bg-primary text-white' : 'text-dark hover-bg-light'
//                   }`
//                 }
//               >
//                 <FaRegCompass className="me-3" /> Explore
//               </NavLink>
//             </Nav.Item>
//           </div>

//           {/* Quick Actions Grid */}
//           <div className="mb-3 p-2 bg-light rounded border">
//             <small className="text-uppercase text-muted fw-semibold d-block mb-2 px-1">
//               Quick Actions
//             </small>

//             <div className="row g-2">
//               {quickActions.map((item, i) => (
//                 <div className="col-6" key={i}>
//                   <button
//                     type="button"
//                     onClick={() => handleQuickAction(item.path)}
//                     className="btn btn-outline-light text-dark w-100 p-2 d-flex flex-column align-items-center justify-content-center rounded border hover-bg-white shadow-sm"
//                     style={{ minHeight: '68px' }}
//                   >
//                     <div className="fs-5 mb-1">{item.icon}</div>
//                     <small className="fw-semibold" style={{ fontSize: '12px' }}>
//                       {item.label}
//                     </small>
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Join Community */}
//           <div className="mb-4 p-3 bg-light rounded">
//             <small className="text-uppercase text-muted fw-semibold d-block mb-2">
//               Join Community
//             </small>
//             <div className="d-flex flex-column gap-2">
//               {/* Telegram Link (Above WhatsApp) */}
//               <a
//                 href="https://t.me/trendkari"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="btn btn-primary btn-sm d-flex align-items-center justify-content-center py-2"
//               >
//                 <FaTelegramPlane className="me-2 fs-5" /> Join Telegram
//               </a>

//               {/* WhatsApp Link */}
//               <a
//                 href="https://chat.whatsapp.com/DHQzCIaKx2m3g4kGBu9Iml"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="btn btn-success btn-sm d-flex align-items-center justify-content-center py-2"
//               >
//                 <FaWhatsapp className="me-2 fs-5" /> Join WhatsApp
//               </a>
//             </div>
//           </div>

//           {/* Footer Links */}
//           <div className="border-top pt-3">
//             <Nav.Item>
//               <NavLink
//                 to="/about"
//                 onClick={onClose}
//                 className={({ isActive }) =>
//                   `nav-link px-3 py-2 rounded mb-1 d-flex align-items-center ${
//                     isActive ? 'fw-bold text-primary' : 'text-muted'
//                   }`
//                 }
//               >
//                 <FaInfoCircle className="me-3" /> About Us
//               </NavLink>
//             </Nav.Item>

//             {auth?.user && (
//               <Nav.Item className="mt-3">
//                 <button
//                   className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center"
//                   onClick={handleLogout}
//                 >
//                   <FaSignOutAlt className="me-2" /> Logout
//                 </button>
//               </Nav.Item>
//             )}
//           </div>
//         </Nav>
//       </Offcanvas.Body>
//     </Offcanvas>
//   );
// };

// export default Sidebar;





import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Offcanvas, Nav } from 'react-bootstrap';
import {
  FaBars,
  FaRegCompass,
  FaInfoCircle,
  FaSignOutAlt,
  FaWhatsapp,
  FaTelegramPlane,
  FaStar,
  FaStore,
  FaPhoneAlt,
  FaBullhorn,
  FaBell,
  FaBellSlash
} from 'react-icons/fa';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { useAuth } from '../context/auth';
import { useLocation } from '../context/LocationContext.jsx';
// import { usePushNotifications } from '../hooks/usePushNotifications';
import {usePushNotifications} from '../Components/usePushNotifications.js';


const Sidebar = ({ isOpen, onClose }) => {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const { location } = useLocation();

  const push = usePushNotifications(auth?.user);

  const handlePushToggle = async () => {
    if (push.subscribed) {
      await push.disable();
    } else {
      const result = await push.enable();
      if (!result.success && result.reason === 'denied') {
        // Permission was denied at the OS/browser level — we must not
        // re-prompt. Let the button reflect the disabled state.
      }
    }
  };

  const handleLogout = () => {
    setAuth({ user: null, token: '' });
    onClose();
  };

  const goHome = () => {
    onClose();
    navigate(`/feed/${location}`);
  };

  const handleQuickAction = (path) => {
    onClose();
    navigate(path);
  };

  const quickActions = [
    { icon: <FaStar className="text-warning" />, label: 'Horoscope', path: '/horoscope' },
    { icon: <FaStore className="text-primary" />, label: 'Market', path: '/market' },
    { icon: <FaPhoneAlt className="text-danger" />, label: 'Emergency', path: '/emergency' },
    { icon: <FaBullhorn className="text-info" />, label: 'Advertise', path: '/advertise' }
  ];

  return (
    <Offcanvas
      show={isOpen}
      onHide={onClose}
      backdrop={true}
      scroll={false}
      placement="start"
      style={{ width: '280px' }}
      className="bg-white text-dark border-end"
    >
      <Offcanvas.Header className="border-bottom tk-sidebar-header">
        <div className="d-flex align-items-center w-100 justify-content-between">
          <div className="d-flex align-items-center">
            <button
              onClick={onClose}
              className="tk-icon-btn me-2"
              aria-label="Close sidebar"
            >
              <FaBars className="fs-5" />
            </button>
            <div className="d-flex flex-column">
              {/* Same class, same left offset as the header's logo — when
                  the drawer slides in this lands on top of / in place of
                  the header logo instead of appearing as a separate brand
                  mark. Doubles as a hyperlink back to the home feed. */}
              <Offcanvas.Title
                as="div"
                className="tk-logo tk-sidebar-logo mb-0"
                role="button"
                tabIndex={0}
                onClick={goHome}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') goHome();
                }}
              >
                Trendkari
              </Offcanvas.Title>
              <small className="text-muted tk-sidebar-subtitle">Hyperlocal • Kota District</small>
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
                style={{ width: '44px', height: '44px', fontWeight: '600' }}
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
            <small className="text-uppercase text-muted fw-semibold d-block mb-2">
              Navigation
            </small>

            <Nav.Item>
              <NavLink
                to="/explore"
                onClick={onClose}
                className={({ isActive }) =>
                  `nav-link px-3 py-2 rounded mb-1 d-flex align-items-center ${
                    isActive ? 'fw-bold bg-primary text-white' : 'text-dark hover-bg-light'
                  }`
                }
              >
                <FaRegCompass className="me-3" /> Explore
              </NavLink>
            </Nav.Item>
          </div>

          {/* Quick Actions Grid */}
          <div className="mb-3 p-2 bg-light rounded border">
            <small className="text-uppercase text-muted fw-semibold d-block mb-2 px-1">
              Quick Actions
            </small>

            <div className="row g-2">
              {quickActions.map((item, i) => (
                <div className="col-6" key={i}>
                  <button
                    type="button"
                    onClick={() => handleQuickAction(item.path)}
                    className="btn btn-outline-light text-dark w-100 p-2 d-flex flex-column align-items-center justify-content-center rounded border hover-bg-white shadow-sm"
                    style={{ minHeight: '68px' }}
                  >
                    <div className="fs-5 mb-1">{item.icon}</div>
                    <small className="fw-semibold" style={{ fontSize: '12px' }}>
                      {item.label}
                    </small>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Push Notifications */}
          {auth?.user && push.supported && (
            <div className="mb-3 p-2 bg-light rounded border">
              <small className="text-uppercase text-muted fw-semibold d-block mb-2 px-1">
                Notifications
              </small>

              {push.permission === 'denied' ? (
                <div className="px-1">
                  <div className="d-flex align-items-center text-muted small">
                    <FaBellSlash className="me-2" />
                    Blocked in browser settings
                  </div>
                  <small className="text-muted d-block mt-1" style={{ fontSize: '11px' }}>
                    Enable notifications for this site in your browser to turn this on.
                  </small>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={push.loading}
                  onClick={handlePushToggle}
                  className={`btn btn-sm w-100 d-flex align-items-center justify-content-center py-2 ${
                    push.subscribed ? 'btn-outline-secondary' : 'btn-primary'
                  }`}
                >
                  {push.subscribed ? (
                    <>
                      <FaBellSlash className="me-2" />
                      {push.loading ? 'Updating…' : 'Disable Notifications'}
                    </>
                  ) : (
                    <>
                      <FaBell className="me-2" />
                      {push.loading ? 'Updating…' : 'Enable Notifications'}
                    </>
                  )}
                </button>
              )}

              {push.error === 'unsupported' && (
                <small className="text-muted d-block mt-1 px-1" style={{ fontSize: '11px' }}>
                  Push isn't supported in this browser.
                </small>
              )}
            </div>
          )}

          {/* Join Community */}
          <div className="mb-4 p-3 bg-light rounded">
            <small className="text-uppercase text-muted fw-semibold d-block mb-2">
              Join Community
            </small>
            <div className="d-flex flex-column gap-2">
              {/* Telegram Link (Above WhatsApp) */}
              <a
                href="https://t.me/trendkari"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm d-flex align-items-center justify-content-center py-2"
              >
                <FaTelegramPlane className="me-2 fs-5" /> Join Telegram
              </a>

              {/* WhatsApp Link */}
              <a
                href="https://chat.whatsapp.com/DHQzCIaKx2m3g4kGBu9Iml"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-success btn-sm d-flex align-items-center justify-content-center py-2"
              >
                <FaWhatsapp className="me-2 fs-5" /> Join WhatsApp
              </a>
            </div>
          </div>

          {/* Footer Links */}
          <div className="border-top pt-3">
            <Nav.Item>
              <NavLink
                to="/about"
                onClick={onClose}
                className={({ isActive }) =>
                  `nav-link px-3 py-2 rounded mb-1 d-flex align-items-center ${
                    isActive ? 'fw-bold text-primary' : 'text-muted'
                  }`
                }
              >
                <FaInfoCircle className="me-3" /> About Us
              </NavLink>
            </Nav.Item>

            {auth?.user && (
              <Nav.Item className="mt-3">
                <button
                  className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt className="me-2" /> Logout
                </button>
              </Nav.Item>
            )}
          </div>
        </Nav>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default Sidebar;