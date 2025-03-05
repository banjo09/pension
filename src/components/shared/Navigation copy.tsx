import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  Home, 
  DollarSign, 
  FileText, 
  PieChart, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';

const Navigation: React.FC = () => {
  const { authState, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Define menu items based on user role
  const getMenuItems = () => {
    const baseItems = [
      { 
        name: 'Dashboard', 
        path: '/dashboard', 
        icon: Home,
        roles: ['member', 'admin'] 
      },
      { 
        name: 'Contributions', 
        path: '/contributions', 
        icon: DollarSign,
        roles: ['member', 'admin'] 
      },
      { 
        name: 'Statements', 
        path: '/statements', 
        icon: FileText,
        roles: ['member', 'admin'] 
      },
      { 
        name: 'Analytics', 
        path: '/analytics', 
        icon: PieChart,
        roles: ['admin'] 
      },
      { 
        name: 'Members', 
        path: '/members', 
        icon: Users,
        roles: ['admin'] 
      }
    ];

    // Filter items based on user role
    return baseItems.filter(item => 
      item.roles.includes(authState.user?.role || '')
    );
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const renderMenuItem = (item: { name: string, path: string, icon: React.ComponentType }) => {
    const isActive = location.pathname === item.path;
    const Icon = item.icon;

    return (
      <Link
        key={item.name}
        to={item.path}
        className={`flex items-center p-2 rounded-lg transition-colors duration-200 ${
          isActive 
            ? 'bg-blue-600 text-white' 
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <Icon 
        // className="w-5 h-5 mr-3" 
        />
        <span>{item.name}</span>
      </Link>
    );
  };

  return (
    <nav className="bg-white shadow-md">
      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center p-4">
        <span className="text-xl font-bold">Pension App</span>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-600"
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute z-50 w-full bg-white">
          <div className="flex flex-col p-4 space-y-2">
            {getMenuItems().map(renderMenuItem)}
            <button
              onClick={handleLogout}
              className="flex items-center p-2 text-red-600 hover:bg-red-50 rounded-lg"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col h-screen w-64 p-4 border-r">
        <div className="mb-10 text-center">
          <span className="text-2xl font-bold text-blue-600">Pension App</span>
        </div>
        
        <div className="flex-grow space-y-2">
          {getMenuItems().map(renderMenuItem)}
        </div>

        <div className="mt-auto space-y-2">
          <Link 
            to="/settings"
            className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center p-2 text-red-600 hover:bg-red-50 rounded-lg"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;