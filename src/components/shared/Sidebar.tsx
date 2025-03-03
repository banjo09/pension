import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, PieChart, DollarSign, FileText, Settings, Users, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 z-40 bg-gray-900 bg-opacity-50 md:hidden"
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-16 transition-transform bg-white border-r border-gray-200 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="overflow-y-auto py-5 px-3 h-full bg-white">
          <div className="flex items-center justify-between md:hidden">
            <span className="self-center text-xl font-semibold">Menu</span>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5"
              onClick={toggleSidebar}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <ul className="space-y-2 pt-5">
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `flex items-center p-2 text-base font-normal rounded-lg ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-900 hover:bg-gray-100'
                  }`
                }
              >
                <Home className="w-6 h-6" />
                <span className="ml-3">Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contributions"
                className={({ isActive }) =>
                  `flex items-center p-2 text-base font-normal rounded-lg ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-900 hover:bg-gray-100'
                  }`
                }
              >
                <DollarSign className="w-6 h-6" />
                <span className="ml-3">Contributions</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/statements"
                className={({ isActive }) =>
                  `flex items-center p-2 text-base font-normal rounded-lg ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-900 hover:bg-gray-100'
                  }`
                }
              >
                <FileText className="w-6 h-6" />
                <span className="ml-3">Statements</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/analytics"
                className={({ isActive }) =>
                  `flex items-center p-2 text-base font-normal rounded-lg ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-900 hover:bg-gray-100'
                  }`
                }
              >
                <PieChart className="w-6 h-6" />
                <span className="ml-3">Analytics</span>
              </NavLink>
            </li>
            {isAdmin && (
              <li>
                <NavLink
                  to="/members"
                  className={({ isActive }) =>
                    `flex items-center p-2 text-base font-normal rounded-lg ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-900 hover:bg-gray-100'
                    }`
                  }
                >
                  <Users className="w-6 h-6" />
                  <span className="ml-3">Members</span>
                </NavLink>
              </li>
            )}
          </ul>
          <ul className="pt-5 mt-5 space-y-2 border-t border-gray-200">
            <li>
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `flex items-center p-2 text-base font-normal rounded-lg ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-900 hover:bg-gray-100'
                  }`
                }
              >
                <Settings className="w-6 h-6" />
                <span className="ml-3">Settings</span>
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="absolute bottom-0 left-0 justify-center p-4 space-x-4 w-full bg-white border-t border-gray-200">
          <div className="flex items-center p-2 text-sm text-gray-600">
            <div className="font-medium">
              {user?.name} <span className="text-blue-600">({user?.role})</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;