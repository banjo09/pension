import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
// import { useAuth } from '../../context/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'member';
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { authState } = useAuth();
  const location = useLocation();
  
  // If not authenticated, redirect to login
  if (!authState.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If role is required and user doesn't have it, redirect to dashboard
  if (requiredRole && authState.user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Otherwise, render children
  return <>{children}</>;
};

export default AuthGuard;