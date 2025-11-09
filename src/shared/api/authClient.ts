import { Auth0Client, createAuth0Client } from '@auth0/auth0-spa-js';
import { config } from '@/shared/config/env';

let auth0Client: Auth0Client | null = null;

export const getAuth0Client = async (): Promise<Auth0Client> => {
  if (!auth0Client) {
    auth0Client = await createAuth0Client({
      domain: config.auth0.domain,
      clientId: config.auth0.clientId,
      authorizationParams: {
        redirect_uri: config.auth0.redirectUri,
        audience: config.auth0.audience,
      },
      cacheLocation: 'localstorage',
      useRefreshTokens: true,
    });
  }
  return auth0Client;
};
