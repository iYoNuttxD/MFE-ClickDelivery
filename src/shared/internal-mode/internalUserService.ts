/**
 * Internal User Service
 * Mock user operations for internal mode
 */

import { internalAuthService } from './internalAuthService';
import type { MeSummary, UserProfile } from '@/entities/user/model/types';
import type { ChangePasswordDto } from '@/entities/user/api/userApi';

const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 300));

export const internalUserService = {
  getMeSummary: async (): Promise<MeSummary> => {
    await simulateDelay();
    
    const user = internalAuthService.getCurrentUser();
    if (!user) {
      throw {
        error: 'UNAUTHORIZED',
        message: 'User not authenticated',
        statusCode: 401,
        timestamp: new Date().toISOString(),
      };
    }
    
    return {
      user,
      stats: {
        totalOrders: 0,
        totalDeliveries: 0,
        totalRentals: 0,
        balance: 0,
      },
    };
  },

  getProfile: async (): Promise<UserProfile> => {
    await simulateDelay();
    
    const user = internalAuthService.getCurrentUser();
    if (!user) {
      throw {
        error: 'UNAUTHORIZED',
        message: 'User not authenticated',
        statusCode: 401,
        timestamp: new Date().toISOString(),
      };
    }
    
    return {
      ...user,
      address: {
        street: '123 Main St',
        city: 'City',
        state: 'State',
        zipCode: '12345',
      },
      preferences: {
        language: 'en',
        notifications: true,
      },
    };
  },

  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    await simulateDelay();
    
    const user = internalAuthService.getCurrentUser();
    if (!user) {
      throw {
        error: 'UNAUTHORIZED',
        message: 'User not authenticated',
        statusCode: 401,
        timestamp: new Date().toISOString(),
      };
    }
    
    const updated = internalAuthService.updateUser(user.id, data);
    if (!updated) {
      throw {
        error: 'UPDATE_FAILED',
        message: 'Failed to update profile',
        statusCode: 500,
        timestamp: new Date().toISOString(),
      };
    }
    
    return {
      ...updated,
      address: data.address || {
        street: '123 Main St',
        city: 'City',
        state: 'State',
        zipCode: '12345',
      },
      preferences: data.preferences || {
        language: 'en',
        notifications: true,
      },
    };
  },

  changePassword: async (_data: ChangePasswordDto): Promise<{ message: string }> => {
    await simulateDelay();
    
    // In internal mode, just simulate success
    // In a real implementation, you'd validate the current password
    return { message: 'Password changed successfully' };
  },
};
