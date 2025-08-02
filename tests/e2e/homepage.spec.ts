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

    // Check that navigation tabs are rendered - use nav element to scope the search
    const nav = page.locator('nav')
    await expect(nav.getByRole('button', { name: 'Overview' })).toBeVisible()
    await expect(nav.getByRole('button', { name: 'Pool Facilities' })).toBeVisible()
    await expect(nav.getByRole('button', { name: 'Test History' })).toBeVisible()
    await expect(nav.getByRole('button', { name: 'Analytics' })).toBeVisible()
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

    // Click on Pool Facilities tab - use nav element to avoid conflicts
    const nav = page.locator('nav')
    await nav.getByRole('button', { name: 'Pool Facilities' }).click()

    // Should show facilities content
    await expect(page.locator('h2')).toContainText('Pool Facility Manager')

    // Click on Test History tab
    await nav.getByRole('button', { name: 'Test History' }).click()

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

    // Check that navigation buttons are accessible - scope to nav element
    const nav = page.locator('nav')
    const navButtons = nav.getByRole('button')
    const buttonCount = await navButtons.count()

    expect(buttonCount).toBe(4)

    // Check first button is accessible
    const firstButton = navButtons.first()
    await expect(firstButton).toBeVisible()
    await expect(firstButton).toBeEnabled()
  })
})
