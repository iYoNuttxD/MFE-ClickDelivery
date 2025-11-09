import httpClient from '@/shared/api/httpClient';
import { Restaurant, MenuItem } from '../model/types';
import { PaginatedResponse } from '@/shared/api/types';

export const restaurantApi = {
  getRestaurants: async (params?: {
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<Restaurant>> => {
    const response = await httpClient.get<PaginatedResponse<Restaurant>>('/restaurants', {
      params,
    });
    return response.data;
  },

  getRestaurantById: async (id: string): Promise<Restaurant> => {
    const response = await httpClient.get<Restaurant>(`/restaurants/${id}`);
    return response.data;
  },

  getMenuItems: async (restaurantId: string): Promise<MenuItem[]> => {
    const response = await httpClient.get<MenuItem[]>(`/restaurants/${restaurantId}/menu`);
    return response.data;
  },
};
