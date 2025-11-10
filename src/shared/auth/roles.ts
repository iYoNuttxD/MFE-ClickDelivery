/**
 * Role utility functions for extracting and managing user roles
 */

import { AppUser } from '@/app/providers/AuthProvider';

/**
 * Supported roles in priority order (highest to lowest)
 */
export const SUPPORTED_ROLES = ['admin', 'owner', 'restaurant', 'courier', 'customer'] as const;
export type SupportedRole = typeof SUPPORTED_ROLES[number];

/**
 * Extract roles from user object, including from namespaced claims
 * Also considers localStorage override for testing purposes
 * @param user - The user object from auth context
 * @returns Array of role strings, normalized to lowercase and deduplicated
 */
export function getUserRoles(user: AppUser | null): string[] {
  if (!user) return [];
  
  const collected: string[] = [];

  // Check for override role in localStorage (dev/test only)
  const overrideRole = getOverrideRole();
  if (overrideRole) {
    collected.push(overrideRole);
  }

  // Extract from user.roles
  if (Array.isArray(user.roles)) {
    collected.push(...user.roles);
  }

  // Extract from namespaced claims containing 'roles'
  Object.entries(user).forEach(([key, value]) => {
    if (
      key.includes('roles') &&
      Array.isArray(value) &&
      value.every(v => typeof v === 'string')
    ) {
      collected.push(...(value as string[]));
    }
  });

  // Normalize to lowercase and remove duplicates
  return [...new Set(collected.map(role => role.toLowerCase()))];
}

/**
 * Get the primary dashboard path based on user roles
 * Priority: admin > owner > restaurant > courier > customer
 * @param user - The user object from auth context
 * @returns The dashboard path for the user's highest priority role
 */
export function getPrimaryDashboardPath(user: AppUser | null): string {
  const roles = getUserRoles(user);

  // Check roles in priority order
  for (const role of SUPPORTED_ROLES) {
    if (roles.includes(role)) {
      return `/${role}/dashboard`;
    }
  }

  // Default fallback
  return '/customer/dashboard';
}

/**
 * Get the override role from localStorage
 * @returns The override role or null
 */
export function getOverrideRole(): string | null {
  return localStorage.getItem('override_role');
}

/**
 * Set the override role in localStorage
 * @param role - The role to set as override
 */
export function setOverrideRole(role: string): void {
  localStorage.setItem('override_role', role.toLowerCase());
}

/**
 * Clear the override role from localStorage
 */
export function clearOverrideRole(): void {
  localStorage.removeItem('override_role');
}

/**
 * Check if role override is enabled based on environment
 * @returns true if in dev mode or explicitly enabled via env var
 */
export function isRoleOverrideEnabled(): boolean {
  return import.meta.env.DEV === true || import.meta.env.VITE_ENABLE_ROLE_SWITCHER === 'true';
}
