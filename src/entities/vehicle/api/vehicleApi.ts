import httpClient from '@/shared/api/httpClient';
import { config } from '@/shared/config/env';
import { internalVehicleService } from '@/shared/internal-mode';
import { Vehicle } from '../model/types';
import { PaginatedResponse } from '@/shared/api/types';

// Real BFF implementation
const realVehicleApi = {
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

  deleteVehicle: async (id: string): Promise<void> => {
    await httpClient.delete(`/deliveries/veiculos/${id}`);
  },
};

// Wrapped API with conditional logic based on internal mode flag
export const vehicleApi = {
  getVehicles: (params?: {
    page?: number;
    pageSize?: number;
    status?: string;
  }): Promise<PaginatedResponse<Vehicle>> => {
    return config.useInternalMode
      ? internalVehicleService.getVehicles(params)
      : realVehicleApi.getVehicles(params);
  },

  getVehicleById: (id: string): Promise<Vehicle> => {
    return config.useInternalMode
      ? internalVehicleService.getVehicleById(id)
      : realVehicleApi.getVehicleById(id);
  },

  createVehicle: (data: Partial<Vehicle>): Promise<Vehicle> => {
    return config.useInternalMode
      ? internalVehicleService.createVehicle(data)
      : realVehicleApi.createVehicle(data);
  },

  updateVehicle: (id: string, data: Partial<Vehicle>): Promise<Vehicle> => {
    return config.useInternalMode
      ? internalVehicleService.updateVehicle(id, data)
      : realVehicleApi.updateVehicle(id, data);
  },

  deleteVehicle: (id: string): Promise<void> => {
    return config.useInternalMode
      ? internalVehicleService.deleteVehicle(id)
      : realVehicleApi.deleteVehicle(id);
  },
};
