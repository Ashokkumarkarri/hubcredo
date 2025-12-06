import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="border-b border-gray-700 bg-gray-900 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold gradient-text">
            LeadIntel AI
          </Link>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-300 hover:text-white">
                  Dashboard
                </Link>
                <Link to="/leads" className="text-gray-300 hover:text-white">
                  Leads
                </Link>
                <span className="text-gray-400">Hi, {user?.name}</span>
                <Button onClick={handleLogout} variant="secondary" className="py-2 px-4">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="secondary" className="py-2 px-4">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="py-2 px-4">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
