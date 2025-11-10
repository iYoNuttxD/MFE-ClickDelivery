import React from 'react';
import { ApiError } from '@/shared/api/types';

interface ApiErrorAlertProps {
  error: ApiError | Error | string | null;
  className?: string;
}

export const ApiErrorAlert: React.FC<ApiErrorAlertProps> = ({ error, className = '' }) => {
  if (!error) return null;

  const getMessage = (): string => {
    if (typeof error === 'string') return error;
    if ('message' in error) return error.message;
    return 'Um erro inesperado ocorreu';
  };

  const getCorrelationId = (): string | undefined => {
    if (typeof error === 'object' && error !== null && 'correlationId' in error) {
      return (error as ApiError).correlationId;
    }
    return undefined;
  };

  return (
    <div className={`alert alert-error ${className}`} role="alert">
      <div className="flex items-start">
        <svg
          className="w-5 h-5 mr-3 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
        <div className="flex-1">
          <p className="font-medium">{getMessage()}</p>
          {getCorrelationId() && (
            <p className="text-xs mt-1 opacity-75">
              ID de Rastreamento: {getCorrelationId()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
