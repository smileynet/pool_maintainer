import { test, expect } from '@playwright/test'

test.describe('Pool Maintenance System', () => {
  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('/')

    // Wait for the page to load
    await page.waitForLoadState('networkidle')

    // Check that the page title is correct
    await expect(page).toHaveTitle('Pool Maintenance System')

    // Check that the main heading is visible
    await expect(page.locator('h1')).toContainText('Pool Maintenance System')
  })

  test('should display navigation tabs', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Check that navigation tabs are rendered
    await expect(page.getByRole('button', { name: /Overview/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Pool Facilities/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Test History/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Analytics/i })).toBeVisible()
  })

  test('should display pool maintenance dashboard on overview tab', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Check that the dashboard heading is visible
    await expect(page.locator('h2')).toContainText('Pool Maintenance Dashboard')

    // Check for dashboard description
    await expect(page.locator('text=Real-time pool status and chemical monitoring')).toBeVisible()
  })

  test('should switch between tabs', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Click on Pool Facilities tab
    await page.getByRole('button', { name: /Pool Facilities/i }).click()

    // Should show facilities content
    await expect(page.locator('h2')).toContainText('Pool Facility Manager')

    // Click on Test History tab
    await page.getByRole('button', { name: /Test History/i }).click()

    // Should show history content
    await expect(page.locator('h2')).toContainText('Chemical Test History')
  })

  test('should be responsive on mobile viewports', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Check that content is still visible on mobile
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.getByRole('button', { name: /Overview/i })).toBeVisible()
  })

  test('should have proper accessibility attributes', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Check that navigation buttons are accessible
    const navButtons = page
      .getByRole('button')
      .filter({ hasText: /Overview|Pool Facilities|Test History|Analytics/i })
    const buttonCount = await navButtons.count()

    expect(buttonCount).toBe(4)

    // Check first button is accessible
    const firstButton = navButtons.first()
    await expect(firstButton).toBeVisible()
    await expect(firstButton).toBeEnabled()
  })
})
