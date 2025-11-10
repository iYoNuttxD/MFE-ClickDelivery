import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Auth0Client } from "@auth0/auth0-spa-js";
import { jwtDecode } from "jwt-decode";
import { authService } from "@/shared/api/authService";
import { userApi } from "@/entities/user/api/userApi";

export type AppUser = {
  sub?: string;
  id?: string;
  name?: string;
  email?: string;
  picture?: string;
  // roles podem vir do claim customizado ou do JWT BFF
  roles?: string[];
  [key: string]: unknown;
};

export type AuthContextType = {
  loading: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  user: AppUser | null;
  getToken: () => Promise<string | null>;
  login: () => Promise<void>;
  loginWithRedirect: () => Promise<void>;
  logout: () => void;
};

interface JwtPayload {
  sub?: string;
  email?: string;
  name?: string;
  roles?: string[];
  'https://schemas.example.com/roles'?: string[];
  exp?: number;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [client, setClient] = useState<Auth0Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AppUser | null>(null);

  const useAuth0 = import.meta.env.VITE_USE_AUTH0 === 'true';
  const domain = import.meta.env.VITE_AUTH0_DOMAIN as string | undefined;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID as string | undefined;
  const audience = (import.meta.env.VITE_AUTH0_AUDIENCE as string | undefined) || undefined;
  const scope = (import.meta.env.VITE_AUTH0_SCOPE as string | undefined) || "openid profile email offline_access";

  // BFF mode initialization
  useEffect(() => {
    let mounted = true;

    async function initBFF() {
      try {
        const token = authService.getToken();
        if (!token) {
          setLoading(false);
          return;
        }

        // Decode JWT to get user info
        const decoded = jwtDecode<JwtPayload>(token);
        const roles = decoded.roles || decoded['https://schemas.example.com/roles'] || [];

        // Check if token is expired
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          authService.logout();
          setLoading(false);
          return;
        }

        // Fetch user profile from BFF
        try {
          const profile = await userApi.getProfile();
          if (!mounted) return;

          setUser({
            id: profile.id,
            sub: profile.id,
            name: profile.name,
            email: profile.email,
            roles: profile.roles || roles,
          });
          setIsAuthenticated(true);
        } catch (error) {
          // If profile fetch fails, use decoded JWT data
          console.warn("Failed to fetch user profile, using JWT data:", error);
          if (!mounted) return;
          
          setUser({
            sub: decoded.sub,
            email: decoded.email,
            name: decoded.name,
            roles,
          });
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error in BFF auth initialization:", error);
        authService.logout();
      } finally {
        if (mounted) setLoading(false);
      }
    }

    async function initAuth0() {
      try {
        if (!domain || !clientId) {
          console.error("Auth0 config ausente. Defina VITE_AUTH0_DOMAIN e VITE_AUTH0_CLIENT_ID.");
          setLoading(false);
          return;
        }

        const auth0 = new Auth0Client({
          domain,
          clientId,
          authorizationParams: {
            audience,
            scope,
            redirect_uri: window.location.origin
          },
          cacheLocation: "localstorage",
          useRefreshTokens: true
        });

        if (!mounted) return;
        setClient(auth0);

        if (window.location.search.includes("code=") && window.location.search.includes("state=")) {
          try {
            await auth0.handleRedirectCallback();
          } finally {
            const cleanUrl = window.location.origin + window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
          }
        }

        const authenticated = await auth0.isAuthenticated();
        if (!mounted) return;

        setIsAuthenticated(authenticated);
        if (authenticated) {
          const u = (await auth0.getUser()) as AppUser | undefined;
          if (!mounted) return;
          setUser(u ?? null);

          try {
            const token = await auth0.getTokenSilently();
            localStorage.setItem("auth_token", token);
          } catch (e) {
            console.warn("Não foi possível obter token silencioso:", e);
          }
        } else {
          localStorage.removeItem("auth_token");
        }
      } catch (e) {
        console.error("Erro inicializando Auth0:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    if (useAuth0) {
      initAuth0();
    } else {
      initBFF();
    }

    return () => {
      mounted = false;
    };
  }, [useAuth0, domain, clientId, audience, scope]);

  const getToken = useCallback(async () => {
    try {
      if (useAuth0 && client) {
        const token = await client.getTokenSilently();
        localStorage.setItem("auth_token", token);
        return token;
      }
      return authService.getToken();
    } catch {
      return authService.getToken();
    }
  }, [client, useAuth0]);

  const login = useCallback(async () => {
    if (useAuth0 && client) {
      await client.loginWithRedirect();
    } else {
      // For BFF mode, redirect to login page
      window.location.href = '/login';
    }
  }, [client, useAuth0]);

  const logout = useCallback(() => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    
    if (useAuth0 && client) {
      client.logout({ logoutParams: { returnTo: window.location.origin } });
    } else {
      window.location.href = '/login';
    }
  }, [client, useAuth0]);

  const value = useMemo<AuthContextType>(
    () => ({ 
      loading, 
      isLoading: loading, 
      isAuthenticated, 
      user, 
      getToken, 
      login,
      loginWithRedirect: login, 
      logout 
    }),
    [loading, isAuthenticated, user, getToken, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
