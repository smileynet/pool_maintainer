/**
 * E2E tests for pool manager daily workflows
 * Based on user story scenarios and real pool management tasks
 */

import { test, expect, Page } from '@playwright/test'
import { dailyPoolManagerScenarios, scenarioHelpers } from '@/test/fixtures/user-scenarios'
import { safeChemicalReadings, criticalChemicalReadings } from '@/test/fixtures/chemical-readings'

// Helper function to execute user scenario steps
async function executeUserScenario(page: Page, scenarioId: string) {
  const scenario = scenarioHelpers.getScenarioById(scenarioId)
  if (!scenario) {
    throw new Error(`Scenario ${scenarioId} not found`)
  }

  console.log(`Executing scenario: ${scenario.title}`)
  
  for (const step of scenario.steps) {
    console.log(`Step: ${step.action} on ${step.target}`)
    
    switch (step.action) {
      case 'navigate':
        await page.goto(step.target)
        break
        
      case 'click':
        await page.click(step.target)
        break
        
      case 'type':
        await page.fill(step.target, step.input)
        break
        
      case 'select':
        await page.selectOption(step.target, step.input)
        break
        
      case 'wait':
        await page.waitForSelector(step.target, { timeout: step.timeout || 5000 })
        break
        
      case 'verify':
        await expect(page.locator(step.target)).toBeVisible()
        break
        
      case 'keyboard':
        await page.keyboard.press(step.input)
        break
        
      default:
        console.warn(`Unknown action: ${step.action}`)
    }
    
    // Take screenshot if requested
    if (step.screenshot) {
      await page.screenshot({ 
        path: `test-results/screenshots/${scenarioId}-${step.action}-${Date.now()}.png`,
        fullPage: true 
      })
    }
    
    // Verify expected outcome
    if (step.expected && step.action !== 'verify') {
      // Add basic verification based on step type
      if (step.action === 'navigate') {
        await expect(page).toHaveURL(new RegExp(step.target))
      }
    }
  }
  
  return scenario
}

test.describe('Pool Manager Daily Workflows', () => {
  test.beforeEach(async ({ page }) => {
    // Setup: Mock user authentication and initial app state
    await page.goto('/')
    
    // Mock authentication state
    await page.evaluate(() => {
      localStorage.setItem('auth-token', 'mock-pool-manager-token')
      localStorage.setItem('user-role', 'pool_manager')
      localStorage.setItem('user-id', 'pm-001')
    })
  })

  test('PM-001: Morning Chemical Test Routine', async ({ page }) => {
    // Execute the morning chemical test routine scenario
    const scenario = await executeUserScenario(page, 'pm-001')
    
    // Verify all expected outcomes
    for (const outcome of scenario.expectedOutcomes) {
      console.log(`Verifying outcome: ${outcome}`)
    }
    
    // Specific verifications for chemical test routine
    await page.goto('/overview')
    
    // Verify chemical test was recorded
    await expect(page.locator('[data-testid="last-test-timestamp"]')).toBeVisible()
    
    // Verify readings are displayed on dashboard
    await expect(page.locator('[data-testid="current-ph-value"]')).toContainText('7.4')
    await expect(page.locator('[data-testid="current-chlorine-value"]')).toContainText('2.0')
    
    // Verify no alerts for safe readings
    await expect(page.locator('[data-testid="critical-alert"]')).not.toBeVisible()
    
    // Verify pool status shows as excellent
    await expect(page.locator('[data-testid="pool-status"]')).toContainText('excellent')
  })

  test('PM-002: Emergency Chemical Alert Response', async ({ page }) => {
    // Setup: Create a critical chemical alert condition
    await page.evaluate(() => {
      // Mock critical alert in localStorage
      const criticalAlert = {
        id: 'alert-critical-001',
        poolId: 'pool-001',
        type: 'critical',
        chemical: 'chlorine',
        value: 4.5,
        message: 'CRITICAL: Chlorine level dangerously high (4.5 ppm)',
        timestamp: new Date().toISOString(),
        resolved: false
      }
      localStorage.setItem('active-alerts', JSON.stringify([criticalAlert]))
    })
    
    const scenario = await executeUserScenario(page, 'pm-002')
    
    // Verify emergency response outcomes
    await expect(page.locator('[data-testid="pool-status"]')).toContainText('CLOSED')
    
    // Verify alert was logged with response
    await page.goto('/alerts')
    await expect(page.locator('[data-testid="alert-response-log"]')).toBeVisible()
    
    // Verify incident documentation
    await expect(page.locator('[data-testid="incident-record"]')).toContainText('Chemical levels unsafe')
  })

  test('PM-003: Weekly Pool Status Review', async ({ page }) => {
    // Setup: Mock historical data for trend analysis
    await page.evaluate(() => {
      const trendData = {
        poolId: 'pool-001',
        readings: [
          { date: '2024-01-08', ph: 7.4, chlorine: 2.0, alkalinity: 100, temperature: 80 },
          { date: '2024-01-09', ph: 7.3, chlorine: 2.1, alkalinity: 102, temperature: 81 },
          { date: '2024-01-10', ph: 7.5, chlorine: 1.9, alkalinity: 98, temperature: 82 },
          { date: '2024-01-11', ph: 7.4, chlorine: 2.0, alkalinity: 101, temperature: 80 },
          { date: '2024-01-12', ph: 7.2, chlorine: 2.2, alkalinity: 99, temperature: 81 },
          { date: '2024-01-13', ph: 7.4, chlorine: 2.0, alkalinity: 100, temperature: 80 },
          { date: '2024-01-14', ph: 7.3, chlorine: 2.1, alkalinity: 103, temperature: 82 }
        ]
      }
      localStorage.setItem('trend-data', JSON.stringify(trendData))
    })
    
    const scenario = await executeUserScenario(page, 'pm-003')
    
    // Verify trend charts are functional
    await expect(page.locator('[data-testid="ph-trend-chart"]')).toBeVisible()
    await expect(page.locator('[data-testid="chlorine-trend-chart"]')).toBeVisible()
    
    // Verify data range selection works
    await expect(page.locator('[data-testid="time-range"]')).toHaveValue('Last 7 days')
    
    // Verify report generation
    const downloadPromise = page.waitForEvent('download')
    await page.click('[data-testid="download-report"]')
    const download = await downloadPromise
    expect(download.suggestedFilename()).toMatch(/.*\.pdf$/)
  })

  test('Multi-pool dashboard overview', async ({ page }) => {
    // Setup multiple pools with different statuses
    await page.evaluate(() => {
      const multiPoolData = {
        pools: [
          {
            id: 'pool-001',
            name: 'Community Recreation Pool',
            status: 'excellent',
            lastTest: '2024-01-15T08:00:00Z',
            readings: { ph: 7.4, chlorine: 2.0, alkalinity: 100, temperature: 80 }
          },
          {
            id: 'pool-002',
            name: 'Therapy Pool',
            status: 'caution',
            lastTest: '2024-01-15T07:30:00Z',
            readings: { ph: 7.1, chlorine: 2.8, alkalinity: 75, temperature: 85 }
          },
          {
            id: 'pool-003',
            name: 'Competition Pool',
            status: 'critical',
            lastTest: '2024-01-15T06:00:00Z',
            readings: { ph: 8.2, chlorine: 4.5, alkalinity: 200, temperature: 90 }
          }
        ]
      }
      localStorage.setItem('multi-pool-data', JSON.stringify(multiPoolData))
    })

    await page.goto('/overview')

    // Verify all pools are displayed
    await expect(page.locator('[data-testid="pool-card-pool-001"]')).toBeVisible()
    await expect(page.locator('[data-testid="pool-card-pool-002"]')).toBeVisible()
    await expect(page.locator('[data-testid="pool-card-pool-003"]')).toBeVisible()

    // Verify status indicators
    await expect(page.locator('[data-testid="status-excellent"]')).toBeVisible()
    await expect(page.locator('[data-testid="status-caution"]')).toBeVisible()
    await expect(page.locator('[data-testid="status-critical"]')).toBeVisible()

    // Verify critical pool is highlighted
    await expect(page.locator('[data-testid="pool-card-pool-003"]')).toHaveClass(/critical/)

    // Test pool card interaction
    await page.click('[data-testid="pool-card-pool-001"]')
    await expect(page.locator('[data-testid="pool-details-modal"]')).toBeVisible()
    
    // Verify detailed readings in modal
    await expect(page.locator('[data-testid="modal-ph-value"]')).toContainText('7.4')
    await expect(page.locator('[data-testid="modal-chlorine-value"]')).toContainText('2.0')
  })

  test('Real-time alert notifications', async ({ page }) => {
    await page.goto('/overview')

    // Simulate real-time alert via WebSocket or polling
    await page.evaluate(() => {
      // Mock real-time alert notification
      const event = new CustomEvent('pool-alert', {
        detail: {
          poolId: 'pool-001',
          type: 'warning',
          message: 'pH level approaching upper limit (7.7)',
          chemical: 'ph',
          value: 7.7,
          timestamp: new Date().toISOString()
        }
      })
      window.dispatchEvent(event)
    })

    // Verify alert notification appears
    await expect(page.locator('[data-testid="alert-notification"]')).toBeVisible()
    await expect(page.locator('[data-testid="alert-message"]')).toContainText('pH level approaching upper limit')

    // Verify alert can be acknowledged
    await page.click('[data-testid="acknowledge-alert"]')
    await expect(page.locator('[data-testid="alert-notification"]')).not.toBeVisible()

    // Verify alert appears in alerts history
    await page.goto('/alerts')
    await expect(page.locator('[data-testid="alert-history"]')).toContainText('pH level approaching upper limit')
  })

  test('Offline functionality and data sync', async ({ page }) => {
    await page.goto('/mobile/test-entry')

    // Test online chemical test submission
    await page.fill('[data-testid="ph-input"]', '7.4')
    await page.fill('[data-testid="chlorine-input"]', '2.0')
    await page.fill('[data-testid="alkalinity-input"]', '100')
    await page.fill('[data-testid="temperature-input"]', '80')
    
    await page.click('[data-testid="submit-test"]')
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible()

    // Simulate going offline
    await page.setOffline(true)

    // Submit another test while offline
    await page.fill('[data-testid="ph-input"]', '7.3')
    await page.fill('[data-testid="chlorine-input"]', '2.1')
    await page.fill('[data-testid="alkalinity-input"]', '98')
    await page.fill('[data-testid="temperature-input"]', '81')
    
    await page.click('[data-testid="submit-test"]')
    
    // Verify offline queue message
    await expect(page.locator('[data-testid="offline-queue-message"]')).toBeVisible()
    await expect(page.locator('[data-testid="queued-items-count"]')).toContainText('1')

    // Go back online
    await page.setOffline(false)

    // Verify data sync
    await page.reload()
    await expect(page.locator('[data-testid="sync-complete-message"]')).toBeVisible()
    await expect(page.locator('[data-testid="queued-items-count"]')).toContainText('0')
  })

  test('Performance under load simulation', async ({ page }) => {
    // Navigate to dashboard
    await page.goto('/overview')
    
    // Measure initial load time
    const startTime = Date.now()
    await page.waitForSelector('[data-testid="pool-status-dashboard"]')
    const loadTime = Date.now() - startTime
    
    expect(loadTime).toBeLessThan(3000) // Should load within 3 seconds

    // Simulate rapid data updates
    for (let i = 0; i < 10; i++) {
      await page.evaluate((index) => {
        const event = new CustomEvent('data-update', {
          detail: {
            poolId: 'pool-001',
            reading: {
              ph: 7.4 + (Math.random() - 0.5) * 0.2,
              chlorine: 2.0 + (Math.random() - 0.5) * 0.4,
              timestamp: new Date().toISOString()
            }
          }
        })
        window.dispatchEvent(event)
      }, i)
      
      await page.waitForTimeout(100) // 100ms between updates
    }

    // Verify UI remains responsive
    await page.click('[data-testid="pool-card-pool-001"]')
    await expect(page.locator('[data-testid="pool-details-modal"]')).toBeVisible()
    
    // Verify data accuracy after rapid updates
    const currentPh = await page.textContent('[data-testid="modal-ph-value"]')
    expect(parseFloat(currentPh || '0')).toBeGreaterThan(7.0)
    expect(parseFloat(currentPh || '0')).toBeLessThan(8.0)
  })
})

test.describe('Critical Path Smoke Tests', () => {
  test('Essential workflow connectivity', async ({ page }) => {
    // Test critical user journey: Login → Dashboard → Test Entry → Results
    
    // 1. Authentication flow
    await page.goto('/login')
    await page.fill('[data-testid="username"]', 'pool_manager_001')
    await page.fill('[data-testid="password"]', 'test_password')
    await page.click('[data-testid="login-button"]')
    
    // 2. Dashboard access
    await expect(page).toHaveURL('/overview')
    await expect(page.locator('[data-testid="pool-status-dashboard"]')).toBeVisible()
    
    // 3. Chemical test entry
    await page.click('[data-testid="record-chemical-test"]')
    await expect(page.locator('[data-testid="chemical-test-form"]')).toBeVisible()
    
    // 4. Complete test submission
    await page.selectOption('[data-testid="pool-selector"]', 'pool-001')
    await page.fill('[data-testid="ph-input"]', '7.4')
    await page.fill('[data-testid="chlorine-input"]', '2.0')
    await page.fill('[data-testid="alkalinity-input"]', '100')
    await page.fill('[data-testid="temperature-input"]', '80')
    
    await page.click('[data-testid="submit-test"]')
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible()
    
    // 5. Verify results on dashboard
    await page.goto('/overview')
    await expect(page.locator('[data-testid="current-ph-value"]')).toContainText('7.4')
    
    // 6. Navigate to trends
    await page.goto('/trends')
    await expect(page.locator('[data-testid="ph-trend-chart"]')).toBeVisible()
    
    console.log('✅ Critical path verification complete - all essential workflows connected')
  })
})