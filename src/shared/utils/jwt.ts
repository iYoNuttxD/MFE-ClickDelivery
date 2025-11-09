import { jwtDecode } from 'jwt-decode';

export interface DecodedToken {
  sub: string;
  email?: string;
  name?: string;
  roles?: string[];
  permissions?: string[];
  exp: number;
  iat: number;
}

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded) return true;
  return decoded.exp * 1000 < Date.now();
};

export const getRolesFromToken = (token: string): string[] => {
  const decoded = decodeToken(token);
  return decoded?.roles || [];
};
