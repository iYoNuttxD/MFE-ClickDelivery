import React, { useEffect, useState } from 'react';
import { vehicleApi } from '@/entities/vehicle/api/vehicleApi';
import { Vehicle, VehicleType, VehicleStatus } from '@/entities/vehicle/model/types';
import { LoadingSpinner } from '@/shared/ui/components/LoadingSpinner';
import { useToast } from '@/shared/ui/components/Toast';
import { useAuth } from '@/shared/hooks/useAuth';
import { config } from '@/shared/config/env';

const VEHICLE_TYPES: VehicleType[] = ['bike', 'motorcycle', 'car'];
const VEHICLE_STATUS: VehicleStatus[] = ['available', 'rented', 'maintenance'];

const VEHICLE_TYPE_LABELS: Record<VehicleType, string> = {
  bike: 'Bicicleta',
  motorcycle: 'Motocicleta',
  car: 'Carro',
};

const STATUS_LABELS: Record<VehicleStatus, string> = {
  available: 'Disponível',
  rented: 'Alugado',
  maintenance: 'Manutenção',
};

const STATUS_COLORS: Record<VehicleStatus, string> = {
  available: 'bg-green-100 text-green-800',
  rented: 'bg-yellow-100 text-yellow-800',
  maintenance: 'bg-red-100 text-red-800',
};

export const OwnerVehiclesPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<Vehicle>>({
    type: 'bike',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    licensePlate: '',
    status: 'available',
    pricePerDay: 0,
  });
  const toast = useToast();
  const { user } = useAuth();

  // In internal mode, use a mock owner ID
  const ownerId = config.useInternalMode 
    ? (localStorage.getItem('internal_mode_user_id') || 'owner-1')
    : user?.id || '';

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await vehicleApi.getVehicles({ page: 1, pageSize: 100 });
      // Filter vehicles by owner
      const ownerVehicles = response.data.filter(v => v.ownerId === ownerId);
      setVehicles(ownerVehicles);
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
      toast.error('Erro ao carregar veículos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ownerId) {
      fetchVehicles();
    }
  }, [ownerId]);

  const handleCreate = async () => {
    try {
      const newVehicle = await vehicleApi.createVehicle({ ...formData, ownerId });
      setVehicles([...vehicles, newVehicle]);
      toast.success('Veículo criado com sucesso!');
      setIsCreating(false);
      resetForm();
    } catch (error) {
      console.error('Failed to create vehicle:', error);
      toast.error('Erro ao criar veículo');
    }
  };

  const handleUpdate = async () => {
    if (!editingVehicle) return;
    
    try {
      const updated = await vehicleApi.updateVehicle(editingVehicle.id, formData);
      setVehicles(vehicles.map(v => v.id === updated.id ? updated : v));
      toast.success('Veículo atualizado com sucesso!');
      setEditingVehicle(null);
      resetForm();
    } catch (error) {
      console.error('Failed to update vehicle:', error);
      toast.error('Erro ao atualizar veículo');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este veículo?')) return;
    
    try {
      await vehicleApi.deleteVehicle(id);
      setVehicles(vehicles.filter(v => v.id !== id));
      toast.success('Veículo excluído com sucesso!');
    } catch (error) {
      console.error('Failed to delete vehicle:', error);
      toast.error('Erro ao excluir veículo');
    }
  };

  const startEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      type: vehicle.type,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      licensePlate: vehicle.licensePlate,
      status: vehicle.status,
      pricePerDay: vehicle.pricePerDay,
    });
  };

  const resetForm = () => {
    setFormData({
      type: 'bike',
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      licensePlate: '',
      status: 'available',
      pricePerDay: 0,
    });
  };

  const cancelEdit = () => {
    setEditingVehicle(null);
    setIsCreating(false);
    resetForm();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Meus Veículos</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-primary-500 text-white px-6 py-2 rounded hover:bg-primary-600"
        >
          + Adicionar Veículo
        </button>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingVehicle) && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            {isCreating ? 'Cadastrar Novo Veículo' : 'Editar Veículo'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as VehicleType })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {VEHICLE_TYPES.map(type => (
                  <option key={type} value={type}>{VEHICLE_TYPE_LABELS[type]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ano</label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || new Date().getFullYear() })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Placa</label>
              <input
                type="text"
                value={formData.licensePlate}
                onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="ABC-1234"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preço por Dia (R$)</label>
              <input
                type="number"
                step="0.01"
                value={formData.pricePerDay}
                onChange={(e) => setFormData({ ...formData, pricePerDay: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as VehicleStatus })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {VEHICLE_STATUS.map(status => (
                  <option key={status} value={status}>{STATUS_LABELS[status]}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 flex space-x-2">
            <button
              onClick={isCreating ? handleCreate : handleUpdate}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              {isCreating ? 'Cadastrar' : 'Salvar'}
            </button>
            <button
              onClick={cancelEdit}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Vehicles List */}
      {vehicles.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-600">Nenhum veículo cadastrado. Adicione o primeiro!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    {vehicle.brand} {vehicle.model}
                  </h3>
                  <p className="text-sm text-gray-600">{VEHICLE_TYPE_LABELS[vehicle.type]} - {vehicle.year}</p>
                  <p className="text-sm font-mono text-gray-900 mt-1">{vehicle.licensePlate}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${STATUS_COLORS[vehicle.status]}`}>
                  {STATUS_LABELS[vehicle.status]}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-lg font-bold text-primary-600">
                  R$ {vehicle.pricePerDay.toFixed(2)} / dia
                </p>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => startEdit(vehicle)}
                  className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(vehicle.id)}
                  className="flex-1 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  disabled={vehicle.status === 'rented'}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
