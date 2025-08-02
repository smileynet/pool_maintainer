/**
 * Common validation utility functions
 */

/**
 * Validation result type
 */
export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

/**
 * Validates email format
 */
export function validateEmail(email: string): ValidationResult {
  const errors: string[] = []
  
  if (!email || typeof email !== 'string') {
    errors.push('Email is required')
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      errors.push('Invalid email format')
    }
  }
  
  return { isValid: errors.length === 0, errors }
}

/**
 * Validates phone number format
 */
export function validatePhone(phone: string): ValidationResult {
  const errors: string[] = []
  
  if (!phone || typeof phone !== 'string') {
    errors.push('Phone number is required')
  } else {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '')
    
    if (digits.length < 10) {
      errors.push('Phone number must have at least 10 digits')
    } else if (digits.length > 15) {
      errors.push('Phone number cannot exceed 15 digits')
    }
  }
  
  return { isValid: errors.length === 0, errors }
}

/**
 * Validates password strength
 */
export function validatePassword(
  password: string,
  options: {
    minLength?: number
    requireUppercase?: boolean
    requireLowercase?: boolean
    requireNumbers?: boolean
    requireSpecialChars?: boolean
  } = {}
): ValidationResult {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = true
  } = options
  
  const errors: string[] = []
  
  if (!password || typeof password !== 'string') {
    errors.push('Password is required')
    return { isValid: false, errors }
  }
  
  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`)
  }
  
  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  if (requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }
  
  return { isValid: errors.length === 0, errors }
}

/**
 * Validates URL format
 */
export function validateUrl(url: string): ValidationResult {
  const errors: string[] = []
  
  if (!url || typeof url !== 'string') {
    errors.push('URL is required')
  } else {
    try {
      new URL(url)
    } catch {
      errors.push('Invalid URL format')
    }
  }
  
  return { isValid: errors.length === 0, errors }
}

/**
 * Validates required field
 */
export function validateRequired(value: any, fieldName: string = 'Field'): ValidationResult {
  const errors: string[] = []
  
  if (value === null || value === undefined || value === '') {
    errors.push(`${fieldName} is required`)
  } else if (typeof value === 'string' && value.trim() === '') {
    errors.push(`${fieldName} cannot be empty`)
  } else if (Array.isArray(value) && value.length === 0) {
    errors.push(`${fieldName} must have at least one item`)
  }
  
  return { isValid: errors.length === 0, errors }
}

/**
 * Validates string length
 */
export function validateLength(
  value: string, 
  min: number = 0, 
  max: number = Infinity,
  fieldName: string = 'Field'
): ValidationResult {
  const errors: string[] = []
  
  if (typeof value !== 'string') {
    errors.push(`${fieldName} must be a string`)
    return { isValid: false, errors }
  }
  
  if (value.length < min) {
    errors.push(`${fieldName} must be at least ${min} characters long`)
  }
  
  if (value.length > max) {
    errors.push(`${fieldName} cannot exceed ${max} characters`)
  }
  
  return { isValid: errors.length === 0, errors }
}

/**
 * Validates number range
 */
export function validateRange(
  value: number, 
  min: number = -Infinity, 
  max: number = Infinity,
  fieldName: string = 'Value'
): ValidationResult {
  const errors: string[] = []
  
  if (typeof value !== 'number' || isNaN(value)) {
    errors.push(`${fieldName} must be a valid number`)
    return { isValid: false, errors }
  }
  
  if (value < min) {
    errors.push(`${fieldName} must be at least ${min}`)
  }
  
  if (value > max) {
    errors.push(`${fieldName} cannot exceed ${max}`)
  }
  
  return { isValid: errors.length === 0, errors }
}

/**
 * Validates array length
 */
export function validateArrayLength(
  array: any[], 
  min: number = 0, 
  max: number = Infinity,
  fieldName: string = 'Array'
): ValidationResult {
  const errors: string[] = []
  
  if (!Array.isArray(array)) {
    errors.push(`${fieldName} must be an array`)
    return { isValid: false, errors }
  }
  
  if (array.length < min) {
    errors.push(`${fieldName} must have at least ${min} items`)
  }
  
  if (array.length > max) {
    errors.push(`${fieldName} cannot have more than ${max} items`)
  }
  
  return { isValid: errors.length === 0, errors }
}

/**
 * Validates date format and range
 */
export function validateDate(
  date: string | Date,
  minDate?: Date,
  maxDate?: Date,
  fieldName: string = 'Date'
): ValidationResult {
  const errors: string[] = []
  
  let dateObj: Date
  
  if (typeof date === 'string') {
    dateObj = new Date(date)
  } else if (date instanceof Date) {
    dateObj = date
  } else {
    errors.push(`${fieldName} must be a valid date`)
    return { isValid: false, errors }
  }
  
  if (isNaN(dateObj.getTime())) {
    errors.push(`${fieldName} must be a valid date`)
    return { isValid: false, errors }
  }
  
  if (minDate && dateObj < minDate) {
    errors.push(`${fieldName} cannot be before ${minDate.toLocaleDateString()}`)
  }
  
  if (maxDate && dateObj > maxDate) {
    errors.push(`${fieldName} cannot be after ${maxDate.toLocaleDateString()}`)
  }
  
  return { isValid: errors.length === 0, errors }
}

/**
 * Validates against regex pattern
 */
export function validatePattern(
  value: string, 
  pattern: RegExp, 
  errorMessage: string,
  fieldName: string = 'Field'
): ValidationResult {
  const errors: string[] = []
  
  if (typeof value !== 'string') {
    errors.push(`${fieldName} must be a string`)
    return { isValid: false, errors }
  }
  
  if (!pattern.test(value)) {
    errors.push(errorMessage)
  }
  
  return { isValid: errors.length === 0, errors }
}

/**
 * Validates that value is one of allowed options
 */
export function validateEnum<T>(
  value: T, 
  allowedValues: T[],
  fieldName: string = 'Value'
): ValidationResult {
  const errors: string[] = []
  
  if (!allowedValues.includes(value)) {
    errors.push(`${fieldName} must be one of: ${allowedValues.join(', ')}`)
  }
  
  return { isValid: errors.length === 0, errors }
}

/**
 * Validates file upload
 */
export function validateFile(
  file: File,
  options: {
    maxSize?: number // in bytes
    allowedTypes?: string[]
    allowedExtensions?: string[]
  } = {}
): ValidationResult {
  const { maxSize, allowedTypes, allowedExtensions } = options
  const errors: string[] = []
  
  if (!file || !(file instanceof File)) {
    errors.push('Valid file is required')
    return { isValid: false, errors }
  }
  
  if (maxSize && file.size > maxSize) {
    const sizeMB = (maxSize / (1024 * 1024)).toFixed(1)
    errors.push(`File size cannot exceed ${sizeMB}MB`)
  }
  
  if (allowedTypes && !allowedTypes.includes(file.type)) {
    errors.push(`File type must be one of: ${allowedTypes.join(', ')}`)
  }
  
  if (allowedExtensions) {
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      errors.push(`File extension must be one of: ${allowedExtensions.join(', ')}`)
    }
  }
  
  return { isValid: errors.length === 0, errors }
}

/**
 * Validates credit card number using Luhn algorithm
 */
export function validateCreditCard(cardNumber: string): ValidationResult {
  const errors: string[] = []
  
  if (!cardNumber || typeof cardNumber !== 'string') {
    errors.push('Credit card number is required')
    return { isValid: false, errors }
  }
  
  // Remove spaces and dashes
  const cleaned = cardNumber.replace(/[\s-]/g, '')
  
  // Check if all characters are digits
  if (!/^\d+$/.test(cleaned)) {
    errors.push('Credit card number must contain only digits')
    return { isValid: false, errors }
  }
  
  // Check length (most cards are 13-19 digits)
  if (cleaned.length < 13 || cleaned.length > 19) {
    errors.push('Credit card number must be 13-19 digits long')
    return { isValid: false, errors }
  }
  
  // Luhn algorithm validation
  let sum = 0
  let isEven = false
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i])
    
    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }
    
    sum += digit
    isEven = !isEven
  }
  
  if (sum % 10 !== 0) {
    errors.push('Invalid credit card number')
  }
  
  return { isValid: errors.length === 0, errors }
}

/**
 * Combines multiple validation results
 */
export function combineValidations(...validations: ValidationResult[]): ValidationResult {
  const allErrors = validations.flatMap(validation => validation.errors)
  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  }
}

/**
 * Creates a validator function from validation rules
 */
export function createValidator<T>(
  rules: Array<(value: T) => ValidationResult>
): (value: T) => ValidationResult {
  return (value: T) => {
    const results = rules.map(rule => rule(value))
    return combineValidations(...results)
  }
}

/**
 * Validates object against schema
 */
export function validateObject<T extends Record<string, any>>(
  obj: T,
  schema: Record<keyof T, (value: any) => ValidationResult>
): ValidationResult & { fieldErrors: Record<keyof T, string[]> } {
  const fieldErrors = {} as Record<keyof T, string[]>
  const allErrors: string[] = []
  
  for (const [field, validator] of Object.entries(schema)) {
    const result = validator(obj[field])
    if (!result.isValid) {
      fieldErrors[field as keyof T] = result.errors
      allErrors.push(...result.errors)
    }
  }
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    fieldErrors
  }
}