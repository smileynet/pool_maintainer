/**
 * Array and object manipulation utility functions
 */

/**
 * Removes duplicate items from an array
 */
export function unique<T>(array: T[]): T[] {
  return [...new Set(array)]
}

/**
 * Removes duplicate objects by a specific key
 */
export function uniqueBy<T>(array: T[], key: keyof T): T[] {
  const seen = new Set()
  return array.filter(item => {
    const value = item[key]
    if (seen.has(value)) return false
    seen.add(value)
    return true
  })
}

/**
 * Groups array items by a specific key
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const value = String(item[key])
    if (!groups[value]) groups[value] = []
    groups[value].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

/**
 * Sorts array by multiple keys with direction
 */
export function sortBy<T>(
  array: T[],
  sorts: Array<{ key: keyof T; direction?: 'asc' | 'desc' }>
): T[] {
  return [...array].sort((a, b) => {
    for (const { key, direction = 'asc' } of sorts) {
      const aVal = a[key]
      const bVal = b[key]
      
      if (aVal < bVal) return direction === 'asc' ? -1 : 1
      if (aVal > bVal) return direction === 'asc' ? 1 : -1
    }
    return 0
  })
}

/**
 * Chunks array into smaller arrays of specified size
 */
export function chunk<T>(array: T[], size: number): T[][] {
  if (size <= 0) return []
  
  const chunks = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

/**
 * Flattens nested arrays one level deep
 */
export function flatten<T>(array: (T | T[])[]): T[] {
  return array.reduce((flat, item) => {
    return Array.isArray(item) ? flat.concat(item) : flat.concat([item])
  }, [] as T[])
}

/**
 * Deeply flattens nested arrays
 */
export function flattenDeep(array: any[]): any[] {
  return array.reduce((flat, item) => {
    return Array.isArray(item) 
      ? flat.concat(flattenDeep(item))
      : flat.concat([item])
  }, [])
}

/**
 * Finds the intersection of two arrays
 */
export function intersection<T>(array1: T[], array2: T[]): T[] {
  const set2 = new Set(array2)
  return array1.filter(item => set2.has(item))
}

/**
 * Finds the difference between two arrays (items in first but not second)
 */
export function difference<T>(array1: T[], array2: T[]): T[] {
  const set2 = new Set(array2)
  return array1.filter(item => !set2.has(item))
}

/**
 * Finds the symmetric difference between two arrays
 */
export function symmetricDifference<T>(array1: T[], array2: T[]): T[] {
  const set1 = new Set(array1)
  const set2 = new Set(array2)
  
  return [
    ...array1.filter(item => !set2.has(item)),
    ...array2.filter(item => !set1.has(item))
  ]
}

/**
 * Shuffles array items randomly
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Takes a random sample from an array
 */
export function sample<T>(array: T[], count: number = 1): T[] {
  if (count >= array.length) return shuffle(array)
  
  const shuffled = shuffle(array)
  return shuffled.slice(0, count)
}

/**
 * Partitions array into two arrays based on predicate
 */
export function partition<T>(
  array: T[], 
  predicate: (item: T) => boolean
): [T[], T[]] {
  const truthy = []
  const falsy = []
  
  for (const item of array) {
    if (predicate(item)) {
      truthy.push(item)
    } else {
      falsy.push(item)
    }
  }
  
  return [truthy, falsy]
}

/**
 * Finds the first item that matches predicate
 */
export function find<T>(
  array: T[], 
  predicate: (item: T) => boolean
): T | undefined {
  return array.find(predicate)
}

/**
 * Finds the last item that matches predicate
 */
export function findLast<T>(
  array: T[], 
  predicate: (item: T) => boolean
): T | undefined {
  for (let i = array.length - 1; i >= 0; i--) {
    if (predicate(array[i])) return array[i]
  }
  return undefined
}

/**
 * Counts items that match predicate
 */
export function count<T>(
  array: T[], 
  predicate: (item: T) => boolean
): number {
  return array.filter(predicate).length
}

/**
 * Checks if any item matches predicate
 */
export function some<T>(
  array: T[], 
  predicate: (item: T) => boolean
): boolean {
  return array.some(predicate)
}

/**
 * Checks if all items match predicate
 */
export function every<T>(
  array: T[], 
  predicate: (item: T) => boolean
): boolean {
  return array.every(predicate)
}

/**
 * Gets a nested property value safely
 */
export function get<T>(
  obj: any, 
  path: string, 
  defaultValue?: T
): T | undefined {
  const keys = path.split('.')
  let current = obj
  
  for (const key of keys) {
    if (current == null || typeof current !== 'object') {
      return defaultValue
    }
    current = current[key]
  }
  
  return current !== undefined ? current : defaultValue
}

/**
 * Sets a nested property value safely
 */
export function set<T extends Record<string, any>>(
  obj: T, 
  path: string, 
  value: any
): T {
  const keys = path.split('.')
  const result = { ...obj }
  let current = result
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {}
    } else {
      current[key] = { ...current[key] }
    }
    current = current[key]
  }
  
  current[keys[keys.length - 1]] = value
  return result
}

/**
 * Omits specified keys from an object
 */
export function omit<T extends Record<string, any>, K extends keyof T>(
  obj: T, 
  keys: K[]
): Omit<T, K> {
  const result = { ...obj }
  for (const key of keys) {
    delete result[key]
  }
  return result
}

/**
 * Picks specified keys from an object
 */
export function pick<T extends Record<string, any>, K extends keyof T>(
  obj: T, 
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key]
    }
  }
  return result
}

/**
 * Deep merges two objects
 */
export function merge<T extends Record<string, any>>(
  target: T, 
  source: Partial<T>
): T {
  const result = { ...target }
  
  for (const key in source) {
    const sourceValue = source[key]
    const targetValue = result[key]
    
    if (
      sourceValue && 
      typeof sourceValue === 'object' && 
      !Array.isArray(sourceValue) &&
      targetValue && 
      typeof targetValue === 'object' && 
      !Array.isArray(targetValue)
    ) {
      result[key] = merge(targetValue, sourceValue)
    } else {
      result[key] = sourceValue as T[Extract<keyof T, string>]
    }
  }
  
  return result
}

/**
 * Deep clones an object or array
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as T
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as T
  if (obj instanceof Set) return new Set([...obj].map(item => deepClone(item))) as T
  if (obj instanceof Map) {
    const cloned = new Map()
    obj.forEach((value, key) => {
      cloned.set(deepClone(key), deepClone(value))
    })
    return cloned as T
  }
  
  const cloned = {} as T
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key])
    }
  }
  return cloned
}

/**
 * Checks if two values are deeply equal
 */
export function isEqual(a: any, b: any): boolean {
  if (a === b) return true
  if (a == null || b == null) return a === b
  if (typeof a !== typeof b) return false
  
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false
    return a.every((item, index) => isEqual(item, b[index]))
  }
  
  if (typeof a === 'object') {
    const keysA = Object.keys(a)
    const keysB = Object.keys(b)
    
    if (keysA.length !== keysB.length) return false
    
    return keysA.every(key => 
      keysB.includes(key) && isEqual(a[key], b[key])
    )
  }
  
  return false
}

/**
 * Checks if an object is empty
 */
export function isEmpty(value: any): boolean {
  if (value == null) return true
  if (Array.isArray(value) || typeof value === 'string') return value.length === 0
  if (value instanceof Map || value instanceof Set) return value.size === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

/**
 * Maps object values while preserving keys
 */
export function mapValues<T, U>(
  obj: Record<string, T>, 
  mapper: (value: T, key: string) => U
): Record<string, U> {
  const result: Record<string, U> = {}
  for (const [key, value] of Object.entries(obj)) {
    result[key] = mapper(value, key)
  }
  return result
}

/**
 * Filters object by predicate
 */
export function filterObject<T>(
  obj: Record<string, T>, 
  predicate: (value: T, key: string) => boolean
): Record<string, T> {
  const result: Record<string, T> = {}
  for (const [key, value] of Object.entries(obj)) {
    if (predicate(value, key)) {
      result[key] = value
    }
  }
  return result
}