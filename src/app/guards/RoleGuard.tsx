import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/shared/hooks/useAuth';
import { LoadingSpinner } from '@/shared/ui/components/LoadingSpinner';

type Props = {
  roles: string[];
  children: React.ReactNode;
};

// Extrai roles possíveis de várias formas:
// 1. user.roles (array simples)
// 2. Qualquer claim cujo valor seja array de strings e inclua pelo menos um valor parecendo role
//    Ex: 'https://schemas.example.com/roles'
function extractRoles(user: any): string[] {
  if (!user) return [];
  const collected: string[] = [];

  // roles padrão
  if (Array.isArray(user.roles)) {
    collected.push(...user.roles);
  }

  // Claims customizadas
  Object.entries(user).forEach(([key, value]) => {
    if (
      key.includes('roles') &&
      Array.isArray(value) &&
      value.every(v => typeof v === 'string')
    ) {
      collected.push(...(value as string[]));
    }
  });

  return [...new Set(collected)];
}

export const RoleGuard: React.FC<Props> = ({ roles, children }) => {
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const tokenRoles = extractRoles(user);
  const effectiveRoles = tokenRoles.length ? tokenRoles : ['customer'];

  const permitted = roles.some(r => effectiveRoles.includes(r));
  if (!permitted) return <Navigate to="/" replace />;

  return <>{children}</>;
};
