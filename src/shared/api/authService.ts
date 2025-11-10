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
  
    // Ajuste conforme o formato REAL da resposta do BFF/User Service
    const data = response.data;
  
    const token =
      (data as any)?.token ??
      (data as any)?.data?.token ?? // se o BFF embrulhar em { data: { token, ... } }
      null;
  
    if (!token || typeof token !== "string" || !token.includes(".")) {
      console.error("Login response does not contain a valid JWT token", data);
      throw new Error("Invalid login response: missing token");
    }
  
    // Salva somente o JWT puro
    localStorage.setItem("auth_token", token);
  
    if ((data as any)?.refreshToken) {
      localStorage.setItem("refresh_token", (data as any).refreshToken);
    }
  
    return data;
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
