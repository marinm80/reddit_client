/**
 * Test Setup File
 *
 * This file runs before each test file.
 * It configures testing-library and adds custom matchers from jest-dom.
 */
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Cleanup after each test (unmount React components)
afterEach(() => {
  cleanup();
});
