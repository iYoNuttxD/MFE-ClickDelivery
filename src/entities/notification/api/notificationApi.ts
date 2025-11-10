import httpClient from '@/shared/api/httpClient';
import { config } from '@/shared/config/env';
import { internalNotificationService } from '@/shared/internal-mode';
import { Notification } from '../model/types';

// Real BFF implementation
const realNotificationApi = {
  getNotifications: async (): Promise<Notification[]> => {
    const response = await httpClient.get<Notification[]>('/notifications/notifications');
    return response.data;
  },

  getNotificationById: async (id: string): Promise<Notification> => {
    const response = await httpClient.get<Notification>(`/notifications/notifications/${id}`);
    return response.data;
  },

  createNotification: async (data: Partial<Notification>): Promise<Notification> => {
    const response = await httpClient.post<Notification>('/notifications/notifications', data);
    return response.data;
  },

  deleteUserNotifications: async (userId: string): Promise<void> => {
    await httpClient.delete(`/notifications/notifications/user/${userId}`);
  },
};

// Wrapped API with conditional logic based on internal mode flag
export const notificationApi = {
  getNotifications: (): Promise<Notification[]> => {
    return config.useInternalMode
      ? internalNotificationService.getNotifications()
      : realNotificationApi.getNotifications();
  },

  getNotificationById: (id: string): Promise<Notification> => {
    return config.useInternalMode
      ? internalNotificationService.getNotificationById(id)
      : realNotificationApi.getNotificationById(id);
  },

  createNotification: (data: Partial<Notification>): Promise<Notification> => {
    return config.useInternalMode
      ? internalNotificationService.createNotification(data)
      : realNotificationApi.createNotification(data);
  },

  deleteUserNotifications: (userId: string): Promise<void> => {
    return config.useInternalMode
      ? internalNotificationService.deleteUserNotifications(userId)
      : realNotificationApi.deleteUserNotifications(userId);
  },
};
