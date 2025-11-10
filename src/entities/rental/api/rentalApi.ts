import httpClient from '@/shared/api/httpClient';
import { config } from '@/shared/config/env';
import { internalRentalService } from '@/shared/internal-mode';
import { Rental } from '../model/types';
import { PaginatedResponse } from '@/shared/api/types';

// Real BFF implementation
const realRentalApi = {
  getRentals: async (params?: {
    page?: number;
    pageSize?: number;
    status?: string;
  }): Promise<PaginatedResponse<Rental>> => {
    const response = await httpClient.get<PaginatedResponse<Rental>>('/rentals/rentals', { params });
    return response.data;
  },

  getRentalById: async (id: string): Promise<Rental> => {
    const response = await httpClient.get<Rental>(`/rentals/rentals/${id}`);
    return response.data;
  },

  createRental: async (data: { vehicleId: string; startDate: string; endDate: string }): Promise<Rental> => {
    const response = await httpClient.post<Rental>('/rentals/rentals', data);
    return response.data;
  },

  approveRental: async (id: string): Promise<Rental> => {
    const response = await httpClient.patch<Rental>(`/rentals/rentals/${id}/approve`);
    return response.data;
  },

  rejectRental: async (id: string): Promise<Rental> => {
    const response = await httpClient.patch<Rental>(`/rentals/rentals/${id}/reject`);
    return response.data;
  },

  completeRental: async (id: string): Promise<Rental> => {
    const response = await httpClient.patch<Rental>(`/rentals/rentals/${id}/complete`);
    return response.data;
  },

  cancelRental: async (id: string): Promise<Rental> => {
    const response = await httpClient.patch<Rental>(`/rentals/rentals/${id}/cancel`);
    return response.data;
  },
};

// Wrapped API with conditional logic based on internal mode flag
export const rentalApi = {
  getRentals: (params?: {
    page?: number;
    pageSize?: number;
    status?: string;
  }): Promise<PaginatedResponse<Rental>> => {
    return config.useInternalMode
      ? internalRentalService.getRentals(params)
      : realRentalApi.getRentals(params);
  },

  getRentalById: (id: string): Promise<Rental> => {
    return config.useInternalMode
      ? internalRentalService.getRentalById(id)
      : realRentalApi.getRentalById(id);
  },

  createRental: (data: { vehicleId: string; startDate: string; endDate: string }): Promise<Rental> => {
    return config.useInternalMode
      ? internalRentalService.createRental(data)
      : realRentalApi.createRental(data);
  },

  approveRental: (id: string): Promise<Rental> => {
    return config.useInternalMode
      ? internalRentalService.approveRental(id)
      : realRentalApi.approveRental(id);
  },

  rejectRental: (id: string): Promise<Rental> => {
    return config.useInternalMode
      ? internalRentalService.rejectRental(id)
      : realRentalApi.rejectRental(id);
  },

  completeRental: (id: string): Promise<Rental> => {
    return config.useInternalMode
      ? internalRentalService.completeRental(id)
      : realRentalApi.completeRental(id);
  },

  cancelRental: (id: string): Promise<Rental> => {
    return config.useInternalMode
      ? internalRentalService.cancelRental(id)
      : realRentalApi.cancelRental(id);
  },
};
