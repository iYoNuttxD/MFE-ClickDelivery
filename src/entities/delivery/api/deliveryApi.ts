import httpClient from '@/shared/api/httpClient';
import { config } from '@/shared/config/env';
import { internalDeliveryService } from '@/shared/internal-mode';
import { Delivery } from '../model/types';
import { PaginatedResponse } from '@/shared/api/types';

// Real BFF implementation
const realDeliveryApi = {
  getDeliveries: async (params?: {
    page?: number;
    pageSize?: number;
    status?: string;
  }): Promise<PaginatedResponse<Delivery>> => {
    const response = await httpClient.get<PaginatedResponse<Delivery>>('/deliveries/entregas', { params });
    return response.data;
  },

  getDeliveryById: async (id: string): Promise<Delivery> => {
    const response = await httpClient.get<Delivery>(`/deliveries/entregas/${id}`);
    return response.data;
  },

  updateDeliveryStatus: async (id: string, status: string): Promise<Delivery> => {
    const response = await httpClient.patch<Delivery>(`/deliveries/entregas/${id}/status`, { status });
    return response.data;
  },
};

// Wrapped API with conditional logic based on internal mode flag
export const deliveryApi = {
  getDeliveries: (params?: {
    page?: number;
    pageSize?: number;
    status?: string;
  }): Promise<PaginatedResponse<Delivery>> => {
    return config.useInternalMode
      ? internalDeliveryService.getDeliveries(params)
      : realDeliveryApi.getDeliveries(params);
  },

  getDeliveryById: (id: string): Promise<Delivery> => {
    return config.useInternalMode
      ? internalDeliveryService.getDeliveryById(id)
      : realDeliveryApi.getDeliveryById(id);
  },

  updateDeliveryStatus: (id: string, status: string): Promise<Delivery> => {
    return config.useInternalMode
      ? internalDeliveryService.updateDeliveryStatus(id, status)
      : realDeliveryApi.updateDeliveryStatus(id, status);
  },
};
