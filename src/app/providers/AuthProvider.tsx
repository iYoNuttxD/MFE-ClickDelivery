/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useEffect, useState, useCallback } from 'react';
import { Auth0Client } from '@auth0/auth0-spa-js';
import { getAuth0Client } from '@/shared/api/authClient';
import { getRolesFromToken } from '@/shared/utils/jwt';

export interface AuthUser {
  sub: string;
  email?: string;
  name?: string;
  picture?: string;
  roles: string[];
}

export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  token: string | null;
  loginWithRedirect: () => Promise<void>;
  logout: () => void;
  getAccessToken: () => Promise<string>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [auth0Client, setAuth0Client] = useState<Auth0Client | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const client = await getAuth0Client();
        setAuth0Client(client);

        // Handle redirect callback
        if (window.location.search.includes('code=') && window.location.search.includes('state=')) {
          await client.handleRedirectCallback();
          window.history.replaceState({}, document.title, window.location.pathname);
        }

        const authenticated = await client.isAuthenticated();
        setIsAuthenticated(authenticated);

        if (authenticated) {
          const auth0User = await client.getUser();
          const accessToken = await client.getTokenSilently();
          
          // Store token in localStorage for httpClient
          localStorage.setItem('auth_token', accessToken);
          setToken(accessToken);

          const roles = getRolesFromToken(accessToken);

          setUser({
            sub: auth0User?.sub || '',
            email: auth0User?.email,
            name: auth0User?.name,
            picture: auth0User?.picture,
            roles,
          });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const loginWithRedirect = useCallback(async () => {
    if (auth0Client) {
      await auth0Client.loginWithRedirect();
    }
  }, [auth0Client]);

  const logout = useCallback(() => {
    if (auth0Client) {
      localStorage.removeItem('auth_token');
      auth0Client.logout({
        logoutParams: {
          returnTo: window.location.origin,
        },
      });
    }
  }, [auth0Client]);

  const getAccessToken = useCallback(async () => {
    if (!auth0Client) throw new Error('Auth0 client not initialized');
    const accessToken = await auth0Client.getTokenSilently();
    localStorage.setItem('auth_token', accessToken);
    setToken(accessToken);
    return accessToken;
  }, [auth0Client]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        token,
        loginWithRedirect,
        logout,
        getAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
