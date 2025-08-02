/**
 * Error handling utility functions
 */

/**
 * Custom error types
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public context?: Record<string, any>
  ) {
    super(message)
    this.name = 'AppError'
    
    // Maintains proper stack trace for where error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError)
    }
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public field?: string, context?: Record<string, any>) {
    super(message, 'VALIDATION_ERROR', 400, context)
    this.name = 'ValidationError'
  }
}

export class NetworkError extends AppError {
  constructor(message: string, public url?: string, context?: Record<string, any>) {
    super(message, 'NETWORK_ERROR', 0, context)
    this.name = 'NetworkError'
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required', context?: Record<string, any>) {
    super(message, 'AUTH_ERROR', 401, context)
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied', context?: Record<string, any>) {
    super(message, 'AUTHORIZATION_ERROR', 403, context)
    this.name = 'AuthorizationError'
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found', public resource?: string, context?: Record<string, any>) {
    super(message, 'NOT_FOUND_ERROR', 404, context)
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict', context?: Record<string, any>) {
    super(message, 'CONFLICT_ERROR', 409, context)
    this.name = 'ConflictError'
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded', public retryAfter?: number, context?: Record<string, any>) {
    super(message, 'RATE_LIMIT_ERROR', 429, context)
    this.name = 'RateLimitError'
  }
}

/**
 * Error severity levels
 */
export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical'

/**
 * Error context information
 */
export interface ErrorContext {
  userId?: string
  sessionId?: string
  userAgent?: string
  url?: string
  timestamp?: Date
  action?: string
  metadata?: Record<string, any>
}

/**
 * Error report structure
 */
export interface ErrorReport {
  id: string
  message: string
  stack?: string
  code: string
  severity: ErrorSeverity
  context: ErrorContext
  fingerprint: string
}

/**
 * Checks if error is of specific type
 */
export function isErrorOfType<T extends Error>(
  error: unknown,
  errorClass: new (...args: any[]) => T
): error is T {
  return error instanceof errorClass
}

/**
 * Extracts error message safely
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  
  if (typeof error === 'string') {
    return error
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }
  
  return 'An unknown error occurred'
}

/**
 * Extracts error code safely
 */
export function getErrorCode(error: unknown): string {
  if (error instanceof AppError) {
    return error.code
  }
  
  if (error instanceof Error) {
    return error.name || 'UNKNOWN_ERROR'
  }
  
  return 'UNKNOWN_ERROR'
}

/**
 * Gets error severity based on error type
 */
export function getErrorSeverity(error: unknown): ErrorSeverity {
  if (error instanceof ValidationError) return 'low'
  if (error instanceof NotFoundError) return 'low'
  if (error instanceof AuthenticationError) return 'medium'
  if (error instanceof AuthorizationError) return 'medium'
  if (error instanceof NetworkError) return 'medium'
  if (error instanceof RateLimitError) return 'medium'
  if (error instanceof ConflictError) return 'medium'
  
  // Check for critical system errors
  if (error instanceof Error) {
    const criticalPatterns = [
      /out of memory/i,
      /stack overflow/i,
      /maximum call stack/i,
      /database.*connection/i
    ]
    
    if (criticalPatterns.some(pattern => pattern.test(error.message))) {
      return 'critical'
    }
  }
  
  return 'high' // Default for unknown errors
}

/**
 * Creates error fingerprint for deduplication
 */
export function createErrorFingerprint(error: unknown, context?: ErrorContext): string {
  const message = getErrorMessage(error)
  const code = getErrorCode(error)
  const action = context?.action || 'unknown'
  
  // Simple hash for fingerprinting
  const hashInput = `${code}:${message}:${action}`
  let hash = 0
  
  for (let i = 0; i < hashInput.length; i++) {
    const char = hashInput.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36)
}

/**
 * Generates unique error ID
 */
export function generateErrorId(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `error_${timestamp}_${random}`
}

/**
 * Creates comprehensive error report
 */
export function createErrorReport(
  error: unknown,
  context: Partial<ErrorContext> = {}
): ErrorReport {
  const fullContext: ErrorContext = {
    timestamp: new Date(),
    url: typeof window !== 'undefined' ? window.location.href : undefined,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    ...context
  }
  
  return {
    id: generateErrorId(),
    message: getErrorMessage(error),
    stack: error instanceof Error ? error.stack : undefined,
    code: getErrorCode(error),
    severity: getErrorSeverity(error),
    context: fullContext,
    fingerprint: createErrorFingerprint(error, fullContext)
  }
}

/**
 * Sanitizes error for logging (removes sensitive data)
 */
export function sanitizeError(error: unknown): Record<string, any> {
  const report = createErrorReport(error)
  
  // Remove potentially sensitive information
  const sanitized = { ...report }
  
  if (sanitized.context.metadata) {
    const sanitizedMetadata = { ...sanitized.context.metadata }
    
    // Remove sensitive fields
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'authorization']
    sensitiveFields.forEach(field => {
      if (field in sanitizedMetadata) {
        sanitizedMetadata[field] = '[REDACTED]'
      }
    })
    
    sanitized.context.metadata = sanitizedMetadata
  }
  
  return sanitized
}

/**
 * Logs error with appropriate level
 */
export function logError(error: unknown, context?: Partial<ErrorContext>): void {
  const report = sanitizeError(error)
  
  switch (report.severity) {
    case 'low':
      console.warn('Error (Low):', report)
      break
    case 'medium':
      console.error('Error (Medium):', report)
      break
    case 'high':
      console.error('Error (High):', report)
      break
    case 'critical':
      console.error('CRITICAL ERROR:', report)
      // In a real app, you might want to send critical errors to a monitoring service
      break
  }
}

/**
 * Retries a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number
    initialDelay?: number
    maxDelay?: number
    backoffFactor?: number
    retryCondition?: (error: unknown) => boolean
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2,
    retryCondition = () => true
  } = options
  
  let lastError: unknown
  let delay = initialDelay
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      
      if (attempt === maxRetries || !retryCondition(error)) {
        throw error
      }
      
      logError(error, { action: 'retry_attempt', metadata: { attempt, delay } })
      
      await new Promise(resolve => setTimeout(resolve, delay))
      delay = Math.min(delay * backoffFactor, maxDelay)
    }
  }
  
  throw lastError
}

/**
 * Creates a safe async function that catches errors
 */
export function safeAsync<TArgs extends any[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>
): (...args: TArgs) => Promise<TReturn | null> {
  return async (...args: TArgs): Promise<TReturn | null> => {
    try {
      return await fn(...args)
    } catch (error) {
      logError(error, { action: 'safe_async_function' })
      return null
    }
  }
}

/**
 * Creates a safe sync function that catches errors
 */
export function safeSync<TArgs extends any[], TReturn>(
  fn: (...args: TArgs) => TReturn
): (...args: TArgs) => TReturn | null {
  return (...args: TArgs): TReturn | null => {
    try {
      return fn(...args)
    } catch (error) {
      logError(error, { action: 'safe_sync_function' })
      return null
    }
  }
}

/**
 * Wraps a promise to timeout after specified duration
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutMessage: string = 'Operation timed out'
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new AppError(timeoutMessage, 'TIMEOUT_ERROR', 408))
      }, timeoutMs)
    })
  ])
}

/**
 * Error boundary helper for React components
 */
export function createErrorBoundaryHandler(
  onError?: (error: Error, errorInfo: { componentStack: string }) => void
) {
  return {
    componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
      const report = createErrorReport(error, {
        action: 'component_error',
        metadata: { componentStack: errorInfo.componentStack }
      })
      
      logError(error, report.context)
      
      if (onError) {
        onError(error, errorInfo)
      }
    }
  }
}

/**
 * Global error handler setup
 */
export function setupGlobalErrorHandling(): void {
  // Handle unhandled promise rejections
  if (typeof window !== 'undefined') {
    window.addEventListener('unhandledrejection', (event) => {
      logError(event.reason, { action: 'unhandled_promise_rejection' })
    })
    
    // Handle uncaught errors
    window.addEventListener('error', (event) => {
      logError(event.error || event.message, {
        action: 'uncaught_error',
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      })
    })
  }
}

/**
 * Pool-specific error types
 */
export class PoolSafetyError extends AppError {
  constructor(message: string, public chemical?: string, context?: Record<string, any>) {
    super(message, 'POOL_SAFETY_ERROR', 400, context)
    this.name = 'PoolSafetyError'
  }
}

export class ChemicalReadingError extends ValidationError {
  constructor(message: string, public reading?: string, context?: Record<string, any>) {
    super(message, reading, context)
    this.name = 'ChemicalReadingError'
    this.code = 'CHEMICAL_READING_ERROR'
  }
}