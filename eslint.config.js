// ESLint v9+ Flat Config
import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
// Opcional: descomente se quiser aplicar Prettier (Flat Config)
import prettier from 'eslint-config-prettier';

export default [
  // Ignorar diretórios comuns
  {
    ignores: ['dist', 'node_modules', 'coverage'],
  },

  // Regras base JS
  js.configs.recommended,

  // Regras para TS/TSX + React
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // TS
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      // React
      'react/prop-types': 'off',

      // Vite Fast Refresh (não crítico em prod)
      'react-refresh/only-export-components': 'off',

      // Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },

  // Ajustes para testes
  {
    files: ['tests/**/*', '**/*.test.ts', '**/*.test.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },

  // Opcional: descomente se quiser aplicar Prettier (Flat Config)
  // prettier,
];
