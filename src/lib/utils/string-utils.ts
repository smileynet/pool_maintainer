/**
 * String manipulation utility functions
 */

/**
 * Capitalizes the first letter of a string
 */
export function capitalize(str: string): string {
  if (!str || typeof str !== 'string') return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Capitalizes each word in a string
 */
export function capitalizeWords(str: string): string {
  if (!str || typeof str !== 'string') return ''
  return str.replace(/\b\w/g, char => char.toUpperCase())
}

/**
 * Converts a string to kebab-case
 */
export function kebabCase(str: string): string {
  if (!str || typeof str !== 'string') return ''
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

/**
 * Converts a string to camelCase
 */
export function camelCase(str: string): string {
  if (!str || typeof str !== 'string') return ''
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
      index === 0 ? word.toLowerCase() : word.toUpperCase()
    )
    .replace(/[\s-_]+/g, '')
}

/**
 * Converts a string to PascalCase
 */
export function pascalCase(str: string): string {
  if (!str || typeof str !== 'string') return ''
  const camelCased = camelCase(str)
  return camelCased.charAt(0).toUpperCase() + camelCased.slice(1)
}

/**
 * Converts a string to snake_case
 */
export function snakeCase(str: string): string {
  if (!str || typeof str !== 'string') return ''
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase()
}

/**
 * Truncates a string to a specified length with ellipsis
 */
export function truncate(str: string, length: number, suffix: string = '...'): string {
  if (!str || typeof str !== 'string') return ''
  if (str.length <= length) return str
  return str.substring(0, length - suffix.length) + suffix
}

/**
 * Truncates a string at word boundaries
 */
export function truncateWords(str: string, maxWords: number, suffix: string = '...'): string {
  if (!str || typeof str !== 'string') return ''
  const words = str.split(/\s+/)
  if (words.length <= maxWords) return str
  return words.slice(0, maxWords).join(' ') + suffix
}

/**
 * Removes extra whitespace and normalizes spacing
 */
export function normalizeWhitespace(str: string): string {
  if (!str || typeof str !== 'string') return ''
  return str.replace(/\s+/g, ' ').trim()
}

/**
 * Slugifies a string for URLs
 */
export function slugify(str: string): string {
  if (!str || typeof str !== 'string') return ''
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

/**
 * Escapes HTML characters in a string
 */
export function escapeHtml(str: string): string {
  if (!str || typeof str !== 'string') return ''
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  }
  return str.replace(/[&<>"'/]/g, char => htmlEscapes[char])
}

/**
 * Unescapes HTML characters in a string
 */
export function unescapeHtml(str: string): string {
  if (!str || typeof str !== 'string') return ''
  const htmlUnescapes: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#x27;': "'",
    '&#x2F;': '/'
  }
  return str.replace(/&(?:amp|lt|gt|quot|#x27|#x2F);/g, entity => htmlUnescapes[entity])
}

/**
 * Generates a random string of specified length
 */
export function randomString(length: number, charset: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'): string {
  let result = ''
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  return result
}

/**
 * Generates a UUID v4
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

/**
 * Extracts initials from a name
 */
export function getInitials(name: string, maxLength: number = 2): string {
  if (!name || typeof name !== 'string') return ''
  
  const words = name.trim().split(/\s+/)
  const initials = words
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, maxLength)
    .join('')
  
  return initials || name.charAt(0).toUpperCase()
}

/**
 * Masks sensitive information in a string
 */
export function maskString(str: string, visibleStart: number = 2, visibleEnd: number = 2, maskChar: string = '*'): string {
  if (!str || typeof str !== 'string') return ''
  if (str.length <= visibleStart + visibleEnd) return str
  
  const start = str.substring(0, visibleStart)
  const end = str.substring(str.length - visibleEnd)
  const maskLength = str.length - visibleStart - visibleEnd
  const mask = maskChar.repeat(maskLength)
  
  return start + mask + end
}

/**
 * Checks if a string is empty or only whitespace
 */
export function isEmpty(str: string): boolean {
  return !str || typeof str !== 'string' || str.trim().length === 0
}

/**
 * Checks if a string contains only numbers
 */
export function isNumeric(str: string): boolean {
  if (!str || typeof str !== 'string') return false
  return /^\d+$/.test(str.trim())
}

/**
 * Checks if a string is a valid email
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

/**
 * Extracts URLs from a string
 */
export function extractUrls(str: string): string[] {
  if (!str || typeof str !== 'string') return []
  const urlRegex = /https?:\/\/[^\s]+/g
  return str.match(urlRegex) || []
}

/**
 * Counts words in a string
 */
export function wordCount(str: string): number {
  if (!str || typeof str !== 'string') return 0
  return str.trim().split(/\s+/).filter(word => word.length > 0).length
}

/**
 * Reverses a string
 */
export function reverse(str: string): string {
  if (!str || typeof str !== 'string') return ''
  return str.split('').reverse().join('')
}

/**
 * Checks if a string is a palindrome
 */
export function isPalindrome(str: string): boolean {
  if (!str || typeof str !== 'string') return false
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '')
  return cleaned === reverse(cleaned)
}

/**
 * Levenshtein distance between two strings (for fuzzy matching)
 */
export function levenshteinDistance(str1: string, str2: string): number {
  if (!str1 || !str2) return Math.max(str1?.length || 0, str2?.length || 0)
  
  const matrix = []
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        )
      }
    }
  }
  
  return matrix[str2.length][str1.length]
}

/**
 * Simple similarity score between 0 and 1
 */
export function similarity(str1: string, str2: string): number {
  if (!str1 || !str2) return 0
  if (str1 === str2) return 1
  
  const longer = str1.length > str2.length ? str1 : str2
  const shorter = str1.length > str2.length ? str2 : str1
  
  if (longer.length === 0) return 1
  
  const distance = levenshteinDistance(str1, str2)
  return (longer.length - distance) / longer.length
}