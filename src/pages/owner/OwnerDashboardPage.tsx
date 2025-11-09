import React, { useEffect, useState } from 'react';
import { userApi } from '@/entities/user/api/userApi';
import { MeSummary } from '@/entities/user/model/types';
import { LoadingSpinner } from '@/shared/ui/components/LoadingSpinner';

export const OwnerDashboardPage: React.FC = () => {
  const [_summary, setSummary] = useState<MeSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await userApi.getMeSummary();
        setSummary(data);
      } catch (error) {
        console.error('Failed to fetch summary:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard do Proprietário</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Veículos Cadastrados</h3>
          <p className="text-3xl font-bold text-primary-600">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Aluguéis Ativos</h3>
          <p className="text-3xl font-bold text-blue-600">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Receita do Mês</h3>
          <p className="text-3xl font-bold text-green-600">R$ 0,00</p>
        </div>
      </div>
    </div>
  );
};
