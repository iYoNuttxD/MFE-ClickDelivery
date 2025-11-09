import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/shared/hooks/useAuth';

interface RoleGuardProps {
  roles: string[];
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ roles, children }) => {
  const { user } = useAuth();

  const hasRole = user?.roles?.some((role) => roles.includes(role));

  if (!hasRole) {
    // Redirect to appropriate dashboard based on user's first role
    const userRole = user?.roles?.[0];
    if (userRole === 'customer') return <Navigate to="/customer/dashboard" replace />;
    if (userRole === 'restaurant') return <Navigate to="/restaurant/dashboard" replace />;
    if (userRole === 'courier') return <Navigate to="/courier/dashboard" replace />;
    if (userRole === 'owner') return <Navigate to="/owner/dashboard" replace />;
    if (userRole === 'admin') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
