import httpClient from '@/shared/api/httpClient';
import { Rental } from '../model/types';
import { PaginatedResponse } from '@/shared/api/types';

export const rentalApi = {
  getRentals: async (params?: {
    page?: number;
    pageSize?: number;
    status?: string;
  }): Promise<PaginatedResponse<Rental>> => {
    const response = await httpClient.get<PaginatedResponse<Rental>>('/rentals', { params });
    return response.data;
  },

  getRentalById: async (id: string): Promise<Rental> => {
    const response = await httpClient.get<Rental>(`/rentals/${id}`);
    return response.data;
  },

  createRental: async (data: { vehicleId: string; startDate: string; endDate: string }): Promise<Rental> => {
    const response = await httpClient.post<Rental>('/rentals', data);
    return response.data;
  },
};
