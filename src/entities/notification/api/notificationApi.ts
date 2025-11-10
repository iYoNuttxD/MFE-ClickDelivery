import httpClient from '@/shared/api/httpClient';
import { Notification } from '../model/types';

export const notificationApi = {
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
