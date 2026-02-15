import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    // Enable global test APIs (describe, it, expect, etc.)
    globals: true,

    // Use jsdom for DOM simulation (React components need this)
    environment: 'jsdom',

    // Setup file to run before each test file
    setupFiles: './src/test/setup.ts',

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        'src/test/',
        '*.config.ts',
        '*.config.js',
        'src/main.tsx',
        'src/App.css',
      ],
      // Target thresholds
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },

    // Test file patterns
    include: ['src/**/*.{test,spec}.{ts,tsx}'],

    // Exclude patterns
    exclude: [
      'node_modules',
      'dist',
      '.idea',
      '.git',
      '.cache',
    ],
  },
});
