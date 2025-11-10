import React, { useEffect, useState } from 'react';
import { restaurantApi } from '@/entities/restaurant/api/restaurantApi';
import { orderApi } from '@/entities/order/api/orderApi';
import { LoadingSpinner } from '@/shared/ui/components/LoadingSpinner';
import { config } from '@/shared/config/env';

export const RestaurantDashboardPage: React.FC = () => {
  const [stats, setStats] = useState({
    ordersToday: 0,
    monthlyRevenue: 0,
    menuItemsCount: 0,
  });
  const [loading, setLoading] = useState(true);

  // In internal mode, use a mock restaurant ID
  const restaurantId = config.useInternalMode 
    ? (localStorage.getItem('internal_mode_restaurant_id') || 'rest-1')
    : '';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch menu items count
        const menuItems = await restaurantApi.getMenuItems(restaurantId);
        
        // Fetch orders
        const ordersResponse = await orderApi.getOrders({ page: 1, pageSize: 100 });
        const restaurantOrders = ordersResponse.data.filter(order => order.restaurantId === restaurantId);
        
        // Calculate today's orders
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const ordersToday = restaurantOrders.filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= today;
        }).length;
        
        // Calculate monthly revenue (simplified - all orders this month)
        const thisMonth = new Date();
        thisMonth.setDate(1);
        thisMonth.setHours(0, 0, 0, 0);
        const monthlyRevenue = restaurantOrders
          .filter(order => {
            const orderDate = new Date(order.createdAt);
            return orderDate >= thisMonth && order.status !== 'cancelled';
          })
          .reduce((sum, order) => sum + order.total, 0);
        
        setStats({
          ordersToday,
          monthlyRevenue,
          menuItemsCount: menuItems.length,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId) {
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [restaurantId]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard do Restaurante</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Pedidos Hoje</h3>
          <p className="text-3xl font-bold text-primary-600">{stats.ordersToday}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Receita do Mês</h3>
          <p className="text-3xl font-bold text-green-600">R$ {stats.monthlyRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Itens no Cardápio</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.menuItemsCount}</p>
        </div>
      </div>
    </div>
  );
};
