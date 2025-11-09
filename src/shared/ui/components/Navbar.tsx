import React from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import { RoleBadge } from "./RoleBadge";

export const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout, login } = useAuth();
  const roles = ((user?.roles as string[]) || (user?.["https://schemas.example.com/roles"] as string[]) || []) as string[];

  return (
    <nav className="w-full px-4 py-2 border-b flex items-center justify-between">
      <div className="font-semibold">ClickDelivery</div>
      <div className="flex items-center gap-2">
        {isAuthenticated ? (
          <>
            <span className="text-sm">{user?.name || user?.email}</span>
            {roles.map((role: string) => (
              <RoleBadge key={role} role={role} />
            ))}
            <button className="btn btn-outline" onClick={logout}>
              Sair
            </button>
          </>
        ) : (
          <button className="btn btn-primary" onClick={login}>
            Entrar
          </button>
        )}
      </div>
    </nav>
  );
};
