import React from 'react';

export const CourierDeliveriesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Minhas Entregas</h1>
      <div className="bg-white p-8 rounded-lg shadow text-center">
        <p className="text-gray-600">Nenhuma entrega disponível no momento</p>
      </div>
    </div>
  );
};
