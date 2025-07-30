import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable React Fast Refresh
      fastRefresh: true,
      // Optimize for Storybook compatibility
      jsxRuntime: 'automatic',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@mocks': path.resolve(__dirname, './src/mocks'),
    },
  },
  optimizeDeps: {
    // Include dependencies that need pre-bundling
    include: [
      'react',
      'react-dom',
      '@radix-ui/react-slot',
      'class-variance-authority',
      'clsx',
      'lucide-react',
      'tailwind-merge',
    ],
    // Exclude Storybook-specific dependencies to avoid conflicts
    exclude: ['@storybook/react-vite'],
  },
  build: {
    // Enable source maps for debugging
    sourcemap: true,
    // Optimize chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': [
            '@radix-ui/react-slot',
            'class-variance-authority',
            'clsx',
            'tailwind-merge',
          ],
          icons: ['lucide-react'],
        },
      },
    },
  },
  server: {
    // Ensure HMR works correctly with Storybook
    hmr: {
      overlay: true,
    },
    // Open browser automatically
    open: true,
    // Configure port
    port: 5173,
    // Allow external connections (useful for testing on other devices)
    host: true,
  },
  preview: {
    // Preview server configuration
    port: 4173,
    open: true,
    host: true,
  },
  // Explicitly define environment variables that should be exposed
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
})
