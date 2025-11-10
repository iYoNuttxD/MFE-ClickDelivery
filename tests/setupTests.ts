import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Polyfill TextEncoder/TextDecoder for Auth0
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// Mock import.meta for Vite env variables
Object.defineProperty(globalThis, 'import', {
  value: {
    meta: {
      env: {
        VITE_AUTH0_DOMAIN: 'test.auth0.com',
        VITE_AUTH0_CLIENT_ID: 'test-client-id',
        VITE_AUTH0_AUDIENCE: 'test-audience',
        VITE_API_URL: 'http://localhost:3000/api',
        VITE_ENABLE_ROLE_SWITCHER: 'true',
        VITE_ENVIRONMENT: 'test',
      },
    },
  },
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock as any;
