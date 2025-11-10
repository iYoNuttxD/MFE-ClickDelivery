/**
 * Internal Delivery Service
 * Mock delivery operations for internal mode
 */

import { InternalStorage } from './storage';
import { generateMockDelivery } from './mockData';
import type { Delivery, DeliveryStatus } from '@/entities/delivery/model/types';
import type { PaginatedResponse } from '@/shared/api/types';

const deliveriesStorage = new InternalStorage<Delivery>('deliveries');

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

export const internalDeliveryService = {
  getDeliveries: async (params?: {
    page?: number;
    pageSize?: number;
    status?: string;
  }): Promise<PaginatedResponse<Delivery>> => {
    await simulateDelay();
    
    let allDeliveries = deliveriesStorage.getAll();
    
    // Filter by status if provided
    if (params?.status) {
      allDeliveries = allDeliveries.filter(delivery => delivery.status === params.status);
    }
    
    // Sort by most recent first
    allDeliveries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return paginateResults(allDeliveries, params?.page, params?.pageSize);
  },

  getDeliveryById: async (id: string): Promise<Delivery> => {
    await simulateDelay();
    
    const delivery = deliveriesStorage.get(id);
    if (!delivery) {
      throw {
        error: 'NOT_FOUND',
        message: 'Delivery not found',
        statusCode: 404,
        timestamp: new Date().toISOString(),
      };
    }
    
    return delivery;
  },

  createDelivery: async (orderId: string, courierId: string, data?: Partial<Delivery>): Promise<Delivery> => {
    await simulateDelay();
    
    const delivery = generateMockDelivery(orderId, courierId, data);
    deliveriesStorage.set(delivery.id, delivery);
    
    return delivery;
  },

  updateDeliveryStatus: async (id: string, status: string): Promise<Delivery> => {
    await simulateDelay();
    
    const updated = deliveriesStorage.update(id, delivery => {
      const updates: Partial<Delivery> = {
        status: status as DeliveryStatus,
        updatedAt: new Date().toISOString(),
      };
      
      // Update timestamps based on status
      if (status === 'picked_up') {
        updates.pickupTime = new Date().toISOString();
      } else if (status === 'delivered') {
        updates.deliveryTime = new Date().toISOString();
      }
      
      return {
        ...delivery,
        ...updates,
      };
    });
    
    if (!updated) {
      throw {
        error: 'NOT_FOUND',
        message: 'Delivery not found',
        statusCode: 404,
        timestamp: new Date().toISOString(),
      };
    }
    
    return updated;
  },

  assignCourier: async (deliveryId: string, courierId: string): Promise<Delivery> => {
    await simulateDelay();
    
    const updated = deliveriesStorage.update(deliveryId, delivery => ({
      ...delivery,
      courierId,
      status: 'assigned' as DeliveryStatus,
      updatedAt: new Date().toISOString(),
    }));
    
    if (!updated) {
      throw {
        error: 'NOT_FOUND',
        message: 'Delivery not found',
        statusCode: 404,
        timestamp: new Date().toISOString(),
      };
    }
    
    return updated;
  },

  // Helper methods for admin
  getAllDeliveries: (): Delivery[] => {
    return deliveriesStorage.getAll();
  },

  deleteDelivery: (id: string): boolean => {
    return deliveriesStorage.delete(id);
  },

  updateDelivery: (id: string, data: Partial<Delivery>): Delivery | undefined => {
    return deliveriesStorage.update(id, delivery => ({
      ...delivery,
      ...data,
      id: delivery.id,
      updatedAt: new Date().toISOString(),
    }));
  },

  // Get deliveries by courier ID
  getDeliveriesByCourierId: async (courierId: string): Promise<Delivery[]> => {
    await simulateDelay();
    
    return deliveriesStorage.getAll()
      .filter(delivery => delivery.courierId === courierId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  // Get active deliveries for a courier
  getActiveDeliveriesForCourier: async (courierId: string): Promise<Delivery[]> => {
    await simulateDelay();
    
    return deliveriesStorage.getAll()
      .filter(delivery => 
        delivery.courierId === courierId && 
        delivery.status !== 'delivered' && 
        delivery.status !== 'failed'
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  // Accept a delivery (courier accepts an order)
  acceptDelivery: async (deliveryId: string, courierId: string, vehicleId?: string): Promise<Delivery> => {
    await simulateDelay();
    
    const updated = deliveriesStorage.update(deliveryId, delivery => ({
      ...delivery,
      courierId,
      vehicleId,
      status: 'assigned' as DeliveryStatus,
      updatedAt: new Date().toISOString(),
    }));
    
    if (!updated) {
      throw {
        error: 'NOT_FOUND',
        message: 'Delivery not found',
        statusCode: 404,
        timestamp: new Date().toISOString(),
      };
    }
    
    return updated;
  },
};
