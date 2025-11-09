import React from 'react';
import { Vehicle } from '@/entities/vehicle/model/types';

interface VehicleListProps {
  vehicles: Vehicle[];
  onRent?: (vehicleId: string) => void;
}

export const VehicleList: React.FC<VehicleListProps> = ({ vehicles, onRent }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map((vehicle) => (
        <div key={vehicle.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          {vehicle.imageUrl && (
            <img src={vehicle.imageUrl} alt={vehicle.model} className="w-full h-48 object-cover" />
          )}
          <div className="p-4">
            <h3 className="text-lg font-semibold">
              {vehicle.brand} {vehicle.model}
            </h3>
            <p className="text-gray-600 text-sm">{vehicle.year}</p>
            <p className="text-gray-600 text-sm">Placa: {vehicle.licensePlate}</p>
            <div className="mt-2">
              <span
                className={`px-2 py-1 rounded text-xs ${
                  vehicle.status === 'available'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {vehicle.status}
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-lg font-bold">R$ {vehicle.pricePerDay.toFixed(2)}/dia</span>
              {vehicle.status === 'available' && onRent && (
                <button
                  onClick={() => onRent(vehicle.id)}
                  className="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600"
                >
                  Alugar
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
