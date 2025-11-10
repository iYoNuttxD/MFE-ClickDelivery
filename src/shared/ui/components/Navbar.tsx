import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/shared/hooks/useAuth";
import { RoleBadge } from "./RoleBadge";
import { getUserRoles } from "@/shared/auth/roles";
import { useCartStore } from "@/features/cart/store/cartStore";

export const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const roles = getUserRoles(user);
  const isAdmin = roles.includes('admin');
  const isCustomer = roles.includes('customer');
  const { getItemCount } = useCartStore();

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
                
                {/* Cart Icon for Customers */}
                {isCustomer && (
                  <Link
                    to="/customer/cart"
                    className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors"
                    title="Meu Carrinho"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    {getItemCount() > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {getItemCount()}
                      </span>
                    )}
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
