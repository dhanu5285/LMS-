import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingScreen } from './LoadingScreen';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // Show a loading screen while resolving auth status
    return <LoadingScreen duration={500} theme="dark" />;
  }

  if (!isAuthenticated) {
    // Redirect unauthenticated users to login page
    return <Navigate to="/login" replace />;
  }

  return children;
};
export default ProtectedRoute;
