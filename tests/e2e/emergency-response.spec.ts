/**
 * E2E tests for emergency response workflows
 * Critical incident handling and emergency protocols
 */

import { test, expect, Page } from '@playwright/test'
import { emergencyScenarios, supervisorScenarios, scenarioHelpers } from '@/test/fixtures/user-scenarios'
import { criticalChemicalReadings, mockAlerts } from '@/test/fixtures/chemical-readings'

test.describe('Emergency Response Workflows', () => {
  test.beforeEach(async ({ page }) => {
    // Setup emergency responder authentication
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.setItem('auth-token', 'mock-emergency-responder-token')
      localStorage.setItem('user-role', 'emergency_responder')
      localStorage.setItem('user-id', 'emg-001')
      localStorage.setItem('emergency-clearance', 'level-3')
      localStorage.setItem('authorized-pools', JSON.stringify(['pool-001', 'pool-002', 'pool-003']))
    })
  })

  test('EMG-001: Chemical Spill Emergency Response', async ({ page }) => {
    const scenario = scenarioHelpers.getScenarioById('emg-001')!
    
    // Navigate to emergency incident form
    await page.goto('/emergency/incident')
    await expect(page.locator('[data-testid="emergency-incident-form"]')).toBeVisible()
    
    // Verify emergency interface is prominent and clear
    await expect(page.locator('[data-testid="emergency-header"]')).toHaveCSS('background-color', 'rgb(239, 68, 68)') // Red emergency color
    await expect(page.locator('[data-testid="emergency-warning"]')).toContainText('EMERGENCY INCIDENT REPORTING')
    
    // Select incident type
    await page.selectOption('[data-testid="incident-type"]', 'Chemical Spill')
    await expect(page.locator('[data-testid="chemical-spill-protocols"]')).toBeVisible()
    
    // Select affected pool
    await page.selectOption('[data-testid="affected-pool"]', 'pool-001')
    await expect(page.locator('[data-testid="pool-info-display"]')).toContainText('Community Recreation Pool')
    
    // Immediate pool closure
    await page.click('[data-testid="immediate-closure"]')
    
    // Verify immediate closure confirmation
    await expect(page.locator('[data-testid="closure-confirmation"]')).toBeVisible()
    await expect(page.locator('[data-testid="closure-timestamp"]')).toBeVisible()
    await expect(page.locator('[data-testid="pool-status-closed"]')).toContainText('CLOSED - EMERGENCY')
    
    // Document incident details
    await page.fill('[data-testid="incident-description"]', 
      'Chlorine container leaked in chemical storage area. Approximately 5 gallons spilled. Area evacuated. Ventilation systems activated.')
    
    // Add chemical details
    await page.selectOption('[data-testid="chemical-involved"]', 'sodium-hypochlorite')
    await page.fill('[data-testid="quantity-spilled"]', '5 gallons')
    await page.selectOption('[data-testid="spill-location"]', 'chemical-storage')
    
    // Upload incident photos
    await page.setInputFiles('[data-testid="incident-photos"]', [
      'test-fixtures/spill-photo-1.jpg',
      'test-fixtures/spill-photo-2.jpg'
    ])
    await expect(page.locator('[data-testid="photo-count"]')).toContainText('2 photos uploaded')
    
    // Notify authorities
    await page.click('[data-testid="notify-authorities"]')
    
    // Verify authority notification options
    await expect(page.locator('[data-testid="fire-department"]')).toBeChecked()
    await expect(page.locator('[data-testid="environmental-services"]')).toBeChecked()
    await expect(page.locator('[data-testid="pool-operations-manager"]')).toBeChecked()
    
    // Add emergency contact details
    await page.fill('[data-testid="on-scene-contact"]', 'Emergency Responder #EMG-001 - Direct: (555) 123-4567')
    
    // Set severity level
    await page.selectOption('[data-testid="severity-level"]', 'high')
    
    // Submit emergency incident
    await page.click('[data-testid="submit-incident"]')
    
    // Verify emergency submission confirmation
    await expect(page.locator('[data-testid="incident-submitted"]')).toBeVisible()
    await expect(page.locator('[data-testid="incident-number"]')).toMatch(/^INC-\d{8}-\d{4}$/) // Format: INC-YYYYMMDD-NNNN
    
    // Verify immediate notifications sent
    await expect(page.locator('[data-testid="notifications-sent"]')).toContainText('Fire Department, Environmental Services, Pool Manager')
    
    // Verify emergency closure status
    await page.goto('/overview')
    await expect(page.locator('[data-testid="pool-001-status"]')).toContainText('EMERGENCY CLOSURE')
    await expect(page.locator('[data-testid="emergency-banner"]')).toContainText('Chemical Spill Incident')
    
    // Take screenshot for incident documentation
    await page.screenshot({ 
      path: 'test-results/screenshots/chemical-spill-emergency-response.png',
      fullPage: true 
    })
  })

  test('Critical Chemical Level Emergency', async ({ page }) => {
    // Setup critical chemical alert
    await page.evaluate(() => {
      const criticalAlert = {
        poolId: 'pool-002',
        type: 'critical',
        chemical: 'chlorine',
        value: 0.1, // Dangerously low
        message: 'CRITICAL: Chlorine level dangerously low (0.1 ppm) - Immediate sanitization risk',
        timestamp: new Date().toISOString(),
        severity: 'emergency'
      }
      localStorage.setItem('emergency-alert', JSON.stringify(criticalAlert))
    })
    
    await page.goto('/emergency/dashboard')
    
    // Verify emergency dashboard shows critical alert
    await expect(page.locator('[data-testid="critical-chemical-alert"]')).toBeVisible()
    await expect(page.locator('[data-testid="alert-severity"]')).toContainText('EMERGENCY')
    
    // Initiate emergency chemical response
    await page.click('[data-testid="emergency-chemical-response"]')
    
    // Pool evacuation protocol
    await page.click('[data-testid="initiate-evacuation"]')
    await expect(page.locator('[data-testid="evacuation-status"]')).toContainText('Pool evacuation in progress')
    
    // Emergency chemical dosing
    await page.click('[data-testid="emergency-dosing"]')
    await page.selectOption('[data-testid="chemical-treatment"]', 'sodium-hypochlorite')
    await page.fill('[data-testid="dosing-amount"]', '10')
    await page.selectOption('[data-testid="dosing-unit"]', 'gallons')
    
    // Confirm emergency dosing
    await page.click('[data-testid="confirm-emergency-dosing"]')
    await expect(page.locator('[data-testid="dosing-confirmed"]')).toContainText('Emergency chemical dosing authorized')
    
    // Schedule immediate retest
    await page.click('[data-testid="schedule-emergency-retest"]')
    await page.selectOption('[data-testid="retest-interval"]', '30-minutes')
    
    // Document emergency actions
    await page.fill('[data-testid="emergency-actions-log"]', 
      'EMERGENCY RESPONSE: Pool evacuated due to critical chlorine deficiency. Authorized emergency chlorine dosing (10 gallons sodium hypochlorite). Immediate retest scheduled. Public health department notified.')
    
    // Submit emergency response
    await page.click('[data-testid="submit-emergency-response"]')
    
    // Verify emergency protocols activated
    await expect(page.locator('[data-testid="emergency-response-active"]')).toBeVisible()
    await expect(page.locator('[data-testid="public-health-notified"]')).toContainText('Public Health Department notified')
  })

  test('Multi-Pool Emergency Coordination', async ({ page }) => {
    // Setup multiple emergency situations
    await page.evaluate(() => {
      const emergencies = [
        {
          poolId: 'pool-001',
          type: 'equipment-failure',
          description: 'Filtration system complete failure',
          severity: 'high',
          status: 'active'
        },
        {
          poolId: 'pool-002', 
          type: 'chemical-spill',
          description: 'Acid leak in pump room',
          severity: 'critical',
          status: 'responding'
        },
        {
          poolId: 'pool-003',
          type: 'water-contamination',
          description: 'Suspected bacterial contamination',
          severity: 'high',
          status: 'investigating'
        }
      ]
      localStorage.setItem('active-emergencies', JSON.stringify(emergencies))
    })
    
    await page.goto('/emergency/coordination')
    
    // Verify emergency coordination dashboard
    await expect(page.locator('[data-testid="emergency-coordination-board"]')).toBeVisible()
    await expect(page.locator('[data-testid="active-emergencies-count"]')).toContainText('3')
    
    // Check each emergency status
    await expect(page.locator('[data-testid="emergency-pool-001"]')).toContainText('Equipment Failure')
    await expect(page.locator('[data-testid="emergency-pool-002"]')).toContainText('Chemical Spill')
    await expect(page.locator('[data-testid="emergency-pool-003"]')).toContainText('Water Contamination')
    
    // Prioritize most critical emergency
    await page.click('[data-testid="priority-pool-002"]')
    await expect(page.locator('[data-testid="priority-indicator-pool-002"]')).toHaveClass(/priority-critical/)
    
    // Assign emergency teams
    await page.click('[data-testid="assign-team-pool-002"]')
    await page.selectOption('[data-testid="emergency-team"]', 'hazmat-team-alpha')
    await page.selectOption('[data-testid="backup-team"]', 'facility-maintenance')
    
    // Coordinate resources
    await page.click('[data-testid="coordinate-resources"]')
    await page.check('[data-testid="resource-emergency-chemicals"]')
    await page.check('[data-testid="resource-protective-equipment"]')
    await page.check('[data-testid="resource-neutralizing-agents"]')
    
    // Update emergency status
    await page.selectOption('[data-testid="emergency-status-pool-002"]', 'contained')
    await page.fill('[data-testid="status-update"]', 
      'Acid leak contained. Hazmat team on scene. Area secured. Cleanup in progress. Estimated containment completion: 45 minutes.')
    
    // Broadcast status update
    await page.click('[data-testid="broadcast-update"]')
    await expect(page.locator('[data-testid="broadcast-sent"]')).toContainText('Status update sent to all emergency personnel')
  })

  test('Emergency Communication Systems', async ({ page }) => {
    await page.goto('/emergency/communication')
    
    // Test emergency hotline activation
    await page.click('[data-testid="activate-emergency-hotline"]')
    await expect(page.locator('[data-testid="hotline-active"]')).toContainText('Emergency hotline: (555) POOL-911 is now active')
    
    // Test mass notification system
    await page.click('[data-testid="mass-notification"]')
    
    // Select notification groups
    await page.check('[data-testid="notify-all-staff"]')
    await page.check('[data-testid="notify-pool-patrons"]')
    await page.check('[data-testid="notify-emergency-contacts"]')
    
    // Compose emergency message
    await page.fill('[data-testid="emergency-message"]', 
      'POOL FACILITY EMERGENCY: All pools are temporarily closed due to chemical incident. Please evacuate immediately. More information at poolsafety.gov/emergency.')
    
    // Select notification methods
    await page.check('[data-testid="method-sms"]')
    await page.check('[data-testid="method-email"]')
    await page.check('[data-testid="method-pa-system"]')
    await page.check('[data-testid="method-mobile-app"]')
    
    // Send emergency notification
    await page.click('[data-testid="send-emergency-notification"]')
    
    // Verify notification delivery
    await expect(page.locator('[data-testid="notification-sent"]')).toBeVisible()
    await expect(page.locator('[data-testid="delivery-summary"]')).toContainText('Message sent to 1,247 recipients')
    
    // Test two-way communication
    await page.click('[data-testid="enable-emergency-chat"]')
    await expect(page.locator('[data-testid="emergency-chat-active"]')).toContainText('Emergency chat channel is now active')
  })

  test('Regulatory Compliance During Emergency', async ({ page }) => {
    await page.goto('/emergency/compliance')
    
    // Setup emergency incident requiring regulatory reporting
    await page.evaluate(() => {
      const incident = {
        type: 'serious-injury',
        description: 'Pool patron injured due to chemical exposure',
        severity: 'critical',
        regulatoryReporting: true,
        timestamp: new Date().toISOString()
      }
      localStorage.setItem('regulatory-incident', JSON.stringify(incident))
    })
    
    // Navigate to regulatory reporting
    await page.click('[data-testid="regulatory-reporting"]')
    
    // Verify regulatory agencies notification
    await expect(page.locator('[data-testid="osha-notification"]')).toBeVisible()
    await expect(page.locator('[data-testid="health-dept-notification"]')).toBeVisible()
    await expect(page.locator('[data-testid="epa-notification"]')).toBeVisible()
    
    // Complete OSHA incident report
    await page.click('[data-testid="osha-report"]')
    await page.fill('[data-testid="osha-incident-description"]', 
      'Pool patron experienced respiratory irritation after exposure to chlorine gas leak from malfunctioning chemical feeder.')
    
    await page.selectOption('[data-testid="injury-classification"]', 'chemical-exposure')
    await page.fill('[data-testid="injured-party-count"]', '1')
    
    // Attach incident documentation
    await page.setInputFiles('[data-testid="incident-documentation"]', [
      'test-fixtures/incident-photos.pdf',
      'test-fixtures/chemical-readings.csv',
      'test-fixtures/witness-statements.pdf'
    ])
    
    // Submit regulatory report
    await page.click('[data-testid="submit-osha-report"]')
    await expect(page.locator('[data-testid="osha-report-submitted"]')).toContainText('OSHA incident report submitted')
    
    // Verify compliance tracking
    await expect(page.locator('[data-testid="compliance-status"]')).toContainText('All required reports submitted')
    await expect(page.locator('[data-testid="investigation-timeline"]')).toContainText('Investigation must be completed within 8 hours')
  })

  test('Emergency Recovery and Reopening Protocol', async ({ page }) => {
    // Setup resolved emergency scenario
    await page.evaluate(() => {
      const resolvedEmergency = {
        incidentId: 'INC-20240115-0001',
        type: 'chemical-spill',
        status: 'contained',
        resolution: 'completed',
        clearanceRequired: true
      }
      localStorage.setItem('resolved-emergency', JSON.stringify(resolvedEmergency))
    })
    
    await page.goto('/emergency/recovery')
    
    // Begin recovery process
    await page.click('[data-testid="begin-recovery-process"]')
    
    // Safety verification checklist
    await page.check('[data-testid="verify-chemical-levels-safe"]')
    await page.check('[data-testid="verify-equipment-operational"]')
    await page.check('[data-testid="verify-area-decontaminated"]')
    await page.check('[data-testid="verify-staff-safety-trained"]')
    
    // Water quality testing
    await page.click('[data-testid="comprehensive-water-test"]')
    await page.fill('[data-testid="ph-post-emergency"]', '7.4')
    await page.fill('[data-testid="chlorine-post-emergency"]', '2.0')
    await page.fill('[data-testid="alkalinity-post-emergency"]', '100')
    await page.fill('[data-testid="temperature-post-emergency"]', '80')
    
    // Additional contaminant testing
    await page.check('[data-testid="test-bacteria"]')
    await page.check('[data-testid="test-heavy-metals"]')
    await page.check('[data-testid="test-chemical-residues"]')
    
    // Supervisor approval required
    await page.selectOption('[data-testid="approving-supervisor"]', 'supervisor-001')
    await page.fill('[data-testid="supervisor-notes"]', 
      'All safety protocols completed. Water quality within normal ranges. Equipment inspected and operational. Cleared for reopening.')
    
    // Submit reopening request
    await page.click('[data-testid="submit-reopening-request"]')
    
    // Verify approval workflow
    await expect(page.locator('[data-testid="approval-pending"]')).toContainText('Reopening request submitted for supervisor approval')
    
    // Simulate supervisor approval
    await page.evaluate(() => {
      const approval = {
        approved: true,
        supervisorId: 'supervisor-001',
        approvalTimestamp: new Date().toISOString(),
        conditions: 'Additional monitoring required for 24 hours'
      }
      localStorage.setItem('reopening-approval', JSON.stringify(approval))
    })
    
    await page.reload()
    
    // Verify pool cleared for reopening
    await expect(page.locator('[data-testid="reopening-approved"]')).toContainText('Pool cleared for reopening')
    await expect(page.locator('[data-testid="additional-monitoring"]')).toContainText('24 hours additional monitoring required')
    
    // Update pool status
    await page.click('[data-testid="reopen-pool"]')
    await expect(page.locator('[data-testid="pool-status"]')).toContainText('OPEN - ADDITIONAL MONITORING')
    
    // Verify reopening notification
    await expect(page.locator('[data-testid="reopening-notification"]')).toContainText('Pool reopening notification sent to all stakeholders')
  })
})

test.describe('Emergency Response Performance', () => {
  test('Emergency response time benchmarks', async ({ page }) => {
    await page.goto('/emergency/incident')
    
    // Measure emergency form load time
    const startTime = Date.now()
    await page.waitForSelector('[data-testid="emergency-incident-form"]')
    const loadTime = Date.now() - startTime
    
    // Emergency form must load within 1 second
    expect(loadTime).toBeLessThan(1000)
    
    // Measure immediate closure response time
    const closureStart = Date.now()
    await page.click('[data-testid="immediate-closure"]')
    await page.waitForSelector('[data-testid="closure-confirmation"]')
    const closureTime = Date.now() - closureStart
    
    // Pool closure must be immediate (under 500ms)
    expect(closureTime).toBeLessThan(500)
  })
  
  test('Emergency notification delivery performance', async ({ page }) => {
    await page.goto('/emergency/communication')
    
    // Test notification system performance
    const notificationStart = Date.now()
    
    await page.click('[data-testid="mass-notification"]')
    await page.fill('[data-testid="emergency-message"]', 'Emergency test notification')
    await page.check('[data-testid="notify-all-staff"]')
    await page.click('[data-testid="send-emergency-notification"]')
    
    await page.waitForSelector('[data-testid="notification-sent"]')
    const notificationTime = Date.now() - notificationStart
    
    // Emergency notifications must be sent within 5 seconds
    expect(notificationTime).toBeLessThan(5000)
  })
})