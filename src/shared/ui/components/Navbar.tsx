import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/shared/hooks/useAuth";
import { RoleBadge } from "./RoleBadge";

export const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const roles = ((user?.roles as string[]) || (user?.["https://schemas.example.com/roles"] as string[]) || []) as string[];
  const isAdmin = roles.includes('admin');

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="w-full bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-primary-600">
              ClickDelivery
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <>
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="px-4 py-2 text-sm font-medium text-white bg-secondary-600 rounded-lg hover:bg-secondary-700 transition-colors"
                  >
                    Admin
                  </Link>
                )}
                
                {/* User Info */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700">
                    {user?.name || user?.email}
                  </span>
                  {roles.map((role: string) => (
                    <RoleBadge key={role} role={role} />
                  ))}
                  <button 
                    className="btn btn-outline btn-sm" 
                    onClick={handleLogout}
                  >
                    Sair
                  </button>
                </div>
              </>
            )}
            
            {!isAuthenticated && (
              <div className="flex items-center gap-2">
                <button 
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors" 
                  onClick={() => navigate('/login')}
                >
                  Entrar
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={() => navigate('/register')}
                >
                  Cadastrar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
