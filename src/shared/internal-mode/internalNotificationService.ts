/**
 * Internal Notification Service
 * Mock notification operations for internal mode
 */

import { InternalStorage } from './storage';
import { v4 as uuidv4 } from 'uuid';
import type { Notification } from '@/entities/notification/model/types';

const notificationsStorage = new InternalStorage<Notification>('notifications');

const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 300));

export const internalNotificationService = {
  getNotifications: async (): Promise<Notification[]> => {
    await simulateDelay();
    
    // Get current user ID
    const userId = localStorage.getItem('internal_mode_user_id');
    if (!userId) return [];
    
    // Return notifications for current user
    return notificationsStorage.getAll()
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getNotificationById: async (id: string): Promise<Notification> => {
    await simulateDelay();
    
    const notification = notificationsStorage.get(id);
    if (!notification) {
      throw {
        error: 'NOT_FOUND',
        message: 'Notification not found',
        statusCode: 404,
        timestamp: new Date().toISOString(),
      };
    }
    
    return notification;
  },

  createNotification: async (data: Partial<Notification>): Promise<Notification> => {
    await simulateDelay();
    
    const notification: Notification = {
      id: uuidv4(),
      userId: data.userId || localStorage.getItem('internal_mode_user_id') || '',
      title: data.title || 'New Notification',
      message: data.message || '',
      type: data.type || 'info',
      read: false,
      createdAt: new Date().toISOString(),
      ...data,
    };
    
    notificationsStorage.set(notification.id, notification);
    
    return notification;
  },

  markAsRead: async (id: string): Promise<Notification> => {
    await simulateDelay();
    
    const updated = notificationsStorage.update(id, notification => ({
      ...notification,
      read: true,
    }));
    
    if (!updated) {
      throw {
        error: 'NOT_FOUND',
        message: 'Notification not found',
        statusCode: 404,
        timestamp: new Date().toISOString(),
      };
    }
    
    return updated;
  },

  deleteUserNotifications: async (userId: string): Promise<void> => {
    await simulateDelay();
    
    const userNotifications = notificationsStorage.getAll()
      .filter(n => n.userId === userId);
    
    userNotifications.forEach(n => notificationsStorage.delete(n.id));
  },

  // Helper methods for admin
  getAllNotifications: (): Notification[] => {
    return notificationsStorage.getAll();
  },

  deleteNotification: (id: string): boolean => {
    return notificationsStorage.delete(id);
  },
};
