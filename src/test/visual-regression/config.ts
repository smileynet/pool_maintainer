/**
 * Visual regression testing configuration
 */

export const visualTestConfig = {
  // Viewport sizes for responsive testing
  viewports: {
    mobile: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1280, height: 720 },
    wide: { width: 1920, height: 1080 },
  },

  // Story IDs mapping for easier maintenance
  storyIds: {
    button: {
      default: 'ui-button--default',
      withIcon: 'ui-button--with-icon',
      variants: 'ui-button--variants',
      sizes: 'ui-button--sizes',
      poolMaintenance: 'ui-button--pool-maintenance-actions',
      states: 'ui-button--states',
      loading: 'ui-button--loading',
      buttonGroup: 'ui-button--button-group',
      responsive: 'ui-button--responsive',
      asChild: 'ui-button--as-child',
    },
  },

  // Screenshot comparison options
  screenshotOptions: {
    fullPage: false,
    animations: 'disabled' as const,
    clip: undefined,
    mask: [],
  },

  // Threshold settings for different test types
  thresholds: {
    default: { maxDiffPixels: 100, threshold: 0.2 },
    strict: { maxDiffPixels: 0, threshold: 0 },
    loose: { maxDiffPixels: 500, threshold: 0.3 },
  },

  // Wait times for different scenarios
  waitTimes: {
    pageLoad: 500,
    animation: 300,
    networkIdle: 'networkidle' as const,
  },

  // CSS to inject for consistent screenshots
  screenshotCSS: `
    /* Disable animations */
    *, *::before, *::after {
      animation-duration: 0s !important;
      animation-delay: 0s !important;
      transition-duration: 0s !important;
      transition-delay: 0s !important;
    }
    
    /* Ensure consistent font rendering */
    * {
      -webkit-font-smoothing: antialiased !important;
      -moz-osx-font-smoothing: grayscale !important;
    }
    
    /* Hide scrollbars */
    ::-webkit-scrollbar {
      display: none !important;
    }
    
    * {
      scrollbar-width: none !important;
    }
  `,
}

/**
 * Helper to generate screenshot names with consistent naming
 */
export function generateScreenshotName(
  component: string,
  variant: string,
  options?: {
    viewport?: keyof typeof visualTestConfig.viewports
    theme?: 'light' | 'dark'
    state?: string
  }
): string {
  const parts = [component, variant]

  if (options?.viewport) {
    parts.push(options.viewport)
  }

  if (options?.theme && options.theme !== 'light') {
    parts.push(options.theme)
  }

  if (options?.state) {
    parts.push(options.state)
  }

  return `${parts.join('-')}.png`
}

/**
 * Pool maintenance specific visual test scenarios
 */
export const poolMaintenanceScenarios = [
  {
    name: 'Chemical Management Dashboard',
    storyId: 'pool-chemical-dashboard--default',
    viewports: ['mobile', 'tablet', 'desktop'] as const,
  },
  {
    name: 'Maintenance Schedule Calendar',
    storyId: 'pool-schedule-calendar--default',
    viewports: ['tablet', 'desktop'] as const,
  },
  {
    name: 'Compliance Report',
    storyId: 'pool-compliance-report--default',
    viewports: ['desktop'] as const,
  },
  {
    name: 'Mobile Technician View',
    storyId: 'pool-technician-mobile--default',
    viewports: ['mobile'] as const,
  },
]
