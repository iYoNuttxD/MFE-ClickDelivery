/**
 * Mock data generators for internal mode
 * Provides realistic default data for testing
 */

import { v4 as uuidv4 } from 'uuid';
import type { Restaurant, MenuItem } from '@/entities/restaurant/model/types';
import type { Order, OrderItem, OrderStatus } from '@/entities/order/model/types';
import type { Delivery, DeliveryStatus } from '@/entities/delivery/model/types';
import type { Vehicle, VehicleType, VehicleStatus } from '@/entities/vehicle/model/types';
import type { Rental, RentalStatus } from '@/entities/rental/model/types';
import type { User } from '@/entities/user/model/types';

export const mockRestaurants: Restaurant[] = [
  {
    id: 'rest-1',
    name: 'Italian Bistro',
    description: 'Authentic Italian cuisine',
    cuisine: 'Italian',
    address: '123 Main St, City',
    phone: '555-0101',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
    isOpen: true,
    deliveryTime: '30-45 min',
    deliveryFee: 5.99,
  },
  {
    id: 'rest-2',
    name: 'Sushi Paradise',
    description: 'Fresh sushi and Japanese dishes',
    cuisine: 'Japanese',
    address: '456 Oak Ave, City',
    phone: '555-0102',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351',
    isOpen: true,
    deliveryTime: '25-35 min',
    deliveryFee: 4.99,
  },
  {
    id: 'rest-3',
    name: 'Burger House',
    description: 'Gourmet burgers and fries',
    cuisine: 'American',
    address: '789 Pine Rd, City',
    phone: '555-0103',
    rating: 4.2,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
    isOpen: true,
    deliveryTime: '20-30 min',
    deliveryFee: 3.99,
  },
];

export const mockMenuItems: MenuItem[] = [
  // Italian Bistro
  {
    id: 'menu-1',
    restaurantId: 'rest-1',
    name: 'Margherita Pizza',
    description: 'Classic tomato and mozzarella',
    price: 12.99,
    category: 'Pizza',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38',
    available: true,
  },
  {
    id: 'menu-2',
    restaurantId: 'rest-1',
    name: 'Pasta Carbonara',
    description: 'Creamy pasta with bacon',
    price: 14.99,
    category: 'Pasta',
    available: true,
  },
  // Sushi Paradise
  {
    id: 'menu-3',
    restaurantId: 'rest-2',
    name: 'California Roll',
    description: '8 pieces of California roll',
    price: 8.99,
    category: 'Sushi',
    imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351',
    available: true,
  },
  {
    id: 'menu-4',
    restaurantId: 'rest-2',
    name: 'Salmon Sashimi',
    description: 'Fresh salmon sashimi',
    price: 15.99,
    category: 'Sashimi',
    available: true,
  },
  // Burger House
  {
    id: 'menu-5',
    restaurantId: 'rest-3',
    name: 'Classic Burger',
    description: 'Beef patty with lettuce and tomato',
    price: 9.99,
    category: 'Burgers',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
    available: true,
  },
  {
    id: 'menu-6',
    restaurantId: 'rest-3',
    name: 'French Fries',
    description: 'Crispy golden fries',
    price: 3.99,
    category: 'Sides',
    available: true,
  },
];

export const generateMockUser = (overrides?: Partial<User>): User => ({
  id: uuidv4(),
  email: `user${Date.now()}@example.com`,
  name: 'Mock User',
  phone: '555-0100',
  roles: ['customer'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

export const generateMockRestaurant = (overrides?: Partial<Restaurant>): Restaurant => ({
  id: uuidv4(),
  name: 'New Restaurant',
  description: 'A new restaurant',
  cuisine: 'International',
  address: '123 Test St',
  phone: '555-0100',
  rating: 4.0,
  isOpen: true,
  deliveryTime: '30-45 min',
  deliveryFee: 4.99,
  ...overrides,
});

export const generateMockMenuItem = (restaurantId: string, overrides?: Partial<MenuItem>): MenuItem => ({
  id: uuidv4(),
  restaurantId,
  name: 'New Menu Item',
  description: 'Delicious dish',
  price: 10.99,
  category: 'Main',
  available: true,
  ...overrides,
});

export const generateMockOrder = (
  customerId: string,
  restaurantId: string,
  items: OrderItem[],
  overrides?: Partial<Order>
): Order => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 4.99;
  
  return {
    id: uuidv4(),
    customerId,
    restaurantId,
    restaurantName: 'Mock Restaurant',
    items,
    status: 'pending' as OrderStatus,
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
    deliveryAddress: '123 Test Address',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    estimatedDeliveryTime: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
    ...overrides,
  };
};

export const generateMockDelivery = (orderId: string, courierId: string, overrides?: Partial<Delivery>): Delivery => ({
  id: uuidv4(),
  orderId,
  courierId,
  status: 'assigned' as DeliveryStatus,
  pickupAddress: '123 Restaurant St',
  deliveryAddress: '456 Customer Ave',
  distance: 5.2,
  earnings: 8.5,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

export const generateMockVehicle = (ownerId: string, overrides?: Partial<Vehicle>): Vehicle => ({
  id: uuidv4(),
  ownerId,
  type: 'bike' as VehicleType,
  brand: 'Honda',
  model: 'CG 160',
  year: 2023,
  licensePlate: 'ABC-1234',
  status: 'available' as VehicleStatus,
  pricePerDay: 50.0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

export const generateMockRental = (
  vehicleId: string,
  courierId: string,
  overrides?: Partial<Rental>
): Rental => {
  const startDate = new Date().toISOString();
  const endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const totalDays = 7;
  const pricePerDay = 50.0;
  
  return {
    id: uuidv4(),
    vehicleId,
    courierId,
    status: 'pending' as RentalStatus,
    startDate,
    endDate,
    totalDays,
    pricePerDay,
    totalPrice: totalDays * pricePerDay,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
};
