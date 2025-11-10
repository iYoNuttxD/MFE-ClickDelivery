import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, RegisterDto } from '@/shared/api/authService';
import { Input } from '@/shared/ui/components/Input';
import { Button } from '@/shared/ui/components/Button';
import { ApiErrorAlert } from '@/shared/ui/components/ApiErrorAlert';
import { ApiError } from '@/shared/api/types';

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterDto>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const validateForm = (): string | null => {
    if (!formData.firstName.trim()) return 'Nome é obrigatório';
    if (!formData.lastName.trim()) return 'Sobrenome é obrigatório';
    if (!formData.email.trim()) return 'Email é obrigatório';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return 'Email inválido';
    }
    if (formData.password.length < 6) {
      return 'Senha deve ter no mínimo 6 caracteres';
    }
    if (formData.password !== confirmPassword) {
      return 'As senhas não coincidem';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await authService.register(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="alert alert-success mb-4">
          <p className="font-medium">Cadastro realizado com sucesso!</p>
          <p className="text-sm mt-1">Redirecionando para login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
      <h2 className="text-3xl font-bold text-center mb-2 text-gray-900">Criar Conta</h2>
      <p className="text-center text-gray-600 mb-6">
        Preencha seus dados para se cadastrar
      </p>

      {error && <ApiErrorAlert error={error} className="mb-4" />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nome"
          name="firstName"
          type="text"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="Digite seu nome"
          required
          disabled={loading}
        />

        <Input
          label="Sobrenome"
          name="lastName"
          type="text"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Digite seu sobrenome"
          required
          disabled={loading}
        />

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
          placeholder="Mínimo 6 caracteres"
          required
          disabled={loading}
        />

        <Input
          label="Confirmar Senha"
          name="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Digite a senha novamente"
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
          Cadastrar
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Já tem uma conta?{' '}
        <button
          onClick={() => navigate('/login')}
          className="text-primary-600 hover:text-primary-700 font-medium"
          disabled={loading}
        >
          Faça login
        </button>
      </p>
    </div>
  );
};
