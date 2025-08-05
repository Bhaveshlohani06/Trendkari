import React from 'react'
import { Link } from 'react-router-dom';

import { useAuth } from '../context/auth';

const AdminMenu = () => {
        const[auth] = useAuth();
  
  return (
    <div className="bg-primary text-white d-flex flex-column justify-content-start align-items-start min-vh-100" style={{ width: '250px', padding: '0' }}>
      <h2 className="m-0 p-3" style={{ color: 'black' }}>{auth?.user?.name} Dashboard</h2>

      <div className="w-100 px-3">
        <div className="mt-3">
          <Link to="/dashboard/admin" className="text-white text-decoration-none">Dashboard</Link>
        </div>

        <div className="mt-3">
          <Link to="/dashboard/admin/create-category" className="text-white text-decoration-none">Create Category</Link>
        </div>

         <div className="mt-3">
          <Link to="/dashboard/admin/create-post" className="text-white text-decoration-none">Create Post</Link>
        </div>

        <div className="mt-3">
          <Link to="/dashboard/admin/posts" className="text-white text-decoration-none">All Post</Link>
        </div>


        <div className="mt-3">
           <Link to="/dashboard/admin/user" className="text-white text-decoration-none">User</Link>
        </div>
      </div>
    </div>
  );
}

export default AdminMenu;
