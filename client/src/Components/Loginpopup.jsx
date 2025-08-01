// components/LoginPopup.jsx
import React from 'react';

const LoginPopup = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md">
        <h2 className="text-xl font-semibold mb-4">Login Required</h2>
        <input type="email" placeholder="Email" className="w-full p-2 border rounded mb-3" />
        <input type="password" placeholder="Password" className="w-full p-2 border rounded mb-4" />
        <button className="w-full bg-blue-600 text-white py-2 rounded mb-2">Login</button>

        <button
            type="button"
            className="btn btn-outline-dark btn-lg w-100 mb-2"
            onClick={handleGoogleLogin}
          >
            <img
              src="https://img.icons8.com/color/16/000000/google-logo.png"
              alt="Google"
              className="me-2"
            />
            Continue with Google
          </button>
          
        <button onClick={onClose} className="w-full bg-gray-300 text-black py-2 rounded">
          Close
        </button>
      </div>
    </div>
  );
};

export default LoginPopup;
