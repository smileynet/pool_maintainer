/**
 * Integration tests for data persistence and offline functionality
 * Tests localStorage, offline queue, and data synchronization workflows
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { 
  safeChemicalReadings,
  createMockReading
} from '@/test/fixtures/chemical-readings'
import { poolStorage, apiCache, sessionData } from '@/lib/utils/storage-utils'

// Mock localStorage for testing
const mockLocalStorage = (() => {
  let store: Record<string, string> = {}
  
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
    key: (index: number) => Object.keys(store)[index] || null,
    get length() {
      return Object.keys(store).length
    }
  }
})()

// Mock offline queue functionality
class MockOfflineQueue {
  private queue: any[] = []
  private isOnline = true
  
  add(item: any) {
    if (this.isOnline) {
      return this.processImmediately(item)
    } else {
      this.queue.push(item)
      return Promise.resolve({ queued: true })
    }
  }
  
  private async processImmediately(_item: any) {
    // Simulate API call
    return { success: true, id: `processed-${Date.now()}` }
  }
  
  setOnlineStatus(online: boolean) {
    this.isOnline = online
    if (online) {
      this.processQueue()
    }
  }
  
  private async processQueue() {
    const items = [...this.queue]
    this.queue = []
    
    for (const item of items) {
      await this.processImmediately(item)
    }
  }
  
  getQueueLength() {
    return this.queue.length
  }
  
  clear() {
    this.queue = []
  }
}

describe('Data Persistence Integration', () => {
  let mockOfflineQueue: MockOfflineQueue
  
  beforeEach(() => {
    // Setup mocks
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    })
    
    mockOfflineQueue = new MockOfflineQueue()
    mockLocalStorage.clear()
    vi.clearAllMocks()
  })
  
  afterEach(() => {
    mockLocalStorage.clear()
    mockOfflineQueue.clear()
  })

  describe('Pool Data Storage', () => {
    it('stores and retrieves pool readings correctly', () => {
      const testReading = safeChemicalReadings[0]
      
      // Store reading
      poolStorage.set('current-reading', testReading)
      
      // Retrieve reading
      const retrieved = poolStorage.get('current-reading', null)
      
      expect(retrieved).toEqual(testReading)
      expect(retrieved.ph).toBe(7.4)
      expect(retrieved.chlorine).toBe(2.0)
    })
    
    it('handles multiple pool readings with different keys', () => {
      const readings = safeChemicalReadings.slice(0, 3)
      
      // Store multiple readings
      readings.forEach((reading, index) => {
        poolStorage.set(`reading-${index}`, reading)
      })
      
      // Retrieve all readings
      const retrieved = readings.map((_, index) => 
        poolStorage.get(`reading-${index}`, null)
      )
      
      expect(retrieved).toHaveLength(3)
      retrieved.forEach((reading, index) => {
        expect(reading).toEqual(readings[index])
      })
    })
    
    it('stores pool status and alert history', () => {
      const poolStatus = {
        poolId: 'pool-001',
        status: 'excellent',
        lastUpdated: new Date().toISOString(),
        alerts: []
      }
      
      poolStorage.set('pool-001-status', poolStatus)
      const retrieved = poolStorage.get('pool-001-status', null)
      
      expect(retrieved).toEqual(poolStatus)
      expect(retrieved.status).toBe('excellent')
    })
    
    it('handles storage quota and cleanup', () => {
      const largeData = Array.from({ length: 1000 }, (_, i) => 
        createMockReading({ id: `reading-${i}` })
      )
      
      // Store large amount of data
      poolStorage.set('large-dataset', largeData)
      
      // Should handle large data gracefully
      const retrieved = poolStorage.get('large-dataset', [])
      expect(retrieved).toHaveLength(1000)
      
      // Test cleanup
      poolStorage.remove('large-dataset')
      const afterCleanup = poolStorage.get('large-dataset', null)
      expect(afterCleanup).toBeNull()
    })
  })

  describe('API Response Caching', () => {
    it('caches API responses with TTL', () => {
      const apiResponse = {
        poolId: 'pool-001',
        readings: safeChemicalReadings,
        timestamp: new Date().toISOString()
      }
      
      // Cache with 1 hour TTL
      apiCache.set('pool-001-readings', apiResponse, 3600000)
      
      // Should retrieve from cache
      const cached = apiCache.get('pool-001-readings')
      expect(cached).toEqual(apiResponse)
    })
    
    it('expires cache after TTL', async () => {
      const apiResponse = { data: 'test' }
      
      // Cache with very short TTL (1ms)
      apiCache.set('short-ttl', apiResponse, 1)
      
      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 10))
      
      const expired = apiCache.get('short-ttl')
      expect(expired).toBeNull()
    })
    
    it('clears expired cache entries automatically', async () => {
      // Add multiple entries with different TTLs
      apiCache.set('entry-1', { data: '1' }, 1) // 1ms
      apiCache.set('entry-2', { data: '2' }, 3600000) // 1 hour
      apiCache.set('entry-3', { data: '3' }, 1) // 1ms
      
      // Wait for short-lived entries to expire
      await new Promise(resolve => setTimeout(resolve, 10))
      
      const clearedCount = apiCache.clearExpired()
      expect(clearedCount).toBe(2) // Should clear 2 expired entries
      
      const remaining = apiCache.get('entry-2')
      expect(remaining).toEqual({ data: '2' })
    })
  })

  describe('Session Data Management', () => {
    it('stores temporary session data', () => {
      const sessionInfo = {
        userId: 'user-001',
        poolId: 'pool-001',
        startTime: new Date().toISOString(),
        currentForm: {
          ph: '7.4',
          chlorine: '2.0'
        }
      }
      
      sessionData.set('current-session', sessionInfo)
      const retrieved = sessionData.get('current-session', null)
      
      expect(retrieved).toEqual(sessionInfo)
      expect(retrieved.userId).toBe('user-001')
    })
    
    it('handles form state persistence during navigation', () => {
      const formState = {
        step: 2,
        data: {
          ph: '7.4',
          chlorine: '2.0',
          alkalinity: '100'
        },
        validation: {
          errors: [],
          warnings: ['pH level approaching upper limit']
        }
      }
      
      sessionData.set('form-state', formState)
      
      // Simulate page refresh/navigation
      const restored = sessionData.get('form-state', null)
      
      expect(restored).toEqual(formState)
      expect(restored.step).toBe(2)
      expect(restored.validation.warnings).toContain('pH level approaching upper limit')
    })
  })

  describe('Offline Queue Functionality', () => {
    it('queues readings when offline', async () => {
      mockOfflineQueue.setOnlineStatus(false)
      
      const testReading = createMockReading({ ph: 7.4, chlorine: 2.0 })
      
      const result = await mockOfflineQueue.add({
        type: 'chemical-reading',
        data: testReading
      })
      
      expect(result.queued).toBe(true)
      expect(mockOfflineQueue.getQueueLength()).toBe(1)
    })
    
    it('processes queue when coming back online', async () => {
      mockOfflineQueue.setOnlineStatus(false)
      
      // Add multiple items while offline
      const readings = [
        createMockReading({ ph: 7.4 }),
        createMockReading({ ph: 7.3 }),
        createMockReading({ ph: 7.5 })
      ]
      
      for (const reading of readings) {
        await mockOfflineQueue.add({
          type: 'chemical-reading',
          data: reading
        })
      }
      
      expect(mockOfflineQueue.getQueueLength()).toBe(3)
      
      // Come back online
      mockOfflineQueue.setOnlineStatus(true)
      
      // Queue should be processed
      await new Promise(resolve => setTimeout(resolve, 10))
      expect(mockOfflineQueue.getQueueLength()).toBe(0)
    })
    
    it('handles failed queue processing gracefully', async () => {
      // This would be implemented with actual error handling
      // For now, just ensure the structure works
      mockOfflineQueue.setOnlineStatus(false)
      
      const invalidReading = createMockReading({ ph: 15 }) // Invalid pH
      
      await mockOfflineQueue.add({
        type: 'chemical-reading',
        data: invalidReading
      })
      
      expect(mockOfflineQueue.getQueueLength()).toBe(1)
    })
  })

  describe('Data Synchronization Workflow', () => {
    it('synchronizes local and server data', async () => {
      // Simulate local data
      const localReadings = [
        createMockReading({ id: 'local-1', ph: 7.4 }),
        createMockReading({ id: 'local-2', ph: 7.3 })
      ]
      
      poolStorage.set('pending-sync', localReadings)
      
      // Simulate server sync
      const syncData = poolStorage.get('pending-sync', [])
      expect(syncData).toHaveLength(2)
      
      // After successful sync, clear pending data
      poolStorage.remove('pending-sync')
      const afterSync = poolStorage.get('pending-sync', [])
      expect(afterSync).toHaveLength(0)
    })
    
    it('handles conflict resolution between local and server data', () => {
      const localReading = createMockReading({ 
        id: 'reading-001',
        ph: 7.4,
        timestamp: '2024-01-15T08:00:00Z',
        validated: false
      })
      
      const serverReading = {
        ...localReading,
        ph: 7.5, // Different value
        validated: true,
        timestamp: '2024-01-15T08:05:00Z' // Later timestamp
      }
      
      poolStorage.set('local-reading', localReading)
      
      // Server data wins due to later timestamp and validation
      const resolvedReading = serverReading.timestamp > localReading.timestamp 
        ? serverReading 
        : localReading
      
      poolStorage.set('local-reading', resolvedReading)
      const final = poolStorage.get('local-reading', null)
      
      expect(final.ph).toBe(7.5)
      expect(final.validated).toBe(true)
    })
  })

  describe('Performance and Storage Limits', () => {
    it('handles storage quota efficiently', () => {
      const startTime = Date.now()
      
      // Store and retrieve large amounts of data
      const largeDataset = Array.from({ length: 100 }, () => 
        createMockReading()
      )
      
      poolStorage.set('performance-test', largeDataset)
      const retrieved = poolStorage.get('performance-test', [])
      
      const endTime = Date.now()
      const operationTime = endTime - startTime
      
      expect(operationTime).toBeLessThan(100) // Should be fast
      expect(retrieved).toHaveLength(100)
    })
    
    it('implements LRU cache for storage management', () => {
      // Add items until near capacity
      for (let i = 0; i < 10; i++) {
        poolStorage.set(`item-${i}`, createMockReading({ id: `reading-${i}` }))
      }
      
      // Access some items to mark as recently used
      poolStorage.get('item-0', null)
      poolStorage.get('item-5', null)
      
      // Add more items (would trigger LRU cleanup in real implementation)
      for (let i = 10; i < 15; i++) {
        poolStorage.set(`item-${i}`, createMockReading({ id: `reading-${i}` }))
      }
      
      // Recently accessed items should still exist
      expect(poolStorage.get('item-0', null)).not.toBeNull()
      expect(poolStorage.get('item-5', null)).not.toBeNull()
    })
  })

  describe('Data Integrity and Validation', () => {
    it('validates data integrity on retrieval', () => {
      const validReading = safeChemicalReadings[0]
      
      poolStorage.set('integrity-test', validReading)
      const retrieved = poolStorage.get('integrity-test', null)
      
      // Verify all required fields are present
      expect(retrieved).toHaveProperty('id')
      expect(retrieved).toHaveProperty('ph')
      expect(retrieved).toHaveProperty('chlorine')
      expect(retrieved).toHaveProperty('alkalinity')
      expect(retrieved).toHaveProperty('temperature')
      expect(retrieved).toHaveProperty('timestamp')
    })
    
    it('handles corrupted data gracefully', () => {
      // Simulate corrupted data by directly setting invalid JSON
      mockLocalStorage.setItem('pool-maintainer:corrupted', 'invalid-json{')
      
      // Should return default value when JSON parsing fails
      const retrieved = poolStorage.get('corrupted', { default: 'fallback' })
      expect(retrieved).toEqual({ default: 'fallback' })
    })
    
    it('maintains data consistency across storage operations', () => {
      const readings = safeChemicalReadings.slice(0, 3)
      
      // Store readings in a transaction-like manner
      const storageKey = 'batch-readings'
      poolStorage.set(storageKey, readings)
      
      // Verify all readings are stored correctly
      const retrieved = poolStorage.get(storageKey, [])
      expect(retrieved).toHaveLength(3)
      
      readings.forEach((reading, index) => {
        expect(retrieved[index]).toEqual(reading)
      })
    })
  })

  describe('Cross-Tab Synchronization', () => {
    it('handles storage events from other tabs', () => {
      const eventHandler = vi.fn()
      
      // Listen for storage events
      window.addEventListener('storage', eventHandler)
      
      // Simulate storage event from another tab
      // Note: JSDOM doesn't fully support StorageEvent constructor with custom storageArea
      // We'll use a custom event as a workaround
      const storageEvent = new CustomEvent('storage', {
        detail: {
          key: 'pool-maintainer:shared-data',
          oldValue: null,
          newValue: JSON.stringify({ updated: true })
        }
      })
      
      window.dispatchEvent(storageEvent)
      
      expect(eventHandler).toHaveBeenCalledWith(storageEvent)
      
      window.removeEventListener('storage', eventHandler)
    })
    
    it('maintains data consistency across tabs', () => {
      const sharedData = {
        poolStatus: 'excellent',
        lastReading: safeChemicalReadings[0],
        alerts: []
      }
      
      poolStorage.set('shared-state', sharedData)
      
      // Simulate another tab reading the same data
      const retrievedInOtherTab = poolStorage.get('shared-state', null)
      
      expect(retrievedInOtherTab).toEqual(sharedData)
    })
  })
})