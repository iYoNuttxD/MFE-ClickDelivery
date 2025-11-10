import httpClient from '@/shared/api/httpClient';
import { Restaurant, MenuItem } from '../model/types';
import { PaginatedResponse } from '@/shared/api/types';

export const restaurantApi = {
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
