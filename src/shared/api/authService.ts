import httpClient from './httpClient';

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken?: string;
  user: {
    id: string;
    email: string;
    name: string;
    roles: string[];
  };
}

export interface PasswordChangeDto {
  currentPassword: string;
  newPassword: string;
}

export const authService = {
  /**
   * Register a new user via BFF
   */
  register: async (data: RegisterDto): Promise<{ message: string }> => {
    const response = await httpClient.post<{ message: string }>('/users/register', data);
    return response.data;
  },

  /**
   * Login user via BFF and receive JWT token
   */
  login: async (credentials: LoginDto): Promise<LoginResponse> => {
    const response = await httpClient.post<LoginResponse>('/users/login', credentials);
    return response.data;
  },

  /**
   * Logout user (client-side token removal)
   */
  logout: (): void => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  },

  /**
   * Get current auth token
   */
  getToken: (): string | null => {
    return localStorage.getItem('auth_token');
  },

  /**
   * Set auth token
   */
  setToken: (token: string): void => {
    localStorage.setItem('auth_token', token);
  },

  /**
   * Set refresh token
   */
  setRefreshToken: (token: string): void => {
    localStorage.setItem('refresh_token', token);
  },

  /**
   * Check if user is authenticated (has valid token)
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('auth_token');
  },
};
