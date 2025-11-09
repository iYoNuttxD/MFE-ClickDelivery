import { useState, useCallback } from 'react';
import { ApiError } from '@/shared/api/types';
import { createErrorFromResponse } from '@/shared/api/error';

export const useApiError = () => {
  const [error, setError] = useState<ApiError | null>(null);
  const [isError, setIsError] = useState(false);

  const handleError = useCallback((err: unknown) => {
    const appError = createErrorFromResponse(err);
    setError({
      error: appError.error,
      message: appError.message,
      statusCode: appError.statusCode,
      correlationId: appError.correlationId,
      timestamp: appError.timestamp,
    });
    setIsError(true);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    setIsError(false);
  }, []);

  return { error, isError, handleError, clearError };
};
