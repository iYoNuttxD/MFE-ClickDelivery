/**
 * Internal Vehicle Service
 * Mock vehicle operations for internal mode
 */

import { InternalStorage } from './storage';
import { generateMockVehicle } from './mockData';
import type { Vehicle, VehicleStatus } from '@/entities/vehicle/model/types';
import type { PaginatedResponse } from '@/shared/api/types';

const vehiclesStorage = new InternalStorage<Vehicle>('vehicles');

// Initialize with default vehicles
const initializeDefaultVehicles = () => {
  if (vehiclesStorage.size() === 0) {
    const defaultVehicles: Vehicle[] = [
      {
        id: 'vehicle-1',
        ownerId: 'owner-1',
        type: 'bike',
        brand: 'Honda',
        model: 'CG 160',
        year: 2023,
        licensePlate: 'ABC-1234',
        status: 'available',
        pricePerDay: 50.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'vehicle-2',
        ownerId: 'owner-1',
        type: 'motorcycle',
        brand: 'Yamaha',
        model: 'Fazer 250',
        year: 2022,
        licensePlate: 'XYZ-5678',
        status: 'available',
        pricePerDay: 65.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'vehicle-3',
        ownerId: 'owner-1',
        type: 'car',
        brand: 'Fiat',
        model: 'Uno',
        year: 2021,
        licensePlate: 'DEF-9012',
        status: 'available',
        pricePerDay: 80.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    
    defaultVehicles.forEach(vehicle => {
      vehiclesStorage.set(vehicle.id, vehicle);
    });
  }
};

// Initialize on module load
initializeDefaultVehicles();

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

  // Get vehicles by owner ID
  getVehiclesByOwnerId: async (ownerId: string): Promise<Vehicle[]> => {
    await simulateDelay();
    
    return vehiclesStorage.getAll()
      .filter(vehicle => vehicle.ownerId === ownerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  // Get available vehicles for rental
  getAvailableVehicles: async (): Promise<Vehicle[]> => {
    await simulateDelay();
    
    return vehiclesStorage.getAll()
      .filter(vehicle => vehicle.status === 'available')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
};
