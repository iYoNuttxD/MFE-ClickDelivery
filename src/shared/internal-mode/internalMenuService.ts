/**
 * Internal Menu Service
 * Mock menu operations for internal mode
 * This is an alias/wrapper for menu-related operations in internalRestaurantService
 */

import { internalRestaurantService } from './internalRestaurantService';

/**
 * Menu service provides operations for managing menu items
 * This is a convenience export that wraps the menu operations from internalRestaurantService
 */
export const internalMenuService = {
  /**
   * Get all menu items for a specific restaurant
   */
  getMenuItems: internalRestaurantService.getMenuItems,

  /**
   * Get a single menu item by ID
   */
  getMenuItemById: internalRestaurantService.getMenuItemById,

  /**
   * Create a new menu item for a restaurant
   */
  createMenuItem: internalRestaurantService.createMenuItem,

  /**
   * Update an existing menu item
   */
  updateMenuItem: internalRestaurantService.updateMenuItem,

  /**
   * Delete a menu item
   */
  deleteMenuItem: internalRestaurantService.deleteMenuItem,

  /**
   * Get all menu items across all restaurants (admin)
   */
  getAllMenuItems: internalRestaurantService.getAllMenuItems,
};
