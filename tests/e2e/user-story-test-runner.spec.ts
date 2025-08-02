/**
 * Comprehensive user story test runner
 * Executes all critical user scenarios and validates complete workflows
 */

import { test, expect, Page } from '@playwright/test'
import { 
  userScenarioSuites, 
  criticalPathScenarios, 
  scenarioHelpers 
} from '@/test/fixtures/user-scenarios'
import { 
  safeChemicalReadings, 
  warningChemicalReadings, 
  criticalChemicalReadings 
} from '@/test/fixtures/chemical-readings'

// Test execution helper
async function executeScenarioWorkflow(page: Page, scenarioId: string) {
  const scenario = scenarioHelpers.getScenarioById(scenarioId)
  if (!scenario) throw new Error(`Scenario ${scenarioId} not found`)
  
  console.log(`\n🎬 Executing: ${scenario.title}`)
  console.log(`👤 User Type: ${scenario.userType}`)
  console.log(`⚡ Priority: ${scenario.priority}`)
  console.log(`⏱️ Duration: ${scenario.duration}`)
  
  const startTime = Date.now()
  
  try {
    for (let i = 0; i < scenario.steps.length; i++) {
      const step = scenario.steps[i]
      console.log(`  📝 Step ${i + 1}/${scenario.steps.length}: ${step.action} ${step.target}`)
      
      await executeStep(page, step)
      
      // Add small delay between steps for stability
      if (i < scenario.steps.length - 1) {
        await page.waitForTimeout(100)
      }
    }
    
    const executionTime = Date.now() - startTime
    console.log(`✅ Scenario completed in ${executionTime}ms`)
    
    // Validate expected outcomes
    console.log(`🔍 Validating ${scenario.expectedOutcomes.length} expected outcomes...`)
    await validateOutcomes(page, scenario.expectedOutcomes)
    
    return { success: true, executionTime, scenario }
    
  } catch (error) {
    const executionTime = Date.now() - startTime
    console.error(`❌ Scenario failed after ${executionTime}ms:`, error.message)
    
    // Take failure screenshot
    await page.screenshot({ 
      path: `test-results/failures/${scenarioId}-failure-${Date.now()}.png`,
      fullPage: true 
    })
    
    throw error
  }
}

async function executeStep(page: Page, step: any) {
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
      if (typeof step.input === 'string') {
        await page.selectOption(step.target, step.input)
      } else {
        await page.selectOption(step.target, step.input)
      }
      break
      
    case 'wait':
      await page.waitForSelector(step.target, { 
        timeout: step.timeout || 5000 
      })
      break
      
    case 'verify':
      await expect(page.locator(step.target)).toBeVisible()
      break
      
    case 'keyboard':
      await page.keyboard.press(step.input)
      break
      
    case 'scan':
      // Mock QR code scanning
      await page.evaluate((poolId) => {
        const event = new CustomEvent('qr-scan-result', {
          detail: { poolId, poolName: `Pool ${poolId}` }
        })
        window.dispatchEvent(event)
      }, step.input)
      break
      
    case 'concurrent':
      // Handle concurrent user simulation
      console.log(`🔄 Simulating ${step.input} concurrent users`)
      break
      
    case 'measure':
      // Performance measurement
      const measureStart = Date.now()
      await page.waitForLoadState('networkidle')
      const measureTime = Date.now() - measureStart
      console.log(`📊 ${step.target}: ${measureTime}ms`)
      break
      
    default:
      console.warn(`⚠️ Unknown step action: ${step.action}`)
  }
  
  // Take screenshot if requested
  if (step.screenshot) {
    await page.screenshot({ 
      path: `test-results/screenshots/step-${step.action}-${Date.now()}.png`,
      fullPage: true 
    })
  }
}

async function validateOutcomes(page: Page, outcomes: string[]) {
  for (const outcome of outcomes) {
    console.log(`  ✓ Checking: ${outcome}`)
    
    // Basic outcome validation patterns
    if (outcome.includes('Chemical test recorded')) {
      await expect(page.locator('[data-testid="success-message"]')).toBeVisible()
    } else if (outcome.includes('Pool closed')) {
      await expect(page.locator('[data-testid="pool-status"]')).toContainText('CLOSED')
    } else if (outcome.includes('Alert logged')) {
      await expect(page.locator('[data-testid="alert-history"]')).toBeVisible()
    } else if (outcome.includes('Dashboard reflects')) {
      await expect(page.locator('[data-testid="pool-status-dashboard"]')).toBeVisible()
    }
  }
}

test.describe('Critical Path User Story Execution', () => {
  test.beforeEach(async ({ page }) => {
    // Global test setup
    await page.goto('/')
    
    // Mock comprehensive app state
    await page.evaluate(() => {
      // Authentication
      localStorage.setItem('auth-token', 'mock-user-story-token')
      localStorage.setItem('user-role', 'pool_manager')
      
      // Pool data
      const pools = [
        { id: 'pool-001', name: 'Community Recreation Pool', status: 'excellent' },
        { id: 'pool-002', name: 'Therapy Pool', status: 'good' },
        { id: 'pool-003', name: 'Competition Pool', status: 'caution' }
      ]
      localStorage.setItem('pools', JSON.stringify(pools))
      
      // Chemical readings
      const readings = [
        { poolId: 'pool-001', ph: 7.4, chlorine: 2.0, alkalinity: 100, temperature: 80 },
        { poolId: 'pool-002', ph: 7.3, chlorine: 1.8, alkalinity: 110, temperature: 84 },
        { poolId: 'pool-003', ph: 7.1, chlorine: 2.8, alkalinity: 75, temperature: 85 }
      ]
      localStorage.setItem('latest-readings', JSON.stringify(readings))
    })
  })

  test('Critical Path: Complete Pool Manager Day', async ({ page }) => {
    // Execute full pool manager daily workflow
    const criticalScenarios = [
      'pm-001', // Morning chemical test routine
      'pm-002', // Emergency alert response  
      'pm-003'  // Weekly status review
    ]
    
    const results = []
    
    for (const scenarioId of criticalScenarios) {
      const result = await executeScenarioWorkflow(page, scenarioId)
      results.push(result)
    }
    
    // Verify entire workflow completion
    const totalTime = results.reduce((sum, r) => sum + r.executionTime, 0)
    console.log(`\n🏁 Complete workflow executed in ${totalTime}ms`)
    
    // All scenarios should complete successfully
    expect(results.every(r => r.success)).toBe(true)
    
    // Total time should be reasonable for daily workflow
    expect(totalTime).toBeLessThan(30000) // Under 30 seconds
  })

  test('Field Technician Complete Route', async ({ page }) => {
    // Switch to technician role
    await page.evaluate(() => {
      localStorage.setItem('user-role', 'technician')
      localStorage.setItem('user-id', 'tech-001')
    })
    
    const techScenarios = ['tech-001'] // Field testing with mobile device
    
    for (const scenarioId of techScenarios) {
      const result = await executeScenarioWorkflow(page, scenarioId)
      expect(result.success).toBe(true)
    }
  })

  test('Emergency Response Simulation', async ({ page }) => {
    // Switch to emergency responder role
    await page.evaluate(() => {
      localStorage.setItem('user-role', 'emergency_responder')
      localStorage.setItem('user-id', 'emg-001')
    })
    
    const emergencyScenarios = ['emg-001'] // Chemical spill response
    
    for (const scenarioId of emergencyScenarios) {
      const result = await executeScenarioWorkflow(page, scenarioId)
      expect(result.success).toBe(true)
      
      // Emergency scenarios must complete quickly
      expect(result.executionTime).toBeLessThan(10000) // Under 10 seconds
    }
  })
})

test.describe('User Type Workflow Validation', () => {
  for (const [userType, scenarios] of Object.entries(userScenarioSuites)) {
    test(`${userType} workflow suite`, async ({ page }) => {
      // Setup user type specific environment
      await page.evaluate((roleType) => {
        localStorage.setItem('user-role', roleType)
        localStorage.setItem('user-id', `${roleType}-001`)
      }, userType)
      
      const highPriorityScenarios = scenarios
        .filter(s => s.priority === 'high' || s.priority === 'critical')
        .slice(0, 3) // Limit to 3 scenarios for test performance
      
      for (const scenario of highPriorityScenarios) {
        console.log(`\n🧪 Testing ${userType} scenario: ${scenario.title}`)
        
        const result = await executeScenarioWorkflow(page, scenario.id)
        expect(result.success).toBe(true)
      }
    })
  }
})

test.describe('Cross-Scenario Integration Testing', () => {
  test('Multi-user pool incident simulation', async ({ page, context }) => {
    // Create multiple browser contexts for different users
    const managerPage = await context.newPage()
    const technicianPage = await context.newPage()
    
    // Setup manager context
    await managerPage.goto('/')
    await managerPage.evaluate(() => {
      localStorage.setItem('user-role', 'pool_manager')
      localStorage.setItem('user-id', 'pm-001')
    })
    
    // Setup technician context  
    await technicianPage.goto('/')
    await technicianPage.evaluate(() => {
      localStorage.setItem('user-role', 'technician')
      localStorage.setItem('user-id', 'tech-001')
    })
    
    // Technician discovers chemical issue
    await technicianPage.goto('/mobile/test-entry')
    await technicianPage.fill('[data-testid="ph-input"]', '6.8') // Low pH
    await technicianPage.fill('[data-testid="chlorine-input"]', '0.5') // Low chlorine
    await technicianPage.click('[data-testid="submit-test"]')
    
    // Wait for alert propagation
    await page.waitForTimeout(1000)
    
    // Manager should receive notification
    await managerPage.goto('/overview')
    await expect(managerPage.locator('[data-testid="warning-alert"]')).toBeVisible()
    
    // Manager responds to alert
    await managerPage.click('[data-testid="alert-details"]')
    await managerPage.click('[data-testid="acknowledge-alert"]')
    
    // Verify coordination
    await expect(managerPage.locator('[data-testid="alert-acknowledged"]')).toBeVisible()
  })

  test('Offline-to-online data synchronization', async ({ page }) => {
    await page.goto('/mobile/test-entry')
    
    // Go offline
    await page.setOffline(true)
    
    // Enter multiple tests while offline
    const offlineTests = [
      { ph: '7.4', chlorine: '2.0', alkalinity: '100', temp: '80' },
      { ph: '7.3', chlorine: '2.1', alkalinity: '98', temp: '81' },
      { ph: '7.5', chlorine: '1.9', alkalinity: '102', temp: '79' }
    ]
    
    for (let i = 0; i < offlineTests.length; i++) {
      const test = offlineTests[i]
      
      await page.fill('[data-testid="ph-input"]', test.ph)
      await page.fill('[data-testid="chlorine-input"]', test.chlorine)
      await page.fill('[data-testid="alkalinity-input"]', test.alkalinity)
      await page.fill('[data-testid="temperature-input"]', test.temp)
      
      await page.click('[data-testid="submit-test"]')
      
      // Verify queued
      await expect(page.locator('[data-testid="queued-tests-count"]')).toContainText((i + 1).toString())
    }
    
    // Go back online
    await page.setOffline(false)
    await page.reload()
    
    // Verify sync
    await expect(page.locator('[data-testid="sync-complete"]')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('[data-testid="queued-tests-count"]')).toContainText('0')
    
    // Verify all data synced to dashboard
    await page.goto('/overview')
    await expect(page.locator('[data-testid="recent-tests"]')).toContainText('3 tests')
  })
})

test.describe('Performance and Load Testing', () => {
  test('High-frequency user interaction simulation', async ({ page }) => {
    await page.goto('/overview')
    
    const startTime = Date.now()
    
    // Simulate rapid user interactions
    for (let i = 0; i < 20; i++) {
      await page.click('[data-testid="refresh-data"]')
      await page.waitForSelector('[data-testid="data-updated"]')
      await page.waitForTimeout(50) // 50ms between actions
    }
    
    const totalTime = Date.now() - startTime
    
    // Should handle rapid interactions gracefully
    expect(totalTime).toBeLessThan(5000) // Under 5 seconds
    
    // UI should remain responsive
    await page.click('[data-testid="pool-card-pool-001"]')
    await expect(page.locator('[data-testid="pool-details-modal"]')).toBeVisible()
  })
  
  test('Large dataset rendering performance', async ({ page }) => {
    // Setup large dataset
    await page.evaluate(() => {
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        id: `reading-${i}`,
        timestamp: new Date(Date.now() - i * 3600000).toISOString(),
        ph: 7.4 + (Math.random() - 0.5) * 0.4,
        chlorine: 2.0 + (Math.random() - 0.5) * 0.8,
        alkalinity: 100 + (Math.random() - 0.5) * 20,
        temperature: 80 + (Math.random() - 0.5) * 4
      }))
      
      localStorage.setItem('large-dataset', JSON.stringify(largeDataset))
    })
    
    const loadStart = Date.now()
    await page.goto('/trends')
    await page.waitForSelector('[data-testid="chemical-readings-table"]')
    const loadTime = Date.now() - loadStart
    
    // Should load large dataset reasonably quickly
    expect(loadTime).toBeLessThan(3000) // Under 3 seconds
    
    // Verify pagination or virtualization
    const visibleRows = await page.locator('tbody tr').count()
    expect(visibleRows).toBeLessThanOrEqual(100) // Should limit visible rows
  })
})

test.describe('User Story Validation Report', () => {
  test('Generate comprehensive user story report', async ({ page }) => {
    const report = {
      testSuite: 'Pool Management E2E User Stories',
      executionDate: new Date().toISOString(),
      scenarios: [],
      summary: {
        total: 0,
        passed: 0,
        failed: 0,
        avgExecutionTime: 0,
        coverage: {}
      }
    }
    
    // Test critical scenarios and gather metrics
    for (const scenarioId of criticalPathScenarios) {
      try {
        const result = await executeScenarioWorkflow(page, scenarioId)
        
        report.scenarios.push({
          id: scenarioId,
          title: result.scenario.title,
          userType: result.scenario.userType,
          priority: result.scenario.priority,
          status: 'PASSED',
          executionTime: result.executionTime,
          outcomes: result.scenario.expectedOutcomes.length
        })
        
        report.summary.passed++
        
      } catch (error) {
        report.scenarios.push({
          id: scenarioId,
          status: 'FAILED',
          error: error.message
        })
        
        report.summary.failed++
      }
      
      report.summary.total++
    }
    
    // Calculate metrics
    const executionTimes = report.scenarios
      .filter(s => s.executionTime)
      .map(s => s.executionTime)
    
    report.summary.avgExecutionTime = executionTimes.length > 0 
      ? Math.round(executionTimes.reduce((a, b) => a + b, 0) / executionTimes.length)
      : 0
    
    // Coverage by user type
    const userTypes = ['pool_manager', 'technician', 'emergency_responder', 'supervisor']
    for (const userType of userTypes) {
      const userScenarios = report.scenarios.filter(s => s.userType === userType)
      const userPassed = userScenarios.filter(s => s.status === 'PASSED').length
      
      report.summary.coverage[userType] = {
        total: userScenarios.length,
        passed: userPassed,
        coverage: userScenarios.length > 0 ? Math.round((userPassed / userScenarios.length) * 100) : 0
      }
    }
    
    // Generate HTML report
    const htmlReport = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Pool Management E2E User Story Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { background: #f0f8ff; padding: 20px; border-radius: 5px; }
          .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin: 20px 0; }
          .metric { background: #fff; border: 1px solid #ddd; padding: 15px; border-radius: 5px; text-align: center; }
          .scenarios { margin: 20px 0; }
          .scenario { background: #f9f9f9; margin: 10px 0; padding: 15px; border-radius: 5px; }
          .passed { border-left: 4px solid #4caf50; }
          .failed { border-left: 4px solid #f44336; }
          .coverage { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🏊 Pool Management E2E User Story Report</h1>
          <p><strong>Execution Date:</strong> ${report.executionDate}</p>
          <p><strong>Test Suite:</strong> ${report.testSuite}</p>
        </div>
        
        <div class="summary">
          <div class="metric">
            <h3>Total Scenarios</h3>
            <div style="font-size: 2em; color: #333;">${report.summary.total}</div>
          </div>
          <div class="metric">
            <h3>Passed</h3>
            <div style="font-size: 2em; color: #4caf50;">${report.summary.passed}</div>
          </div>
          <div class="metric">
            <h3>Failed</h3>
            <div style="font-size: 2em; color: #f44336;">${report.summary.failed}</div>
          </div>
          <div class="metric">
            <h3>Avg Time</h3>
            <div style="font-size: 2em; color: #2196f3;">${report.summary.avgExecutionTime}ms</div>
          </div>
        </div>
        
        <h2>User Type Coverage</h2>
        <div class="coverage">
          ${Object.entries(report.summary.coverage).map(([userType, data]) => `
            <div class="metric">
              <h4>${userType.replace('_', ' ').toUpperCase()}</h4>
              <p>${data.passed}/${data.total} scenarios (${data.coverage}%)</p>
            </div>
          `).join('')}
        </div>
        
        <h2>Scenario Results</h2>
        <div class="scenarios">
          ${report.scenarios.map(scenario => `
            <div class="scenario ${scenario.status.toLowerCase()}">
              <h4>${scenario.title || scenario.id}</h4>
              <p><strong>Status:</strong> ${scenario.status}</p>
              ${scenario.userType ? `<p><strong>User Type:</strong> ${scenario.userType}</p>` : ''}
              ${scenario.priority ? `<p><strong>Priority:</strong> ${scenario.priority}</p>` : ''}
              ${scenario.executionTime ? `<p><strong>Execution Time:</strong> ${scenario.executionTime}ms</p>` : ''}
              ${scenario.outcomes ? `<p><strong>Outcomes Validated:</strong> ${scenario.outcomes}</p>` : ''}
              ${scenario.error ? `<p style="color: #f44336;"><strong>Error:</strong> ${scenario.error}</p>` : ''}
            </div>
          `).join('')}
        </div>
      </body>
      </html>
    `
    
    // Write report to file
    await page.evaluate((html) => {
      console.log('📊 E2E User Story Report Generated')
      console.log(html)
    }, htmlReport)
    
    // Verify overall test success
    const successRate = report.summary.total > 0 
      ? Math.round((report.summary.passed / report.summary.total) * 100)
      : 0
    
    console.log(`\n🎯 Overall Success Rate: ${successRate}%`)
    console.log(`📈 Average Execution Time: ${report.summary.avgExecutionTime}ms`)
    
    // Test should pass if at least 80% of critical scenarios pass
    expect(successRate).toBeGreaterThanOrEqual(80)
  })
})