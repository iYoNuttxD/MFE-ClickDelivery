import React, { useEffect, useState } from 'react';
import { rentalApi } from '@/entities/rental/api/rentalApi';
import { vehicleApi } from '@/entities/vehicle/api/vehicleApi';
import { Rental, RentalStatus } from '@/entities/rental/model/types';
import { Vehicle } from '@/entities/vehicle/model/types';
import { LoadingSpinner } from '@/shared/ui/components/LoadingSpinner';
import { useToast } from '@/shared/ui/components/Toast';
import { useAuth } from '@/shared/auth/useAuth';
import { config } from '@/shared/config/env';

const RENTAL_STATUS_LABELS: Record<RentalStatus, string> = {
  pending: 'Pendente',
  active: 'Ativo',
  completed: 'Concluído',
  cancelled: 'Cancelado',
};

const RENTAL_STATUS_COLORS: Record<RentalStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  active: 'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800',
};

export const OwnerRentalsPage: React.FC = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const { user } = useAuth();

  // In internal mode, use a mock owner ID
  const ownerId = config.useInternalMode 
    ? (localStorage.getItem('internal_mode_user_id') || 'owner-1')
    : user?.id || '';

  const fetchData = async () => {
    if (!ownerId) return;
    
    try {
      setLoading(true);
      
      // Fetch all rentals and filter by owner's vehicles
      const rentalsResponse = await rentalApi.getRentals({ page: 1, pageSize: 100 });
      const vehiclesResponse = await vehicleApi.getVehicles({ page: 1, pageSize: 100 });
      
      // Filter vehicles by owner
      const ownerVehicles = vehiclesResponse.data.filter(v => v.ownerId === ownerId);
      setVehicles(ownerVehicles);
      
      // Get vehicle IDs
      const ownerVehicleIds = ownerVehicles.map(v => v.id);
      
      // Filter rentals for owner's vehicles
      const ownerRentals = rentalsResponse.data.filter(r => ownerVehicleIds.includes(r.vehicleId));
      setRentals(ownerRentals);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Erro ao carregar aluguéis');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [ownerId]);

  const handleApprove = async (id: string) => {
    try {
      const updated = await rentalApi.approveRental(id);
      setRentals(rentals.map(r => r.id === updated.id ? updated : r));
      toast.success('Aluguel aprovado com sucesso!');
    } catch (error) {
      console.error('Failed to approve rental:', error);
      toast.error('Erro ao aprovar aluguel');
    }
  };

  const handleReject = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja rejeitar este aluguel?')) return;
    
    try {
      const updated = await rentalApi.rejectRental(id);
      setRentals(rentals.map(r => r.id === updated.id ? updated : r));
      toast.success('Aluguel rejeitado');
    } catch (error) {
      console.error('Failed to reject rental:', error);
      toast.error('Erro ao rejeitar aluguel');
    }
  };

  const handleComplete = async (id: string) => {
    try {
      const updated = await rentalApi.completeRental(id);
      setRentals(rentals.map(r => r.id === updated.id ? updated : r));
      toast.success('Aluguel concluído com sucesso!');
    } catch (error) {
      console.error('Failed to complete rental:', error);
      toast.error('Erro ao concluir aluguel');
    }
  };

  const handleCancel = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja cancelar este aluguel?')) return;
    
    try {
      const updated = await rentalApi.cancelRental(id);
      setRentals(rentals.map(r => r.id === updated.id ? updated : r));
      toast.success('Aluguel cancelado');
    } catch (error) {
      console.error('Failed to cancel rental:', error);
      toast.error('Erro ao cancelar aluguel');
    }
  };

  const getVehicleInfo = (vehicleId: string): string => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.brand} ${vehicle.model} (${vehicle.licensePlate})` : vehicleId;
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Aluguéis</h1>
        <button
          onClick={fetchData}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          🔄 Atualizar
        </button>
      </div>

      {rentals.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-600">Nenhum aluguel encontrado</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rentals.map((rental) => (
            <div key={rental.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Aluguel #{rental.id}</h3>
                  <p className="text-sm text-gray-600">Veículo: {getVehicleInfo(rental.vehicleId)}</p>
                  <p className="text-sm text-gray-600">Entregador: {rental.courierId}</p>
                  <span className={`inline-block px-2 py-1 rounded text-xs mt-2 ${RENTAL_STATUS_COLORS[rental.status]}`}>
                    {RENTAL_STATUS_LABELS[rental.status]}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary-600">
                    R$ {rental.totalPrice.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">{rental.totalDays} dias</p>
                </div>
              </div>

              <div className="space-y-1 mb-4 text-sm">
                <p><strong>Início:</strong> {new Date(rental.startDate).toLocaleDateString('pt-BR')}</p>
                <p><strong>Término:</strong> {new Date(rental.endDate).toLocaleDateString('pt-BR')}</p>
                <p><strong>Valor/dia:</strong> R$ {rental.pricePerDay.toFixed(2)}</p>
              </div>

              {rental.status === 'pending' && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleApprove(rental.id)}
                    className="flex-1 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Aprovar
                  </button>
                  <button
                    onClick={() => handleReject(rental.id)}
                    className="flex-1 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Rejeitar
                  </button>
                </div>
              )}

              {rental.status === 'active' && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleComplete(rental.id)}
                    className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Concluir Aluguel
                  </button>
                  <button
                    onClick={() => handleCancel(rental.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Cancelar
                  </button>
                </div>
              )}

              {(rental.status === 'completed' || rental.status === 'cancelled') && (
                <div className="text-center text-gray-500 py-2">
                  {rental.status === 'completed' ? 'Aluguel concluído' : 'Aluguel cancelado'}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
