import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderApi } from '@/entities/order/api/orderApi';
import { Order } from '@/entities/order/model/types';
import { LoadingSpinner } from '@/shared/ui/components/LoadingSpinner';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderApi.getOrders({ page: 1, pageSize: 20 });
        setOrders(response.data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Meus Pedidos</h1>

      {orders.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-600 mb-4">Você ainda não fez nenhum pedido</p>
          <Link
            to="/customer/restaurants"
            className="bg-primary-500 text-white px-6 py-2 rounded hover:bg-primary-600 inline-block"
          >
            Explorar Restaurantes
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/customer/orders/${order.id}`}
              className="block bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{order.restaurantName}</h3>
                  <p className="text-sm text-gray-600">Pedido #{order.id}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleString('pt-BR')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">R$ {order.total.toFixed(2)}</p>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      order.status === 'delivered'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
