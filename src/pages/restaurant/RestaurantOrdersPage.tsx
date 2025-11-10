import React, { useEffect, useState } from 'react';
import { orderApi } from '@/entities/order/api/orderApi';
import { Order, OrderStatus } from '@/entities/order/model/types';
import { LoadingSpinner } from '@/shared/ui/components/LoadingSpinner';
import { useToast } from '@/shared/ui/components/Toast';
import { useAuth } from '@/shared/auth/useAuth';
import { config } from '@/shared/config/env';

const ORDER_STATUSES: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'];

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pendente',
  confirmed: 'Confirmado',
  preparing: 'Preparando',
  ready: 'Pronto',
  out_for_delivery: 'Saiu para Entrega',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-purple-100 text-purple-800',
  ready: 'bg-green-100 text-green-800',
  out_for_delivery: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
};

export const RestaurantOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const { user } = useAuth();

  // In internal mode, use a mock restaurant ID
  const restaurantId = config.useInternalMode 
    ? (localStorage.getItem('internal_mode_restaurant_id') || 'rest-1')
    : user?.restaurantId || '';

  const fetchOrders = async () => {
    if (!restaurantId) return;
    
    try {
      setLoading(true);
      const response = await orderApi.getOrders({ page: 1, pageSize: 50 });
      // Filter orders for this restaurant
      const restaurantOrders = response.data.filter(order => order.restaurantId === restaurantId);
      setOrders(restaurantOrders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [restaurantId]);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const updatedOrder = await orderApi.updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order => order.id === updatedOrder.id ? updatedOrder : order));
      toast.success(`Status atualizado para: ${STATUS_LABELS[newStatus]}`);
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast.error('Erro ao atualizar status do pedido');
    }
  };

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    const statusFlow: Record<OrderStatus, OrderStatus | null> = {
      pending: 'confirmed',
      confirmed: 'preparing',
      preparing: 'ready',
      ready: 'out_for_delivery',
      out_for_delivery: 'delivered',
      delivered: null,
      cancelled: null,
    };
    return statusFlow[currentStatus];
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Pedidos do Restaurante</h1>
        <button
          onClick={fetchOrders}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          🔄 Atualizar
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-600">Nenhum pedido no momento</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const nextStatus = getNextStatus(order.status);
            
            return (
              <div key={order.id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Pedido #{order.id}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleString('pt-BR')}
                    </p>
                    <p className="text-sm text-gray-600">Cliente: {order.customerId}</p>
                    <p className="text-sm text-gray-600 mt-1">Endereço: {order.deliveryAddress}</p>
                    {order.notes && (
                      <p className="text-sm text-gray-600 mt-1">Observações: {order.notes}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">R$ {order.total.toFixed(2)}</p>
                    <span className={`inline-block px-2 py-1 rounded text-xs mt-1 ${STATUS_COLORS[order.status]}`}>
                      {STATUS_LABELS[order.status]}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Itens:</h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.name}</span>
                        <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex space-x-2">
                  {nextStatus && (
                    <button
                      onClick={() => handleStatusChange(order.id, nextStatus)}
                      className="flex-1 py-2 bg-primary-500 text-white rounded hover:bg-primary-600"
                    >
                      Avançar para: {STATUS_LABELS[nextStatus]}
                    </button>
                  )}
                  
                  {order.status !== 'cancelled' && order.status !== 'delivered' && (
                    <>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                      >
                        {ORDER_STATUSES.map(status => (
                          <option key={status} value={status}>
                            {STATUS_LABELS[status]}
                          </option>
                        ))}
                      </select>
                      
                      <button
                        onClick={() => handleStatusChange(order.id, 'cancelled')}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Cancelar
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
