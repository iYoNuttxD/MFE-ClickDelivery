import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/shared/hooks/useAuth';

type Props = {
  roles: string[];
  children: React.ReactNode;
};

// Se usuário está autenticado, mas sem roles no token, tratamos como "customer" por padrão.
// Isso elimina o loop quando o token ainda não traz claims de roles.
export const RoleGuard: React.FC<Props> = ({ roles, children }) => {
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) return <div className="p-8">Carregando sessão...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const tokenRoles = (user?.roles as string[]) ?? [];
  const effectiveRoles = tokenRoles.length ? tokenRoles : ['customer'];

  const permitted = roles.some(r => effectiveRoles.includes(r));
  if (!permitted) return <Navigate to="/" replace />;

  return <>{children}</>;
};
