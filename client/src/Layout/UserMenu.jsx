import React from 'react'
import { Link } from 'react-router-dom';


const UserMenu = () => {
  return (
     <>
     <div className="bg-primary text-white d-flex flex-column justify-content-start align-items-start min-vh-100" style={{ width: '250px' }}>
          <h2 style={{ color: 'black' }}>User Dashboard</h2>
    
          <div className="container">
            <div className="mt-3">
              <Link to="/dashboard/user" style={{color: 'white'}}>Dashboard</Link>
            </div>
          </div>
    
          <div className="container">
            <div className="mt-3">
              <Link to="/dashboard/user/order" style={{color: 'white'}}>Order</Link>
            </div>
          </div>
    
          <div className="container">
            <div className="mt-3">
              <Link to="/dashboard/user/profile" style={{color: 'white'}}>Profile</Link>
            </div>
          </div>
          </div>
          </>
  )
}

export default UserMenu