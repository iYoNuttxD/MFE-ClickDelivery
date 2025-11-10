import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/shared/hooks/useAuth';
import { getPrimaryDashboardPath } from '@/shared/auth/roles';

export const LandingPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-4">ClickDelivery</h1>
          <p className="text-xl mb-8">
            Plataforma completa de delivery com múltiplos perfis
          </p>
          <div className="space-x-4">
            {isAuthenticated ? (
              <Link
                to={getPrimaryDashboardPath(user)}
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 inline-block"
              >
                Ir para Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 inline-block"
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 inline-block"
                >
                  Cadastrar
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-2">Para Clientes</h3>
            <p className="text-gray-600">
              Faça pedidos de seus restaurantes favoritos com rapidez e segurança
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-2">Para Restaurantes</h3>
            <p className="text-gray-600">
              Gerencie seu cardápio, pedidos e aumente suas vendas
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-2">Para Entregadores</h3>
            <p className="text-gray-600">
              Faça entregas e alugue veículos para maximizar seus ganhos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
