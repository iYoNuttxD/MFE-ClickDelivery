import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/shared/hooks/useAuth';
import { RoleBadge } from './RoleBadge';

export const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary-600">ClickDelivery</span>
          </Link>

          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">{user.name || user.email}</span>
                  {user.roles?.map((role) => (
                    <RoleBadge key={role} role={role} />
                  ))}
                </div>
                <button
                  onClick={logout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  {t('auth.logout')}
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600"
              >
                {t('auth.login')}
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
