const getEnv = (key: string, defaultValue = ''): string => {
  // For tests
  if (typeof import.meta === 'undefined') {
    return process.env[key] || defaultValue;
  }
  // For browser
  return import.meta.env[key] || defaultValue;
};

const getWindowOrigin = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'http://localhost:3000';
};

export const config = {
  apiBaseUrl: getEnv('VITE_API_URL', 'https://cd-apim-gateway.azure-api.net/api/v1'),
  auth0: {
    domain: getEnv('VITE_AUTH0_DOMAIN'),
    clientId: getEnv('VITE_AUTH0_CLIENT_ID'),
    audience: getEnv('VITE_AUTH0_AUDIENCE', 'https://cd-apim-gateway.azure-api.net'),
    redirectUri: getEnv('VITE_AUTH0_REDIRECT_URI', getWindowOrigin()),
  },
  environment: getEnv('VITE_ENVIRONMENT', 'development'),
};
