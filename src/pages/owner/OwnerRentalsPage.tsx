import React from 'react';

export const OwnerRentalsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Aluguéis</h1>
      <div className="bg-white p-8 rounded-lg shadow text-center">
        <p className="text-gray-600">Nenhum aluguel ativo no momento</p>
      </div>
    </div>
  );
};
