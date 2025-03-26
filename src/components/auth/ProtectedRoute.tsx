
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole | UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRoles 
}) => {
  const { isAuthenticated, isLoading, hasRole } = useAuth();
  
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">
      <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRoles && !hasRole(requiredRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
