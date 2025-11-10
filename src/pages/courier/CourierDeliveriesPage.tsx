import React, { useEffect, useState } from 'react';
import { deliveryApi } from '@/entities/delivery/api/deliveryApi';
import { orderApi } from '@/entities/order/api/orderApi';
import { vehicleApi } from '@/entities/vehicle/api/vehicleApi';
import { Delivery, DeliveryStatus } from '@/entities/delivery/model/types';
import { Order } from '@/entities/order/model/types';
import { Vehicle } from '@/entities/vehicle/model/types';
import { LoadingSpinner } from '@/shared/ui/components/LoadingSpinner';
import { useToast } from '@/shared/ui/components/Toast';
import { useAuth } from '@/shared/auth/useAuth';
import { config } from '@/shared/config/env';

const DELIVERY_STATUS_LABELS: Record<DeliveryStatus, string> = {
  pending: 'Pendente',
  assigned: 'Atribuída',
  picked_up: 'Coletado',
  in_transit: 'Em Trânsito',
  delivered: 'Entregue',
  failed: 'Falhou',
};

const DELIVERY_STATUS_COLORS: Record<DeliveryStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  assigned: 'bg-blue-100 text-blue-800',
  picked_up: 'bg-purple-100 text-purple-800',
  in_transit: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
};

export const CourierDeliveriesPage: React.FC = () => {
  const [activeDeliveries, setActiveDeliveries] = useState<Delivery[]>([]);
  const [availableOrders, setAvailableOrders] = useState<Order[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'active' | 'available'>('active');
  const toast = useToast();
  const { user } = useAuth();

  // In internal mode, use a mock courier ID
  const courierId = config.useInternalMode 
    ? (localStorage.getItem('internal_mode_user_id') || 'courier-1')
    : user?.id || '';

  const fetchData = async () => {
    if (!courierId) return;
    
    try {
      setLoading(true);
      
      // Fetch active deliveries for this courier
      const deliveries = await deliveryApi.getActiveDeliveriesForCourier(courierId);
      setActiveDeliveries(deliveries);

      // Fetch available orders (ready for pickup, not yet assigned)
      const ordersResponse = await orderApi.getOrders({ page: 1, pageSize: 50 });
      const readyOrders = ordersResponse.data.filter(
        order => order.status === 'ready' && !order.courierId
      );
      setAvailableOrders(readyOrders);

      // Fetch available vehicles
      if (config.useInternalMode) {
        const vehiclesResponse = await vehicleApi.getVehicles({ status: 'available' });
        setVehicles(vehiclesResponse.data);
        if (vehiclesResponse.data.length > 0 && !selectedVehicle) {
          setSelectedVehicle(vehiclesResponse.data[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [courierId]);

  const handleAcceptOrder = async (orderId: string) => {
    try {
      // Create a delivery for this order
      // In a real system, this would be handled differently
      // For now, we'll use the delivery service to create/accept a delivery
      
      // First check if delivery already exists for this order
      const deliveriesResponse = await deliveryApi.getDeliveries({ page: 1, pageSize: 100 });
      let delivery = deliveriesResponse.data.find(d => d.orderId === orderId);
      
      if (!delivery) {
        // Create delivery via internal service if needed
        // This is a simplified flow for internal mode
        toast.info('Criando entrega...');
        // In production, the backend would handle this
      }

      // Accept/assign the delivery to this courier
      if (delivery) {
        const updatedDelivery = await deliveryApi.acceptDelivery(
          delivery.id,
          courierId,
          selectedVehicle || undefined
        );
        
        setActiveDeliveries([...activeDeliveries, updatedDelivery]);
        setAvailableOrders(availableOrders.filter(order => order.id !== orderId));
        toast.success('Pedido aceito com sucesso!');
        setTab('active');
      } else {
        toast.warning('Entrega não encontrada. Recarregando...');
        fetchData();
      }
    } catch (error) {
      console.error('Failed to accept order:', error);
      toast.error('Erro ao aceitar pedido');
    }
  };

  const handleUpdateDeliveryStatus = async (deliveryId: string, newStatus: DeliveryStatus) => {
    try {
      const updated = await deliveryApi.updateDeliveryStatus(deliveryId, newStatus);
      setActiveDeliveries(activeDeliveries.map(d => d.id === updated.id ? updated : d));
      toast.success(`Status atualizado: ${DELIVERY_STATUS_LABELS[newStatus]}`);
      
      // If delivered or failed, remove from active list
      if (newStatus === 'delivered' || newStatus === 'failed') {
        setActiveDeliveries(activeDeliveries.filter(d => d.id !== deliveryId));
      }
    } catch (error) {
      console.error('Failed to update delivery status:', error);
      toast.error('Erro ao atualizar status');
    }
  };

  const getNextStatus = (currentStatus: DeliveryStatus): DeliveryStatus | null => {
    const flow: Record<DeliveryStatus, DeliveryStatus | null> = {
      pending: 'assigned',
      assigned: 'picked_up',
      picked_up: 'in_transit',
      in_transit: 'delivered',
      delivered: null,
      failed: null,
    };
    return flow[currentStatus];
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Minhas Entregas</h1>
        <button
          onClick={fetchData}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          🔄 Atualizar
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-4">
          <button
            onClick={() => setTab('active')}
            className={`py-3 px-4 border-b-2 font-medium text-sm transition ${
              tab === 'active'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Entregas Ativas ({activeDeliveries.length})
          </button>
          <button
            onClick={() => setTab('available')}
            className={`py-3 px-4 border-b-2 font-medium text-sm transition ${
              tab === 'available'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Pedidos Disponíveis ({availableOrders.length})
          </button>
        </nav>
      </div>

      {/* Active Deliveries Tab */}
      {tab === 'active' && (
        <div className="space-y-4">
          {activeDeliveries.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-gray-600">Nenhuma entrega ativa no momento</p>
            </div>
          ) : (
            activeDeliveries.map((delivery) => {
              const nextStatus = getNextStatus(delivery.status);
              
              return (
                <div key={delivery.id} className="bg-white p-6 rounded-lg shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Entrega #{delivery.id}</h3>
                      <p className="text-sm text-gray-600">Pedido: {delivery.orderId}</p>
                      <span className={`inline-block px-2 py-1 rounded text-xs mt-2 ${DELIVERY_STATUS_COLORS[delivery.status]}`}>
                        {DELIVERY_STATUS_LABELS[delivery.status]}
                      </span>
                    </div>
                    <div className="text-right">
                      {delivery.distance && (
                        <p className="text-sm text-gray-600">{delivery.distance.toFixed(1)} km</p>
                      )}
                      {delivery.earnings && (
                        <p className="text-lg font-bold text-green-600">R$ {delivery.earnings.toFixed(2)}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm"><strong>Coleta:</strong> {delivery.pickupAddress}</p>
                    <p className="text-sm"><strong>Entrega:</strong> {delivery.deliveryAddress}</p>
                  </div>

                  <div className="flex space-x-2">
                    {nextStatus && (
                      <button
                        onClick={() => handleUpdateDeliveryStatus(delivery.id, nextStatus)}
                        className="flex-1 py-2 bg-primary-500 text-white rounded hover:bg-primary-600"
                      >
                        {DELIVERY_STATUS_LABELS[nextStatus]}
                      </button>
                    )}
                    
                    {delivery.status !== 'delivered' && delivery.status !== 'failed' && (
                      <button
                        onClick={() => handleUpdateDeliveryStatus(delivery.id, 'failed')}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Falhou
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Available Orders Tab */}
      {tab === 'available' && (
        <div className="space-y-4">
          {vehicles.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecione seu veículo:
              </label>
              <select
                value={selectedVehicle}
                onChange={(e) => setSelectedVehicle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {vehicles.map(vehicle => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.brand} {vehicle.model} - {vehicle.licensePlate}
                  </option>
                ))}
              </select>
            </div>
          )}

          {availableOrders.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-gray-600">Nenhum pedido disponível no momento</p>
            </div>
          ) : (
            availableOrders.map((order) => (
              <div key={order.id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Pedido #{order.id}</h3>
                    <p className="text-sm text-gray-600">{order.restaurantName}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(order.createdAt).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <p className="text-lg font-bold">R$ {order.total.toFixed(2)}</p>
                </div>

                <div className="mb-4">
                  <p className="text-sm"><strong>Endereço de entrega:</strong></p>
                  <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
                </div>

                <button
                  onClick={() => handleAcceptOrder(order.id)}
                  className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  disabled={!selectedVehicle && vehicles.length > 0}
                >
                  Aceitar Entrega
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
