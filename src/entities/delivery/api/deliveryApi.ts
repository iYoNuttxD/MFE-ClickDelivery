import httpClient from '@/shared/api/httpClient';
import { Delivery } from '../model/types';
import { PaginatedResponse } from '@/shared/api/types';

export const deliveryApi = {
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
