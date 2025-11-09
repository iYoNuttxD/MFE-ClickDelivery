import React, { useEffect, useState } from 'react';
import { vehicleApi } from '@/entities/vehicle/api/vehicleApi';
import { Vehicle } from '@/entities/vehicle/model/types';
import { VehicleList } from '@/features/vehicle-rental/components/VehicleList';
import { LoadingSpinner } from '@/shared/ui/components/LoadingSpinner';

export const CourierVehiclesPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await vehicleApi.getVehicles({ status: 'available' });
        setVehicles(response.data);
      } catch (error) {
        console.error('Failed to fetch vehicles:', error);
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Veículos Disponíveis para Aluguel</h1>
      <VehicleList vehicles={vehicles} onRent={(id) => alert(`Alugar veículo ${id}`)} />
    </div>
  );
};
