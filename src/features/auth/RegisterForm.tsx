import React from 'react';
import { useAuth } from '@/shared/hooks/useAuth';
import { useTranslation } from 'react-i18next';

export const RegisterForm: React.FC = () => {
  const { loginWithRedirect } = useAuth();
  const { t } = useTranslation();

  const handleRegister = () => {
    loginWithRedirect();
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
      <h2 className="text-2xl font-bold text-center mb-6">{t('auth.register')}</h2>
      <button
        onClick={handleRegister}
        className="w-full bg-primary-500 text-white py-3 px-4 rounded-lg hover:bg-primary-600 transition-colors"
      >
        {t('auth.register')} com Auth0
      </button>
      <p className="mt-4 text-center text-sm text-gray-600">
        Cadastre-se através do Auth0
      </p>
    </div>
  );
};
