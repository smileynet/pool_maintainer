import { test, expect } from '@playwright/test'

// Test Docker deployment on port 8080
test.use({
  baseURL: 'http://localhost:8080'
})

test.describe('Docker Deployment Verification', () => {
  test('health check endpoint responds', async ({ request }) => {
    const response = await request.get('/health')
    expect(response.ok()).toBeTruthy()
    expect(await response.text()).toBe('healthy\n')
  })

  test('application loads without errors', async ({ page }) => {
    // Listen for console errors
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    // Navigate to the app
    await page.goto('/')
    
    // Wait for app to fully load
    await page.waitForLoadState('networkidle')
    
    // Check no console errors
    expect(errors).toHaveLength(0)
    
    // Verify title
    await expect(page).toHaveTitle('Pool Maintenance System')
    
    // Verify main header is visible
    await expect(page.getByRole('heading', { name: 'Pool Maintenance System' })).toBeVisible()
  })

  test('all navigation tabs are functional', async ({ page }) => {
    await page.goto('/')
    
    // Get navigation element
    const nav = page.locator('nav')
    
    // Test Overview tab (default)
    await expect(page.getByRole('heading', { name: 'Pool Maintenance Dashboard' })).toBeVisible()
    
    // Test Pool Facilities tab
    await nav.getByRole('button', { name: 'Pool Facilities' }).click()
    await page.waitForLoadState('networkidle')
    await expect(page.getByRole('heading', { name: 'Pool Facility Management' })).toBeVisible()
    
    // Test History tab
    await nav.getByRole('button', { name: 'Test History' }).click()
    await page.waitForLoadState('networkidle')
    await expect(page.getByRole('heading', { name: 'Chemical Test History' })).toBeVisible()
    
    // Test Analytics tab
    await nav.getByRole('button', { name: 'Analytics' }).click()
    await page.waitForLoadState('networkidle')
    await expect(page.getByRole('heading', { name: 'Analytics & Reports' })).toBeVisible()
    
    // Return to Overview
    await nav.getByRole('button', { name: 'Overview' }).click()
    await expect(page.getByRole('heading', { name: 'Pool Maintenance Dashboard' })).toBeVisible()
  })

  test('lazy-loaded components work correctly', async ({ page }) => {
    await page.goto('/')
    
    const nav = page.locator('nav')
    
    // Test lazy-loaded Analytics tab
    await nav.getByRole('button', { name: 'Analytics' }).click()
    
    // Should show loading state briefly
    const loadingText = page.getByText('Loading Chemical Trend Charts...')
    
    // Component should load and replace loading state
    await expect(page.getByRole('heading', { name: 'Chemical Trend Analysis' })).toBeVisible({ timeout: 10000 })
    
    // Verify chart components loaded
    await expect(page.locator('.recharts-wrapper')).toBeVisible()
  })

  test('static assets are properly served and cached', async ({ page, request }) => {
    await page.goto('/')
    
    // Get all network requests
    const assetRequests: string[] = []
    page.on('response', response => {
      const url = response.url()
      if (url.includes('/assets/')) {
        assetRequests.push(url)
        
        // Check cache headers for assets
        const headers = response.headers()
        if (url.match(/\.(js|css)$/)) {
          expect(headers['cache-control']).toContain('public')
          expect(headers['cache-control']).toContain('immutable')
        }
      }
    })
    
    await page.waitForLoadState('networkidle')
    
    // Verify assets were loaded
    expect(assetRequests.length).toBeGreaterThan(0)
    
    // Test that index.html has no-cache headers
    const indexResponse = await request.get('/')
    const indexHeaders = indexResponse.headers()
    expect(indexHeaders['cache-control']).toContain('no-cache')
  })

  test('security headers are present', async ({ request }) => {
    const response = await request.get('/')
    const headers = response.headers()
    
    // Check security headers
    expect(headers['x-frame-options']).toBe('SAMEORIGIN')
    expect(headers['x-content-type-options']).toBe('nosniff')
    expect(headers['x-xss-protection']).toBe('1; mode=block')
    expect(headers['referrer-policy']).toBe('no-referrer-when-downgrade')
    expect(headers['content-security-policy']).toBeDefined()
  })

  test('gzip compression is enabled', async ({ request }) => {
    const response = await request.get('/', {
      headers: {
        'Accept-Encoding': 'gzip, deflate'
      }
    })
    
    const headers = response.headers()
    expect(headers['content-encoding']).toBe('gzip')
  })

  test('SPA routing fallback works', async ({ page }) => {
    // Try to navigate directly to a route
    await page.goto('/non-existent-route')
    
    // Should still load the app (SPA fallback)
    await expect(page).toHaveTitle('Pool Maintenance System')
    await expect(page.getByRole('heading', { name: 'Pool Maintenance System' })).toBeVisible()
  })

  test('forms and interactions work correctly', async ({ page }) => {
    await page.goto('/')
    
    // Navigate to Pool Facilities
    const nav = page.locator('nav')
    await nav.getByRole('button', { name: 'Pool Facilities' }).click()
    
    // Test "Add New Test" button
    await page.getByRole('button', { name: 'Add New Test' }).click()
    
    // Dialog should open
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Record Chemical Test' })).toBeVisible()
    
    // Close dialog
    await page.getByRole('button', { name: 'Cancel' }).click()
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })

  test('responsive design works on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    await page.goto('/')
    
    // App should still be functional
    await expect(page.getByRole('heading', { name: 'Pool Maintenance System' })).toBeVisible()
    
    // Navigation should be accessible
    const nav = page.locator('nav')
    await expect(nav).toBeVisible()
    
    // Test navigation on mobile
    await nav.getByRole('button', { name: 'Pool Facilities' }).click()
    await expect(page.getByRole('heading', { name: 'Pool Facility Management' })).toBeVisible()
  })

  test('performance: initial page load is fast', async ({ page }) => {
    const startTime = Date.now()
    
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
    
    const loadTime = Date.now() - startTime
    
    // Should load quickly (under 3 seconds even in Docker)
    expect(loadTime).toBeLessThan(3000)
    
    // Check that main bundle is optimized
    const bundleSize = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script[src*="/assets/index-"]'))
      return scripts.length > 0
    })
    expect(bundleSize).toBeTruthy()
  })

  test('offline indicator is present and functional', async ({ page }) => {
    await page.goto('/')
    
    // Offline indicator should be visible in header
    const offlineIndicator = page.locator('text=Online').or(page.locator('text=Offline'))
    await expect(offlineIndicator).toBeVisible()
    
    // Click on it to see details
    await offlineIndicator.click()
    
    // Sync status panel should appear
    await expect(page.getByText('Sync Status')).toBeVisible()
    await expect(page.getByRole('button', { name: /Sync Now/i })).toBeVisible()
    
    // Close the panel
    await page.locator('button[aria-label="Close"]').or(page.getByRole('button', { name: 'Close' })).click()
  })
})