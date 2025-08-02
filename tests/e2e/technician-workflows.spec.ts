/**
 * E2E tests for pool technician field workflows
 * Mobile-optimized interfaces and corrective action documentation
 */

import { test, expect, Page, devices } from '@playwright/test'
import { technicianScenarios, scenarioHelpers } from '@/test/fixtures/user-scenarios'
import { warningChemicalReadings, criticalChemicalReadings } from '@/test/fixtures/chemical-readings'

test.describe('Technician Field Workflows', () => {
  test.beforeEach(async ({ page }) => {
    // Setup mobile viewport for field testing scenarios
    await page.setViewportSize({ width: 375, height: 812 })
    
    // Mock technician authentication
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.setItem('auth-token', 'mock-technician-token')
      localStorage.setItem('user-role', 'technician')
      localStorage.setItem('user-id', 'tech-001')
      localStorage.setItem('certified-pools', JSON.stringify(['pool-001', 'pool-002', 'pool-003']))
    })
  })

  test('TECH-001: Field Chemical Testing with Mobile Device', async ({ page }) => {
    const scenario = scenarioHelpers.getScenarioById('tech-001')!
    
    // Navigate to mobile test entry
    await page.goto('/mobile/test-entry')
    
    // Verify mobile-optimized interface
    await expect(page.locator('[data-testid="mobile-test-form"]')).toBeVisible()
    await expect(page.locator('[data-testid="large-input-fields"]')).toBeVisible()
    
    // Simulate QR code pool selection
    await page.evaluate(() => {
      // Mock QR scanner result
      const event = new CustomEvent('qr-scan-result', {
        detail: { poolId: 'pool-002', poolName: 'Therapy Pool' }
      })
      window.dispatchEvent(event)
    })
    
    await expect(page.locator('[data-testid="selected-pool"]')).toContainText('Therapy Pool')
    
    // Enter chemical readings that trigger warnings
    await page.fill('[data-testid="ph-input"]', '7.1') // Below optimal
    await page.fill('[data-testid="chlorine-input"]', '2.8') // Near upper limit
    await page.fill('[data-testid="alkalinity-input"]', '75') // Below optimal
    await page.fill('[data-testid="temperature-input"]', '85') // Above optimal
    
    // Verify warning indicators appear
    await expect(page.locator('[data-testid="ph-warning"]')).toBeVisible()
    await expect(page.locator('[data-testid="alkalinity-warning"]')).toBeVisible()
    await expect(page.locator('[data-testid="temperature-warning"]')).toBeVisible()
    
    // Verify multiple warnings summary
    await expect(page.locator('[data-testid="warning-summary"]')).toContainText('3 parameters need attention')
    
    // Add corrective actions
    await page.click('[data-testid="add-corrective-action"]')
    await expect(page.locator('[data-testid="corrective-actions-form"]')).toBeVisible()
    
    // Select predefined actions
    await page.check('[data-testid="action-ph-increaser"]')
    await page.check('[data-testid="action-reduce-chlorine"]')
    await page.check('[data-testid="action-check-heater"]')
    
    // Add custom action notes
    await page.fill('[data-testid="custom-action-notes"]', 
      'Added pH increaser (2 lbs), reduced chlorine feeder rate to 50%, checked heater thermostat')
    
    // Submit test with actions
    await page.click('[data-testid="submit-with-actions"]')
    
    // Verify submission success
    await expect(page.locator('[data-testid="submission-success"]')).toBeVisible()
    await expect(page.locator('[data-testid="follow-up-scheduled"]')).toContainText('Follow-up test scheduled in 2 hours')
    
    // Verify notification to supervisor
    await expect(page.locator('[data-testid="supervisor-notified"]')).toContainText('Supervisor has been notified')
    
    // Take screenshot for documentation
    await page.screenshot({ 
      path: 'test-results/screenshots/technician-field-test-complete.png',
      fullPage: true 
    })
  })

  test('Mobile QR Code Pool Selection', async ({ page }) => {
    await page.goto('/mobile/test-entry')
    
    // Test QR scanner activation
    await page.click('[data-testid="qr-scanner-button"]')
    await expect(page.locator('[data-testid="qr-scanner-modal"]')).toBeVisible()
    
    // Simulate camera permission granted
    await page.evaluate(() => {
      const event = new CustomEvent('camera-permission', { detail: { granted: true } })
      window.dispatchEvent(event)
    })
    
    // Simulate QR code detection
    await page.evaluate(() => {
      const qrData = {
        poolId: 'pool-001',
        poolName: 'Community Recreation Pool',
        location: 'Building A, Main Pool Area',
        lastMaintenance: '2024-01-14T16:00:00Z'
      }
      
      const event = new CustomEvent('qr-detected', { detail: qrData })
      window.dispatchEvent(event)
    })
    
    // Verify pool information loaded
    await expect(page.locator('[data-testid="scanned-pool-info"]')).toBeVisible()
    await expect(page.locator('[data-testid="pool-name"]')).toContainText('Community Recreation Pool')
    await expect(page.locator('[data-testid="pool-location"]')).toContainText('Building A, Main Pool Area')
    
    // Confirm pool selection
    await page.click('[data-testid="confirm-pool-selection"]')
    await expect(page.locator('[data-testid="selected-pool-badge"]')).toContainText('Community Recreation Pool')
  })

  test('Corrective Action Documentation Workflow', async ({ page }) => {
    await page.goto('/mobile/test-entry')
    
    // Setup pool and enter readings requiring immediate action
    await page.evaluate(() => {
      const event = new CustomEvent('qr-scan-result', {
        detail: { poolId: 'pool-003', poolName: 'Competition Pool' }
      })
      window.dispatchEvent(event)
    })
    
    // Enter critical readings
    await page.fill('[data-testid="ph-input"]', '8.1') // Critical high
    await page.fill('[data-testid="chlorine-input"]', '4.2') // Critical high
    await page.fill('[data-testid="alkalinity-input"]', '180') // Critical high
    await page.fill('[data-testid="temperature-input"]', '88') // High
    
    // Verify critical alert triggered
    await expect(page.locator('[data-testid="critical-alert-banner"]')).toBeVisible()
    await expect(page.locator('[data-testid="immediate-action-required"]')).toContainText('IMMEDIATE ACTION REQUIRED')
    
    // Verify corrective actions are mandator for critical readings
    await expect(page.locator('[data-testid="corrective-actions-required"]')).toBeVisible()
    
    // Document immediate actions taken
    await page.click('[data-testid="emergency-actions"]')
    
    // Select emergency protocols
    await page.check('[data-testid="action-pool-evacuation"]')
    await page.check('[data-testid="action-emergency-dilution"]')
    await page.check('[data-testid="action-supervisor-call"]')
    
    // Add detailed emergency response notes
    await page.fill('[data-testid="emergency-notes"]', 
      'EMERGENCY RESPONSE: Pool evacuated immediately. Started emergency dilution protocol. Called supervisor (John Smith) at 14:35. Contacting pool equipment technician for chemical feed system inspection.')
    
    // Upload photo evidence (simulate)
    await page.setInputFiles('[data-testid="photo-upload"]', 'test-fixtures/chemical-reading-photo.jpg')
    await expect(page.locator('[data-testid="photo-preview"]')).toBeVisible()
    
    // Set follow-up requirements
    await page.selectOption('[data-testid="follow-up-schedule"]', 'immediate')
    await page.fill('[data-testid="follow-up-notes"]', 
      'Retest required in 30 minutes after dilution. Equipment inspection needed before reopening.')
    
    // Submit emergency documentation
    await page.click('[data-testid="submit-emergency-report"]')
    
    // Verify emergency protocols activated
    await expect(page.locator('[data-testid="emergency-submitted"]')).toBeVisible()
    await expect(page.locator('[data-testid="pool-closure-status"]')).toContainText('Pool automatically closed')
    await expect(page.locator('[data-testid="authorities-notified"]')).toContainText('Authorities notified')
  })

  test('Multiple Pool Route Testing', async ({ page }) => {
    // Simulate technician route with multiple pool testing
    const pools = [
      { id: 'pool-001', name: 'Community Pool', readings: { ph: 7.4, chlorine: 2.0, alkalinity: 100, temp: 80 } },
      { id: 'pool-002', name: 'Therapy Pool', readings: { ph: 7.2, chlorine: 1.8, alkalinity: 110, temp: 84 } },
      { id: 'pool-003', name: 'Competition Pool', readings: { ph: 7.6, chlorine: 3.0, alkalinity: 95, temp: 78 } }
    ]
    
    for (let i = 0; i < pools.length; i++) {
      const pool = pools[i]
      
      await page.goto('/mobile/test-entry')
      
      // Select pool
      await page.evaluate((poolData) => {
        const event = new CustomEvent('qr-scan-result', {
          detail: { poolId: poolData.id, poolName: poolData.name }
        })
        window.dispatchEvent(event)
      }, pool)
      
      // Enter readings
      await page.fill('[data-testid="ph-input"]', pool.readings.ph.toString())
      await page.fill('[data-testid="chlorine-input"]', pool.readings.chlorine.toString())
      await page.fill('[data-testid="alkalinity-input"]', pool.readings.alkalinity.toString())
      await page.fill('[data-testid="temperature-input"]', pool.readings.temp.toString())
      
      // Add route notes
      await page.fill('[data-testid="notes-input"]', `Route test ${i + 1}/3 - ${pool.name}`)
      
      // Submit test
      await page.click('[data-testid="submit-test"]')
      await expect(page.locator('[data-testid="submission-success"]')).toBeVisible()
      
      // Verify test added to route summary
      await page.goto('/mobile/route-summary')
      await expect(page.locator(`[data-testid="route-item-${pool.id}"]`)).toBeVisible()
      await expect(page.locator(`[data-testid="route-item-${pool.id}"]`)).toContainText(pool.name)
    }
    
    // Complete route and sync all data
    await page.click('[data-testid="complete-route"]')
    await expect(page.locator('[data-testid="route-complete-summary"]')).toBeVisible()
    await expect(page.locator('[data-testid="tests-completed-count"]')).toContainText('3')
    
    // Sync all route data
    await page.click('[data-testid="sync-route-data"]')
    await expect(page.locator('[data-testid="sync-complete"]')).toBeVisible()
  })

  test('Offline Capability and Data Persistence', async ({ page }) => {
    await page.goto('/mobile/test-entry')
    
    // Go offline
    await page.setOffline(true)
    
    // Verify offline mode indicator
    await expect(page.locator('[data-testid="offline-indicator"]')).toBeVisible()
    await expect(page.locator('[data-testid="offline-message"]')).toContainText('Working offline')
    
    // Enter test data while offline
    await page.evaluate(() => {
      const event = new CustomEvent('qr-scan-result', {
        detail: { poolId: 'pool-001', poolName: 'Community Pool' }
      })
      window.dispatchEvent(event)
    })
    
    await page.fill('[data-testid="ph-input"]', '7.5')
    await page.fill('[data-testid="chlorine-input"]', '2.1')
    await page.fill('[data-testid="alkalinity-input"]', '98')
    await page.fill('[data-testid="temperature-input"]', '81')
    await page.fill('[data-testid="notes-input"]', 'Offline test entry - sync when online')
    
    // Submit while offline
    await page.click('[data-testid="submit-test"]')
    
    // Verify offline queue
    await expect(page.locator('[data-testid="offline-queue-notification"]')).toBeVisible()
    await expect(page.locator('[data-testid="queued-tests-count"]')).toContainText('1')
    
    // Add second test to queue
    await page.fill('[data-testid="ph-input"]', '7.3')
    await page.fill('[data-testid="chlorine-input"]', '1.9')
    await page.click('[data-testid="submit-test"]')
    await expect(page.locator('[data-testid="queued-tests-count"]')).toContainText('2')
    
    // Go back online
    await page.setOffline(false)
    await page.reload()
    
    // Verify automatic sync
    await expect(page.locator('[data-testid="sync-in-progress"]')).toBeVisible()
    await expect(page.locator('[data-testid="sync-complete"]')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('[data-testid="queued-tests-count"]')).toContainText('0')
    
    // Verify synced data appears in dashboard
    await page.goto('/overview')
    await expect(page.locator('[data-testid="recent-tests"]')).toContainText('Offline test entry')
  })

  test('Photo Documentation and Equipment Inspection', async ({ page }) => {
    await page.goto('/mobile/inspection')
    
    // Start equipment inspection workflow
    await page.click('[data-testid="start-inspection"]')
    
    // Select equipment types to inspect
    await page.check('[data-testid="inspect-chemical-feeders"]')
    await page.check('[data-testid="inspect-filtration-system"]')
    await page.check('[data-testid="inspect-heating-system"]')
    
    // Chemical feeder inspection
    await page.click('[data-testid="chemical-feeder-inspection"]')
    
    // Take photos of equipment
    const photoFiles = ['feeder-1.jpg', 'feeder-2.jpg', 'control-panel.jpg']
    for (const file of photoFiles) {
      await page.click('[data-testid="add-inspection-photo"]')
      await page.setInputFiles('[data-testid="photo-input"]', `test-fixtures/${file}`)
      await expect(page.locator(`[data-testid="photo-preview-${file}"]`)).toBeVisible()
    }
    
    // Add inspection notes
    await page.fill('[data-testid="inspection-notes"]', 
      'Chemical feeders operating normally. Chlorine level at 75%, pH solution at 60%. No leaks detected. Control panel responding correctly.')
    
    // Mark any issues found
    await page.click('[data-testid="add-issue"]')
    await page.selectOption('[data-testid="issue-type"]', 'maintenance-needed')
    await page.fill('[data-testid="issue-description"]', 
      'pH solution tank needs refill within 48 hours. Scheduled for Thursday maintenance.')
    
    // Complete inspection
    await page.click('[data-testid="complete-inspection"]')
    
    // Verify inspection record created
    await expect(page.locator('[data-testid="inspection-complete"]')).toBeVisible()
    await expect(page.locator('[data-testid="inspection-id"]')).toBeVisible()
    
    // Verify photos uploaded and notes saved
    await page.goto('/inspections')
    await expect(page.locator('[data-testid="recent-inspection"]')).toContainText('Chemical feeders')
    await expect(page.locator('[data-testid="inspection-photos-count"]')).toContainText('3 photos')
  })

  test('Emergency Communication and Escalation', async ({ page }) => {
    await page.goto('/mobile/test-entry')
    
    // Enter readings that require immediate escalation
    await page.evaluate(() => {
      const event = new CustomEvent('qr-scan-result', {
        detail: { poolId: 'pool-002', poolName: 'Therapy Pool' }
      })
      window.dispatchEvent(event)
    })
    
    await page.fill('[data-testid="ph-input"]', '6.4') // Critically low
    await page.fill('[data-testid="chlorine-input"]', '0.3') // Critically low
    await page.fill('[data-testid="alkalinity-input"]', '45') // Critically low
    
    // Verify emergency escalation triggered
    await expect(page.locator('[data-testid="emergency-escalation"]')).toBeVisible()
    await expect(page.locator('[data-testid="automatic-notifications"]')).toContainText('Supervisor and manager automatically notified')
    
    // Emergency communication options
    await page.click('[data-testid="emergency-communication"]')
    
    // Send immediate alert
    await page.click('[data-testid="send-immediate-alert"]')
    await expect(page.locator('[data-testid="alert-sent-confirmation"]')).toContainText('Emergency alert sent to on-call manager')
    
    // Call supervisor directly
    await page.click('[data-testid="call-supervisor"]')
    await expect(page.locator('[data-testid="call-initiated"]')).toBeVisible()
    
    // Document emergency response
    await page.fill('[data-testid="emergency-response-log"]', 
      'CRITICAL CHEMICAL FAILURE: All chemical levels critically low. Pool evacuated. Emergency chemical balancing initiated. Supervisor called at 15:42. Manager en route.')
    
    // Set pool to emergency closure
    await page.click('[data-testid="emergency-closure"]')
    await expect(page.locator('[data-testid="emergency-closure-active"]')).toContainText('Pool closed for emergency chemical treatment')
    
    // Submit emergency report
    await page.click('[data-testid="submit-emergency-report"]')
    
    // Verify emergency protocols completed
    await expect(page.locator('[data-testid="emergency-protocols-complete"]')).toBeVisible()
    await expect(page.locator('[data-testid="incident-tracking-number"]')).toBeVisible()
  })
})

test.describe('Mobile Performance and Usability', () => {
  
  test('Touch interface optimization', async ({ page }) => {
    await page.goto('/mobile/test-entry')
    
    // Verify large touch targets
    const inputElements = await page.locator('[data-testid*="input"]').all()
    for (const element of inputElements) {
      const box = await element.boundingBox()
      expect(box!.height).toBeGreaterThan(44) // Minimum touch target size
    }
    
    // Test touch gestures
    await page.touchTap('[data-testid="ph-input"]')
    await expect(page.locator('[data-testid="ph-input"]')).toBeFocused()
    
    // Test swipe navigation
    await page.touchswipe('[data-testid="form-container"]', 0, -200, 500)
    await expect(page.locator('[data-testid="submit-section"]')).toBeInViewport()
  })
  
  test('Mobile performance benchmarks', async ({ page }) => {
    const startTime = Date.now()
    await page.goto('/mobile/test-entry')
    await page.waitForSelector('[data-testid="mobile-test-form"]')
    const loadTime = Date.now() - startTime
    
    // Mobile load time should be under 2 seconds
    expect(loadTime).toBeLessThan(2000)
    
    // Test form input responsiveness
    const inputStart = Date.now()
    await page.fill('[data-testid="ph-input"]', '7.4')
    const inputTime = Date.now() - inputStart
    
    expect(inputTime).toBeLessThan(100) // Input should be immediate
  })
})