import axios, { AxiosInstance, AxiosError } from 'axios';
import { config } from '@/shared/config/env';
import { getOrCreateCorrelationId } from '@/shared/utils/correlationId';
import { ApiError } from './types';

const httpClient: AxiosInstance = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: add Authorization and x-correlation-id headers
httpClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add correlation ID
    const correlationId = getOrCreateCorrelationId();
    config.headers['x-correlation-id'] = correlationId;

    // Log request in development mode
    if (import.meta.env.DEV) {
      console.log('[HTTP Request]', {
        method: config.method?.toUpperCase(),
        url: config.url,
        correlationId,
      });
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: handle errors uniformly
httpClient.interceptors.response.use(
  (response) => {
    // Log response in development mode
    if (import.meta.env.DEV) {
      console.log('[HTTP Response]', {
        status: response.status,
        url: response.config.url,
        correlationId: response.config.headers['x-correlation-id'],
      });
    }
    return response;
  },
  (error: AxiosError) => {
    const data = error.response?.data as ApiError | undefined;

    const apiError: ApiError = {
      error: data?.error || 'UNKNOWN_ERROR',
      message: data?.message || error.message || 'An error occurred',
      statusCode: data?.statusCode || error.response?.status || 500,
      correlationId: data?.correlationId,
      timestamp: data?.timestamp || new Date().toISOString(),
    };

    // Log error in development mode
    if (import.meta.env.DEV) {
      console.error('[HTTP Error]', {
        status: apiError.statusCode,
        url: error.config?.url,
        error: apiError.error,
        message: apiError.message,
        correlationId: apiError.correlationId,
      });
    }

    // Handle 401 Unauthorized - clear session and redirect to login
    if (apiError.statusCode === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      
      // Only redirect if not already on login/register pages
      if (typeof window !== 'undefined' && 
          !window.location.pathname.includes('/login') && 
          !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(apiError);
  }
);

export default httpClient;
