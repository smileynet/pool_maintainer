/**
 * Date and time utility functions
 */

/**
 * Formats a date to a human-readable string
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date'
  }
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  }
  
  return dateObj.toLocaleDateString('en-US', defaultOptions)
}

/**
 * Formats a date and time to a readable string
 */
export function formatDateTime(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options
  }
  
  return formatDate(date, defaultOptions)
}

/**
 * Gets a relative time string (e.g., "2 hours ago", "in 3 days")
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - dateObj.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  if (Math.abs(diffMinutes) < 1) return 'just now'
  if (Math.abs(diffMinutes) < 60) {
    return diffMinutes > 0 ? `${diffMinutes}m ago` : `in ${Math.abs(diffMinutes)}m`
  }
  if (Math.abs(diffHours) < 24) {
    return diffHours > 0 ? `${diffHours}h ago` : `in ${Math.abs(diffHours)}h`
  }
  if (Math.abs(diffDays) < 7) {
    return diffDays > 0 ? `${diffDays}d ago` : `in ${Math.abs(diffDays)}d`
  }
  
  return formatDate(dateObj)
}

/**
 * Checks if a date is today
 */
export function isToday(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const today = new Date()
  
  return dateObj.toDateString() === today.toDateString()
}

/**
 * Checks if a date is within the last N days
 */
export function isWithinDays(date: Date | string, days: number): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - dateObj.getTime()
  const diffDays = diffMs / (1000 * 60 * 60 * 24)
  
  return diffDays >= 0 && diffDays <= days
}

/**
 * Gets the start of day for a given date
 */
export function startOfDay(date: Date | string): Date {
  const dateObj = typeof date === 'string' ? new Date(date) : new Date(date)
  dateObj.setHours(0, 0, 0, 0)
  return dateObj
}

/**
 * Gets the end of day for a given date
 */
export function endOfDay(date: Date | string): Date {
  const dateObj = typeof date === 'string' ? new Date(date) : new Date(date)
  dateObj.setHours(23, 59, 59, 999)
  return dateObj
}

/**
 * Adds days to a date
 */
export function addDays(date: Date | string, days: number): Date {
  const dateObj = typeof date === 'string' ? new Date(date) : new Date(date)
  dateObj.setDate(dateObj.getDate() + days)
  return dateObj
}

/**
 * Subtracts days from a date
 */
export function subtractDays(date: Date | string, days: number): Date {
  return addDays(date, -days)
}

/**
 * Gets the date range for common periods
 */
export function getDateRange(period: 'today' | 'week' | 'month' | 'quarter' | 'year'): { start: Date; end: Date } {
  const now = new Date()
  const start = new Date()
  
  switch (period) {
    case 'today':
      return { start: startOfDay(now), end: endOfDay(now) }
    
    case 'week':
      start.setDate(now.getDate() - now.getDay()) // Start of week (Sunday)
      return { start: startOfDay(start), end: endOfDay(now) }
    
    case 'month':
      start.setDate(1) // First day of month
      return { start: startOfDay(start), end: endOfDay(now) }
    
    case 'quarter':
      const quarter = Math.floor(now.getMonth() / 3)
      start.setMonth(quarter * 3, 1)
      return { start: startOfDay(start), end: endOfDay(now) }
    
    case 'year':
      start.setMonth(0, 1) // January 1st
      return { start: startOfDay(start), end: endOfDay(now) }
    
    default:
      return { start: startOfDay(now), end: endOfDay(now) }
  }
}

/**
 * Formats a date for input elements (YYYY-MM-DD)
 */
export function formatDateForInput(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toISOString().split('T')[0]
}

/**
 * Formats a datetime for input elements (YYYY-MM-DDTHH:mm)
 */
export function formatDateTimeForInput(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const isoString = dateObj.toISOString()
  return isoString.slice(0, 16) // Remove seconds and timezone
}

/**
 * Parses a date string safely
 */
export function parseDate(dateString: string): Date | null {
  if (!dateString || typeof dateString !== 'string') return null
  
  const date = new Date(dateString)
  return isNaN(date.getTime()) ? null : date
}

/**
 * Gets a list of months for dropdowns
 */
export function getMonthOptions(format: 'short' | 'long' = 'long'): Array<{ value: number; label: string }> {
  const months = []
  for (let i = 0; i < 12; i++) {
    const date = new Date(2024, i, 1) // Use 2024 as a reference year
    months.push({
      value: i,
      label: date.toLocaleDateString('en-US', { month: format })
    })
  }
  return months
}

/**
 * Gets a list of years for dropdowns
 */
export function getYearOptions(startYear?: number, endYear?: number): Array<{ value: number; label: string }> {
  const currentYear = new Date().getFullYear()
  const start = startYear ?? currentYear - 10
  const end = endYear ?? currentYear + 5
  
  const years = []
  for (let year = end; year >= start; year--) {
    years.push({ value: year, label: year.toString() })
  }
  return years
}