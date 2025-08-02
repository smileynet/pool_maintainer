/**
 * User scenario test fixtures for E2E testing
 * Based on real pool manager workflows and user stories
 */

export interface UserScenario {
  id: string
  title: string
  description: string
  userType: 'pool_manager' | 'technician' | 'supervisor' | 'emergency_responder'
  priority: 'critical' | 'high' | 'medium' | 'low'
  duration: string
  steps: UserStep[]
  expectedOutcomes: string[]
  testData: Record<string, unknown>
}

export interface UserStep {
  action: string
  target: string
  input?: string | number | boolean | Record<string, unknown>
  expected: string
  timeout?: number
  screenshot?: boolean
}

/**
 * Daily Pool Manager Workflows
 */
export const dailyPoolManagerScenarios: UserScenario[] = [
  {
    id: 'pm-001',
    title: 'Morning Chemical Test Routine',
    description: 'Pool manager performs routine morning chemical testing and records results',
    userType: 'pool_manager',
    priority: 'critical',
    duration: '5-10 minutes',
    steps: [
      {
        action: 'navigate',
        target: '/pool-facilities',
        expected: 'Pool facilities dashboard loads'
      },
      {
        action: 'click',
        target: '[data-testid="record-chemical-test"]',
        expected: 'Chemical test form opens'
      },
      {
        action: 'select',
        target: '[data-testid="pool-selector"]',
        input: 'Community Recreation Pool',
        expected: 'Pool selected in dropdown'
      },
      {
        action: 'type',
        target: '[data-testid="ph-input"]',
        input: '7.4',
        expected: 'pH value entered'
      },
      {
        action: 'type',
        target: '[data-testid="chlorine-input"]',
        input: '2.0',
        expected: 'Chlorine value entered'
      },
      {
        action: 'type',
        target: '[data-testid="alkalinity-input"]',
        input: '100',
        expected: 'Alkalinity value entered'
      },
      {
        action: 'type',
        target: '[data-testid="temperature-input"]',
        input: '80',
        expected: 'Temperature value entered'
      },
      {
        action: 'type',
        target: '[data-testid="notes-input"]',
        input: 'Morning reading - all levels optimal',
        expected: 'Notes entered'
      },
      {
        action: 'click',
        target: '[data-testid="submit-test"]',
        expected: 'Test submitted successfully',
        screenshot: true
      },
      {
        action: 'wait',
        target: '[data-testid="success-message"]',
        expected: 'Success confirmation visible',
        timeout: 3000
      },
      {
        action: 'navigate',
        target: '/overview',
        expected: 'Dashboard shows updated test data'
      }
    ],
    expectedOutcomes: [
      'Chemical test recorded in system',
      'Dashboard reflects current readings',
      'No alerts generated for safe readings',
      'Last test timestamp updated'
    ],
    testData: {
      poolId: 'pool-001',
      reading: {
        ph: 7.4,
        chlorine: 2.0,
        alkalinity: 100,
        temperature: 80,
        notes: 'Morning reading - all levels optimal'
      }
    }
  },
  
  {
    id: 'pm-002',
    title: 'Emergency Chemical Alert Response',
    description: 'Pool manager responds to critical chemical level alert and takes corrective action',
    userType: 'pool_manager',
    priority: 'critical',
    duration: '2-5 minutes',
    steps: [
      {
        action: 'navigate',
        target: '/overview',
        expected: 'Dashboard loads with critical alert visible'
      },
      {
        action: 'verify',
        target: '[data-testid="critical-alert"]',
        expected: 'Critical alert banner displayed',
        screenshot: true
      },
      {
        action: 'click',
        target: '[data-testid="alert-details"]',
        expected: 'Alert details modal opens'
      },
      {
        action: 'verify',
        target: '[data-testid="alert-chemical"]',
        expected: 'Chemical type and value shown'
      },
      {
        action: 'click',
        target: '[data-testid="close-pool-action"]',
        expected: 'Pool closure action available'
      },
      {
        action: 'type',
        target: '[data-testid="closure-reason"]',
        input: 'Chemical levels unsafe - immediate correction required',
        expected: 'Closure reason entered'
      },
      {
        action: 'click',
        target: '[data-testid="confirm-closure"]',
        expected: 'Pool marked as closed',
        screenshot: true
      },
      {
        action: 'verify',
        target: '[data-testid="pool-status"]',
        expected: 'Pool status shows "CLOSED"'
      }
    ],
    expectedOutcomes: [
      'Pool immediately marked as closed',
      'Alert logged with response actions',
      'Notification sent to relevant staff',
      'Incident documented for compliance'
    ],
    testData: {
      poolId: 'pool-001',
      alert: {
        type: 'critical',
        chemical: 'chlorine',
        value: 4.5,
        message: 'CRITICAL: Chlorine level dangerously high (4.5 ppm)'
      }
    }
  },
  
  {
    id: 'pm-003',
    title: 'Weekly Pool Status Review',
    description: 'Pool manager reviews weekly chemical trends and maintenance needs',
    userType: 'pool_manager',
    priority: 'medium',
    duration: '10-15 minutes',
    steps: [
      {
        action: 'navigate',
        target: '/trends',
        expected: 'Chemical trend charts load'
      },
      {
        action: 'select',
        target: '[data-testid="time-range"]',
        input: 'Last 7 days',
        expected: 'Weekly data range selected'
      },
      {
        action: 'verify',
        target: '[data-testid="ph-trend-chart"]',
        expected: 'pH trend chart displays weekly data',
        screenshot: true
      },
      {
        action: 'verify',
        target: '[data-testid="chlorine-trend-chart"]',
        expected: 'Chlorine trend chart displays weekly data'
      },
      {
        action: 'click',
        target: '[data-testid="generate-report"]',
        expected: 'Weekly report generation dialog opens'
      },
      {
        action: 'select',
        target: '[data-testid="report-format"]',
        input: 'PDF',
        expected: 'PDF format selected'
      },
      {
        action: 'click',
        target: '[data-testid="download-report"]',
        expected: 'Report download initiated'
      }
    ],
    expectedOutcomes: [
      'Weekly trends clearly visualized',
      'Patterns and anomalies identified',
      'Compliance report generated',
      'Maintenance recommendations provided'
    ],
    testData: {
      poolId: 'pool-001',
      dateRange: {
        start: '2024-01-08',
        end: '2024-01-15'
      }
    }
  }
]

/**
 * Technician Workflow Scenarios
 */
export const technicianScenarios: UserScenario[] = [
  {
    id: 'tech-001',
    title: 'Field Chemical Testing with Mobile Device',
    description: 'Pool technician performs on-site testing using mobile interface',
    userType: 'technician',
    priority: 'high',
    duration: '3-7 minutes',
    steps: [
      {
        action: 'navigate',
        target: '/mobile/test-entry',
        expected: 'Mobile-optimized test form loads'
      },
      {
        action: 'scan',
        target: '[data-testid="pool-qr-scanner"]',
        input: 'pool-002-qr-code',
        expected: 'Pool automatically selected via QR scan'
      },
      {
        action: 'type',
        target: '[data-testid="ph-input"]',
        input: '7.1',
        expected: 'pH value triggers warning indicator'
      },
      {
        action: 'verify',
        target: '[data-testid="ph-warning"]',
        expected: 'Warning indicator shows for low pH'
      },
      {
        action: 'type',
        target: '[data-testid="chlorine-input"]',
        input: '2.8',
        expected: 'Chlorine value entered'
      },
      {
        action: 'type',
        target: '[data-testid="alkalinity-input"]',
        input: '75',
        expected: 'Alkalinity value triggers warning'
      },
      {
        action: 'verify',
        target: '[data-testid="multiple-warnings"]',
        expected: 'Multiple parameter warnings displayed'
      },
      {
        action: 'click',
        target: '[data-testid="add-corrective-action"]',
        expected: 'Corrective action form opens'
      },
      {
        action: 'type',
        target: '[data-testid="action-notes"]',
        input: 'Added pH increaser and reduced chlorine feeder rate',
        expected: 'Corrective actions documented'
      },
      {
        action: 'click',
        target: '[data-testid="submit-with-actions"]',
        expected: 'Test and actions submitted',
        screenshot: true
      }
    ],
    expectedOutcomes: [
      'Chemical readings recorded with warnings',
      'Corrective actions documented',
      'Automatic supervisor notification sent',
      'Follow-up test scheduled'
    ],
    testData: {
      poolId: 'pool-002',
      reading: {
        ph: 7.1,
        chlorine: 2.8,
        alkalinity: 75,
        temperature: 85
      },
      actions: ['pH adjustment', 'chlorine reduction']
    }
  }
]

/**
 * Emergency Response Scenarios
 */
export const emergencyScenarios: UserScenario[] = [
  {
    id: 'emg-001',
    title: 'Chemical Spill Emergency Response',
    description: 'Emergency responder handles chemical spill incident with immediate pool closure',
    userType: 'emergency_responder',
    priority: 'critical',
    duration: '1-3 minutes',
    steps: [
      {
        action: 'navigate',
        target: '/emergency/incident',
        expected: 'Emergency incident form loads'
      },
      {
        action: 'select',
        target: '[data-testid="incident-type"]',
        input: 'Chemical Spill',
        expected: 'Chemical spill selected as incident type'
      },
      {
        action: 'select',
        target: '[data-testid="affected-pool"]',
        input: 'pool-001',
        expected: 'Affected pool selected'
      },
      {
        action: 'click',
        target: '[data-testid="immediate-closure"]',
        expected: 'Pool immediately closed'
      },
      {
        action: 'type',
        target: '[data-testid="incident-description"]',
        input: 'Chlorine container leaked in chemical storage area',
        expected: 'Incident details entered'
      },
      {
        action: 'click',
        target: '[data-testid="notify-authorities"]',
        expected: 'Authority notification triggered'
      },
      {
        action: 'click',
        target: '[data-testid="submit-incident"]',
        expected: 'Emergency incident logged',
        screenshot: true
      },
      {
        action: 'verify',
        target: '[data-testid="incident-number"]',
        expected: 'Incident tracking number generated'
      }
    ],
    expectedOutcomes: [
      'Pool immediately closed to public',
      'Emergency services notified',
      'Incident documented for investigation',
      'Compliance authorities alerted'
    ],
    testData: {
      incidentType: 'chemical_spill',
      poolId: 'pool-001',
      severity: 'high',
      chemicalInvolved: 'chlorine'
    }
  }
]

/**
 * Supervisor Oversight Scenarios
 */
export const supervisorScenarios: UserScenario[] = [
  {
    id: 'sup-001',
    title: 'Multi-Pool Status Monitoring',
    description: 'Supervisor monitors multiple pool facilities and validates critical readings',
    userType: 'supervisor',
    priority: 'high',
    duration: '5-10 minutes',
    steps: [
      {
        action: 'navigate',
        target: '/supervisor/dashboard',
        expected: 'Multi-pool supervisor dashboard loads'
      },
      {
        action: 'verify',
        target: '[data-testid="pool-status-grid"]',
        expected: 'All pools displayed with current status',
        screenshot: true
      },
      {
        action: 'click',
        target: '[data-testid="pending-validations"]',
        expected: 'Pending validation list opens'
      },
      {
        action: 'click',
        target: '[data-testid="reading-validation-item"]',
        expected: 'Reading validation form opens'
      },
      {
        action: 'verify',
        target: '[data-testid="reading-details"]',
        expected: 'Chemical reading details displayed'
      },
      {
        action: 'click',
        target: '[data-testid="approve-reading"]',
        expected: 'Reading marked as validated'
      },
      {
        action: 'type',
        target: '[data-testid="validation-notes"]',
        input: 'Reviewed and approved - readings within normal range',
        expected: 'Validation notes entered'
      },
      {
        action: 'click',
        target: '[data-testid="submit-validation"]',
        expected: 'Validation completed'
      }
    ],
    expectedOutcomes: [
      'Chemical reading officially validated',
      'Compliance record updated',
      'Technician notified of approval',
      'Quality assurance maintained'
    ],
    testData: {
      readingsToValidate: ['reading-001', 'reading-002'],
      supervisorId: 'sup-001'
    }
  }
]

/**
 * Cross-Device and Accessibility Scenarios
 */
export const accessibilityScenarios: UserScenario[] = [
  {
    id: 'a11y-001',
    title: 'Screen Reader Pool Status Navigation',
    description: 'Vision-impaired user navigates pool status using screen reader',
    userType: 'pool_manager',
    priority: 'medium',
    duration: '3-5 minutes',
    steps: [
      {
        action: 'navigate',
        target: '/overview',
        expected: 'Dashboard loads with proper heading structure'
      },
      {
        action: 'keyboard',
        target: 'Tab',
        expected: 'Focus moves through interactive elements'
      },
      {
        action: 'verify',
        target: '[aria-label="Pool status summary"]',
        expected: 'Pool status has descriptive aria-label'
      },
      {
        action: 'keyboard',
        target: 'Enter',
        expected: 'Chemical details expand with keyboard activation'
      },
      {
        action: 'verify',
        target: '[role="alert"]',
        expected: 'Critical alerts announced to screen reader'
      }
    ],
    expectedOutcomes: [
      'All functionality accessible via keyboard',
      'Screen reader announces important information',
      'Focus management works correctly',
      'ARIA labels provide context'
    ],
    testData: {
      screenReaderMode: true,
      keyboardNavigation: true
    }
  }
]

/**
 * Performance and Load Testing Scenarios
 */
export const performanceScenarios: UserScenario[] = [
  {
    id: 'perf-001',
    title: 'High-Frequency Data Entry Load Test',
    description: 'Multiple technicians entering data simultaneously during peak hours',
    userType: 'technician',
    priority: 'medium',
    duration: '10-15 minutes',
    steps: [
      {
        action: 'concurrent',
        target: 'multiple-users',
        input: 5,
        expected: '5 users perform simultaneous chemical tests'
      },
      {
        action: 'measure',
        target: 'response-time',
        expected: 'Response times remain under 2 seconds'
      },
      {
        action: 'verify',
        target: 'data-integrity',
        expected: 'All submissions processed correctly'
      }
    ],
    expectedOutcomes: [
      'System handles concurrent users',
      'No data loss or corruption',
      'Performance remains acceptable',
      'Error handling works under load'
    ],
    testData: {
      concurrentUsers: 5,
      testDuration: '15 minutes',
      expectedResponseTime: '< 2 seconds'
    }
  }
]

/**
 * Complete test scenario suites organized by user type
 */
export const userScenarioSuites = {
  poolManager: dailyPoolManagerScenarios,
  technician: technicianScenarios,
  supervisor: supervisorScenarios,
  emergency: emergencyScenarios,
  accessibility: accessibilityScenarios,
  performance: performanceScenarios
}

/**
 * Critical path scenarios for smoke testing
 */
export const criticalPathScenarios = [
  'pm-001', // Morning chemical test routine
  'pm-002', // Emergency alert response
  'tech-001', // Field testing
  'emg-001', // Emergency response
  'sup-001' // Supervisor validation
]

/**
 * Helper functions for scenario execution
 */
export const scenarioHelpers = {
  getScenarioById: (id: string): UserScenario | undefined => {
    const allScenarios = [
      ...dailyPoolManagerScenarios,
      ...technicianScenarios,
      ...supervisorScenarios,
      ...emergencyScenarios,
      ...accessibilityScenarios,
      ...performanceScenarios
    ]
    return allScenarios.find(scenario => scenario.id === id)
  },
  
  getScenariosByUserType: (userType: UserScenario['userType']): UserScenario[] => {
    return userScenarioSuites[userType.replace('_', '')] || []
  },
  
  getScenariosByPriority: (priority: UserScenario['priority']): UserScenario[] => {
    const allScenarios = Object.values(userScenarioSuites).flat()
    return allScenarios.filter(scenario => scenario.priority === priority)
  },
  
  getCriticalScenarios: (): UserScenario[] => {
    return criticalPathScenarios.map(id => scenarioHelpers.getScenarioById(id)).filter(Boolean)
  }
}

export default {
  scenarios: userScenarioSuites,
  critical: criticalPathScenarios,
  helpers: scenarioHelpers
}