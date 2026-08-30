import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['components/**/__tests__/*.{test,spec}.{ts,tsx}'],
    globals: true,
    setupFiles: 'test/setup.ts'
  }
});
