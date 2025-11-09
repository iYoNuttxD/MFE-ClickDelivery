import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from '@/app/guards/ProtectedRoute';
import * as useAuthModule from '@/shared/hooks/useAuth';

// Mock the useAuth hook
const mockUseAuth = jest.spyOn(useAuthModule, 'useAuth');

describe('AuthProvider - Integration with ProtectedRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should wait for loading to complete before redirecting', () => {
    mockUseAuth.mockReturnValue({
      loading: true,
      isLoading: true,
      isAuthenticated: false,
      user: null,
      getToken: jest.fn().mockResolvedValue(null),
      login: jest.fn().mockResolvedValue(undefined),
      loginWithRedirect: jest.fn().mockResolvedValue(undefined),
      logout: jest.fn(),
    });

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    );

    // Should show loading spinner while loading
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should render protected content when authenticated after loading', () => {
    mockUseAuth.mockReturnValue({
      loading: false,
      isLoading: false,
      isAuthenticated: true,
      user: {
        sub: 'auth0|123',
        email: 'test@example.com',
      },
      getToken: jest.fn().mockResolvedValue('test-token'),
      login: jest.fn().mockResolvedValue(undefined),
      loginWithRedirect: jest.fn().mockResolvedValue(undefined),
      logout: jest.fn(),
    });

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    );

    // Should show protected content after loading completes
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should redirect to login when not authenticated after loading', () => {
    mockUseAuth.mockReturnValue({
      loading: false,
      isLoading: false,
      isAuthenticated: false,
      user: null,
      getToken: jest.fn().mockResolvedValue(null),
      login: jest.fn().mockResolvedValue(undefined),
      loginWithRedirect: jest.fn().mockResolvedValue(undefined),
      logout: jest.fn(),
    });

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    );

    // Should not show protected content
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should handle transition from loading to authenticated', () => {
    const { rerender } = render(
      <BrowserRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    );

    // Initially loading
    mockUseAuth.mockReturnValue({
      loading: true,
      isLoading: true,
      isAuthenticated: false,
      user: null,
      getToken: jest.fn().mockResolvedValue(null),
      login: jest.fn().mockResolvedValue(undefined),
      loginWithRedirect: jest.fn().mockResolvedValue(undefined),
      logout: jest.fn(),
    });

    rerender(
      <BrowserRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(document.querySelector('.animate-spin')).toBeInTheDocument();

    // Then authenticated
    mockUseAuth.mockReturnValue({
      loading: false,
      isLoading: false,
      isAuthenticated: true,
      user: {
        sub: 'auth0|123',
        email: 'test@example.com',
      },
      getToken: jest.fn().mockResolvedValue('test-token'),
      login: jest.fn().mockResolvedValue(undefined),
      loginWithRedirect: jest.fn().mockResolvedValue(undefined),
      logout: jest.fn(),
    });

    rerender(
      <BrowserRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
