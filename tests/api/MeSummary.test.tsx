import httpClient from '@/shared/api/httpClient';
import { userApi } from '@/entities/user/api/userApi';

jest.mock('@/shared/api/httpClient');

describe('User API', () => {
  it('should fetch me summary', async () => {
    const mockSummary = {
      user: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        roles: ['customer'],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
      stats: {
        totalOrders: 5,
        balance: 100,
      },
    };

    (httpClient.get as jest.Mock).mockResolvedValue({ data: mockSummary });

    const result = await userApi.getMeSummary();

    expect(httpClient.get).toHaveBeenCalledWith('/me/summary');
    expect(result).toEqual(mockSummary);
  });

  it('should fetch user profile', async () => {
    const mockProfile = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      roles: ['customer'],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    };

    (httpClient.get as jest.Mock).mockResolvedValue({ data: mockProfile });

    const result = await userApi.getProfile();

    expect(httpClient.get).toHaveBeenCalledWith('/users/me');
    expect(result).toEqual(mockProfile);
  });
});
