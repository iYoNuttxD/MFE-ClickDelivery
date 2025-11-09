import httpClient from '@/shared/api/httpClient';
import { MeSummary, UserProfile } from '../model/types';

export const userApi = {
  getMeSummary: async (): Promise<MeSummary> => {
    const response = await httpClient.get<MeSummary>('/me/summary');
    return response.data;
  },

  getProfile: async (): Promise<UserProfile> => {
    const response = await httpClient.get<UserProfile>('/me/profile');
    return response.data;
  },

  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await httpClient.put<UserProfile>('/me/profile', data);
    return response.data;
  },
};
