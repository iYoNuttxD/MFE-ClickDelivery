/**
 * Internal Vehicle Service
 * Mock vehicle operations for internal mode
 */

import { InternalStorage } from './storage';
import { generateMockVehicle } from './mockData';
import type { Vehicle, VehicleStatus } from '@/entities/vehicle/model/types';
import type { PaginatedResponse } from '@/shared/api/types';

const vehiclesStorage = new InternalStorage<Vehicle>('vehicles');

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

export const internalVehicleService = {
  getVehicles: async (params?: {
    page?: number;
    pageSize?: number;
    status?: string;
  }): Promise<PaginatedResponse<Vehicle>> => {
    await simulateDelay();
    
    let allVehicles = vehiclesStorage.getAll();
    
    // Filter by status if provided
    if (params?.status) {
      allVehicles = allVehicles.filter(vehicle => vehicle.status === params.status);
    }
    
    // Sort by most recent first
    allVehicles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return paginateResults(allVehicles, params?.page, params?.pageSize);
  },

  getVehicleById: async (id: string): Promise<Vehicle> => {
    await simulateDelay();
    
    const vehicle = vehiclesStorage.get(id);
    if (!vehicle) {
      throw {
        error: 'NOT_FOUND',
        message: 'Vehicle not found',
        statusCode: 404,
        timestamp: new Date().toISOString(),
      };
    }
    
    return vehicle;
  },

  createVehicle: async (data: Partial<Vehicle>): Promise<Vehicle> => {
    await simulateDelay();
    
    // Get current user ID as owner if not specified
    const ownerId = data.ownerId || localStorage.getItem('internal_mode_user_id') || 'owner-1';
    
    const vehicle = generateMockVehicle(ownerId, data);
    vehiclesStorage.set(vehicle.id, vehicle);
    
    return vehicle;
  },

  updateVehicle: async (id: string, data: Partial<Vehicle>): Promise<Vehicle> => {
    await simulateDelay();
    
    const updated = vehiclesStorage.update(id, vehicle => ({
      ...vehicle,
      ...data,
      id: vehicle.id, // Don't allow ID change
      updatedAt: new Date().toISOString(),
    }));
    
    if (!updated) {
      throw {
        error: 'NOT_FOUND',
        message: 'Vehicle not found',
        statusCode: 404,
        timestamp: new Date().toISOString(),
      };
    }
    
    return updated;
  },

  updateVehicleStatus: async (id: string, status: VehicleStatus): Promise<Vehicle> => {
    await simulateDelay();
    
    const updated = vehiclesStorage.update(id, vehicle => ({
      ...vehicle,
      status,
      updatedAt: new Date().toISOString(),
    }));
    
    if (!updated) {
      throw {
        error: 'NOT_FOUND',
        message: 'Vehicle not found',
        statusCode: 404,
        timestamp: new Date().toISOString(),
      };
    }
    
    return updated;
  },

  deleteVehicle: async (id: string): Promise<void> => {
    await simulateDelay();
    
    const deleted = vehiclesStorage.delete(id);
    if (!deleted) {
      throw {
        error: 'NOT_FOUND',
        message: 'Vehicle not found',
        statusCode: 404,
        timestamp: new Date().toISOString(),
      };
    }
  },

  // Helper methods for admin
  getAllVehicles: (): Vehicle[] => {
    return vehiclesStorage.getAll();
  },
};
