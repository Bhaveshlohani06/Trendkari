import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/auth';  


const UserMenu = () => {
  const [auth] = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Toggle Sidebar
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
{/* //      //Toggle Button */}

      <button
        onClick={toggleSidebar}
        className="btn btn-primary m-2"
      >
        {isOpen ? 'Close Menu' : 'Open Menu'}
      </button>

      {/* Sidebar */}
      <div
        className={`bg-primary text-white d-flex flex-column justify-content-start align-items-start position-fixed top-0 left-0 min-vh-100 p-3 transition`}
        style={{
          width: '250px',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-in-out',
          zIndex: 1000,
        }}
      >
        <h2 style={{ color: 'black' }}>User Dashboard</h2>
        <h2 style={{ color: 'black' }}>{auth.user.name}</h2>

        <div className="container mt-3">
          <Link to="/dashboard/user" style={{ color: 'white' }}>Dashboard</Link>
        </div>

        <div className="container mt-3">
          <Link to="/dashboard/user/order" style={{ color: 'white' }}>Order</Link>
        </div>

        <div className="container mt-3">
          <Link to="/dashboard/user/profile" style={{ color: 'white' }}>Profile</Link>
        </div>
      </div>
    </>
  );
};

export default UserMenu;
