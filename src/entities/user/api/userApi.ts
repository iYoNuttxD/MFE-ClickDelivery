import httpClient from '@/shared/api/httpClient';
import { MeSummary, UserProfile } from '../model/types';

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export const userApi = {
  getMeSummary: async (): Promise<MeSummary> => {
    const response = await httpClient.get<MeSummary>('/me/summary');
    return response.data;
  },

  getProfile: async (): Promise<UserProfile> => {
    const response = await httpClient.get<UserProfile>('/users/me');
    return response.data;
  },

  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await httpClient.put<UserProfile>('/users/me', data);
    return response.data;
  },

  changePassword: async (data: ChangePasswordDto): Promise<{ message: string }> => {
    const response = await httpClient.put<{ message: string }>('/users/me/password', data);
    return response.data;
  },
};
