import { ApiError } from './types';

export class AppError extends Error {
  public statusCode: number;
  public error: string;
  public correlationId?: string;
  public timestamp: string;

  constructor(apiError: ApiError) {
    super(apiError.message);
    this.name = 'AppError';
    this.error = apiError.error;
    this.statusCode = apiError.statusCode;
    this.correlationId = apiError.correlationId;
    this.timestamp = apiError.timestamp;
  }
}

export const createErrorFromResponse = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const err = error as any;
  
  return new AppError({
    error: err.error || 'UNKNOWN_ERROR',
    message: err.message || 'An unknown error occurred',
    statusCode: err.statusCode || 500,
    correlationId: err.correlationId,
    timestamp: err.timestamp || new Date().toISOString(),
  });
};
