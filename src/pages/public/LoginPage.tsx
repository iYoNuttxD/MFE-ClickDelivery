import React from 'react';
import { LoginForm } from '@/features/auth/LoginForm';

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <LoginForm />
    </div>
  );
};
