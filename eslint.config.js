// Enhanced ESLint configuration for React 19 + TypeScript + Pool Maintenance Project
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import storybook from 'eslint-plugin-storybook'

export default tseslint.config([
  {
    // Global ignores
    ignores: [
      'dist/**',
      'build/**',
      'coverage/**',
      'test-results/**',
      'tests/e2e/**',
      'vite.config.ts',
      'tailwind.config.js',
      'postcss.config.js',
      'node_modules/**',
      '.storybook/main.ts', // Storybook config can be complex
    ],
  },
  {
    // Base configuration for all JavaScript/TypeScript files
    files: ['**/*.{js,jsx,ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2022,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // TypeScript specific rules for pool maintenance safety
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      // Note: nullish coalescing and optional chain rules require type information
      // '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      // '@typescript-eslint/prefer-optional-chain': 'warn',
      
      // General code quality
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error',
      
      // Prevent theming bypasses - enforce shadcn/ui patterns
      'no-restricted-syntax': [
        'error',
        {
          selector: 'JSXAttribute[name.name="className"][value.value=/var\\(--semantic-/]',
          message: 'Do not use semantic CSS variables directly. Use shadcn/ui component variants instead (e.g., variant="default" instead of className="bg-[var(--semantic-action-primary)]").',
        },
      ],
    },
  },
  {
    // React-specific configuration
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      
      // React 19 specific rules
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      
      // Pool maintenance component safety rules
      'react-hooks/exhaustive-deps': 'error', // Critical for chemical reading state consistency
      'react-hooks/rules-of-hooks': 'error',
      
      // Theming enforcement for React components
      'no-restricted-syntax': [
        'error',
        {
          selector: 'JSXAttribute[name.name="className"][value.value=/text-\\[var\\(--semantic-/]',
          message: 'Do not use semantic text variables directly. Use Tailwind utilities like text-foreground, text-muted-foreground instead.',
        },
        {
          selector: 'JSXAttribute[name.name="className"][value.value=/bg-\\[var\\(--semantic-/]',
          message: 'Do not use semantic background variables directly. Use Tailwind utilities like bg-background, bg-card, or component variants.',
        },
        {
          selector: 'JSXAttribute[name.name="className"][value.value=/border-\\[var\\(--semantic-/]',
          message: 'Do not use semantic border variables directly. Use Tailwind utilities like border-border or border-muted.',
        },
      ],
    },
  },
  {
    // Storybook-specific configuration
    files: ['**/*.stories.{ts,tsx}', '**/*.story.{ts,tsx}'],
    plugins: {
      storybook,
    },
    rules: {
      // Storybook specific rules
      'storybook/await-interactions': 'error',
      'storybook/context-in-play-function': 'error',
      'storybook/default-exports': 'error',
      'storybook/hierarchy-separator': 'warn',
      'storybook/no-redundant-story-name': 'warn',
      'storybook/prefer-pascal-case': 'warn',
      'storybook/story-exports': 'error',
      'storybook/use-storybook-expect': 'error',
      'storybook/use-storybook-testing-library': 'error',
      
      // Relax some rules for Storybook files
      '@typescript-eslint/no-explicit-any': 'off',
      'react-hooks/rules-of-hooks': 'off', // Storybook uses hooks in decorators
    },
  },
  {
    // Test files configuration
    files: ['**/*.{test,spec}.{ts,tsx}', '**/__tests__/**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.node,
      },
    },
    rules: {
      // Relax some rules for test files
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
  {
    // Configuration files
    files: ['*.config.{js,ts}', 'vite.config.ts', 'tailwind.config.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // Allow require in config files
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
]);
