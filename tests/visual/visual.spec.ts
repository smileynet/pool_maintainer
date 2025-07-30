import { test, expect } from '@playwright/test'

// Helper to navigate to a story
async function gotoStory(page: any, storyId: string) {
  await page.goto(`/iframe.html?id=${storyId}&viewMode=story`)
  // Wait for the story to be fully loaded
  await page.waitForLoadState('networkidle')
  // Additional wait to ensure any animations have completed
  await page.waitForTimeout(500)
}

test.describe('Visual Regression Tests', () => {
  test.describe('Button Component', () => {
    test('default button', async ({ page }) => {
      await gotoStory(page, 'ui-button--default')
      await expect(page.locator('#storybook-root')).toHaveScreenshot('button-default.png')
    })

    test('button with icon', async ({ page }) => {
      await gotoStory(page, 'ui-button--with-icon')
      await expect(page.locator('#storybook-root')).toHaveScreenshot('button-with-icon.png')
    })

    test('button variants', async ({ page }) => {
      await gotoStory(page, 'ui-button--variants')
      await expect(page.locator('#storybook-root')).toHaveScreenshot('button-variants.png')
    })

    test('button sizes', async ({ page }) => {
      await gotoStory(page, 'ui-button--sizes')
      await expect(page.locator('#storybook-root')).toHaveScreenshot('button-sizes.png')
    })

    test('pool maintenance actions', async ({ page }) => {
      await gotoStory(page, 'ui-button--pool-maintenance-actions')
      await expect(page.locator('#storybook-root')).toHaveScreenshot('button-pool-maintenance.png')
    })

    test('button states', async ({ page }) => {
      await gotoStory(page, 'ui-button--states')
      await expect(page.locator('#storybook-root')).toHaveScreenshot('button-states.png')
    })

    test('loading state', async ({ page }) => {
      await gotoStory(page, 'ui-button--loading')
      // Disable animations for consistent screenshots
      await page.addStyleTag({
        content: `
          *, *::before, *::after {
            animation-duration: 0s !important;
            animation-delay: 0s !important;
          }
        `,
      })
      await expect(page.locator('#storybook-root')).toHaveScreenshot('button-loading.png')
    })

    test('button group', async ({ page }) => {
      await gotoStory(page, 'ui-button--button-group')
      await expect(page.locator('#storybook-root')).toHaveScreenshot('button-group.png')
    })

    test('responsive buttons', async ({ page }) => {
      await gotoStory(page, 'ui-button--responsive')

      // Test desktop view
      await page.setViewportSize({ width: 1280, height: 720 })
      await expect(page.locator('#storybook-root')).toHaveScreenshot(
        'button-responsive-desktop.png'
      )

      // Test mobile view
      await page.setViewportSize({ width: 375, height: 667 })
      await page.waitForTimeout(300) // Wait for layout to adjust
      await expect(page.locator('#storybook-root')).toHaveScreenshot('button-responsive-mobile.png')
    })

    test('as child examples', async ({ page }) => {
      await gotoStory(page, 'ui-button--as-child')
      await expect(page.locator('#storybook-root')).toHaveScreenshot('button-as-child.png')
    })
  })

  // Accessibility visual tests
  test.describe('Accessibility States', () => {
    test('focus states', async ({ page }) => {
      await gotoStory(page, 'ui-button--default')

      // Focus the button
      await page.keyboard.press('Tab')
      await expect(page.locator('#storybook-root')).toHaveScreenshot('button-focus-state.png')
    })

    test('high contrast mode', async ({ page, browserName }) => {
      // Skip for non-chromium browsers as high contrast mode simulation varies
      test.skip(browserName !== 'chromium', 'High contrast mode test only runs in Chromium')

      await page.emulateMedia({ forcedColors: 'active' })
      await gotoStory(page, 'ui-button--variants')
      await expect(page.locator('#storybook-root')).toHaveScreenshot('button-high-contrast.png')
    })
  })

  // Dark mode visual tests
  test.describe('Dark Mode', () => {
    test.use({ colorScheme: 'dark' })

    test('button variants in dark mode', async ({ page }) => {
      await gotoStory(page, 'ui-button--variants')
      await expect(page.locator('#storybook-root')).toHaveScreenshot('button-variants-dark.png')
    })

    test('pool maintenance actions in dark mode', async ({ page }) => {
      await gotoStory(page, 'ui-button--pool-maintenance-actions')
      await expect(page.locator('#storybook-root')).toHaveScreenshot(
        'button-pool-maintenance-dark.png'
      )
    })
  })
})

// Cross-browser visual consistency tests
test.describe('Cross-browser Consistency', () => {
  const browsers = ['chromium', 'firefox', 'webkit'] as const

  browsers.forEach((browserName) => {
    test(`button rendering in ${browserName}`, async ({ page, browserName: currentBrowser }) => {
      test.skip(currentBrowser !== browserName, `This test only runs in ${browserName}`)

      await gotoStory(page, 'ui-button--variants')
      await expect(page.locator('#storybook-root')).toHaveScreenshot(
        `button-variants-${browserName}.png`
      )
    })
  })
})
