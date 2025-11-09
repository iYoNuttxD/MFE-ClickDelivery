import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { orderApi } from '@/entities/order/api/orderApi';
import { Order } from '@/entities/order/model/types';
import { LoadingSpinner } from '@/shared/ui/components/LoadingSpinner';
import { OrderStatusTimeline } from '@/features/order-tracking/components/OrderStatusTimeline';

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      try {
        const data = await orderApi.getOrderById(id);
        setOrder(data);
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!order) return <div>Pedido não encontrado</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Detalhes do Pedido</h1>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">{order.restaurantName}</h2>
          <OrderStatusTimeline currentStatus={order.status} />
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold mb-2">Itens do Pedido</h3>
          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span>
                  {item.quantity}x {item.name}
                </span>
                <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>R$ {order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Taxa de Entrega</span>
            <span>R$ {order.deliveryFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg mt-2">
            <span>Total</span>
            <span>R$ {order.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="border-t pt-4 mt-4">
          <p className="text-sm text-gray-600">
            <strong>Endereço:</strong> {order.deliveryAddress}
          </p>
          {order.notes && (
            <p className="text-sm text-gray-600 mt-2">
              <strong>Observações:</strong> {order.notes}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
