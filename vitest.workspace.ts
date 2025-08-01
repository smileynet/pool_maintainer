// Vitest Workspace Configuration for Pool Maintenance System
// Supports monorepo structure and multiple testing environments

import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  // Main application tests
  {
    extends: './vitest.config.ts',
    test: {
      name: 'pool-maintenance-app',
      include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
      exclude: [
        '**/node_modules/**',
        '**/tests/e2e/**',
        '**/src/test/performance/**',
        '**/src/stories/**',
      ],
      environment: 'jsdom',
    },
  },
  
  // Performance benchmarks
  {
    extends: './vitest.config.ts',
    test: {
      name: 'performance-benchmarks',
      include: ['src/test/performance/**/*.test.{js,ts}'],
      environment: 'node',
      testTimeout: 30000, // Extended timeout for performance tests
      reporters: ['default', 'json'],
      outputFile: {
        json: './test-results/performance-results.json',
      },
    },
  },
])