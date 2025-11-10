import httpClient from '@/shared/api/httpClient';
import { Vehicle } from '../model/types';
import { PaginatedResponse } from '@/shared/api/types';

export const vehicleApi = {
  getVehicles: async (params?: {
    page?: number;
    pageSize?: number;
    status?: string;
  }): Promise<PaginatedResponse<Vehicle>> => {
    const response = await httpClient.get<PaginatedResponse<Vehicle>>('/deliveries/veiculos', { params });
    return response.data;
  },

  getVehicleById: async (id: string): Promise<Vehicle> => {
    const response = await httpClient.get<Vehicle>(`/deliveries/veiculos/${id}`);
    return response.data;
  },

  createVehicle: async (data: Partial<Vehicle>): Promise<Vehicle> => {
    const response = await httpClient.post<Vehicle>('/deliveries/veiculos', data);
    return response.data;
  },

  updateVehicle: async (id: string, data: Partial<Vehicle>): Promise<Vehicle> => {
    const response = await httpClient.put<Vehicle>(`/deliveries/veiculos/${id}`, data);
    return response.data;
  },
};
