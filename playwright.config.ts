import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright configuration for Pool Management E2E testing
 * Includes user story-driven scenarios and accessibility testing
 */
export default defineConfig({
  testDir: './tests/e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['json', { outputFile: 'playwright-report/results.json' }],
    ['junit', { outputFile: 'playwright-report/junit.xml' }]
  ],
  /* Global test timeout */
  timeout: 60 * 1000, // 60 seconds for complex user scenarios
  /* Expect timeout for assertions */
  expect: {
    timeout: 10 * 1000, // 10 seconds for assertions
  },
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:5080',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Take screenshot on failure */
    screenshot: 'only-on-failure',

    /* Record video on failure */
    video: 'retain-on-failure',

    /* Action timeout */
    actionTimeout: 10 * 1000,

    /* Navigation timeout */
    navigationTimeout: 30 * 1000,
  },

  /* Configure projects for major browsers and testing scenarios */
  projects: [
    // Critical user story tests - run on Chromium for speed
    {
      name: 'critical-workflows',
      testMatch: '**/user-story-test-runner.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },

    // Pool manager workflows - desktop focus
    {
      name: 'pool-manager-desktop',
      testMatch: '**/pool-manager-workflows.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },

    // Technician workflows - mobile focus
    {
      name: 'technician-mobile',
      testMatch: '**/technician-workflows.spec.ts',
      use: { ...devices['iPhone 13'] },
    },

    // Emergency response - all devices
    {
      name: 'emergency-response',
      testMatch: '**/emergency-response.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },

    // Accessibility testing - Chromium with axe
    {
      name: 'accessibility',
      testMatch: '**/accessibility.spec.ts',
      use: { 
        ...devices['Desktop Chrome'],
        // Additional accessibility testing flags
        launchOptions: {
          args: ['--enable-accessibility-live-regions']
        }
      },
    },

    // Cross-browser validation for critical paths
    {
      name: 'firefox-critical',
      testMatch: ['**/pool-manager-workflows.spec.ts', '**/emergency-response.spec.ts'],
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit-critical',
      testMatch: ['**/pool-manager-workflows.spec.ts'],
      use: { ...devices['Desktop Safari'] },
    },

    // Mobile testing for field technician workflows
    {
      name: 'mobile-chrome',
      testMatch: '**/technician-workflows.spec.ts',
      use: { ...devices['Pixel 5'] },
    },

    {
      name: 'mobile-safari',
      testMatch: '**/technician-workflows.spec.ts',
      use: { ...devices['iPhone 12'] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'bun run dev',
    url: 'http://localhost:5080',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
})
