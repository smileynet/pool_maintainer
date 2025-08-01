/* eslint-disable no-console */
// Offline Queue System for Pool Maintenance Data
// Handles offline data storage and synchronization
// Console logging is needed for debugging offline sync behavior

interface OfflineQueueItem {
  id: string
  type: 'chemical_test' | 'delete_test' | 'update_test'
  data: Record<string, unknown>
  timestamp: number
  retryCount: number
  maxRetries: number
}

interface SyncResult {
  success: boolean
  syncedItems: number
  failedItems: number
  errors: Array<{ id: string; error: string }>
}

const DB_NAME = 'PoolMaintenanceOffline'
const DB_VERSION = 1
const STORE_NAME = 'offline_queue'

class OfflineQueue {
  private db: IDBDatabase | null = null
  private isOnline = navigator.onLine
  private syncInProgress = false

  constructor() {
    // Monitor connection status
    window.addEventListener('online', () => {
      this.isOnline = true
      console.log('[OfflineQueue] Connection restored, starting sync...')
      this.processPendingItems()
    })

    window.addEventListener('offline', () => {
      this.isOnline = false
      console.log('[OfflineQueue] Connection lost, entering offline mode')
    })

    // Initialize database
    this.initDatabase()

    // Register background sync if supported
    this.registerBackgroundSync()
  }

  private async initDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => {
        console.error('[OfflineQueue] Failed to open database:', request.error)
        reject(request.error)
      }

      request.onsuccess = () => {
        this.db = request.result
        console.log('[OfflineQueue] Database initialized successfully')
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        
        // Create object store for offline queue
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
          store.createIndex('timestamp', 'timestamp', { unique: false })
          store.createIndex('type', 'type', { unique: false })
          console.log('[OfflineQueue] Object store created')
        }
      }
    })
  }

  // Add item to offline queue
  async addToQueue(
    type: OfflineQueueItem['type'], 
    data: Record<string, unknown>, 
    maxRetries = 3
  ): Promise<string> {
    const item: OfflineQueueItem = {
      id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      data,
      timestamp: Date.now(),
      retryCount: 0,
      maxRetries
    }

    if (!this.db) {
      throw new Error('Database not initialized')
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.add(item)

      request.onsuccess = () => {
        console.log('[OfflineQueue] Item added to queue:', item.id)
        resolve(item.id)
        
        // Try to sync immediately if online
        if (this.isOnline) {
          this.processPendingItems()
        }
      }

      request.onerror = () => {
        console.error('[OfflineQueue] Failed to add item to queue:', request.error)
        reject(request.error)
      }
    })
  }

  // Get all pending items
  async getPendingItems(): Promise<OfflineQueueItem[]> {
    if (!this.db) {
      throw new Error('Database not initialized')
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.getAll()

      request.onsuccess = () => {
        const items = request.result as OfflineQueueItem[]
        // Sort by timestamp (oldest first)
        items.sort((a, b) => a.timestamp - b.timestamp)
        resolve(items)
      }

      request.onerror = () => {
        console.error('[OfflineQueue] Failed to get pending items:', request.error)
        reject(request.error)
      }
    })
  }

  // Remove item from queue
  async removeFromQueue(id: string): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized')
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.delete(id)

      request.onsuccess = () => {
        console.log('[OfflineQueue] Item removed from queue:', id)
        resolve()
      }

      request.onerror = () => {
        console.error('[OfflineQueue] Failed to remove item from queue:', request.error)
        reject(request.error)
      }
    })
  }

  // Update retry count for failed item
  async updateRetryCount(id: string): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized')
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const getRequest = store.get(id)

      getRequest.onsuccess = () => {
        const item = getRequest.result as OfflineQueueItem
        if (item) {
          item.retryCount++
          const putRequest = store.put(item)
          
          putRequest.onsuccess = () => resolve()
          putRequest.onerror = () => reject(putRequest.error)
        } else {
          reject(new Error('Item not found'))
        }
      }

      getRequest.onerror = () => reject(getRequest.error)
    })
  }

  // Process all pending items
  async processPendingItems(): Promise<SyncResult> {
    if (this.syncInProgress || !this.isOnline) {
      console.log('[OfflineQueue] Sync already in progress or offline')
      return { success: false, syncedItems: 0, failedItems: 0, errors: [] }
    }

    this.syncInProgress = true
    console.log('[OfflineQueue] Starting sync process...')

    try {
      const pendingItems = await this.getPendingItems()
      
      if (pendingItems.length === 0) {
        console.log('[OfflineQueue] No pending items to sync')
        return { success: true, syncedItems: 0, failedItems: 0, errors: [] }
      }

      console.log(`[OfflineQueue] Found ${pendingItems.length} items to sync`)

      const result: SyncResult = {
        success: true,
        syncedItems: 0,
        failedItems: 0,
        errors: []
      }

      // Process each item
      for (const item of pendingItems) {
        try {
          await this.syncSingleItem(item)
          await this.removeFromQueue(item.id)
          result.syncedItems++
          console.log(`[OfflineQueue] Synced item: ${item.id}`)
        } catch (error) {
          console.error(`[OfflineQueue] Failed to sync item ${item.id}:`, error)
          
          if (item.retryCount >= item.maxRetries) {
            // Max retries reached, remove from queue
            await this.removeFromQueue(item.id)
            result.failedItems++
            result.errors.push({ 
              id: item.id, 
              error: `Max retries exceeded: ${error}` 
            })
          } else {
            // Increment retry count
            await this.updateRetryCount(item.id)
            result.failedItems++
            result.errors.push({ 
              id: item.id, 
              error: `Retry ${item.retryCount + 1}/${item.maxRetries}: ${error}` 
            })
          }
        }
      }

      // Trigger background sync for remaining items if available
      if (result.failedItems > 0) {
        this.requestBackgroundSync()
      }

      console.log(`[OfflineQueue] Sync complete: ${result.syncedItems} synced, ${result.failedItems} failed`)
      return result

    } catch (error) {
      console.error('[OfflineQueue] Sync process failed:', error)
      return { 
        success: false, 
        syncedItems: 0, 
        failedItems: 0, 
        errors: [{ id: 'sync_process', error: String(error) }] 
      }
    } finally {
      this.syncInProgress = false
    }
  }

  // Sync individual item based on type
  private async syncSingleItem(item: OfflineQueueItem): Promise<void> {
    const { type, data } = item

    switch (type) {
      case 'chemical_test':
        // In a real app, this would make an API call
        console.log('[OfflineQueue] Syncing chemical test:', data)
        // Simulate API call
        await this.simulateAPICall('POST', '/api/chemical-tests', data)
        break

      case 'update_test':
        console.log('[OfflineQueue] Syncing test update:', data)
        await this.simulateAPICall('PUT', `/api/chemical-tests/${data.id}`, data)
        break

      case 'delete_test':
        console.log('[OfflineQueue] Syncing test deletion:', data)
        await this.simulateAPICall('DELETE', `/api/chemical-tests/${data.id}`)
        break

      default:
        throw new Error(`Unknown sync type: ${type}`)
    }
  }

  // Simulate API call (replace with real API calls)
  private async simulateAPICall(method: string, url: string, _data?: Record<string, unknown>): Promise<void> {
    return new Promise((resolve, reject) => {
      // Simulate network delay
      setTimeout(() => {
        // Simulate 90% success rate
        if (Math.random() > 0.1) {
          console.log(`[OfflineQueue] Simulated ${method} ${url} - Success`)
          resolve()
        } else {
          reject(new Error(`Simulated ${method} ${url} - Network error`))
        }
      }, 500 + Math.random() * 1000)
    })
  }

  // Register background sync with service worker
  private async registerBackgroundSync(): Promise<void> {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      try {
        const registration = await navigator.serviceWorker.ready
        console.log('[OfflineQueue] Background sync registered')
        
        // The service worker will handle the 'pool-data-sync' event
        return registration.sync.register('pool-data-sync')
      } catch (error) {
        console.log('[OfflineQueue] Background sync not supported:', error)
      }
    }
  }

  // Request background sync
  private async requestBackgroundSync(): Promise<void> {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      try {
        const registration = await navigator.serviceWorker.ready
        await registration.sync.register('pool-data-sync')
        console.log('[OfflineQueue] Background sync requested')
      } catch (error) {
        console.log('[OfflineQueue] Failed to request background sync:', error)
      }
    }
  }

  // Get queue statistics
  async getQueueStats(): Promise<{ total: number; byType: Record<string, number> }> {
    const items = await this.getPendingItems()
    const byType: Record<string, number> = {}
    
    items.forEach(item => {
      byType[item.type] = (byType[item.type] || 0) + 1
    })

    return {
      total: items.length,
      byType
    }
  }

  // Clear all queue items (for debugging)
  async clearQueue(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized')
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.clear()

      request.onsuccess = () => {
        console.log('[OfflineQueue] Queue cleared')
        resolve()
      }

      request.onerror = () => {
        console.error('[OfflineQueue] Failed to clear queue:', request.error)
        reject(request.error)
      }
    })
  }
}

// Create singleton instance
export const offlineQueue = new OfflineQueue()

// Export types for use in other modules
export type { OfflineQueueItem, SyncResult }