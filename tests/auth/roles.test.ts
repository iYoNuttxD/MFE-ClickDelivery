import {
  getUserRoles,
  getPrimaryDashboardPath,
  getOverrideRole,
  setOverrideRole,
  clearOverrideRole,
  SUPPORTED_ROLES,
} from '@/shared/auth/roles';

describe('Role Utilities', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('getUserRoles', () => {
    it('should return empty array for null user', () => {
      const roles = getUserRoles(null);
      expect(roles).toEqual([]);
    });

    it('should extract roles from user.roles array', () => {
      const user = {
        sub: 'user123',
        roles: ['customer', 'courier'],
      };
      const roles = getUserRoles(user);
      expect(roles).toContain('customer');
      expect(roles).toContain('courier');
    });

    it('should extract roles from namespaced claims', () => {
      const user = {
        sub: 'user123',
        'https://schemas.example.com/roles': ['restaurant'],
      };
      const roles = getUserRoles(user);
      expect(roles).toContain('restaurant');
    });

    it('should normalize roles to lowercase', () => {
      const user = {
        sub: 'user123',
        roles: ['Admin', 'CUSTOMER'],
      };
      const roles = getUserRoles(user);
      expect(roles).toContain('admin');
      expect(roles).toContain('customer');
    });

    it('should remove duplicate roles', () => {
      const user = {
        sub: 'user123',
        roles: ['customer'],
        'https://schemas.example.com/roles': ['customer', 'courier'],
      };
      const roles = getUserRoles(user);
      const customerCount = roles.filter(r => r === 'customer').length;
      expect(customerCount).toBe(1);
    });

    it('should include override role from localStorage', () => {
      localStorage.setItem('override_role', 'admin');
      const user = {
        sub: 'user123',
        roles: ['customer'],
      };
      const roles = getUserRoles(user);
      expect(roles).toContain('admin');
      expect(roles).toContain('customer');
    });
  });

  describe('getPrimaryDashboardPath', () => {
    it('should return admin dashboard for admin role', () => {
      const user = {
        sub: 'user123',
        roles: ['admin', 'customer'],
      };
      expect(getPrimaryDashboardPath(user)).toBe('/admin/dashboard');
    });

    it('should return owner dashboard for owner role', () => {
      const user = {
        sub: 'user123',
        roles: ['owner', 'customer'],
      };
      expect(getPrimaryDashboardPath(user)).toBe('/owner/dashboard');
    });

    it('should return restaurant dashboard for restaurant role', () => {
      const user = {
        sub: 'user123',
        roles: ['restaurant', 'customer'],
      };
      expect(getPrimaryDashboardPath(user)).toBe('/restaurant/dashboard');
    });

    it('should return courier dashboard for courier role', () => {
      const user = {
        sub: 'user123',
        roles: ['courier', 'customer'],
      };
      expect(getPrimaryDashboardPath(user)).toBe('/courier/dashboard');
    });

    it('should return customer dashboard for customer role', () => {
      const user = {
        sub: 'user123',
        roles: ['customer'],
      };
      expect(getPrimaryDashboardPath(user)).toBe('/customer/dashboard');
    });

    it('should prioritize admin over other roles', () => {
      const user = {
        sub: 'user123',
        roles: ['customer', 'courier', 'admin'],
      };
      expect(getPrimaryDashboardPath(user)).toBe('/admin/dashboard');
    });

    it('should return customer dashboard as fallback for no roles', () => {
      const user = {
        sub: 'user123',
      };
      expect(getPrimaryDashboardPath(user)).toBe('/customer/dashboard');
    });

    it('should return customer dashboard for null user', () => {
      expect(getPrimaryDashboardPath(null)).toBe('/customer/dashboard');
    });

    it('should respect role priority order', () => {
      // Test all roles together to verify priority
      const user = {
        sub: 'user123',
        roles: ['customer', 'courier', 'restaurant', 'owner', 'admin'],
      };
      expect(getPrimaryDashboardPath(user)).toBe('/admin/dashboard');
    });
  });

  describe('Override Role Management', () => {
    it('should set override role in localStorage', () => {
      setOverrideRole('admin');
      expect(localStorage.getItem('override_role')).toBe('admin');
    });

    it('should normalize override role to lowercase', () => {
      setOverrideRole('ADMIN');
      expect(localStorage.getItem('override_role')).toBe('admin');
    });

    it('should get override role from localStorage when VITE_ENABLE_ROLE_SWITCHER is true', () => {
      // Note: In jest.config.js, VITE_ENABLE_ROLE_SWITCHER is set to 'true' for tests
      localStorage.setItem('override_role', 'owner');
      expect(getOverrideRole()).toBe('owner');
    });

    it('should return null when no override is set', () => {
      expect(getOverrideRole()).toBeNull();
    });

    it('should clear override role from localStorage', () => {
      localStorage.setItem('override_role', 'courier');
      clearOverrideRole();
      expect(localStorage.getItem('override_role')).toBeNull();
    });
  });

  describe('SUPPORTED_ROLES', () => {
    it('should have all expected roles in priority order', () => {
      expect(SUPPORTED_ROLES).toEqual(['admin', 'owner', 'restaurant', 'courier', 'customer']);
    });
  });
});
