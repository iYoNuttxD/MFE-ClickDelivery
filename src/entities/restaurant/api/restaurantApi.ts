import httpClient from '@/shared/api/httpClient';
import { config } from '@/shared/config/env';
import { internalRestaurantService } from '@/shared/internal-mode';
import { Restaurant, MenuItem } from '../model/types';
import { PaginatedResponse } from '@/shared/api/types';

// Real BFF implementation
const realRestaurantApi = {
  getRestaurants: async (params?: {
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<Restaurant>> => {
    const response = await httpClient.get<PaginatedResponse<Restaurant>>('/orders/restaurantes', {
      params,
    });
    return response.data;
  },

  getRestaurantById: async (id: string): Promise<Restaurant> => {
    const response = await httpClient.get<Restaurant>(`/orders/restaurantes/${id}`);
    return response.data;
  },

  getMenuItems: async (restaurantId: string): Promise<MenuItem[]> => {
    const response = await httpClient.get<MenuItem[]>(`/orders/cardapios/restaurante/${restaurantId}`);
    return response.data;
  },

  createMenuItem: async (restaurantId: string, data: Partial<MenuItem>): Promise<MenuItem> => {
    const response = await httpClient.post<MenuItem>(`/orders/cardapios`, { ...data, restaurantId });
    return response.data;
  },

  updateMenuItem: async (id: string, data: Partial<MenuItem>): Promise<MenuItem> => {
    const response = await httpClient.put<MenuItem>(`/orders/cardapios/${id}`, data);
    return response.data;
  },

  deleteMenuItem: async (id: string): Promise<void> => {
    await httpClient.delete(`/orders/cardapios/${id}`);
  },
};

// Wrapped API with conditional logic based on internal mode flag
export const restaurantApi = {
  getRestaurants: (params?: {
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<Restaurant>> => {
    return config.useInternalMode
      ? internalRestaurantService.getRestaurants(params)
      : realRestaurantApi.getRestaurants(params);
  },

  getRestaurantById: (id: string): Promise<Restaurant> => {
    return config.useInternalMode
      ? internalRestaurantService.getRestaurantById(id)
      : realRestaurantApi.getRestaurantById(id);
  },

  getMenuItems: (restaurantId: string): Promise<MenuItem[]> => {
    return config.useInternalMode
      ? internalRestaurantService.getMenuItems(restaurantId)
      : realRestaurantApi.getMenuItems(restaurantId);
  },

  createMenuItem: (restaurantId: string, data: Partial<MenuItem>): Promise<MenuItem> => {
    return config.useInternalMode
      ? internalRestaurantService.createMenuItem(restaurantId, data)
      : realRestaurantApi.createMenuItem(restaurantId, data);
  },

  updateMenuItem: (id: string, data: Partial<MenuItem>): Promise<MenuItem> => {
    return config.useInternalMode
      ? internalRestaurantService.updateMenuItem(id, data)
      : realRestaurantApi.updateMenuItem(id, data);
  },

  deleteMenuItem: (id: string): Promise<void> => {
    return config.useInternalMode
      ? internalRestaurantService.deleteMenuItem(id)
      : realRestaurantApi.deleteMenuItem(id);
  },
};
