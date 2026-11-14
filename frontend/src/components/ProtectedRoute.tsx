import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRoles?: ('ADMIN' | 'VENDOR')[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f2f4f7]">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-3 border-slate-900 border-t-transparent rounded-full animate-spin" />
          <span className="font-serif text-lg font-bold text-slate-900">Loading CashPilot...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If Admin attempts to access vendor route, redirect to /admin
    if (user.role === 'ADMIN') {
      return <Navigate to="/admin" replace />;
    }
    // If Vendor attempts to access admin route, redirect to /dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
