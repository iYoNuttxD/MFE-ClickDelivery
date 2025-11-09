import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import createAuth0Client, { Auth0Client } from "@auth0/auth0-spa-js";

type AuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
  user: any;
  getToken: () => Promise<string | null>;
  login: () => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [client, setClient] = useState<Auth0Client | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE;
  const scope = import.meta.env.VITE_AUTH0_SCOPE || "openid profile email offline_access";

  useEffect(() => {
    async function init() {
      try {
        if (!domain || !clientId) {
          console.error("Auth0 config ausente: verifique VITE_AUTH0_DOMAIN e VITE_AUTH0_CLIENT_ID");
          setLoading(false);
          return;
        }
        const auth0Client = await createAuth0Client({
          domain,
          clientId,
          authorizationParams: {
            audience,
            scope,
            redirect_uri: window.location.origin,
          },
          cacheLocation: "localstorage",
          useRefreshTokens: true,
        });

        setClient(auth0Client);

        if (window.location.search.includes("code=") && window.location.search.includes("state=")) {
          await auth0Client.handleRedirectCallback();
          window.history.replaceState({}, document.title, window.location.pathname);
        }

        const isAuth = await auth0Client.isAuthenticated();
        setIsAuthenticated(isAuth);
        if (isAuth) {
          const u = await auth0Client.getUser();
          setUser(u);
        }
      } catch (e) {
        console.error("Erro inicializando Auth0:", e);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [domain, clientId, audience, scope]);

  const value = useMemo<AuthContextType>(() => ({
    isAuthenticated,
    loading,
    user,
    getToken: async () => (client ? await client.getTokenSilently() : null),
    login: async () => { if (client) await client.loginWithRedirect(); },
    logout: () => { if (client) client.logout({ logoutParams: { returnTo: window.location.origin } }); },
  }), [client, isAuthenticated, loading, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
