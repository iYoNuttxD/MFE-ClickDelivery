import httpClient from '@/shared/api/httpClient';
import { Vehicle } from '../model/types';
import { PaginatedResponse } from '@/shared/api/types';

export const vehicleApi = {
  getVehicles: async (params?: {
    page?: number;
    pageSize?: number;
    status?: string;
  }): Promise<PaginatedResponse<Vehicle>> => {
    const response = await httpClient.get<PaginatedResponse<Vehicle>>('/vehicles', { params });
    return response.data;
  },

  getVehicleById: async (id: string): Promise<Vehicle> => {
    const response = await httpClient.get<Vehicle>(`/vehicles/${id}`);
    return response.data;
  },

  createVehicle: async (data: Partial<Vehicle>): Promise<Vehicle> => {
    const response = await httpClient.post<Vehicle>('/vehicles', data);
    return response.data;
  },

  updateVehicle: async (id: string, data: Partial<Vehicle>): Promise<Vehicle> => {
    const response = await httpClient.put<Vehicle>(`/vehicles/${id}`, data);
    return response.data;
  },
};
