import httpClient from '@/shared/api/httpClient';
import { config } from '@/shared/config/env';
import { internalUserService } from '@/shared/internal-mode';
import { MeSummary, UserProfile } from '../model/types';

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

// Real BFF implementation
const realUserApi = {
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

// Wrapped API with conditional logic based on internal mode flag
export const userApi = {
  getMeSummary: (): Promise<MeSummary> => {
    return config.useInternalMode
      ? internalUserService.getMeSummary()
      : realUserApi.getMeSummary();
  },

  getProfile: (): Promise<UserProfile> => {
    return config.useInternalMode
      ? internalUserService.getProfile()
      : realUserApi.getProfile();
  },

  updateProfile: (data: Partial<UserProfile>): Promise<UserProfile> => {
    return config.useInternalMode
      ? internalUserService.updateProfile(data)
      : realUserApi.updateProfile(data);
  },

  changePassword: (data: ChangePasswordDto): Promise<{ message: string }> => {
    return config.useInternalMode
      ? internalUserService.changePassword(data)
      : realUserApi.changePassword(data);
  },
};
