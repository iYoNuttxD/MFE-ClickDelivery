import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, LoginDto } from '@/shared/api/authService';
import { Input } from '@/shared/ui/components/Input';
import { Button } from '@/shared/ui/components/Button';
import { ApiErrorAlert } from '@/shared/ui/components/ApiErrorAlert';
import { ApiError } from '@/shared/api/types';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub?: string;
  email?: string;
  name?: string;
  roles?: string[];
  'https://schemas.example.com/roles'?: string[];
  exp?: number;
}

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginDto>({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.email || !formData.password) {
      setError('Email e senha são obrigatórios');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login(formData);
      
      // Store tokens
      authService.setToken(response.token);
      if (response.refreshToken) {
        authService.setRefreshToken(response.refreshToken);
      }

      // Decode JWT to get user roles
      const decoded = jwtDecode<JwtPayload>(response.token);
      const roles = decoded.roles || decoded['https://schemas.example.com/roles'] || [];

      // Redirect based on role
      if (roles.includes('admin')) {
        navigate('/admin/dashboard');
      } else if (roles.includes('restaurant')) {
        navigate('/restaurant/dashboard');
      } else if (roles.includes('courier')) {
        navigate('/courier/dashboard');
      } else if (roles.includes('owner')) {
        navigate('/owner/dashboard');
      } else {
        navigate('/customer/dashboard');
      }

      // Reload to trigger auth state update
      window.location.reload();
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
      <h2 className="text-3xl font-bold text-center mb-2 text-gray-900">Bem-vindo</h2>
      <p className="text-center text-gray-600 mb-6">
        Entre com suas credenciais
      </p>

      {error && <ApiErrorAlert error={error} className="mb-4" />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="seu@email.com"
          required
          disabled={loading}
        />

        <Input
          label="Senha"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Digite sua senha"
          required
          disabled={loading}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          fullWidth
        >
          Entrar
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Não tem uma conta?{' '}
        <button
          onClick={() => navigate('/register')}
          className="text-primary-600 hover:text-primary-700 font-medium"
          disabled={loading}
        >
          Cadastre-se
        </button>
      </p>
    </div>
  );
};
