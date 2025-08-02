/**
 * Local storage and session storage utility functions
 */

/**
 * Storage types
 */
export type StorageType = 'localStorage' | 'sessionStorage'

/**
 * Storage error types
 */
export class StorageError extends Error {
  constructor(message: string, public storageType: StorageType) {
    super(message)
    this.name = 'StorageError'
  }
}

/**
 * Checks if storage is available
 */
export function isStorageAvailable(type: StorageType): boolean {
  try {
    const storage = window[type]
    const testKey = '__storage_test__'
    storage.setItem(testKey, 'test')
    storage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

/**
 * Gets the storage object safely
 */
function getStorage(type: StorageType): Storage {
  if (!isStorageAvailable(type)) {
    throw new StorageError(`${type} is not available`, type)
  }
  return window[type]
}

/**
 * Safely sets an item in storage with JSON serialization
 */
export function setStorageItem<T>(
  key: string, 
  value: T, 
  type: StorageType = 'localStorage'
): boolean {
  try {
    const storage = getStorage(type)
    const serializedValue = JSON.stringify(value)
    storage.setItem(key, serializedValue)
    return true
  } catch (error) {
    console.warn(`Failed to set ${type} item:`, error)
    return false
  }
}

/**
 * Safely gets an item from storage with JSON deserialization
 */
export function getStorageItem<T>(
  key: string, 
  defaultValue: T, 
  type: StorageType = 'localStorage'
): T {
  try {
    const storage = getStorage(type)
    const item = storage.getItem(key)
    
    if (item === null) {
      return defaultValue
    }
    
    return JSON.parse(item) as T
  } catch (error) {
    console.warn(`Failed to get ${type} item:`, error)
    return defaultValue
  }
}

/**
 * Safely removes an item from storage
 */
export function removeStorageItem(
  key: string, 
  type: StorageType = 'localStorage'
): boolean {
  try {
    const storage = getStorage(type)
    storage.removeItem(key)
    return true
  } catch (error) {
    console.warn(`Failed to remove ${type} item:`, error)
    return false
  }
}

/**
 * Clears all items from storage
 */
export function clearStorage(type: StorageType = 'localStorage'): boolean {
  try {
    const storage = getStorage(type)
    storage.clear()
    return true
  } catch (error) {
    console.warn(`Failed to clear ${type}:`, error)
    return false
  }
}

/**
 * Gets all keys from storage
 */
export function getStorageKeys(type: StorageType = 'localStorage'): string[] {
  try {
    const storage = getStorage(type)
    const keys: string[] = []
    
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i)
      if (key !== null) {
        keys.push(key)
      }
    }
    
    return keys
  } catch (error) {
    console.warn(`Failed to get ${type} keys:`, error)
    return []
  }
}

/**
 * Gets storage size in bytes (approximate)
 */
export function getStorageSize(type: StorageType = 'localStorage'): number {
  try {
    const storage = getStorage(type)
    let totalSize = 0
    
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i)
      if (key !== null) {
        const value = storage.getItem(key)
        if (value !== null) {
          totalSize += key.length + value.length
        }
      }
    }
    
    return totalSize
  } catch (error) {
    console.warn(`Failed to calculate ${type} size:`, error)
    return 0
  }
}

/**
 * Checks if a key exists in storage
 */
export function hasStorageItem(
  key: string, 
  type: StorageType = 'localStorage'
): boolean {
  try {
    const storage = getStorage(type)
    return storage.getItem(key) !== null
  } catch (error) {
    console.warn(`Failed to check ${type} item:`, error)
    return false
  }
}

/**
 * Gets all items from storage as an object
 */
export function getAllStorageItems(
  type: StorageType = 'localStorage'
): Record<string, any> {
  try {
    const storage = getStorage(type)
    const items: Record<string, any> = {}
    
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i)
      if (key !== null) {
        const value = storage.getItem(key)
        if (value !== null) {
          try {
            items[key] = JSON.parse(value)
          } catch {
            items[key] = value // Store as string if not valid JSON
          }
        }
      }
    }
    
    return items
  } catch (error) {
    console.warn(`Failed to get all ${type} items:`, error)
    return {}
  }
}

/**
 * Exports storage data as JSON string
 */
export function exportStorage(type: StorageType = 'localStorage'): string {
  const items = getAllStorageItems(type)
  return JSON.stringify(items, null, 2)
}

/**
 * Imports storage data from JSON string
 */
export function importStorage(
  data: string, 
  type: StorageType = 'localStorage',
  merge: boolean = false
): boolean {
  try {
    const items = JSON.parse(data)
    
    if (!merge) {
      clearStorage(type)
    }
    
    for (const [key, value] of Object.entries(items)) {
      setStorageItem(key, value, type)
    }
    
    return true
  } catch (error) {
    console.warn(`Failed to import ${type} data:`, error)
    return false
  }
}

/**
 * Creates a storage manager for a specific prefix
 */
export function createStorageManager(
  prefix: string, 
  type: StorageType = 'localStorage'
) {
  const getKey = (key: string) => `${prefix}:${key}`
  
  return {
    set<T>(key: string, value: T): boolean {
      return setStorageItem(getKey(key), value, type)
    },
    
    get<T>(key: string, defaultValue: T): T {
      return getStorageItem(getKey(key), defaultValue, type)
    },
    
    remove(key: string): boolean {
      return removeStorageItem(getKey(key), type)
    },
    
    has(key: string): boolean {
      return hasStorageItem(getKey(key), type)
    },
    
    clear(): boolean {
      const keys = getStorageKeys(type)
      const prefixedKeys = keys.filter(key => key.startsWith(`${prefix}:`))
      
      let success = true
      for (const key of prefixedKeys) {
        if (!removeStorageItem(key, type)) {
          success = false
        }
      }
      
      return success
    },
    
    getAllKeys(): string[] {
      const keys = getStorageKeys(type)
      return keys
        .filter(key => key.startsWith(`${prefix}:`))
        .map(key => key.substring(prefix.length + 1))
    },
    
    getAll(): Record<string, any> {
      const allItems = getAllStorageItems(type)
      const prefixedItems: Record<string, any> = {}
      
      for (const [key, value] of Object.entries(allItems)) {
        if (key.startsWith(`${prefix}:`)) {
          const unprefixedKey = key.substring(prefix.length + 1)
          prefixedItems[unprefixedKey] = value
        }
      }
      
      return prefixedItems
    }
  }
}

/**
 * Creates a storage cache with expiration
 */
export function createStorageCache(
  prefix: string = 'cache',
  type: StorageType = 'localStorage'
) {
  const manager = createStorageManager(prefix, type)
  
  interface CacheItem<T> {
    value: T
    expires: number
  }
  
  return {
    set<T>(key: string, value: T, ttlMs: number = 3600000): boolean {
      const expires = Date.now() + ttlMs
      const cacheItem: CacheItem<T> = { value, expires }
      return manager.set(key, cacheItem)
    },
    
    get<T>(key: string): T | null {
      const cacheItem = manager.get<CacheItem<T> | null>(key, null)
      
      if (!cacheItem) {
        return null
      }
      
      if (Date.now() > cacheItem.expires) {
        manager.remove(key)
        return null
      }
      
      return cacheItem.value
    },
    
    has(key: string): boolean {
      const value = this.get(key)
      return value !== null
    },
    
    remove(key: string): boolean {
      return manager.remove(key)
    },
    
    clear(): boolean {
      return manager.clear()
    },
    
    clearExpired(): number {
      const keys = manager.getAllKeys()
      let clearedCount = 0
      
      for (const key of keys) {
        const cacheItem = manager.get<CacheItem<any> | null>(key, null)
        if (cacheItem && Date.now() > cacheItem.expires) {
          manager.remove(key)
          clearedCount++
        }
      }
      
      return clearedCount
    }
  }
}

/**
 * Migrates data between storage types
 */
export function migrateStorage(
  fromType: StorageType,
  toType: StorageType,
  keys?: string[]
): boolean {
  try {
    const sourceItems = getAllStorageItems(fromType)
    
    for (const [key, value] of Object.entries(sourceItems)) {
      if (!keys || keys.includes(key)) {
        setStorageItem(key, value, toType)
      }
    }
    
    return true
  } catch (error) {
    console.warn(`Failed to migrate from ${fromType} to ${toType}:`, error)
    return false
  }
}

/**
 * Pool-specific storage utilities
 */
export const poolStorage = createStorageManager('pool-maintainer')

/**
 * Settings storage utilities
 */
export const settingsStorage = createStorageManager('settings')

/**
 * Cache for API responses
 */
export const apiCache = createStorageCache('api-cache')

/**
 * Temporary session data
 */
export const sessionData = createStorageManager('session', 'sessionStorage')