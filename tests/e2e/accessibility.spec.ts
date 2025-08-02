/**
 * E2E accessibility tests for pool management application
 * Ensures WCAG 2.1 compliance and screen reader compatibility
 */

import { test, expect, Page } from '@playwright/test'
import { accessibilityScenarios } from '@/test/fixtures/user-scenarios'
import { injectAxe, checkA11y, configureAxe } from 'axe-playwright'

test.describe('Accessibility Testing', () => {
  test.beforeEach(async ({ page }) => {
    // Setup accessibility testing environment
    await page.goto('/')
    await injectAxe(page)
    
    // Configure axe for pool management specific needs
    await configureAxe(page, {
      rules: {
        // Enable additional rules for data tables and forms
        'color-contrast': { enabled: true },
        'keyboard-navigation': { enabled: true },
        'aria-labels': { enabled: true },
        'focus-management': { enabled: true }
      }
    })
    
    // Mock user authentication
    await page.evaluate(() => {
      localStorage.setItem('auth-token', 'mock-accessibility-user')
      localStorage.setItem('user-role', 'pool_manager')
      localStorage.setItem('accessibility-preferences', JSON.stringify({
        screenReader: true,
        highContrast: false,
        largeText: false,
        reducedMotion: false
      }))
    })
  })

  test('A11Y-001: Screen Reader Pool Status Navigation', async ({ page }) => {
    await page.goto('/overview')
    
    // Test semantic structure for screen readers
    await expect(page.locator('h1')).toContainText('Pool Status Dashboard')
    await expect(page.locator('main')).toHaveAttribute('role', 'main')
    await expect(page.locator('nav')).toHaveAttribute('role', 'navigation')
    
    // Verify landmark structure
    await expect(page.locator('[role="banner"]')).toBeVisible() // Header
    await expect(page.locator('[role="main"]')).toBeVisible() // Main content
    await expect(page.locator('[role="complementary"]')).toBeVisible() // Sidebar
    
    // Test pool status cards accessibility
    const poolCards = page.locator('[data-testid^="pool-card-"]')
    const firstCard = poolCards.first()
    
    // Verify card has proper accessibility attributes
    await expect(firstCard).toHaveAttribute('role', 'button')
    await expect(firstCard).toHaveAttribute('aria-label')
    await expect(firstCard).toHaveAttribute('tabindex', '0')
    
    // Test keyboard navigation through pool cards
    await firstCard.focus()
    await expect(firstCard).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(poolCards.nth(1)).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(poolCards.nth(2)).toBeFocused()
    
    // Test Enter key activation
    await page.keyboard.press('Enter')
    await expect(page.locator('[data-testid="pool-details-modal"]')).toBeVisible()
    await expect(page.locator('[data-testid="pool-details-modal"]')).toHaveAttribute('role', 'dialog')
    await expect(page.locator('[data-testid="pool-details-modal"]')).toHaveAttribute('aria-modal', 'true')
    
    // Test modal focus management
    await expect(page.locator('[data-testid="modal-close-button"]')).toBeFocused()
    
    // Test Escape key to close modal
    await page.keyboard.press('Escape')
    await expect(page.locator('[data-testid="pool-details-modal"]')).not.toBeVisible()
    await expect(firstCard).toBeFocused() // Focus should return to triggering element
    
    // Run comprehensive accessibility check
    await checkA11y(page, null, {
      detailedReport: true,
      detailedReportOptions: { html: true }
    })
  })

  test('Chemical Test Form Accessibility', async ({ page }) => {
    await page.goto('/pool-facilities')
    await page.click('[data-testid="record-chemical-test"]')
    
    // Verify form accessibility structure
    await expect(page.locator('form')).toHaveAttribute('role', 'form')
    await expect(page.locator('form')).toHaveAttribute('aria-labelledby', 'form-title')
    
    // Test form field accessibility
    const formFields = [
      { field: 'pool-selector', label: 'Select Pool' },
      { field: 'ph-input', label: 'pH Level' },
      { field: 'chlorine-input', label: 'Chlorine (ppm)' },
      { field: 'alkalinity-input', label: 'Alkalinity (ppm)' },
      { field: 'temperature-input', label: 'Temperature (°F)' },
      { field: 'notes-input', label: 'Notes' }
    ]
    
    for (const { field, label } of formFields) {
      const input = page.locator(`[data-testid="${field}"]`)
      const labelElement = page.locator(`label[for="${field}"]`)
      
      // Verify label association
      await expect(labelElement).toContainText(label)
      await expect(input).toHaveAttribute('aria-labelledby')
      
      // Test keyboard navigation to field
      await input.focus()
      await expect(input).toBeFocused()
      
      // Verify required field indication
      if (['pool-selector', 'ph-input', 'chlorine-input'].includes(field)) {
        await expect(input).toHaveAttribute('aria-required', 'true')
        await expect(input).toHaveAttribute('required')
      }
    }
    
    // Test error handling accessibility
    await page.fill('[data-testid="ph-input"]', '15') // Invalid pH value
    await page.click('[data-testid="submit-test"]')
    
    // Verify error message accessibility
    await expect(page.locator('[data-testid="ph-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="ph-error"]')).toHaveAttribute('role', 'alert')
    await expect(page.locator('[data-testid="ph-input"]')).toHaveAttribute('aria-invalid', 'true')
    await expect(page.locator('[data-testid="ph-input"]')).toHaveAttribute('aria-describedby')
    
    // Test error summary for screen readers
    await expect(page.locator('[data-testid="error-summary"]')).toBeVisible()
    await expect(page.locator('[data-testid="error-summary"]')).toHaveAttribute('role', 'alert')
    await expect(page.locator('[data-testid="error-summary"]')).toHaveAttribute('aria-live', 'assertive')
    
    // Run accessibility check on form
    await checkA11y(page, '[data-testid="chemical-test-form"]', {
      tags: ['wcag2a', 'wcag2aa', 'wcag21aa']
    })
  })

  test('Alert and Notification Accessibility', async ({ page }) => {
    // Setup critical alert scenario
    await page.evaluate(() => {
      const criticalAlert = {
        id: 'alert-001',
        type: 'critical',
        message: 'CRITICAL: Chlorine level dangerously high (4.5 ppm)',
        chemical: 'chlorine',
        poolId: 'pool-001',
        timestamp: new Date().toISOString()
      }
      localStorage.setItem('test-alert', JSON.stringify(criticalAlert))
    })
    
    await page.goto('/overview')
    
    // Trigger alert display
    await page.evaluate(() => {
      const alert = JSON.parse(localStorage.getItem('test-alert'))
      const event = new CustomEvent('pool-alert', { detail: alert })
      window.dispatchEvent(event)
    })
    
    // Verify alert accessibility
    const alertElement = page.locator('[data-testid="critical-alert"]')
    await expect(alertElement).toBeVisible()
    await expect(alertElement).toHaveAttribute('role', 'alert')
    await expect(alertElement).toHaveAttribute('aria-live', 'assertive')
    await expect(alertElement).toHaveAttribute('aria-atomic', 'true')
    
    // Verify alert content is descriptive
    const alertText = await alertElement.textContent()
    expect(alertText).toContain('CRITICAL')
    expect(alertText).toContain('Chlorine level')
    expect(alertText).toContain('dangerously high')
    expect(alertText).toContain('4.5 ppm')
    
    // Test alert interaction accessibility
    await expect(page.locator('[data-testid="alert-details-button"]')).toHaveAttribute('aria-expanded', 'false')
    
    await page.click('[data-testid="alert-details-button"]')
    await expect(page.locator('[data-testid="alert-details-button"]')).toHaveAttribute('aria-expanded', 'true')
    await expect(page.locator('[data-testid="alert-details"]')).toBeVisible()
    
    // Test alert dismissal
    await page.click('[data-testid="dismiss-alert"]')
    await expect(page.locator('[data-testid="alert-dismissed-confirmation"]')).toBeVisible()
    await expect(page.locator('[data-testid="alert-dismissed-confirmation"]')).toHaveAttribute('role', 'status')
  })

  test('Data Table Accessibility', async ({ page }) => {
    await page.goto('/trends')
    
    // Verify data table structure
    const table = page.locator('[data-testid="chemical-readings-table"]')
    await expect(table).toHaveAttribute('role', 'table')
    
    // Test table caption
    await expect(page.locator('caption')).toContainText('Chemical Readings History')
    
    // Test table headers
    const headers = page.locator('th')
    await expect(headers.first()).toHaveAttribute('scope', 'col')
    
    // Verify header content is descriptive
    const headerTexts = await headers.allTextContents()
    expect(headerTexts).toContain('Date and Time')
    expect(headerTexts).toContain('pH Level')
    expect(headerTexts).toContain('Chlorine (ppm)')
    expect(headerTexts).toContain('Status')
    
    // Test table navigation with keyboard
    await table.focus()
    await page.keyboard.press('ArrowDown') // Navigate to first row
    await page.keyboard.press('ArrowRight') // Navigate to next cell
    
    // Test row selection accessibility
    const firstRow = page.locator('tbody tr').first()
    await firstRow.click()
    await expect(firstRow).toHaveAttribute('aria-selected', 'true')
    
    // Test sortable columns
    const sortButton = page.locator('[data-testid="sort-ph"]')
    await expect(sortButton).toHaveAttribute('aria-sort', 'none')
    
    await sortButton.click()
    await expect(sortButton).toHaveAttribute('aria-sort', 'ascending')
    
    await sortButton.click()
    await expect(sortButton).toHaveAttribute('aria-sort', 'descending')
    
    // Run table-specific accessibility check
    await checkA11y(page, '[data-testid="chemical-readings-table"]', {
      rules: {
        'table-fake-caption': { enabled: true },
        'th-has-data-cells': { enabled: true },
        'td-headers-attr': { enabled: true }
      }
    })
  })

  test('Chart and Graph Accessibility', async ({ page }) => {
    await page.goto('/trends')
    
    // Test chart accessibility features
    const chart = page.locator('[data-testid="ph-trend-chart"]')
    await expect(chart).toHaveAttribute('role', 'img')
    await expect(chart).toHaveAttribute('aria-labelledby', 'chart-title')
    
    // Verify chart description
    await expect(page.locator('[data-testid="chart-description"]')).toContainText('pH levels over the last 7 days')
    await expect(chart).toHaveAttribute('aria-describedby', 'chart-description')
    
    // Test chart data table alternative
    await page.click('[data-testid="show-chart-data-table"]')
    const dataTable = page.locator('[data-testid="chart-data-table"]')
    await expect(dataTable).toBeVisible()
    await expect(dataTable).toHaveAttribute('role', 'table')
    
    // Verify data table has same information as chart
    await expect(page.locator('[data-testid="chart-data-table"] caption')).toContainText('pH Trend Data')
    
    // Test chart keyboard navigation
    await chart.focus()
    await page.keyboard.press('ArrowLeft') // Previous data point
    await page.keyboard.press('ArrowRight') // Next data point
    
    // Verify chart announcements for screen readers
    await expect(page.locator('[data-testid="chart-announcement"]')).toHaveAttribute('aria-live', 'polite')
  })

  test('Mobile Accessibility', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/mobile/test-entry')
    
    // Test mobile touch target sizes
    const touchTargets = page.locator('button, input, select, [role="button"]')
    const targetCount = await touchTargets.count()
    
    for (let i = 0; i < targetCount; i++) {
      const target = touchTargets.nth(i)
      const box = await target.boundingBox()
      
      if (box) {
        // WCAG 2.1 AAA minimum touch target size is 44x44 pixels
        expect(box.width).toBeGreaterThanOrEqual(44)
        expect(box.height).toBeGreaterThanOrEqual(44)
      }
    }
    
    // Test mobile navigation accessibility
    await expect(page.locator('[data-testid="mobile-nav"]')).toHaveAttribute('role', 'navigation')
    await expect(page.locator('[data-testid="mobile-nav"]')).toHaveAttribute('aria-label', 'Mobile navigation')
    
    // Test mobile form input accessibility
    const mobileInputs = page.locator('[data-testid*="input"]')
    const inputCount = await mobileInputs.count()
    
    for (let i = 0; i < inputCount; i++) {
      const input = mobileInputs.nth(i)
      
      // Verify mobile inputs have proper labels
      await expect(input).toHaveAttribute('aria-labelledby')
      
      // Verify mobile inputs have appropriate input types
      const inputType = await input.getAttribute('type')
      if (input.getAttribute('data-testid').includes('ph')) {
        expect(inputType).toBe('number')
      }
    }
    
    // Run mobile-specific accessibility check
    await checkA11y(page, null, {
      tags: ['wcag2a', 'wcag2aa', 'wcag21aa', 'mobile']
    })
  })

  test('High Contrast and Color Accessibility', async ({ page }) => {
    await page.goto('/overview')
    
    // Test high contrast mode
    await page.evaluate(() => {
      document.body.classList.add('high-contrast')
    })
    
    // Verify color contrast ratios
    await checkA11y(page, null, {
      rules: {
        'color-contrast': { enabled: true }
      }
    })
    
    // Test status indicators without relying only on color
    const statusIndicators = page.locator('[data-testid*="status-"]')
    const statusCount = await statusIndicators.count()
    
    for (let i = 0; i < statusCount; i++) {
      const indicator = statusIndicators.nth(i)
      
      // Verify status has text or icon in addition to color
      const hasText = await indicator.textContent()
      const hasIcon = await indicator.locator('[data-testid*="icon"]').count()
      
      expect(hasText || hasIcon > 0).toBeTruthy()
    }
    
    // Test chemical level indicators
    const chemicalIndicators = page.locator('[data-testid*="chemical-level-"]')
    const chemicalCount = await chemicalIndicators.count()
    
    for (let i = 0; i < chemicalCount; i++) {
      const indicator = chemicalIndicators.nth(i)
      
      // Verify chemical levels have text descriptions
      await expect(indicator).toHaveAttribute('aria-label')
      
      // Verify patterns or shapes used in addition to color
      const hasPattern = await indicator.locator('[data-testid*="pattern"]').count()
      expect(hasPattern > 0).toBeTruthy()
    }
  })

  test('Focus Management and Keyboard Navigation', async ({ page }) => {
    await page.goto('/overview')
    
    // Test skip links
    await page.keyboard.press('Tab')
    await expect(page.locator('[data-testid="skip-to-main"]')).toBeFocused()
    
    await page.keyboard.press('Enter')
    await expect(page.locator('main')).toBeFocused()
    
    // Test focus trap in modal dialogs
    await page.click('[data-testid="pool-card-pool-001"]')
    const modal = page.locator('[data-testid="pool-details-modal"]')
    await expect(modal).toBeVisible()
    
    // Focus should be trapped within modal
    const focusableElements = modal.locator('button, input, select, [tabindex="0"]')
    const firstElement = focusableElements.first()
    const lastElement = focusableElements.last()
    
    await expect(firstElement).toBeFocused()
    
    // Tab to last element
    const elementCount = await focusableElements.count()
    for (let i = 1; i < elementCount; i++) {
      await page.keyboard.press('Tab')
    }
    await expect(lastElement).toBeFocused()
    
    // Tab again should cycle back to first element
    await page.keyboard.press('Tab')
    await expect(firstElement).toBeFocused()
    
    // Test Shift+Tab reverse navigation
    await page.keyboard.press('Shift+Tab')
    await expect(lastElement).toBeFocused()
    
    // Close modal and verify focus returns
    await page.keyboard.press('Escape')
    await expect(modal).not.toBeVisible()
    await expect(page.locator('[data-testid="pool-card-pool-001"]')).toBeFocused()
  })

  test('Screen Reader Announcements', async ({ page }) => {
    await page.goto('/overview')
    
    // Test live region announcements
    const liveRegion = page.locator('[data-testid="live-announcements"]')
    await expect(liveRegion).toHaveAttribute('aria-live', 'polite')
    
    // Trigger status update
    await page.evaluate(() => {
      const event = new CustomEvent('status-update', {
        detail: { message: 'Pool chemical test completed successfully' }
      })
      window.dispatchEvent(event)
    })
    
    // Verify announcement appears in live region
    await expect(liveRegion).toContainText('Pool chemical test completed successfully')
    
    // Test critical announcements
    const criticalRegion = page.locator('[data-testid="critical-announcements"]')
    await expect(criticalRegion).toHaveAttribute('aria-live', 'assertive')
    
    // Trigger critical alert
    await page.evaluate(() => {
      const event = new CustomEvent('critical-alert', {
        detail: { message: 'CRITICAL: Pool closure required immediately' }
      })
      window.dispatchEvent(event)
    })
    
    // Verify critical announcement
    await expect(criticalRegion).toContainText('CRITICAL: Pool closure required immediately')
  })

  test('Alternative Text and Media Accessibility', async ({ page }) => {
    await page.goto('/trends')
    
    // Test image alternative text
    const images = page.locator('img')
    const imageCount = await images.count()
    
    for (let i = 0; i < imageCount; i++) {
      const image = images.nth(i)
      const alt = await image.getAttribute('alt')
      
      // Verify all images have meaningful alt text
      expect(alt).toBeTruthy()
      expect(alt.length).toBeGreaterThan(0)
      
      // Decorative images should have empty alt
      const isDecorative = await image.getAttribute('data-decorative')
      if (isDecorative === 'true') {
        expect(alt).toBe('')
      }
    }
    
    // Test video accessibility (if present)
    const videos = page.locator('video')
    const videoCount = await videos.count()
    
    for (let i = 0; i < videoCount; i++) {
      const video = videos.nth(i)
      
      // Verify video has captions
      await expect(video.locator('track[kind="captions"]')).toBeAttached()
      
      // Verify video has transcript link
      await expect(page.locator(`[data-testid="video-transcript-${i}"]`)).toBeVisible()
    }
  })
})

test.describe('WCAG Compliance Verification', () => {
  const testPages = [
    '/overview',
    '/pool-facilities', 
    '/trends',
    '/alerts',
    '/mobile/test-entry'
  ]
  
  for (const pagePath of testPages) {
    test(`WCAG 2.1 AA compliance - ${pagePath}`, async ({ page }) => {
      await page.goto(pagePath)
      await injectAxe(page)
      
      // Run comprehensive WCAG 2.1 AA check
      await checkA11y(page, null, {
        tags: ['wcag2a', 'wcag2aa', 'wcag21aa'],
        include: ['main', '[role="main"]'],
        exclude: ['[data-testid="third-party-widget"]'] // Exclude third-party components
      })
    })
  }
  
  test('Color contrast compliance across themes', async ({ page }) => {
    const themes = ['light', 'dark', 'high-contrast']
    
    for (const theme of themes) {
      await page.goto('/overview')
      
      // Apply theme
      await page.evaluate((themeName) => {
        document.body.className = `theme-${themeName}`
      }, theme)
      
      await injectAxe(page)
      
      // Check color contrast for current theme
      await checkA11y(page, null, {
        rules: {
          'color-contrast': { enabled: true },
          'color-contrast-enhanced': { enabled: true }
        }
      })
    }
  })
})