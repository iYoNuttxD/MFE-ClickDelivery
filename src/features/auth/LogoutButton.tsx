import React from 'react';
import { useAuth } from '@/shared/hooks/useAuth';
import { useTranslation } from 'react-i18next';

export const LogoutButton: React.FC = () => {
  const { logout } = useAuth();
  const { t } = useTranslation();

  return (
    <button
      onClick={logout}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
    >
      {t('auth.logout')}
    </button>
  );
};
