import { v4 as uuidv4 } from 'uuid';

const CORRELATION_ID_KEY = 'x_cid';

export const getOrCreateCorrelationId = (): string => {
  let correlationId = localStorage.getItem(CORRELATION_ID_KEY);
  if (!correlationId) {
    correlationId = uuidv4();
    localStorage.setItem(CORRELATION_ID_KEY, correlationId);
  }
  return correlationId;
};

export const createNewCorrelationId = (): string => {
  const correlationId = uuidv4();
  localStorage.setItem(CORRELATION_ID_KEY, correlationId);
  return correlationId;
};

export const clearCorrelationId = (): void => {
  localStorage.removeItem(CORRELATION_ID_KEY);
};
