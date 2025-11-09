import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";
import { LoadingSpinner } from "@/shared/ui/components/LoadingSpinner";

type Props = {
  roles: string[];
  children: React.ReactNode;
};

export const RoleGuard: React.FC<Props> = ({ roles, children }) => {
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const userRoles = ((user?.roles as string[]) || (user?.["https://schemas.example.com/roles"] as string[]) || []) as string[];
  const hasAccess = userRoles.some((role: string) => roles.includes(role));

  if (!hasAccess) return <Navigate to="/" replace />;
  return <>{children}</>;
};
