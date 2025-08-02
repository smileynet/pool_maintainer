import { test, expect } from '@playwright/test'

// Helper to navigate to a story
async function gotoStory(page: any, storyId: string) {
  await page.goto(`/iframe.html?id=${storyId}&viewMode=story`)
  // Wait for the story to be fully loaded
  await page.waitForLoadState('networkidle')
  // Additional wait to ensure any animations have completed
  await page.waitForTimeout(500)
}

test.describe('Enhanced Components Visual Regression', () => {
  test.describe('Enhanced Badge Component', () => {
    test('badge with icons', async ({ page }) => {
      await gotoStory(page, 'ui-badge--with-icons')
      await expect(page.locator('#storybook-root')).toHaveScreenshot('badge-with-icons.png')
    })

    test('removable badges', async ({ page }) => {
      await gotoStory(page, 'ui-badge--removable')
      await expect(page.locator('#storybook-root')).toHaveScreenshot('badge-removable.png')
    })

    test('badge variants with status', async ({ page }) => {
      await gotoStory(page, 'ui-badge--status-variants')
      await expect(page.locator('#storybook-root')).toHaveScreenshot('badge-status-variants.png')
    })
  })

  test.describe('Enhanced Input Component', () => {
    test('input with icons', async ({ page }) => {
      await gotoStory(page, 'ui-input--with-icons')
      await expect(page.locator('#storybook-root')).toHaveScreenshot('input-with-icons.png')
    })

    test('input with label and helper text', async ({ page }) => {
      await gotoStory(page, 'ui-input--with-label-helper')
      await expect(page.locator('#storybook-root')).toHaveScreenshot('input-label-helper.png')
    })

    test('input error states', async ({ page }) => {
      await gotoStory(page, 'ui-input--error-states')
      await expect(page.locator('#storybook-root')).toHaveScreenshot('input-error-states.png')
    })
  })

  test.describe('Enhanced Label Component', () => {
    test('label with required indicator', async ({ page }) => {
      await gotoStory(page, 'ui-label--required')
      await expect(page.locator('#storybook-root')).toHaveScreenshot('label-required.png')
    })

    test('label error states', async ({ page }) => {
      await gotoStory(page, 'ui-label--error-state')
      await expect(page.locator('#storybook-root')).toHaveScreenshot('label-error.png')
    })
  })

  test.describe('Layout Wrapper Components', () => {
    test('content wrapper with constraints', async ({ page }) => {
      await gotoStory(page, 'ui-layout--content-wrapper')
      await expect(page.locator('#storybook-root')).toHaveScreenshot('layout-content-wrapper.png')
    })

    test('grid wrapper responsive behavior', async ({ page }) => {
      await gotoStory(page, 'ui-layout--grid-wrapper')
      
      // Test desktop view
      await page.setViewportSize({ width: 1280, height: 720 })
      await expect(page.locator('#storybook-root')).toHaveScreenshot('layout-grid-desktop.png')

      // Test tablet view
      await page.setViewportSize({ width: 768, height: 1024 })
      await page.waitForTimeout(300)
      await expect(page.locator('#storybook-root')).toHaveScreenshot('layout-grid-tablet.png')

      // Test mobile view
      await page.setViewportSize({ width: 375, height: 667 })
      await page.waitForTimeout(300)
      await expect(page.locator('#storybook-root')).toHaveScreenshot('layout-grid-mobile.png')
    })

    test('stack wrapper spacing', async ({ page }) => {
      await gotoStory(page, 'ui-layout--stack-wrapper')
      await expect(page.locator('#storybook-root')).toHaveScreenshot('layout-stack-wrapper.png')
    })

    test('flex wrapper alignment', async ({ page }) => {
      await gotoStory(page, 'ui-layout--flex-wrapper')
      await expect(page.locator('#storybook-root')).toHaveScreenshot('layout-flex-wrapper.png')
    })
  })

  test.describe('Dialog Sizing Fixes', () => {
    test('responsive dialog constraints', async ({ page }) => {
      await gotoStory(page, 'ui-dialog--responsive-sizing')
      
      // Test various viewport sizes to ensure dialog doesn't overflow
      const viewports = [
        { width: 320, height: 568 },  // Small mobile
        { width: 768, height: 1024 }, // Tablet
        { width: 1280, height: 720 }, // Desktop
        { width: 1920, height: 1080 } // Large desktop
      ]

      for (const viewport of viewports) {
        await page.setViewportSize(viewport)
        await page.waitForTimeout(300)
        await expect(page.locator('#storybook-root')).toHaveScreenshot(
          `dialog-responsive-${viewport.width}x${viewport.height}.png`
        )
      }
    })

    test('dialog with overflow content', async ({ page }) => {
      await gotoStory(page, 'ui-dialog--overflow-content')
      await expect(page.locator('#storybook-root')).toHaveScreenshot('dialog-overflow-content.png')
    })
  })
})

test.describe('Component Base Classes Visual Tests', () => {
  test.describe('Base Class Inheritance', () => {
    test('components without custom styling', async ({ page }) => {
      await gotoStory(page, 'ui-components--base-classes-demo')
      await expect(page.locator('#storybook-root')).toHaveScreenshot('base-classes-demo.png')
    })

    test('component consistency across variants', async ({ page }) => {
      await gotoStory(page, 'ui-components--consistency-demo')
      await expect(page.locator('#storybook-root')).toHaveScreenshot('component-consistency.png')
    })
  })

  test.describe('Default Properties Visual Validation', () => {
    test('spacing consistency', async ({ page }) => {
      await gotoStory(page, 'ui-design-system--spacing-demo')
      await expect(page.locator('#storybook-root')).toHaveScreenshot('spacing-consistency.png')
    })

    test('typography consistency', async ({ page }) => {
      await gotoStory(page, 'ui-design-system--typography-demo')
      await expect(page.locator('#storybook-root')).toHaveScreenshot('typography-consistency.png')
    })

    test('color token consistency', async ({ page }) => {
      await gotoStory(page, 'ui-design-system--color-demo')
      await expect(page.locator('#storybook-root')).toHaveScreenshot('color-consistency.png')
    })
  })
})

test.describe('Responsive Design System Visual Tests', () => {
  test.describe('Viewport Overflow Prevention', () => {
    test('components at various screen sizes', async ({ page }) => {
      await gotoStory(page, 'ui-components--responsive-demo')
      
      const viewports = [
        { width: 320, height: 568, name: 'mobile' },
        { width: 768, height: 1024, name: 'tablet' },
        { width: 1024, height: 768, name: 'laptop' },
        { width: 1280, height: 720, name: 'desktop' },
        { width: 1920, height: 1080, name: 'large' }
      ]

      for (const viewport of viewports) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height })
        await page.waitForTimeout(300)
        await expect(page.locator('#storybook-root')).toHaveScreenshot(
          `responsive-components-${viewport.name}.png`
        )
      }
    })
  })

  test.describe('Dark Mode Consistency', () => {
    test.use({ colorScheme: 'dark' })

    test('enhanced components in dark mode', async ({ page }) => {
      await gotoStory(page, 'ui-components--enhanced-dark-mode')
      await expect(page.locator('#storybook-root')).toHaveScreenshot('enhanced-components-dark.png')
    })

    test('layout wrappers in dark mode', async ({ page }) => {
      await gotoStory(page, 'ui-layout--dark-mode-demo')
      await expect(page.locator('#storybook-root')).toHaveScreenshot('layout-wrappers-dark.png')
    })
  })
})

test.describe('Accessibility Visual Tests', () => {
  test.describe('High Contrast Mode', () => {
    test('enhanced components with forced colors', async ({ page, browserName }) => {
      test.skip(browserName !== 'chromium', 'Forced colors test only runs in Chromium')

      await page.emulateMedia({ forcedColors: 'active' })
      await gotoStory(page, 'ui-components--enhanced-demo')
      await expect(page.locator('#storybook-root')).toHaveScreenshot('enhanced-high-contrast.png')
    })
  })

  test.describe('Focus States', () => {
    test('enhanced component focus rings', async ({ page }) => {
      await gotoStory(page, 'ui-components--focus-demo')
      
      // Tab through interactive elements
      await page.keyboard.press('Tab')
      await page.waitForTimeout(100)
      await expect(page.locator('#storybook-root')).toHaveScreenshot('focus-state-1.png')
      
      await page.keyboard.press('Tab')
      await page.waitForTimeout(100)
      await expect(page.locator('#storybook-root')).toHaveScreenshot('focus-state-2.png')
    })
  })

  test.describe('Reduced Motion', () => {
    test('components with animations disabled', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await gotoStory(page, 'ui-components--animated-demo')
      
      // Disable all animations for consistent screenshots
      await page.addStyleTag({
        content: `
          *, *::before, *::after {
            animation-duration: 0s !important;
            animation-delay: 0s !important;
            transition-duration: 0s !important;
            transition-delay: 0s !important;
          }
        `,
      })
      
      await expect(page.locator('#storybook-root')).toHaveScreenshot('reduced-motion.png')
    })
  })
})