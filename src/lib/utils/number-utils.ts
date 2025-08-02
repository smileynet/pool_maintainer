/**
 * Number and math utility functions
 */

/**
 * Formats a number with specified decimal places
 */
export function formatNumber(value: number, decimals: number = 2): string {
  if (isNaN(value)) return 'N/A'
  return value.toFixed(decimals)
}

/**
 * Formats a number as a percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  if (isNaN(value)) return 'N/A'
  return `${(value * 100).toFixed(decimals)}%`
}

/**
 * Formats a number with thousand separators
 */
export function formatWithCommas(value: number): string {
  if (isNaN(value)) return 'N/A'
  return value.toLocaleString()
}

/**
 * Clamps a number between min and max values
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Rounds a number to specified decimal places
 */
export function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals)
  return Math.round(value * factor) / factor
}

/**
 * Checks if a value is a valid number
 */
export function isValidNumber(value: any): value is number {
  return typeof value === 'number' && !isNaN(value) && isFinite(value)
}

/**
 * Safely parses a number from string
 */
export function parseNumber(value: string | number): number | null {
  if (typeof value === 'number') return isValidNumber(value) ? value : null
  if (typeof value !== 'string') return null
  
  const parsed = parseFloat(value.replace(/[^-.\d]/g, ''))
  return isValidNumber(parsed) ? parsed : null
}

/**
 * Calculates percentage change between two values
 */
export function calculatePercentageChange(oldValue: number, newValue: number): number {
  if (!isValidNumber(oldValue) || !isValidNumber(newValue)) return 0
  if (oldValue === 0) return newValue === 0 ? 0 : 100
  
  return ((newValue - oldValue) / Math.abs(oldValue)) * 100
}

/**
 * Calculates average of an array of numbers
 */
export function average(numbers: number[]): number {
  if (!numbers.length) return 0
  const validNumbers = numbers.filter(isValidNumber)
  if (!validNumbers.length) return 0
  
  return validNumbers.reduce((sum, num) => sum + num, 0) / validNumbers.length
}

/**
 * Calculates median of an array of numbers
 */
export function median(numbers: number[]): number {
  if (!numbers.length) return 0
  const validNumbers = numbers.filter(isValidNumber).sort((a, b) => a - b)
  if (!validNumbers.length) return 0
  
  const middle = Math.floor(validNumbers.length / 2)
  
  if (validNumbers.length % 2 === 0) {
    return (validNumbers[middle - 1] + validNumbers[middle]) / 2
  }
  
  return validNumbers[middle]
}

/**
 * Calculates standard deviation of an array of numbers
 */
export function standardDeviation(numbers: number[]): number {
  if (!numbers.length) return 0
  const validNumbers = numbers.filter(isValidNumber)
  if (validNumbers.length < 2) return 0
  
  const avg = average(validNumbers)
  const squaredDiffs = validNumbers.map(num => Math.pow(num - avg, 2))
  const avgSquaredDiff = average(squaredDiffs)
  
  return Math.sqrt(avgSquaredDiff)
}

/**
 * Generates a range of numbers
 */
export function range(start: number, end: number, step: number = 1): number[] {
  const result = []
  for (let i = start; i <= end; i += step) {
    result.push(i)
  }
  return result
}

/**
 * Random number between min and max (inclusive)
 */
export function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

/**
 * Random integer between min and max (inclusive)
 */
export function randomIntBetween(min: number, max: number): number {
  return Math.floor(randomBetween(min, max + 1))
}

/**
 * Converts bytes to human readable format
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (!isValidNumber(bytes) || bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k))
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`
}

/**
 * Formats a duration in milliseconds to human readable format
 */
export function formatDuration(ms: number): string {
  if (!isValidNumber(ms)) return '0ms'
  
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 0) return `${days}d ${hours % 24}h`
  if (hours > 0) return `${hours}h ${minutes % 60}m`
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`
  if (seconds > 0) return `${seconds}s`
  
  return `${ms}ms`
}

/**
 * Linear interpolation between two values
 */
export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * clamp(factor, 0, 1)
}

/**
 * Maps a value from one range to another
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
}

/**
 * Checks if a number is within a range (inclusive)
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return isValidNumber(value) && value >= min && value <= max
}

/**
 * Gets the sign of a number (-1, 0, or 1)
 */
export function sign(value: number): -1 | 0 | 1 {
  if (!isValidNumber(value)) return 0
  return value > 0 ? 1 : value < 0 ? -1 : 0
}

/**
 * Formats a number as currency
 */
export function formatCurrency(
  value: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  if (!isValidNumber(value)) return 'N/A'
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(value)
}