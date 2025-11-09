/* eslint-env node */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react-refresh', 'react'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',
    'prettier'
  ],
  settings: {
    react: { version: 'detect' }
  },
  rules: {
    // Regra de DX do Vite Fast Refresh — não essencial em prod
    'react-refresh/only-export-components': 'off',

    // Sinaliza, mas não quebra build
    '@typescript-eslint/no-explicit-any': ['warn'],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
    ],
    'react/prop-types': 'off'
  },
  overrides: [
    {
      files: ['tests/**/*', '**/*.test.ts', '**/*.test.tsx'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': 'off'
      }
    }
  ]
}
