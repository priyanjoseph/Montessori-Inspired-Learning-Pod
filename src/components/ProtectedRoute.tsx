import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSettings, UserRole } from '../context/SettingsContext';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { user, authLoading } = useSettings();
  const location = useLocation();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50 dark:bg-forest-950 text-forest-800 dark:text-beige-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-forest-500 border-t-transparent animate-spin" />
          <p className="text-xs font-semibold uppercase tracking-widest text-forest-700 dark:text-beige-200">
            Verifying Portal Session...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  return <>{children}</>;
};

