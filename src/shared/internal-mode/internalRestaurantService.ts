/**
 * Internal Restaurant Service
 * Mock restaurant and menu operations for internal mode
 */

import { InternalStorage } from './storage';
import { mockRestaurants, mockMenuItems, generateMockRestaurant, generateMockMenuItem } from './mockData';
import type { Restaurant, MenuItem } from '@/entities/restaurant/model/types';
import type { PaginatedResponse } from '@/shared/api/types';

const restaurantsStorage = new InternalStorage<Restaurant>('restaurants');
const menuItemsStorage = new InternalStorage<MenuItem>('menu_items');

// Initialize with default data
const initializeDefaultData = () => {
  if (restaurantsStorage.size() === 0) {
    mockRestaurants.forEach(restaurant => {
      restaurantsStorage.set(restaurant.id, restaurant);
    });
  }
  
  if (menuItemsStorage.size() === 0) {
    mockMenuItems.forEach(item => {
      menuItemsStorage.set(item.id, item);
    });
  }
};

// Initialize on module load
initializeDefaultData();

const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 300));

const paginateResults = <T>(
  items: T[],
  page: number = 1,
  pageSize: number = 10
): PaginatedResponse<T> => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedItems = items.slice(start, end);
  
  return {
    data: paginatedItems,
    total: items.length,
    page,
    pageSize,
    totalPages: Math.ceil(items.length / pageSize),
  };
};

export const internalRestaurantService = {
  // Restaurant operations
  getRestaurants: async (params?: {
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<Restaurant>> => {
    await simulateDelay();
    
    const allRestaurants = restaurantsStorage.getAll();
    return paginateResults(allRestaurants, params?.page, params?.pageSize);
  },

  getRestaurantById: async (id: string): Promise<Restaurant> => {
    await simulateDelay();
    
    const restaurant = restaurantsStorage.get(id);
    if (!restaurant) {
      throw {
        error: 'NOT_FOUND',
        message: 'Restaurant not found',
        statusCode: 404,
        timestamp: new Date().toISOString(),
      };
    }
    
    return restaurant;
  },

  createRestaurant: async (data: Partial<Restaurant>): Promise<Restaurant> => {
    await simulateDelay();
    
    const restaurant = generateMockRestaurant(data);
    restaurantsStorage.set(restaurant.id, restaurant);
    
    return restaurant;
  },

  updateRestaurant: async (id: string, data: Partial<Restaurant>): Promise<Restaurant> => {
    await simulateDelay();
    
    const updated = restaurantsStorage.update(id, restaurant => ({
      ...restaurant,
      ...data,
      id: restaurant.id, // Don't allow ID change
      updatedAt: new Date().toISOString(),
    }));
    
    if (!updated) {
      throw {
        error: 'NOT_FOUND',
        message: 'Restaurant not found',
        statusCode: 404,
        timestamp: new Date().toISOString(),
      };
    }
    
    return updated;
  },

  deleteRestaurant: async (id: string): Promise<void> => {
    await simulateDelay();
    
    const deleted = restaurantsStorage.delete(id);
    if (!deleted) {
      throw {
        error: 'NOT_FOUND',
        message: 'Restaurant not found',
        statusCode: 404,
        timestamp: new Date().toISOString(),
      };
    }
    
    // Also delete associated menu items
    const menuItems = menuItemsStorage.getAll().filter(item => item.restaurantId === id);
    menuItems.forEach(item => menuItemsStorage.delete(item.id));
  },

  // Menu item operations
  getMenuItems: async (restaurantId: string): Promise<MenuItem[]> => {
    await simulateDelay();
    
    return menuItemsStorage.getAll().filter(item => item.restaurantId === restaurantId);
  },

  getMenuItemById: async (id: string): Promise<MenuItem> => {
    await simulateDelay();
    
    const item = menuItemsStorage.get(id);
    if (!item) {
      throw {
        error: 'NOT_FOUND',
        message: 'Menu item not found',
        statusCode: 404,
        timestamp: new Date().toISOString(),
      };
    }
    
    return item;
  },

  createMenuItem: async (restaurantId: string, data: Partial<MenuItem>): Promise<MenuItem> => {
    await simulateDelay();
    
    const item = generateMockMenuItem(restaurantId, data);
    menuItemsStorage.set(item.id, item);
    
    return item;
  },

  updateMenuItem: async (id: string, data: Partial<MenuItem>): Promise<MenuItem> => {
    await simulateDelay();
    
    const updated = menuItemsStorage.update(id, item => ({
      ...item,
      ...data,
      id: item.id, // Don't allow ID change
      restaurantId: item.restaurantId, // Don't allow restaurant change
    }));
    
    if (!updated) {
      throw {
        error: 'NOT_FOUND',
        message: 'Menu item not found',
        statusCode: 404,
        timestamp: new Date().toISOString(),
      };
    }
    
    return updated;
  },

  deleteMenuItem: async (id: string): Promise<void> => {
    await simulateDelay();
    
    const deleted = menuItemsStorage.delete(id);
    if (!deleted) {
      throw {
        error: 'NOT_FOUND',
        message: 'Menu item not found',
        statusCode: 404,
        timestamp: new Date().toISOString(),
      };
    }
  },

  // Helper methods for admin
  getAllRestaurants: (): Restaurant[] => {
    return restaurantsStorage.getAll();
  },

  getAllMenuItems: (): MenuItem[] => {
    return menuItemsStorage.getAll();
  },
};
