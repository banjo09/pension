import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
import ToastNotification from '../notifications/ToastNotification';
import { NotificationType } from '../../types/notifications.types';
import { useAuth } from '../hooks/useAuth';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { authState, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: NotificationType;
  } | null>(null);

  const handleLogout = async () => {
    await logout();
    setNotification({
      message: 'You have been logged out successfully',
      type: 'info'
    });
    navigate('/login');
  };

  // Define navigation items
  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Contributions', path: '/contributions' },
    { name: 'Statements', path: '/statements' },
    { name: 'Profile', path: '/profile' },
  ];

  // Add admin-only items if user is admin
  if (authState.user?.role === 'admin') {
    navItems.push({ name: 'Admin', path: '/admin' });
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-blue-600">Pension App</span>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:ml-6 md:flex md:space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${location.pathname === item.path
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* User Menu */}
            <div className="flex items-center">
              <div className="hidden md:flex items-center">
                {authState.user && (
                  <div className="flex items-center">
                    <span className="text-sm text-gray-700 mr-2">
                      {authState.user.fullName}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="ml-4 px-3 py-1 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
                >
                  <span className="sr-only">Open menu</span>
                  {isMobileMenuOpen ? (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`block pl-3 pr-4 py-2 text-base font-medium ${location.pathname === item.path
                    ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-500'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {authState.user && (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 border-l-4 border-transparent"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Notification Toast */}
      {notification && (
        <ToastNotification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
          id={(Math.random() * 100).toString()}
        />
      )}
    </div>
  );
};

export default Layout;