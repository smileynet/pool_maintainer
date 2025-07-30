import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright configuration for visual regression testing with Storybook
 */
export default defineConfig({
  testDir: './tests/visual',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use */
  reporter: [
    ['html', { outputFolder: 'playwright-visual-report' }],
    ['json', { outputFile: 'playwright-visual-report/results.json' }],
  ],

  /* Shared settings for all the projects below */
  use: {
    /* Base URL for Storybook */
    baseURL: 'http://localhost:6006',

    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',

    /* Visual regression specific settings */
    screenshot: {
      mode: 'only-on-failure',
      fullPage: true,
    },

    /* Viewport size for consistent screenshots */
    viewport: { width: 1280, height: 720 },
  },

  /* Configure projects for visual regression testing */
  projects: [
    {
      name: 'visual-chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Use a consistent color profile for visual tests
        colorScheme: 'light',
      },
    },
    {
      name: 'visual-chromium-dark',
      use: {
        ...devices['Desktop Chrome'],
        colorScheme: 'dark',
      },
    },
    {
      name: 'visual-mobile',
      use: {
        ...devices['iPhone 12'],
        colorScheme: 'light',
      },
    },
    {
      name: 'visual-tablet',
      use: {
        ...devices['iPad Pro'],
        colorScheme: 'light',
      },
    },
  ],

  /* Run Storybook before starting the tests */
  webServer: {
    command: 'bun run storybook',
    url: 'http://localhost:6006',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },

  /* Visual regression specific configuration */
  expect: {
    // Threshold for pixel differences (0-1, where 0 is identical)
    toHaveScreenshot: {
      maxDiffPixels: 100,
      threshold: 0.2,
      animations: 'disabled',
    },
  },
})
