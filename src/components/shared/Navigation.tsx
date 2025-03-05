import React, { useState, useMemo } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
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

const Navigation: React.FC = React.memo(() => {
  const { authState, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Memoized menu items based on user role
  const menuItems = useMemo(() => {
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

    return baseItems.filter(item => 
      item.roles.includes(authState.user?.role || '')
    );
  }, [authState.user?.role]);

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
    <div className="flex h-screen">
      <nav className="w-64 bg-white shadow-md flex flex-col h-screen">
        {/* Logo */}
        <div className="p-6 border-b text-center">
          <span className="text-2xl font-bold text-blue-600">Pension App</span>
        </div>

        {/* Menu Items */}
        <div className="flex-grow p-4 space-y-2">
          {menuItems.map(renderMenuItem)}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t space-y-2">
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
      </nav>

      {/* Outlet for nested routes */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
});

export default Navigation;































// import React, { useState, useMemo } from 'react';
// import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
// import { useAuth } from '../hooks/useAuth';
// import {
//   Home,
//   DollarSign,
//   FileText,
//   PieChart,
//   Users,
//   Settings,
//   LogOut,
//   Menu,
//   X
// } from 'lucide-react';

// const Navigation: React.FC = React.memo(() => {
//   const { authState, logout } = useAuth();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   // Memoized menu items based on user role
//   const menuItems = useMemo(() => {
//     const baseItems = [
//       {
//         name: 'Dashboard',
//         path: '/dashboard',
//         icon: Home,
//         roles: ['member', 'admin']
//       },
//       {
//         name: 'Contributions',
//         path: '/contributions',
//         icon: DollarSign,
//         roles: ['member', 'admin']
//       },
//       {
//         name: 'Statements',
//         path: '/statements',
//         icon: FileText,
//         roles: ['member', 'admin']
//       },
//       {
//         name: 'Analytics',
//         path: '/analytics',
//         icon: PieChart,
//         roles: ['admin']
//       },
//       {
//         name: 'Members',
//         path: '/members',
//         icon: Users,
//         roles: ['admin']
//       }
//     ];

//     return baseItems.filter(item =>
//       item.roles.includes(authState.user?.role || '')
//     );
//   }, [authState.user?.role]);

//   const handleLogout = async () => {
//     await logout();
//     navigate('/login');
//   };

//   const renderMenuItem = (item: { name: string, path: string, icon: React.ComponentType }) => {
//     const isActive = location.pathname === item.path;
//     const Icon = item.icon;

//     return (
//       <Link
//         key={item.name}
//         to={item.path}
//         className={`flex items-center p-2 rounded-lg transition-colors duration-200 ${isActive
//           ? 'bg-blue-600 text-white'
//           : 'text-gray-700 hover:bg-gray-100'
//           }`}
//       >
//         <Icon
//         // className="w-5 h-5 mr-3" 
//         />
//         <span>{item.name}</span>
//       </Link>
//     );
//   };

//   return (
//     <div className="flex h-screen">
//       <nav className="w-64 bg-white shadow-md flex flex-col h-screen">
//         {/* Logo */}
//         <div className="p-6 border-b text-center">
//           <span className="text-2xl font-bold text-blue-600">Pension App</span>
//         </div>

//         {/* Menu Items */}
//         <div className="flex-grow p-4 space-y-2">
//           {menuItems.map(renderMenuItem)}
//         </div>

//         {/* Footer Actions */}
//         <div className="p-4 border-t space-y-2">
//           <Link
//             to="/settings"
//             className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
//           >
//             <Settings className="w-5 h-5 mr-3" />
//             Settings
//           </Link>
//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center p-2 text-red-600 hover:bg-red-50 rounded-lg"
//           >
//             <LogOut className="w-5 h-5 mr-3" />
//             Logout
//           </button>
//         </div>
//       </nav>

//       {/* Outlet for nested routes */}
//       <main className="flex-1 overflow-y-auto">
//         <Outlet />
//       </main>
//     </div>
//   );
// });

// export default Navigation;