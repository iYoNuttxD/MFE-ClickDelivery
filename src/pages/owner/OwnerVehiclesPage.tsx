import React from 'react';

export const OwnerVehiclesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Meus Veículos</h1>
      <div className="bg-white p-8 rounded-lg shadow text-center">
        <p className="text-gray-600 mb-4">Cadastre seus veículos para aluguel</p>
        <button className="bg-primary-500 text-white px-6 py-2 rounded hover:bg-primary-600">
          Adicionar Veículo
        </button>
      </div>
    </div>
  );
};
