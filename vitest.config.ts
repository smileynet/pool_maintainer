import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    css: true,
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/tests/e2e/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
    ],
    // Pool Maintenance System optimizations
    testTimeout: 10000, // Pool calculations may need extra time
    hookTimeout: 10000,
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        minThreads: 1,
        maxThreads: 4,
      },
    },
    // Enhanced reporting for pool maintenance workflows
    reporter: ['default', 'json', 'html'],
    outputFile: {
      json: './test-results/results.json',
      html: './test-results/index.html',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      thresholds: {
        global: {
          branches: 10,
          functions: 10,
          lines: 10,
          statements: 10,
        },
        // TODO: Increase coverage thresholds as tests are added
        // Critical pool safety functions require higher coverage
        // 'src/lib/mahc-validation.ts': {
        //   branches: 95,
        //   functions: 95,
        //   lines: 95,
        //   statements: 95,
        // },
        // 'src/lib/localStorage.ts': {
        //   branches: 90,
        //   functions: 90,
        //   lines: 90,
        //   statements: 90,
        // },
      },
      exclude: [
        '**/node_modules/**',
        'src/test-setup.ts',
        'src/test-utils.tsx',
        '**/*.d.ts',
        '**/dist/**',
        '.claude/**',
        'tests/e2e/**',
        '**/*.stories.{ts,tsx}',
        'src/mocks/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@types': path.resolve(__dirname, './src/types'),
    },
  },
})
