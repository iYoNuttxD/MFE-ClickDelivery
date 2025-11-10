/**
 * Internal Order Service
 * Mock order operations for internal mode
 */

import { InternalStorage } from './storage';
import { generateMockOrder } from './mockData';
import type { Order, CreateOrderDto, OrderStatus } from '@/entities/order/model/types';
import type { PaginatedResponse } from '@/shared/api/types';

const ordersStorage = new InternalStorage<Order>('orders');

const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 300));

const paginateResults = <T>(
  items: T[],
  page: number = 1,
  pageSize: number = 10
): PaginatedResponse<T> => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedItems = items.slice(start, end);
  
  return {
    data: paginatedItems,
    total: items.length,
    page,
    pageSize,
    totalPages: Math.ceil(items.length / pageSize),
  };
};

export const internalOrderService = {
  getOrders: async (params?: {
    page?: number;
    pageSize?: number;
    status?: string;
  }): Promise<PaginatedResponse<Order>> => {
    await simulateDelay();
    
    let allOrders = ordersStorage.getAll();
    
    // Filter by status if provided
    if (params?.status) {
      allOrders = allOrders.filter(order => order.status === params.status);
    }
    
    // Sort by most recent first
    allOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return paginateResults(allOrders, params?.page, params?.pageSize);
  },

  getOrderById: async (id: string): Promise<Order> => {
    await simulateDelay();
    
    const order = ordersStorage.get(id);
    if (!order) {
      throw {
        error: 'NOT_FOUND',
        message: 'Order not found',
        statusCode: 404,
        timestamp: new Date().toISOString(),
      };
    }
    
    return order;
  },

  createOrder: async (data: CreateOrderDto): Promise<Order> => {
    await simulateDelay();
    
    // Get current user ID from localStorage
    const customerId = localStorage.getItem('internal_mode_user_id') || 'customer-1';
    
    // Get restaurant name from storage
    let restaurantName = 'Mock Restaurant';
    try {
      // Import at runtime to avoid circular dependency
      const { InternalStorage } = await import('./storage');
      const restaurantsStorage = new InternalStorage('restaurants');
      const restaurant = restaurantsStorage.get(data.restaurantId);
      if (restaurant && typeof restaurant === 'object' && 'name' in restaurant) {
        restaurantName = (restaurant as any).name;
      }
    } catch (error) {
      console.warn('Could not fetch restaurant name:', error);
    }
    
    const order = generateMockOrder(customerId, data.restaurantId, data.items, {
      restaurantName,
      deliveryAddress: data.deliveryAddress,
      notes: data.notes,
    });
    
    ordersStorage.set(order.id, order);
    
    return order;
  },

  updateOrderStatus: async (id: string, status: OrderStatus): Promise<Order> => {
    await simulateDelay();
    
    const updated = ordersStorage.update(id, order => ({
      ...order,
      status,
      updatedAt: new Date().toISOString(),
    }));
    
    if (!updated) {
      throw {
        error: 'NOT_FOUND',
        message: 'Order not found',
        statusCode: 404,
        timestamp: new Date().toISOString(),
      };
    }
    
    return updated;
  },

  cancelOrder: async (id: string): Promise<Order> => {
    await simulateDelay();
    
    const updated = ordersStorage.update(id, order => {
      if (order.status === 'delivered' || order.status === 'cancelled') {
        throw {
          error: 'INVALID_STATUS',
          message: 'Cannot cancel order in current status',
          statusCode: 400,
          timestamp: new Date().toISOString(),
        };
      }
      
      return {
        ...order,
        status: 'cancelled' as OrderStatus,
        updatedAt: new Date().toISOString(),
      };
    });
    
    if (!updated) {
      throw {
        error: 'NOT_FOUND',
        message: 'Order not found',
        statusCode: 404,
        timestamp: new Date().toISOString(),
      };
    }
    
    return updated;
  },

  assignCourier: async (orderId: string, courierId: string): Promise<Order> => {
    await simulateDelay();
    
    const updated = ordersStorage.update(orderId, order => ({
      ...order,
      courierId,
      updatedAt: new Date().toISOString(),
    }));
    
    if (!updated) {
      throw {
        error: 'NOT_FOUND',
        message: 'Order not found',
        statusCode: 404,
        timestamp: new Date().toISOString(),
      };
    }
    
    return updated;
  },

  // Helper methods for admin
  getAllOrders: (): Order[] => {
    return ordersStorage.getAll();
  },

  deleteOrder: (id: string): boolean => {
    return ordersStorage.delete(id);
  },

  updateOrder: (id: string, data: Partial<Order>): Order | undefined => {
    return ordersStorage.update(id, order => ({
      ...order,
      ...data,
      id: order.id,
      updatedAt: new Date().toISOString(),
    }));
  },

  // Get orders by restaurant ID (for restaurant owners)
  getOrdersByRestaurantId: async (restaurantId: string): Promise<Order[]> => {
    await simulateDelay();
    
    return ordersStorage.getAll().filter(order => order.restaurantId === restaurantId);
  },

  // Get orders by customer ID (for customer history)
  getOrdersByCustomerId: async (customerId: string): Promise<Order[]> => {
    await simulateDelay();
    
    return ordersStorage.getAll()
      .filter(order => order.customerId === customerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  // Get available orders for couriers (orders ready for pickup without courier)
  getAvailableOrdersForCourier: async (): Promise<Order[]> => {
    await simulateDelay();
    
    return ordersStorage.getAll()
      .filter(order => 
        (order.status === 'ready' || order.status === 'confirmed') && 
        !order.courierId
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
};
