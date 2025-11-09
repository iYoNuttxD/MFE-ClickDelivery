import React from 'react';
import { RegisterForm } from '@/features/auth/RegisterForm';

export const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <RegisterForm />
    </div>
  );
};
