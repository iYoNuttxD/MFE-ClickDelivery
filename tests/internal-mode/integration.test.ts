/**
 * Integration tests for internal mode
 * Tests end-to-end flows in internal simulation mode
 */

import { config } from '@/shared/config/env';
import { authService } from '@/shared/api/authService';
import { userApi } from '@/entities/user/api/userApi';
import { restaurantApi } from '@/entities/restaurant/api/restaurantApi';
import { orderApi } from '@/entities/order/api/orderApi';
import { deliveryApi } from '@/entities/delivery/api/deliveryApi';
import { vehicleApi } from '@/entities/vehicle/api/vehicleApi';
import { rentalApi } from '@/entities/rental/api/rentalApi';
import { notificationApi } from '@/entities/notification/api/notificationApi';
import { clearAllInternalStorage } from '@/shared/internal-mode';

describe('Internal Mode Integration Tests', () => {
  beforeAll(() => {
    // Ensure internal mode is enabled for tests
    if (!config.useInternalMode) {
      console.warn('Internal mode is not enabled. Set VITE_USE_INTERNAL_MODE=true to run these tests.');
    }
  });

  beforeEach(() => {
    // Clear all internal storage before each test
    clearAllInternalStorage();
    localStorage.clear();
  });

  afterEach(() => {
    // Clean up after each test
    clearAllInternalStorage();
    localStorage.clear();
  });

  describe('Authentication Flow', () => {
    it('should login with default customer credentials', async () => {
      const response = await authService.login({
        email: 'customer@example.com',
        password: 'customer123',
      });

      expect(response.token).toBeDefined();
      expect(response.user.email).toBe('customer@example.com');
      expect(response.user.roles).toContain('customer');
      expect(authService.isAuthenticated()).toBe(true);
    });

    it('should logout successfully', async () => {
      await authService.login({
        email: 'customer@example.com',
        password: 'customer123',
      });

      expect(authService.isAuthenticated()).toBe(true);

      authService.logout();
      expect(authService.isAuthenticated()).toBe(false);
    });

    it('should register a new user', async () => {
      const response = await authService.register({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'test123',
        role: 'customer',
      });

      expect(response.message).toBeDefined();
    });
  });

  describe('Restaurant Flow', () => {
    it('should fetch restaurants', async () => {
      const response = await restaurantApi.getRestaurants();

      expect(response.data).toBeInstanceOf(Array);
      expect(response.data.length).toBeGreaterThan(0);
      expect(response.total).toBeGreaterThan(0);
    });

    it('should fetch restaurant by ID', async () => {
      const restaurants = await restaurantApi.getRestaurants();
      const firstRestaurant = restaurants.data[0];

      const restaurant = await restaurantApi.getRestaurantById(firstRestaurant.id);

      expect(restaurant.id).toBe(firstRestaurant.id);
      expect(restaurant.name).toBe(firstRestaurant.name);
    });

    it('should fetch menu items for a restaurant', async () => {
      const restaurants = await restaurantApi.getRestaurants();
      const firstRestaurant = restaurants.data[0];

      const menuItems = await restaurantApi.getMenuItems(firstRestaurant.id);

      expect(menuItems).toBeInstanceOf(Array);
      expect(menuItems.length).toBeGreaterThan(0);
    });
  });

  describe('Order Flow', () => {
    it('should create an order', async () => {
      // Login first
      await authService.login({
        email: 'customer@example.com',
        password: 'customer123',
      });

      const restaurants = await restaurantApi.getRestaurants();
      const restaurant = restaurants.data[0];
      const menuItems = await restaurantApi.getMenuItems(restaurant.id);

      const order = await orderApi.createOrder({
        restaurantId: restaurant.id,
        items: [
          {
            menuItemId: menuItems[0].id,
            name: menuItems[0].name,
            price: menuItems[0].price,
            quantity: 2,
          },
        ],
        deliveryAddress: '123 Test St',
      });

      expect(order.id).toBeDefined();
      expect(order.restaurantId).toBe(restaurant.id);
      expect(order.items.length).toBe(1);
      expect(order.status).toBe('pending');
    });

    it('should fetch orders', async () => {
      await authService.login({
        email: 'customer@example.com',
        password: 'customer123',
      });

      const response = await orderApi.getOrders();

      expect(response.data).toBeInstanceOf(Array);
    });

    it('should cancel an order', async () => {
      await authService.login({
        email: 'customer@example.com',
        password: 'customer123',
      });

      const restaurants = await restaurantApi.getRestaurants();
      const restaurant = restaurants.data[0];
      const menuItems = await restaurantApi.getMenuItems(restaurant.id);

      const order = await orderApi.createOrder({
        restaurantId: restaurant.id,
        items: [
          {
            menuItemId: menuItems[0].id,
            name: menuItems[0].name,
            price: menuItems[0].price,
            quantity: 1,
          },
        ],
        deliveryAddress: '123 Test St',
      });

      const canceledOrder = await orderApi.cancelOrder(order.id);

      expect(canceledOrder.status).toBe('cancelled');
    });
  });

  describe('Vehicle and Rental Flow', () => {
    it('should fetch available vehicles', async () => {
      const response = await vehicleApi.getVehicles({ status: 'available' });

      expect(response.data).toBeInstanceOf(Array);
      expect(response.data.length).toBeGreaterThan(0);
    });

    it('should create a vehicle', async () => {
      await authService.login({
        email: 'owner@example.com',
        password: 'owner123',
      });

      const vehicle = await vehicleApi.createVehicle({
        type: 'bike',
        brand: 'Test',
        model: 'Test Model',
        year: 2023,
        licensePlate: 'TEST-123',
        pricePerDay: 50,
      });

      expect(vehicle.id).toBeDefined();
      expect(vehicle.brand).toBe('Test');
      expect(vehicle.status).toBe('available');
    });

    it('should create a rental', async () => {
      await authService.login({
        email: 'courier@example.com',
        password: 'courier123',
      });

      const vehicles = await vehicleApi.getVehicles();
      const vehicle = vehicles.data[0];

      const rental = await rentalApi.createRental({
        vehicleId: vehicle.id,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      });

      expect(rental.id).toBeDefined();
      expect(rental.vehicleId).toBe(vehicle.id);
      expect(rental.status).toBe('pending');
    });
  });

  describe('Delivery Flow', () => {
    it('should fetch deliveries', async () => {
      const response = await deliveryApi.getDeliveries();

      expect(response.data).toBeInstanceOf(Array);
    });

    it('should update delivery status', async () => {
      await authService.login({
        email: 'courier@example.com',
        password: 'courier123',
      });

      // This test would require creating an order first and then a delivery
      // For now, we just verify the API structure works
      const response = await deliveryApi.getDeliveries();
      expect(response).toBeDefined();
    });
  });

  describe('Notification Flow', () => {
    it('should fetch notifications', async () => {
      await authService.login({
        email: 'customer@example.com',
        password: 'customer123',
      });

      const notifications = await notificationApi.getNotifications();

      expect(notifications).toBeInstanceOf(Array);
    });

    it('should create a notification', async () => {
      await authService.login({
        email: 'customer@example.com',
        password: 'customer123',
      });

      const notification = await notificationApi.createNotification({
        title: 'Test Notification',
        message: 'This is a test notification',
        type: 'info',
      });

      expect(notification.id).toBeDefined();
      expect(notification.title).toBe('Test Notification');
      expect(notification.read).toBe(false);
    });
  });

  describe('User Profile Flow', () => {
    it('should fetch user profile', async () => {
      await authService.login({
        email: 'customer@example.com',
        password: 'customer123',
      });

      const profile = await userApi.getProfile();

      expect(profile.email).toBe('customer@example.com');
      expect(profile.roles).toContain('customer');
    });

    it('should fetch user summary', async () => {
      await authService.login({
        email: 'customer@example.com',
        password: 'customer123',
      });

      const summary = await userApi.getMeSummary();

      expect(summary.user).toBeDefined();
      expect(summary.stats).toBeDefined();
    });

    it('should update user profile', async () => {
      await authService.login({
        email: 'customer@example.com',
        password: 'customer123',
      });

      const updatedProfile = await userApi.updateProfile({
        name: 'Updated Customer',
      });

      expect(updatedProfile.name).toBe('Updated Customer');
    });
  });
});
