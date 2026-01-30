import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

interface NavbarProps {
  children?: ReactNode;
}

export const Navbar = ({ children }: NavbarProps) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              BiznesAsh
            </Link>
          </div>

          {isAuthenticated && (
            <div className="flex items-center space-x-4">
              <Link
                to="/feed"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Feed
              </Link>
              <Link
                to="/notifications"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Notifications
              </Link>
              <Link
                to={`/profile/${user?.id}`}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          )}

          {!isAuthenticated && (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Register
              </Link>
            </div>
          )}

          {children}
        </div>
      </div>
    </nav>
  );
};
