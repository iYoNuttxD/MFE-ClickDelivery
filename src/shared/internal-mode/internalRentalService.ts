/**
 * Internal Rental Service
 * Mock rental operations for internal mode
 */

import { InternalStorage } from './storage';
import { generateMockRental } from './mockData';
import type { Rental, RentalStatus } from '@/entities/rental/model/types';
import type { PaginatedResponse } from '@/shared/api/types';

const rentalsStorage = new InternalStorage<Rental>('rentals');

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

export const internalRentalService = {
  getRentals: async (params?: {
    page?: number;
    pageSize?: number;
    status?: string;
  }): Promise<PaginatedResponse<Rental>> => {
    await simulateDelay();
    
    let allRentals = rentalsStorage.getAll();
    
    // Filter by status if provided
    if (params?.status) {
      allRentals = allRentals.filter(rental => rental.status === params.status);
    }
    
    // Sort by most recent first
    allRentals.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return paginateResults(allRentals, params?.page, params?.pageSize);
  },

  getRentalById: async (id: string): Promise<Rental> => {
    await simulateDelay();
    
    const rental = rentalsStorage.get(id);
    if (!rental) {
      throw {
        error: 'NOT_FOUND',
        message: 'Rental not found',
        statusCode: 404,
        timestamp: new Date().toISOString(),
      };
    }
    
    return rental;
  },

  createRental: async (data: { vehicleId: string; startDate: string; endDate: string }): Promise<Rental> => {
    await simulateDelay();
    
    // Get current user ID as courier if not specified
    const courierId = localStorage.getItem('internal_mode_user_id') || 'courier-1';
    
    const rental = generateMockRental(data.vehicleId, courierId, {
      startDate: data.startDate,
      endDate: data.endDate,
    });
    
    rentalsStorage.set(rental.id, rental);
    
    return rental;
  },

  updateRentalStatus: async (id: string, status: RentalStatus): Promise<Rental> => {
    await simulateDelay();
    
    const updated = rentalsStorage.update(id, rental => ({
      ...rental,
      status,
      updatedAt: new Date().toISOString(),
    }));
    
    if (!updated) {
      throw {
        error: 'NOT_FOUND',
        message: 'Rental not found',
        statusCode: 404,
        timestamp: new Date().toISOString(),
      };
    }
    
    return updated;
  },

  cancelRental: async (id: string): Promise<Rental> => {
    await simulateDelay();
    
    const updated = rentalsStorage.update(id, rental => {
      if (rental.status === 'completed' || rental.status === 'cancelled') {
        throw {
          error: 'INVALID_STATUS',
          message: 'Cannot cancel rental in current status',
          statusCode: 400,
          timestamp: new Date().toISOString(),
        };
      }
      
      return {
        ...rental,
        status: 'cancelled' as RentalStatus,
        updatedAt: new Date().toISOString(),
      };
    });
    
    if (!updated) {
      throw {
        error: 'NOT_FOUND',
        message: 'Rental not found',
        statusCode: 404,
        timestamp: new Date().toISOString(),
      };
    }
    
    return updated;
  },

  // Helper methods for admin
  getAllRentals: (): Rental[] => {
    return rentalsStorage.getAll();
  },

  deleteRental: (id: string): boolean => {
    return rentalsStorage.delete(id);
  },

  updateRental: (id: string, data: Partial<Rental>): Rental | undefined => {
    return rentalsStorage.update(id, rental => ({
      ...rental,
      ...data,
      id: rental.id,
      updatedAt: new Date().toISOString(),
    }));
  },
};
