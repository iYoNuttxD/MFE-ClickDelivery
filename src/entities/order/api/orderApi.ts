import httpClient from '@/shared/api/httpClient';
import { config } from '@/shared/config/env';
import { internalOrderService } from '@/shared/internal-mode';
import { Order, CreateOrderDto } from '../model/types';
import { PaginatedResponse } from '@/shared/api/types';

// Real BFF implementation
const realOrderApi = {
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

// Wrapped API with conditional logic based on internal mode flag
export const orderApi = {
  getOrders: (params?: {
    page?: number;
    pageSize?: number;
    status?: string;
  }): Promise<PaginatedResponse<Order>> => {
    return config.useInternalMode
      ? internalOrderService.getOrders(params)
      : realOrderApi.getOrders(params);
  },

  getOrderById: (id: string): Promise<Order> => {
    return config.useInternalMode
      ? internalOrderService.getOrderById(id)
      : realOrderApi.getOrderById(id);
  },

  createOrder: (data: CreateOrderDto): Promise<Order> => {
    return config.useInternalMode
      ? internalOrderService.createOrder(data)
      : realOrderApi.createOrder(data);
  },

  cancelOrder: (id: string): Promise<Order> => {
    return config.useInternalMode
      ? internalOrderService.cancelOrder(id)
      : realOrderApi.cancelOrder(id);
  },
};
