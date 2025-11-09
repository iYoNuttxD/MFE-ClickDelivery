import React from 'react';

export const RestaurantOrdersPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Pedidos do Restaurante</h1>
      <div className="bg-white p-8 rounded-lg shadow text-center">
        <p className="text-gray-600">Nenhum pedido no momento</p>
      </div>
    </div>
  );
};
