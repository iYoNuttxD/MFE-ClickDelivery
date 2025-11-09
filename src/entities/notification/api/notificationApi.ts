import httpClient from '@/shared/api/httpClient';
import { Notification } from '../model/types';

export const notificationApi = {
  getNotifications: async (): Promise<Notification[]> => {
    const response = await httpClient.get<Notification[]>('/notifications');
    return response.data;
  },

  markAsRead: async (id: string): Promise<void> => {
    await httpClient.patch(`/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await httpClient.post('/notifications/read-all');
  },
};
