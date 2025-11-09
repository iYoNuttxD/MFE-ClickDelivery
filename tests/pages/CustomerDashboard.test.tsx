import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CustomerDashboardPage } from '@/pages/customer/CustomerDashboardPage';
import { userApi } from '@/entities/user/api/userApi';

jest.mock('@/entities/user/api/userApi');

describe('CustomerDashboardPage', () => {
  it('should render dashboard with summary data', async () => {
    const mockSummary = {
      user: {
        id: '1',
        email: 'customer@example.com',
        name: 'John Doe',
        roles: ['customer'],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
      stats: {
        totalOrders: 12,
        balance: 50,
      },
    };

    (userApi.getMeSummary as jest.Mock).mockResolvedValue(mockSummary);

    render(
      <BrowserRouter>
        <CustomerDashboardPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Dashboard do Cliente')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('12')).toBeInTheDocument();
      expect(screen.getByText('R$ 50.00')).toBeInTheDocument();
    });
  });

  it('should handle API errors gracefully', async () => {
    (userApi.getMeSummary as jest.Mock).mockRejectedValue(new Error('API Error'));

    render(
      <BrowserRouter>
        <CustomerDashboardPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Dashboard do Cliente')).toBeInTheDocument();
    });
  });
});
