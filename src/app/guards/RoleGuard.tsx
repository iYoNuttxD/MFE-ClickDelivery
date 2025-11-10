import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/shared/hooks/useAuth';
import { LoadingSpinner } from '@/shared/ui/components/LoadingSpinner';
import { getUserRoles } from '@/shared/auth/roles';

type Props = {
  roles: string[];
  children: React.ReactNode;
};

export const RoleGuard: React.FC<Props> = ({ roles, children }) => {
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const effectiveRoles = getUserRoles(user);
  
  // If no roles detected and no override, fallback to customer
  const rolesWithFallback = effectiveRoles.length > 0 ? effectiveRoles : ['customer'];

  const permitted = roles.some(r => rolesWithFallback.includes(r));
  if (!permitted) return <Navigate to="/" replace />;

  return <>{children}</>;
};
