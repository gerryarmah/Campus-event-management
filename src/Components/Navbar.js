// frontend/src/Components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">
              Campus Events
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/events" className="hover:text-gray-200">Events</Link>
                <Link to="/calendar" className="hover:text-gray-200">Calendar</Link>
                <Link to="/profile" className="hover:text-gray-200">Profile</Link>
                {isAdmin && (
                  <Link to="/admin" className="hover:text-gray-200">Admin</Link>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-gray-200">Login</Link>
                <Link 
                  to="/register" 
                  className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-100"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;