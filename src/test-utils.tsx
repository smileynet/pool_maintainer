import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { ChemicalTest, PoolFacility } from '@/lib/localStorage'

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

// Re-export everything from testing library
export * from '@testing-library/react'

// Override render method with our custom wrapper
export { customRender as render }
