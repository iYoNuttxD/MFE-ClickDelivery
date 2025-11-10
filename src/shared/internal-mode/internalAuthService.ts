/**
 * Internal Authentication Service
 * Mock authentication for internal mode
 */

import { v4 as uuidv4 } from 'uuid';
import { InternalStorage } from './storage';
import type { User } from '@/entities/user/model/types';
import type { LoginDto, LoginResponse, RegisterDto } from '@/shared/api/authService';

interface StoredUser extends User {
  password: string;
}

const usersStorage = new InternalStorage<StoredUser>('users');

// Initialize with default admin user
const initializeDefaultUsers = () => {
  if (usersStorage.size() === 0) {
    const adminUser: StoredUser = {
      id: 'admin-1',
      email: 'admin@clickdelivery.com',
      name: 'Admin User',
      phone: '555-0000',
      roles: ['admin'],
      password: 'admin123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const customerUser: StoredUser = {
      id: 'customer-1',
      email: 'customer@example.com',
      name: 'Test Customer',
      phone: '555-0001',
      roles: ['customer'],
      password: 'customer123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const restaurantUser: StoredUser = {
      id: 'restaurant-1',
      email: 'restaurant@example.com',
      name: 'Test Restaurant',
      phone: '555-0002',
      roles: ['restaurant'],
      password: 'restaurant123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const courierUser: StoredUser = {
      id: 'courier-1',
      email: 'courier@example.com',
      name: 'Test Courier',
      phone: '555-0003',
      roles: ['courier'],
      password: 'courier123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const ownerUser: StoredUser = {
      id: 'owner-1',
      email: 'owner@example.com',
      name: 'Test Owner',
      phone: '555-0004',
      roles: ['owner'],
      password: 'owner123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    usersStorage.set(adminUser.id, adminUser);
    usersStorage.set(customerUser.id, customerUser);
    usersStorage.set(restaurantUser.id, restaurantUser);
    usersStorage.set(courierUser.id, courierUser);
    usersStorage.set(ownerUser.id, ownerUser);
  }
};

// Initialize on module load
initializeDefaultUsers();

// Simple JWT generation (not secure, only for mock purposes)
const generateMockToken = (user: User): string => {
  const payload = {
    sub: user.id,
    email: user.email,
    roles: user.roles,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
  };
  
  // Simple base64 encoding (not real JWT)
  return `mock.${btoa(JSON.stringify(payload))}.signature`;
};

export const internalAuthService = {
  register: async (data: RegisterDto): Promise<{ message: string }> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if user already exists
    const existingUser = usersStorage.getAll().find(u => u.email === data.email);
    if (existingUser) {
      throw {
        error: 'USER_EXISTS',
        message: 'User with this email already exists',
        statusCode: 400,
        timestamp: new Date().toISOString(),
      };
    }
    
    // Create new user
    const newUser: StoredUser = {
      id: uuidv4(),
      email: data.email,
      name: `${data.firstName} ${data.lastName}`,
      phone: '',
      roles: data.role ? [data.role] : ['customer'],
      password: data.password,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    usersStorage.set(newUser.id, newUser);
    
    return { message: 'User registered successfully' };
  },

  login: async (credentials: LoginDto): Promise<LoginResponse> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = usersStorage.getAll().find(
      u => u.email === credentials.email && u.password === credentials.password
    );
    
    if (!user) {
      throw {
        error: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password',
        statusCode: 401,
        timestamp: new Date().toISOString(),
      };
    }
    
    const token = generateMockToken(user);
    
    // Store token
    localStorage.setItem('auth_token', token);
    localStorage.setItem('internal_mode_user_id', user.id);
    
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles,
      },
    };
  },

  logout: (): void => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('internal_mode_user_id');
  },

  getToken: (): string | null => {
    return localStorage.getItem('auth_token');
  },

  setToken: (token: string): void => {
    localStorage.setItem('auth_token', token);
  },

  setRefreshToken: (token: string): void => {
    localStorage.setItem('refresh_token', token);
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('auth_token');
  },

  getCurrentUser: (): User | null => {
    const userId = localStorage.getItem('internal_mode_user_id');
    if (!userId) return null;
    
    const storedUser = usersStorage.get(userId);
    if (!storedUser) return null;
    
    const { password, ...user } = storedUser;
    return user;
  },

  getAllUsers: (): User[] => {
    return usersStorage.getAll().map(({ password, ...user }) => user);
  },

  getUserById: (id: string): User | null => {
    const storedUser = usersStorage.get(id);
    if (!storedUser) return null;
    
    const { password, ...user } = storedUser;
    return user;
  },

  createUser: (data: RegisterDto & { roles?: string[] }): User => {
    const newUser: StoredUser = {
      id: uuidv4(),
      email: data.email,
      name: `${data.firstName} ${data.lastName}`,
      phone: '',
      roles: data.roles || ['customer'],
      password: data.password,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    usersStorage.set(newUser.id, newUser);
    
    const { password, ...user } = newUser;
    return user;
  },

  updateUser: (id: string, data: Partial<User>): User | null => {
    const updated = usersStorage.update(id, user => ({
      ...user,
      ...data,
      id: user.id, // Don't allow ID change
      password: user.password, // Keep password
      updatedAt: new Date().toISOString(),
    }));
    
    if (!updated) return null;
    
    const { password, ...user } = updated;
    return user;
  },

  deleteUser: (id: string): boolean => {
    return usersStorage.delete(id);
  },
};
