import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('/')

    // Wait for the page to load
    await page.waitForLoadState('networkidle')

    // Check that the page title is correct
    await expect(page).toHaveTitle(/Vite \+ React \+ TS/)

    // Check that the main heading is visible
    await expect(page.locator('h1')).toContainText('Vite + React')
  })

  test('should display shadcn/ui buttons with different variants', async ({ page }) => {
    await page.goto('/')

    // Wait for the page to load
    await page.waitForLoadState('networkidle')

    // Check that button variants are rendered
    await expect(page.getByRole('button', { name: 'Default' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Secondary' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Destructive' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Outline' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Ghost' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Link' })).toBeVisible()
  })

  test('should have proper styling for default button', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const defaultButton = page.getByRole('button', { name: 'Default' })
    await expect(defaultButton).toBeVisible()

    // Check that the button has the expected classes (basic check)
    const buttonClasses = await defaultButton.getAttribute('class')
    expect(buttonClasses).toContain('bg-primary')
  })

  test('should be interactive - buttons can be clicked', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const defaultButton = page.getByRole('button', { name: 'Default' })

    // Click the button (should not throw an error)
    await defaultButton.click()

    // Button should still be visible after click
    await expect(defaultButton).toBeVisible()
  })

  test('should be responsive on mobile viewports', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Check that content is still visible on mobile
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Default' })).toBeVisible()
  })

  test('should have proper accessibility attributes', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Check that buttons have proper accessibility attributes
    const buttons = page.getByRole('button')
    const buttonCount = await buttons.count()

    expect(buttonCount).toBeGreaterThan(0)

    // Check first button is accessible
    const firstButton = buttons.first()
    await expect(firstButton).toBeVisible()
    await expect(firstButton).toBeEnabled()
  })
})
