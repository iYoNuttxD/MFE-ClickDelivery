import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import createAuth0Client, { Auth0Client } from "@auth0/auth0-spa-js";

export type AppUser = {
  sub?: string;
  name?: string;
  email?: string;
  picture?: string;
  // roles podem vir no claim customizado
  roles?: string[];
  [key: string]: unknown;
};

export type AuthContextType = {
  loading: boolean;
  isAuthenticated: boolean;
  user: AppUser | null;
  getToken: () => Promise<string | null>;
  login: () => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [client, setClient] = useState<Auth0Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AppUser | null>(null);

  const domain = import.meta.env.VITE_AUTH0_DOMAIN as string | undefined;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID as string | undefined;
  const audience = (import.meta.env.VITE_AUTH0_AUDIENCE as string | undefined) || undefined;
  const scope = (import.meta.env.VITE_AUTH0_SCOPE as string | undefined) || "openid profile email offline_access";

  useEffect(() => {
    let mounted = true;
    async function init() {
      try {
        if (!domain || !clientId) {
          console.error("Auth0 config ausente. Defina VITE_AUTH0_DOMAIN e VITE_AUTH0_CLIENT_ID.");
          return;
        }

        const auth0 = await createAuth0Client({
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
    init();
    return () => {
      mounted = false;
    };
  }, [domain, clientId, audience, scope]);

  const getToken = useCallback(async () => {
    try {
      if (!client) return null;
      const token = await client.getTokenSilently();
      localStorage.setItem("auth_token", token);
      return token;
    } catch {
      return localStorage.getItem("auth_token");
    }
  }, [client]);

  const login = useCallback(async () => {
    if (!client) return;
    await client.loginWithRedirect();
  }, [client]);

  const logout = useCallback(() => {
    localStorage.removeItem("auth_token");
    if (!client) return;
    client.logout({ logoutParams: { returnTo: window.location.origin } });
  }, [client]);

  const value = useMemo<AuthContextType>(
    () => ({ loading, isAuthenticated, user, getToken, login, logout }),
    [loading, isAuthenticated, user, getToken, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
