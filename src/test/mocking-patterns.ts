// Advanced Vitest Mocking Patterns for Pool Maintenance System
// Comprehensive mocking utilities for pool maintenance testing scenarios

import { vi } from 'vitest'
import { 
  createMockChemicalTest, 
  createSafeChemicalTest, 
  createDangerousChemicalTest 
} from '@/test-utils'

// Advanced localStorage mocking
export const createLocalStorageMock = () => {
  const store = new Map<string, string>()
  
  return {
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store.set(key, value)
    }),
    removeItem: vi.fn((key: string) => {
      store.delete(key)
    }),
    clear: vi.fn(() => {
      store.clear()
    }),
    key: vi.fn((index: number) => {
      const keys = Array.from(store.keys())
      return keys[index] ?? null
    }),
    get length() {
      return store.size
    },
    // Test utilities
    _getStore: () => store,
    _seed: (data: Record<string, string>) => {
      Object.entries(data).forEach(([key, value]) => store.set(key, value))
    },
  }
}

// Pool API service mocks
export const createPoolApiMocks = () => ({
  // Chemical test operations
  getChemicalTests: vi.fn(),
  saveChemicalTest: vi.fn(),
  deleteChemicalTest: vi.fn(),
  updateChemicalTest: vi.fn(),
  
  // Pool facility operations
  getPoolFacilities: vi.fn(),
  savePoolFacility: vi.fn(),
  deletePoolFacility: vi.fn(),
  updatePoolFacility: vi.fn(),
  
  // CSV operations
  exportToCSV: vi.fn(),
  importFromCSV: vi.fn(),
  validateCSVData: vi.fn(),
  
  // Analytics
  getChemicalTrends: vi.fn(),
  getPoolStatus: vi.fn(),
  getMAHCCompliance: vi.fn(),
})

// Time-based mocking utilities
export const createTimeMocks = () => {
  return {
    // Mock specific date/time
    mockDate: (dateString: string) => {
      const mockDate = new Date(dateString)
      vi.setSystemTime(mockDate)
      return mockDate
    },
    
    // Mock date progression
    advanceTime: (milliseconds: number) => {
      vi.advanceTimersByTime(milliseconds)
    },
    
    // Mock time functions
    mockDateNow: (timestamp: number) => {
      vi.spyOn(Date, 'now').mockReturnValue(timestamp)
    },
    
    // Reset time mocks
    resetTime: () => {
      vi.useRealTimers()
      vi.restoreAllMocks()
    },
    
    // Test utilities for pool maintenance schedules
    simulateMaintenanceSchedule: () => {
      const startTime = new Date('2025-08-01T08:00:00Z').getTime()
      const times = [
        startTime, // 8 AM - morning test
        startTime + 6 * 60 * 60 * 1000, // 2 PM - afternoon test
        startTime + 12 * 60 * 60 * 1000, // 8 PM - evening test
      ]
      
      let callCount = 0
      vi.spyOn(Date, 'now').mockImplementation(() => {
        return times[callCount++ % times.length]
      })
      
      return times
    },
  }
}

// Chemical calculation mocking
export const createChemicalCalculationMocks = () => ({
  // MAHC validation mocks
  validateMAHCCompliance: vi.fn(),
  calculateChlorineAdjustment: vi.fn(),
  calculatepHAdjustment: vi.fn(),
  calculateAlkalinityAdjustment: vi.fn(),
  
  // Pool status calculation mocks
  calculatePoolStatus: vi.fn(),
  determineActionRequired: vi.fn(),
  estimateChemicalCosts: vi.fn(),
  
  // Trending and analytics mocks
  calculateTrends: vi.fn(),
  predictNextReading: vi.fn(),
  identifyPatterns: vi.fn(),
})

// Error simulation patterns
export const createErrorSimulators = () => ({
  // Network errors
  simulateNetworkError: () => {
    return vi.fn().mockRejectedValue(new Error('Network request failed'))
  },
  
  // localStorage quota exceeded
  simulateStorageQuotaExceeded: () => {
    return vi.fn().mockImplementation(() => {
      throw new DOMException('QuotaExceededError', 'QuotaExceededError')
    })
  },
  
  // Invalid data errors
  simulateInvalidData: () => {
    return vi.fn().mockRejectedValue(new Error('Invalid chemical test data'))
  },
  
  // Permission errors
  simulatePermissionDenied: () => {
    return vi.fn().mockRejectedValue(new Error('Permission denied'))
  },
  
  // Rate limiting
  simulateRateLimit: () => {
    return vi.fn().mockRejectedValue(new Error('Rate limit exceeded'))
  },
})

// Test scenario builders
export const createTestScenarios = () => ({
  // Normal operations
  normalOperation: {
    setup: () => {
      const mocks = createPoolApiMocks()
      mocks.getChemicalTests.mockResolvedValue([
        createSafeChemicalTest(),
        createSafeChemicalTest(),
      ])
      return mocks
    },
  },
  
  // Emergency situations
  emergencyScenario: {
    setup: () => {
      const mocks = createPoolApiMocks()
      mocks.getChemicalTests.mockResolvedValue([
        createDangerousChemicalTest(),
      ])
      mocks.getPoolStatus.mockResolvedValue({
        status: 'emergency',
        alerts: ['Critical pH level', 'Low chlorine'],
      })
      return mocks
    },
  },
  
  // High traffic periods
  highTrafficScenario: {
    setup: () => {
      const mocks = createPoolApiMocks()
      const tests = Array.from({ length: 10 }, (_, i) => 
        createMockChemicalTest({
          id: `busy-test-${i}`,
          timestamp: new Date(Date.now() - i * 30 * 60 * 1000).toISOString(),
          freeChlorine: Math.max(0.5, 2.0 - i * 0.2), // Declining chlorine
          pH: Math.min(8.0, 7.4 + i * 0.1), // Rising pH
        })
      )
      mocks.getChemicalTests.mockResolvedValue(tests)
      return mocks
    },
  },
  
  // Data migration scenario
  csvImportScenario: {
    setup: () => {
      const mocks = createPoolApiMocks()
      mocks.importFromCSV.mockImplementation(async (csvData: string) => {
        // Simulate parsing delays
        await new Promise(resolve => setTimeout(resolve, 100))
        
        const lines = csvData.split('\n').filter(line => line.trim())
        const results = {
          imported: lines.length - 1, // Excluding header
          errors: [] as string[],
          warnings: [] as string[],
        }
        
        // Simulate validation errors
        if (csvData.includes('invalid')) {
          results.errors.push('Invalid data in row 2')
        }
        
        return results
      })
      return mocks
    },
  },
})

// Performance testing utilities
export const createPerformanceMocks = () => ({
  // Simulate slow operations
  simulateSlowOperation: (delayMs: number) => {
    return vi.fn().mockImplementation(async (...args) => {
      await new Promise(resolve => setTimeout(resolve, delayMs))
      return args
    })
  },
  
  // Memory usage monitoring
  mockMemoryUsage: () => {
    const originalPerformance = global.performance
    global.performance = {
      ...originalPerformance,
      memory: {
        usedJSHeapSize: 1024 * 1024 * 50, // 50MB
        totalJSHeapSize: 1024 * 1024 * 100, // 100MB
        jsHeapSizeLimit: 1024 * 1024 * 500, // 500MB
      },
    } as Performance
    
    return () => {
      global.performance = originalPerformance
    }
  },
  
  // Large dataset simulation
  generateLargeDataset: (size: number) => {
    return Array.from({ length: size }, (_, i) => 
      createMockChemicalTest({
        id: `large-test-${i}`,
        timestamp: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
      })
    )
  },
})

// Utility functions for common test patterns
export const testPatterns = {
  // Test a function with multiple scenarios
  testWithScenarios: <T, R>(
    fn: (...args: T[]) => R,
    scenarios: Array<{ input: T[], expected: R, description: string }>
  ) => {
    scenarios.forEach(({ input, expected, description }) => {
      it(description, () => {
        expect(fn(...input)).toEqual(expected)
      })
    })
  },
  
  // Test async operations with timeout
  testAsyncWithTimeout: async <T>(
    operation: () => Promise<T>,
    timeoutMs: number = 5000
  ) => {
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Operation timed out')), timeoutMs)
    )
    
    return Promise.race([operation(), timeoutPromise])
  },
  
  // Test error boundaries
  testErrorBoundary: (component: React.ComponentType, errorTrigger: () => void) => {
    const originalError = console.error
    console.error = vi.fn()
    
    try {
      errorTrigger()
      // Test error handling logic
    } finally {
      console.error = originalError
    }
  },
}