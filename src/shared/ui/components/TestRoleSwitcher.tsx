import React, { useState, useEffect } from 'react';
import {
  SUPPORTED_ROLES,
  getOverrideRole,
  setOverrideRole,
  clearOverrideRole,
  isRoleOverrideEnabled,
} from '@/shared/auth/roles';

/**
 * TestRoleSwitcher - Component for testing different user roles
 * Visible only when VITE_ENABLE_ROLE_SWITCHER is explicitly set to 'true'
 */
export const TestRoleSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentOverride, setCurrentOverride] = useState<string | null>(null);

  useEffect(() => {
    setCurrentOverride(getOverrideRole());
  }, []);

  // Only show when explicitly enabled via VITE_ENABLE_ROLE_SWITCHER
  if (!isRoleOverrideEnabled()) {
    return null;
  }

  const handleRoleSelect = (role: string) => {
    setOverrideRole(role);
    setCurrentOverride(role);
    // Reload to apply new role
    window.location.reload();
  };

  const handleClearOverride = () => {
    clearOverrideRole();
    setCurrentOverride(null);
    // Reload to revert to actual roles
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Floating Badge */}
      {currentOverride && !isOpen && (
        <div className="mb-2 bg-yellow-500 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <span className="text-xs font-semibold">🧪 Test Mode: {currentOverride}</span>
          <button
            onClick={() => setIsOpen(true)}
            className="text-xs underline hover:text-yellow-100"
          >
            Change
          </button>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-colors"
        title="Test Role Switcher"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-64">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-800">🧪 Test Role Switcher</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {currentOverride && (
            <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
              <span className="font-semibold text-yellow-800">Active Override:</span>{' '}
              <span className="text-yellow-900">{currentOverride}</span>
            </div>
          )}

          <div className="space-y-2 mb-3">
            {SUPPORTED_ROLES.map((role) => (
              <button
                key={role}
                onClick={() => handleRoleSelect(role)}
                className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                  currentOverride === role
                    ? 'bg-purple-100 text-purple-800 font-semibold'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>

          {currentOverride && (
            <button
              onClick={handleClearOverride}
              className="w-full bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm font-semibold transition-colors"
            >
              Clear Override
            </button>
          )}

          <p className="mt-3 text-xs text-gray-500 text-center">
            For testing only. Changes require page reload.
          </p>
        </div>
      )}
    </div>
  );
};
