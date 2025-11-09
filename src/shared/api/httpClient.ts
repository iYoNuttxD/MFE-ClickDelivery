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

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: handle errors uniformly
httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const data = error.response?.data as ApiError | undefined;

    const apiError: ApiError = {
      error: data?.error || 'UNKNOWN_ERROR',
      message: data?.message || error.message || 'An error occurred',
      statusCode: data?.statusCode || error.response?.status || 500,
      correlationId: data?.correlationId,
      timestamp: data?.timestamp || new Date().toISOString(),
    };

    return Promise.reject(apiError);
  }
);

export default httpClient;
