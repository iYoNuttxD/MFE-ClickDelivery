import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/shared/hooks/useAuth';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Evita decidir antes do Auth carregar
  if (loading) return <div className="p-8">Carregando sessão...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
};
