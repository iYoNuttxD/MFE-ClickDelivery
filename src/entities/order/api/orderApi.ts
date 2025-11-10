import httpClient from '@/shared/api/httpClient';
import { Order, CreateOrderDto } from '../model/types';
import { PaginatedResponse } from '@/shared/api/types';

export const orderApi = {
  getOrders: async (params?: {
    page?: number;
    pageSize?: number;
    status?: string;
  }): Promise<PaginatedResponse<Order>> => {
    const response = await httpClient.get<PaginatedResponse<Order>>('/orders/pedidos', { params });
    return response.data;
  },

  getOrderById: async (id: string): Promise<Order> => {
    const response = await httpClient.get<Order>(`/orders/pedidos/${id}`);
    return response.data;
  },

  createOrder: async (data: CreateOrderDto): Promise<Order> => {
    const response = await httpClient.post<Order>('/orders/pedidos', data);
    return response.data;
  },

  cancelOrder: async (id: string): Promise<Order> => {
    const response = await httpClient.patch<Order>(`/orders/pedidos/${id}/cancelar`);
    return response.data;
  },
};
