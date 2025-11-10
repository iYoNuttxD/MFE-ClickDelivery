import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { RoleGuard } from '@/app/guards/RoleGuard';
import * as useAuthModule from '@/shared/hooks/useAuth';

// Mock the useAuth hook
const mockUseAuth = jest.spyOn(useAuthModule, 'useAuth');

describe('RoleGuard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state when loading', () => {
    mockUseAuth.mockReturnValue({
      loading: true,
      isLoading: true,
      isAuthenticated: false,
      user: null,
      getToken: jest.fn(),
      login: jest.fn(),
      loginWithRedirect: jest.fn(),
      logout: jest.fn(),
    });
  
    render(
      <BrowserRouter>
        <RoleGuard roles={['admin']}>
          <div>Admin Content</div>
        </RoleGuard>
      </BrowserRouter>
    );
  
    expect(screen.getByText(/Carregando sessão/i)).toBeInTheDocument();
  });

  it('should redirect to login when not authenticated', () => {
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
        <RoleGuard roles={['admin']}>
          <div>Admin Content</div>
        </RoleGuard>
      </BrowserRouter>
    );

    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });

  it('should render content when user has required role', () => {
    mockUseAuth.mockReturnValue({
      loading: false,
      isLoading: false,
      isAuthenticated: true,
      user: {
        sub: 'auth0|123',
        email: 'admin@example.com',
        roles: ['admin'],
      },
      getToken: jest.fn().mockResolvedValue('token'),
      login: jest.fn().mockResolvedValue(undefined),
      loginWithRedirect: jest.fn().mockResolvedValue(undefined),
      logout: jest.fn(),
    });

    render(
      <BrowserRouter>
        <RoleGuard roles={['admin']}>
          <div>Admin Content</div>
        </RoleGuard>
      </BrowserRouter>
    );

    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });

  it('should redirect to home when user does not have required role', () => {
    mockUseAuth.mockReturnValue({
      loading: false,
      isLoading: false,
      isAuthenticated: true,
      user: {
        sub: 'auth0|123',
        email: 'user@example.com',
        roles: ['customer'],
      },
      getToken: jest.fn().mockResolvedValue('token'),
      login: jest.fn().mockResolvedValue(undefined),
      loginWithRedirect: jest.fn().mockResolvedValue(undefined),
      logout: jest.fn(),
    });

    render(
      <BrowserRouter>
        <RoleGuard roles={['admin']}>
          <div>Admin Content</div>
        </RoleGuard>
      </BrowserRouter>
    );

    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });

  it('should support custom namespace for roles', () => {
    mockUseAuth.mockReturnValue({
      loading: false,
      isLoading: false,
      isAuthenticated: true,
      user: {
        sub: 'auth0|123',
        email: 'user@example.com',
        'https://schemas.example.com/roles': ['restaurant'],
      },
      getToken: jest.fn().mockResolvedValue('token'),
      login: jest.fn().mockResolvedValue(undefined),
      loginWithRedirect: jest.fn().mockResolvedValue(undefined),
      logout: jest.fn(),
    });

    render(
      <BrowserRouter>
        <RoleGuard roles={['restaurant']}>
          <div>Restaurant Content</div>
        </RoleGuard>
      </BrowserRouter>
    );

    expect(screen.getByText('Restaurant Content')).toBeInTheDocument();
  });

  it('should handle multiple required roles', () => {
    mockUseAuth.mockReturnValue({
      loading: false,
      isLoading: false,
      isAuthenticated: true,
      user: {
        sub: 'auth0|123',
        email: 'user@example.com',
        roles: ['customer', 'courier'],
      },
      getToken: jest.fn().mockResolvedValue('token'),
      login: jest.fn().mockResolvedValue(undefined),
      loginWithRedirect: jest.fn().mockResolvedValue(undefined),
      logout: jest.fn(),
    });

    render(
      <BrowserRouter>
        <RoleGuard roles={['customer', 'admin']}>
          <div>Protected Content</div>
        </RoleGuard>
      </BrowserRouter>
    );

    // User has 'customer' role which is one of the required roles
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should redirect when user has no roles', () => {
    mockUseAuth.mockReturnValue({
      loading: false,
      isLoading: false,
      isAuthenticated: true,
      user: {
        sub: 'auth0|123',
        email: 'user@example.com',
      },
      getToken: jest.fn().mockResolvedValue('token'),
      login: jest.fn().mockResolvedValue(undefined),
      loginWithRedirect: jest.fn().mockResolvedValue(undefined),
      logout: jest.fn(),
    });

    render(
      <BrowserRouter>
        <RoleGuard roles={['admin']}>
          <div>Admin Content</div>
        </RoleGuard>
      </BrowserRouter>
    );

    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });
});
