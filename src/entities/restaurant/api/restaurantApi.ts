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
};
