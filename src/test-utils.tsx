import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { vi } from 'vitest'
import { ChemicalTest, PoolFacility } from '@/lib/localStorage'
import type { ValidationResult, ComplianceReport } from '@/lib/mahc-validation'

// Pool Maintenance System Test Utilities
// Enhanced test utilities for pool maintenance workflows

// Custom render function that includes common providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <div data-testid="test-wrapper">{children}</div>
}

const customRender = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options })

// Pool-specific test data factories
export const createMockChemicalTest = (overrides: Partial<ChemicalTest> = {}): ChemicalTest => ({
  id: `test-${Date.now()}`,
  poolId: 'pool-1',
  timestamp: new Date().toISOString(),
  freeChlorine: 2.0,
  pH: 7.4,
  totalAlkalinity: 100,
  temperature: 80,
  notes: '',
  ...overrides,
})

export const createMockPoolFacility = (overrides: Partial<PoolFacility> = {}): PoolFacility => ({
  id: `facility-${Date.now()}`,
  name: 'Test Pool',
  type: 'public',
  location: 'Test Location',
  capacity: 100,
  status: 'active',
  lastInspection: new Date().toISOString(),
  ...overrides,
})

// MAHC compliance test helpers
export const createSafeChemicalTest = (): ChemicalTest => 
  createMockChemicalTest({
    freeChlorine: 2.0, // Within 1.0-3.0 ideal range
    pH: 7.4, // Within 7.2-7.6 ideal range
    totalAlkalinity: 100, // Within 80-120 ideal range
    temperature: 80, // Within 78-82 ideal range
  })

export const createDangerousChemicalTest = (): ChemicalTest => 
  createMockChemicalTest({
    freeChlorine: 0.2, // Below safe minimum
    pH: 6.5, // Below safe minimum
    totalAlkalinity: 40, // Below safe minimum
    temperature: 95, // Above safe maximum
  })

// Pool calculation test helpers
export const expectMAHCCompliant = (test: ChemicalTest) => {
  expect(test.freeChlorine).toBeGreaterThanOrEqual(0.5)
  expect(test.freeChlorine).toBeLessThanOrEqual(5.0)
  expect(test.pH).toBeGreaterThanOrEqual(7.0)
  expect(test.pH).toBeLessThanOrEqual(8.0)
  expect(test.totalAlkalinity).toBeGreaterThanOrEqual(60)
  expect(test.totalAlkalinity).toBeLessThanOrEqual(180)
}

export const expectIdealRange = (test: ChemicalTest) => {
  expect(test.freeChlorine).toBeGreaterThanOrEqual(1.0)
  expect(test.freeChlorine).toBeLessThanOrEqual(3.0)
  expect(test.pH).toBeGreaterThanOrEqual(7.2)
  expect(test.pH).toBeLessThanOrEqual(7.6)
  expect(test.totalAlkalinity).toBeGreaterThanOrEqual(80)
  expect(test.totalAlkalinity).toBeLessThanOrEqual(120)
}

// localStorage test helpers
export const clearPoolTestData = () => {
  localStorage.removeItem('pool-maintenance-chemical-tests')
  localStorage.removeItem('pool-maintenance-facilities')
}

export const seedPoolTestData = (tests: ChemicalTest[], facilities: PoolFacility[] = []) => {
  if (tests.length > 0) {
    localStorage.setItem('pool-maintenance-chemical-tests', JSON.stringify(tests))
  }
  if (facilities.length > 0) {
    localStorage.setItem('pool-maintenance-facilities', JSON.stringify(facilities))
  }
}

// MAHC validation mocking utilities
export const mockMAHCValidation = () => {
  const mocks = {
    validateChemical: vi.fn<[number, string], ValidationResult>((value, chemical) => {
      // Default to good validation
      return {
        status: 'good',
        severity: 'low',
        color: 'text-green-700',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-400',
        message: `${chemical} within ideal range`,
        requiresAction: false,
        requiresClosure: false,
      }
    }),
    
    generateComplianceReport: vi.fn<[Partial<Record<string, number>>], ComplianceReport>((readings) => {
      return {
        overall: 'compliant',
        totalTests: Object.keys(readings).length,
        passedTests: Object.keys(readings).length,
        warningTests: 0,
        criticalTests: 0,
        emergencyTests: 0,
        details: [],
        recommendations: [],
        requiredActions: [],
      }
    }),
    
    shouldClosePool: vi.fn(() => ({
      shouldClose: false,
      reasons: [],
    })),
    
    formatChemicalValue: vi.fn((value: number, chemical: string) => {
      return `${value} ppm`
    }),
    
    getAcceptableRange: vi.fn((chemical: string) => {
      const ranges: Record<string, string> = {
        freeChlorine: '1.0-3.0 ppm',
        totalChlorine: '1.0-4.0 ppm',
        ph: '7.2-7.6',
        alkalinity: '80-120 ppm',
        cyanuricAcid: '30-50 ppm',
        calcium: '200-400 ppm',
        temperature: '78-84 °F',
      }
      return ranges[chemical] || '0-100'
    }),
  }
  
  // Helper to mock specific validation scenarios
  ;(mocks.validateChemical as any).mockScenario = (scenario: 'good' | 'warning' | 'critical' | 'emergency') => {
    const scenarios: Record<string, ValidationResult> = {
      good: {
        status: 'good',
        severity: 'low',
        color: 'text-green-700',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-400',
        message: 'Within ideal range',
        requiresAction: false,
        requiresClosure: false,
      },
      warning: {
        status: 'warning',
        severity: 'medium',
        color: 'text-orange-700',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-400',
        message: 'Outside ideal range',
        recommendation: 'Adjust chemical levels',
        requiresAction: true,
        requiresClosure: false,
      },
      critical: {
        status: 'critical',
        severity: 'high',
        color: 'text-red-700',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-400',
        message: 'Out of compliance range',
        recommendation: 'Immediate adjustment required',
        requiresAction: true,
        requiresClosure: false,
      },
      emergency: {
        status: 'emergency',
        severity: 'critical',
        color: 'text-red-900',
        bgColor: 'bg-red-100',
        borderColor: 'border-red-500',
        message: 'Emergency level detected',
        recommendation: 'Close pool immediately',
        requiresAction: true,
        requiresClosure: true,
      },
    }
    
    mocks.validateChemical.mockReturnValue(scenarios[scenario])
  }
  
  return mocks
}

// Mock the MAHC validation module
export const setupMAHCMocks = () => {
  const mocks = mockMAHCValidation()
  return mocks
}

// Re-export everything from testing library
export * from '@testing-library/react'

// Override render method with our custom wrapper
export { customRender as render }
