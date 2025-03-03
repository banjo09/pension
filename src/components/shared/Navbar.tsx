import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Menu, User, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface NavbarProps {
  toggleSidebar: () => void;
  toggleNotifications: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar, toggleNotifications }) => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 fixed z-30 w-full">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <button
              onClick={toggleSidebar}
              type="button"
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="w-6 h-6" />
            </button>
            <Link to="/" className="flex ml-2 md:mr-24">
              <img src="/logo.svg" className="h-8 mr-3" alt="NLPC PFA Logo" />
              <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap">NLPC PFA</span>
            </Link>
          </div>
          <div className="flex items-center">
            <button
              onClick={toggleNotifications}
              type="button"
              className="p-2 mr-3 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100"
            >
              <span className="sr-only">View notifications</span>
              <Bell className="w-6 h-6" />
              <div className="absolute inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full -top-1 -right-1">
                3
              </div>
            </button>
            <div className="relative">
              <button
                type="button"
                className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <span className="sr-only">Open user menu</span>
                {user?.photoUrl ? (
                  <img className="w-8 h-8 rounded-full" src={user.photoUrl} alt="user photo" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow z-50">
                  <div className="px-4 py-3 text-sm text-gray-900">
                    <div>{user?.name}</div>
                    <div className="font-medium truncate">{user?.email}</div>
                  </div>
                  <ul className="py-2 text-sm text-gray-700">
                    <li>
                      <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link to="/settings" className="block px-4 py-2 hover:bg-gray-100">
                        Settings
                      </Link>
                    </li>
                  </ul>
                  <div className="py-1">
                    <button
                      onClick={logout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;