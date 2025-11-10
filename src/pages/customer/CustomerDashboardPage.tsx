import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { userApi } from '@/entities/user/api/userApi';
import { MeSummary } from '@/entities/user/model/types';
import { LoadingSpinner } from '@/shared/ui/components/LoadingSpinner';

export const CustomerDashboardPage: React.FC = () => {
  const [summary, setSummary] = useState<MeSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await userApi.getMeSummary();
        setSummary(data);
      } catch (err) {
        console.error('Failed to fetch summary:', err);
        setError('Não foi possível carregar o resumo. Usando dados mockados.');
        // Mock data fallback
        setSummary({
          user: {
            id: '1',
            email: 'customer@example.com',
            name: 'Cliente Exemplo',
            roles: ['customer'],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          stats: {
            totalOrders: 12,
            balance: 0,
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard do Cliente</h1>

      {error && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total de Pedidos</h3>
          <p className="text-3xl font-bold text-primary-600">{summary?.stats?.totalOrders || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Saldo</h3>
          <p className="text-3xl font-bold text-green-600">
            R$ {(summary?.stats?.balance || 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Perfil</h3>
          <p className="text-lg">
            {summary?.user?.name || 'Cliente Exemplo'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/customer/restaurants"
          className="bg-primary-500 text-white p-6 rounded-lg shadow hover:bg-primary-600 text-center"
        >
          <h3 className="text-xl font-semibold">Restaurantes</h3>
          <p className="mt-2">Explore restaurantes e faça pedidos</p>
        </Link>
        <Link
          to="/customer/orders"
          className="bg-blue-500 text-white p-6 rounded-lg shadow hover:bg-blue-600 text-center"
        >
          <h3 className="text-xl font-semibold">Meus Pedidos</h3>
          <p className="mt-2">Acompanhe seus pedidos</p>
        </Link>
      </div>
    </div>
  );
};
