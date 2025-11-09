import React from 'react';
import { useAuth } from '@/shared/hooks/useAuth';
import { useTranslation } from 'react-i18next';

export const LoginForm: React.FC = () => {
  const { loginWithRedirect } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
      <h2 className="text-2xl font-bold text-center mb-6">{t('auth.welcomeBack')}</h2>
      <button
        onClick={loginWithRedirect}
        className="w-full bg-primary-500 text-white py-3 px-4 rounded-lg hover:bg-primary-600 transition-colors"
      >
        {t('auth.login')} com Auth0
      </button>
      <p className="mt-4 text-center text-sm text-gray-600">
        Clique para fazer login com Auth0
      </p>
    </div>
  );
};
