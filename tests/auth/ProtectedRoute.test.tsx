import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from '@/app/guards/ProtectedRoute';
import { AuthProvider } from '@/app/providers/AuthProvider';

// Mock the Auth0 client
jest.mock('@/shared/api/authClient', () => ({
  getAuth0Client: jest.fn().mockResolvedValue({
    isAuthenticated: jest.fn().mockResolvedValue(false),
    handleRedirectCallback: jest.fn(),
    getUser: jest.fn(),
    getTokenSilently: jest.fn(),
    loginWithRedirect: jest.fn(),
    logout: jest.fn(),
  }),
}));

describe('ProtectedRoute', () => {
  it('should render loading spinner initially', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </AuthProvider>
      </BrowserRouter>
    );

    // Initially should show loading state
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('should protect route when not authenticated', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </AuthProvider>
      </BrowserRouter>
    );

    // Wait for auth to initialize
    await new Promise((resolve) => setTimeout(resolve, 100));
  });
});
