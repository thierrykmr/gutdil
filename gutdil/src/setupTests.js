import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

if (typeof global.fetch === 'undefined') {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    })
  );
}

process.env.VITE_EMAILJS_SERVICE_ID = 'test_service';
process.env.VITE_EMAILJS_TEMPLATE_ID = 'test_template';
process.env.VITE_EMAILJS_PUBLIC_KEY = 'test_key';
process.env.VITE_FIREBASE_API_KEY = 'test_api_key';
process.env.VITE_FIREBASE_AUTH_DOMAIN = 'test.firebaseapp.com';
process.env.VITE_FIREBASE_PROJECT_ID = 'test-project';
process.env.VITE_FIREBASE_STORAGE_BUCKET = 'test.appspot.com';
process.env.VITE_FIREBASE_MESSAGING_SENDER_ID = '123';
process.env.VITE_FIREBASE_APP_ID = 'app-id';
process.env.VITE_FIREBASE_MEASUREMENT_ID = 'G-TEST';

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  Element.prototype.scrollIntoView = vi.fn();
});
