import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    css: true,
  },
  resolve: {
    alias: [
      {
        find: /^\.\/firebaseConfig(\.js)?$/,
        replacement: path.resolve(__dirname, './src/__mocks__/firebaseConfig.js').replace(/\\/g, '/'),
      },
      {
        find: /^\.\.\/firebaseConfig(\.js)?$/,
        replacement: path.resolve(__dirname, './src/__mocks__/firebaseConfig.js').replace(/\\/g, '/'),
      },
    ],
  },
});
