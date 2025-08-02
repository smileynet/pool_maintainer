/**
 * Test fixtures for pool chemical readings
 * Provides realistic data scenarios for comprehensive testing
 */

export interface ChemicalReading {
  id: string
  poolId: string
  timestamp: string
  ph: number
  chlorine: number
  alkalinity: number
  temperature: number
  notes?: string
  technicianId?: string
  validated?: boolean
}

export interface PoolAlert {
  id: string
  poolId: string
  type: 'warning' | 'critical' | 'info'
  message: string
  timestamp: string
  resolved?: boolean
  chemical?: 'ph' | 'chlorine' | 'alkalinity' | 'temperature'
  value?: number
}

/**
 * MAHC Compliant Chemical Ranges
 */
export const CHEMICAL_RANGES = {
  ph: { min: 7.2, max: 7.6, ideal: 7.4 },
  chlorine: { min: 1.0, max: 3.0, ideal: 2.0 },
  alkalinity: { min: 80, max: 120, ideal: 100 },
  temperature: { min: 78, max: 84, ideal: 80 }
} as const

/**
 * Base pool information for testing
 */
export const mockPools = {
  community_pool: {
    id: 'pool-001',
    name: 'Community Recreation Pool',
    type: 'public',
    capacity: 150,
    volume: 50000 // gallons
  },
  therapy_pool: {
    id: 'pool-002', 
    name: 'Therapy Pool',
    type: 'therapeutic',
    capacity: 25,
    volume: 8000
  },
  competition_pool: {
    id: 'pool-003',
    name: 'Olympic Competition Pool', 
    type: 'competition',
    capacity: 500,
    volume: 660000
  }
} as const

/**
 * Normal/Safe Chemical Readings
 */
export const safeChemicalReadings: ChemicalReading[] = [
  {
    id: 'reading-001',
    poolId: 'pool-001',
    timestamp: '2024-01-15T08:00:00Z',
    ph: 7.4,
    chlorine: 2.0,
    alkalinity: 100,
    temperature: 80,
    notes: 'Morning reading - all levels optimal',
    technicianId: 'tech-001',
    validated: true
  },
  {
    id: 'reading-002',
    poolId: 'pool-001',
    timestamp: '2024-01-15T14:00:00Z',
    ph: 7.3,
    chlorine: 2.2,
    alkalinity: 95,
    temperature: 82,
    notes: 'Afternoon reading - slightly elevated temperature',
    technicianId: 'tech-001',
    validated: true
  },
  {
    id: 'reading-003',
    poolId: 'pool-002',
    timestamp: '2024-01-15T09:00:00Z',
    ph: 7.5,
    chlorine: 1.8,
    alkalinity: 110,
    temperature: 84,
    notes: 'Therapy pool - higher temperature normal',
    technicianId: 'tech-002',
    validated: true
  }
]

/**
 * Warning Level Chemical Readings (outside optimal range but not critical)
 */
export const warningChemicalReadings: ChemicalReading[] = [
  {
    id: 'reading-w001',
    poolId: 'pool-001',
    timestamp: '2024-01-15T16:00:00Z',
    ph: 7.1, // Below optimal range
    chlorine: 2.8, // Near upper limit
    alkalinity: 75, // Below optimal range
    temperature: 85, // Above optimal range
    notes: 'Multiple parameters approaching limits - needs attention',
    technicianId: 'tech-001',
    validated: false
  },
  {
    id: 'reading-w002',
    poolId: 'pool-003',
    timestamp: '2024-01-15T10:00:00Z',
    ph: 7.7, // Above optimal range
    chlorine: 0.8, // Below minimum
    alkalinity: 125, // Above optimal range
    temperature: 77, // Below optimal range
    notes: 'Competition pool showing low chlorine after heavy use',
    technicianId: 'tech-003',
    validated: false
  }
]

/**
 * Critical/Dangerous Chemical Readings
 */
export const criticalChemicalReadings: ChemicalReading[] = [
  {
    id: 'reading-c001',
    poolId: 'pool-001',
    timestamp: '2024-01-15T18:00:00Z',
    ph: 8.2, // Dangerously high
    chlorine: 4.5, // Dangerously high
    alkalinity: 200, // Dangerously high
    temperature: 90, // Dangerously high
    notes: 'CRITICAL: Chemical system malfunction - pool closed',
    technicianId: 'tech-001',
    validated: false
  },
  {
    id: 'reading-c002',
    poolId: 'pool-002',
    timestamp: '2024-01-15T20:00:00Z',
    ph: 6.5, // Dangerously low
    chlorine: 0.2, // Dangerously low
    alkalinity: 40, // Dangerously low
    temperature: 70, // Dangerously low
    notes: 'CRITICAL: System failure - immediate intervention required',
    technicianId: 'tech-002',
    validated: false
  }
]

/**
 * Edge Case Chemical Readings for testing boundaries
 */
export const edgeCaseReadings: ChemicalReading[] = [
  {
    id: 'reading-e001',
    poolId: 'pool-001',
    timestamp: '2024-01-15T22:00:00Z',
    ph: 7.2, // Exact minimum
    chlorine: 1.0, // Exact minimum
    alkalinity: 80, // Exact minimum
    temperature: 78, // Exact minimum
    notes: 'Boundary testing - all minimums',
    technicianId: 'tech-001',
    validated: true
  },
  {
    id: 'reading-e002',
    poolId: 'pool-001',
    timestamp: '2024-01-15T23:00:00Z',
    ph: 7.6, // Exact maximum
    chlorine: 3.0, // Exact maximum
    alkalinity: 120, // Exact maximum
    temperature: 84, // Exact maximum
    notes: 'Boundary testing - all maximums',
    technicianId: 'tech-001',
    validated: true
  },
  {
    id: 'reading-e003',
    poolId: 'pool-001',
    timestamp: '2024-01-16T00:00:00Z',
    ph: 0, // Invalid low
    chlorine: -1, // Invalid negative
    alkalinity: 1000, // Invalid high
    temperature: 150, // Invalid high
    notes: 'Testing invalid readings handling',
    technicianId: 'tech-001',
    validated: false
  }
]

/**
 * Time series data for trend testing
 */
export const trendReadings: ChemicalReading[] = [
  // Declining pH trend over 5 days
  ...Array.from({ length: 5 }, (_, i) => ({
    id: `trend-ph-${i + 1}`,
    poolId: 'pool-001',
    timestamp: new Date(2024, 0, 10 + i, 8, 0, 0).toISOString(),
    ph: 7.6 - (i * 0.1), // 7.6 -> 7.2 over 5 days
    chlorine: 2.0,
    alkalinity: 100,
    temperature: 80,
    notes: `Day ${i + 1} - pH declining trend`,
    technicianId: 'tech-001',
    validated: true
  })),
  
  // Rising chlorine trend after shock treatment
  ...Array.from({ length: 6 }, (_, i) => ({
    id: `trend-cl-${i + 1}`,
    poolId: 'pool-002',
    timestamp: new Date(2024, 0, 15, 6 + (i * 2), 0, 0).toISOString(),
    ph: 7.4,
    chlorine: 0.5 + (i * 0.3), // 0.5 -> 2.0 over 12 hours
    alkalinity: 100,
    temperature: 82,
    notes: `${i * 2}h post-shock - chlorine recovery`,
    technicianId: 'tech-002',
    validated: true
  }))
]

/**
 * Sample pool alerts for different scenarios
 */
export const mockAlerts: PoolAlert[] = [
  {
    id: 'alert-001',
    poolId: 'pool-001',
    type: 'warning',
    message: 'pH level approaching upper limit (7.7)',
    timestamp: '2024-01-15T14:30:00Z',
    chemical: 'ph',
    value: 7.7,
    resolved: false
  },
  {
    id: 'alert-002',
    poolId: 'pool-001',
    type: 'critical',
    message: 'CRITICAL: Chlorine level dangerously high (4.5 ppm)',
    timestamp: '2024-01-15T18:00:00Z',
    chemical: 'chlorine',
    value: 4.5,
    resolved: false
  },
  {
    id: 'alert-003',
    poolId: 'pool-002',
    type: 'info',
    message: 'Chemical test completed successfully',
    timestamp: '2024-01-15T09:05:00Z',
    resolved: true
  },
  {
    id: 'alert-004',
    poolId: 'pool-003',
    type: 'warning',
    message: 'Temperature below optimal range (77°F)',
    timestamp: '2024-01-15T10:00:00Z',
    chemical: 'temperature',
    value: 77,
    resolved: false
  }
]

/**
 * Factory functions for creating test data
 */
export const createMockReading = (overrides: Partial<ChemicalReading> = {}): ChemicalReading => ({
  id: `reading-${Date.now()}`,
  poolId: 'pool-001',
  timestamp: new Date().toISOString(),
  ph: 7.4,
  chlorine: 2.0,
  alkalinity: 100,
  temperature: 80,
  notes: 'Test reading',
  technicianId: 'tech-test',
  validated: true,
  ...overrides
})

export const createMockAlert = (overrides: Partial<PoolAlert> = {}): PoolAlert => ({
  id: `alert-${Date.now()}`,
  poolId: 'pool-001',
  type: 'info',
  message: 'Test alert message',
  timestamp: new Date().toISOString(),
  resolved: false,
  ...overrides
})

/**
 * Scenario-based test data sets
 */
export const testScenarios = {
  // Scenario: Normal daily operations
  normalOperations: {
    readings: safeChemicalReadings,
    alerts: mockAlerts.filter(alert => alert.type === 'info'),
    expectedStatus: 'optimal'
  },
  
  // Scenario: Pool needs attention
  needsAttention: {
    readings: warningChemicalReadings,
    alerts: mockAlerts.filter(alert => alert.type === 'warning'),
    expectedStatus: 'warning'
  },
  
  // Scenario: Emergency situation
  emergency: {
    readings: criticalChemicalReadings,
    alerts: mockAlerts.filter(alert => alert.type === 'critical'),
    expectedStatus: 'critical'
  },
  
  // Scenario: System malfunction/edge cases
  systemMalfunction: {
    readings: edgeCaseReadings,
    alerts: [],
    expectedStatus: 'error'
  },
  
  // Scenario: Trend analysis over time
  trendAnalysis: {
    readings: trendReadings,
    alerts: mockAlerts,
    expectedStatus: 'monitoring'
  }
}

/**
 * Mock API responses for MSW handlers
 */
export const mockApiResponses = {
  getPoolReadings: (poolId: string) => ({
    poolId,
    readings: safeChemicalReadings.filter(r => r.poolId === poolId),
    lastUpdated: new Date().toISOString()
  }),
  
  getPoolAlerts: (poolId: string) => ({
    poolId,
    alerts: mockAlerts.filter(a => a.poolId === poolId),
    unreadCount: mockAlerts.filter(a => a.poolId === poolId && !a.resolved).length
  }),
  
  createReading: (reading: Omit<ChemicalReading, 'id'>) => ({
    ...reading,
    id: `reading-${Date.now()}`,
    timestamp: new Date().toISOString(),
    validated: false
  }),
  
  validateReading: (readingId: string) => ({
    id: readingId,
    validated: true,
    validatedAt: new Date().toISOString(),
    validatedBy: 'system'
  })
}

/**
 * Helper functions for test assertions
 */
export const testHelpers = {
  isWithinSafeRange: (reading: ChemicalReading): boolean => {
    return (
      reading.ph >= CHEMICAL_RANGES.ph.min && reading.ph <= CHEMICAL_RANGES.ph.max &&
      reading.chlorine >= CHEMICAL_RANGES.chlorine.min && reading.chlorine <= CHEMICAL_RANGES.chlorine.max &&
      reading.alkalinity >= CHEMICAL_RANGES.alkalinity.min && reading.alkalinity <= CHEMICAL_RANGES.alkalinity.max &&
      reading.temperature >= CHEMICAL_RANGES.temperature.min && reading.temperature <= CHEMICAL_RANGES.temperature.max
    )
  },
  
  getReadingSeverity: (reading: ChemicalReading): 'safe' | 'warning' | 'critical' => {
    
    // Check for critical levels (far outside ranges)
    if (
      reading.ph < 6.8 || reading.ph > 8.0 ||
      reading.chlorine < 0.5 || reading.chlorine > 4.0 ||
      reading.alkalinity < 60 || reading.alkalinity > 150 ||
      reading.temperature < 75 || reading.temperature > 90
    ) {
      return 'critical'
    }
    
    // Check for warning levels (outside optimal but not critical)
    if (!testHelpers.isWithinSafeRange(reading)) {
      return 'warning'
    }
    
    return 'safe'
  },
  
  generateReadingSequence: (
    count: number, 
    poolId: string, 
    startDate: Date = new Date()
  ): ChemicalReading[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: `seq-reading-${i + 1}`,
      poolId,
      timestamp: new Date(startDate.getTime() + (i * 6 * 60 * 60 * 1000)).toISOString(), // 6 hour intervals
      ph: 7.4 + (Math.random() - 0.5) * 0.4, // 7.2 - 7.6 range
      chlorine: 2.0 + (Math.random() - 0.5) * 0.8, // 1.6 - 2.4 range
      alkalinity: 100 + (Math.random() - 0.5) * 20, // 90 - 110 range
      temperature: 80 + (Math.random() - 0.5) * 4, // 78 - 82 range
      notes: `Sequence reading ${i + 1}`,
      technicianId: 'tech-auto',
      validated: i % 3 === 0 // Every 3rd reading validated
    }))
  }
}

export default {
  pools: mockPools,
  readings: {
    safe: safeChemicalReadings,
    warning: warningChemicalReadings,
    critical: criticalChemicalReadings,
    edge: edgeCaseReadings,
    trends: trendReadings
  },
  alerts: mockAlerts,
  scenarios: testScenarios,
  api: mockApiResponses,
  helpers: testHelpers,
  factories: {
    createMockReading,
    createMockAlert
  }
}