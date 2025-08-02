import React from 'react'
import { ErrorBoundary, DefaultErrorFallback, MinimalErrorFallback } from './error-boundary'
import { EmptyState } from './fallback-ui'
import { Button } from './button'
import type { ErrorFallbackProps } from './error-boundary'

/**
 * Error fallback for pool data loading failures
 */
export function PoolDataErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <EmptyState
      icon={
        <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" 
          />
        </svg>
      }
      title="Unable to load pool data"
      description={`We couldn't retrieve the pool information. ${error.message}`}
      action={
        <div className="flex gap-2">
          <Button onClick={resetError}>
            Try Again
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            Go to Dashboard
          </Button>
        </div>
      }
    />
  )
}

/**
 * Error fallback for chemical test form failures
 */
export function ChemicalTestErrorFallback({ error, resetError }: ErrorFallbackProps) {
  const isValidationError = error.message.includes('validation') || error.message.includes('invalid')
  
  return (
    <div className="p-6 bg-destructive/10 border border-destructive/20 rounded-lg">
      <div className="flex items-start gap-3">
        <svg 
          className="h-5 w-5 text-destructive mt-0.5" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
        <div className="flex-1">
          <h3 className="font-semibold text-destructive">
            {isValidationError ? 'Invalid Test Data' : 'Test Submission Failed'}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {error.message}
          </p>
          <div className="mt-4 flex gap-2">
            <Button size="sm" variant="outline" onClick={resetError}>
              Try Again
            </Button>
            {!isValidationError && (
              <Button size="sm" variant="ghost" onClick={() => {
                // Save to offline queue
                console.log('Saving to offline queue...')
                resetError()
              }}>
                Save Offline
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Error fallback for chart/visualization failures
 */
export function ChartErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center h-64 p-6">
      <svg 
        className="h-12 w-12 text-muted-foreground mb-3" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
        />
      </svg>
      <p className="text-muted-foreground text-center mb-3">
        Unable to display chart data
      </p>
      <Button size="sm" variant="outline" onClick={resetError}>
        Reload Chart
      </Button>
    </div>
  )
}

/**
 * Error boundary for the main dashboard
 */
export function DashboardErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={DefaultErrorFallback}
      onError={(error, errorInfo) => {
        // Log to error tracking service
        console.error('Dashboard error:', error, errorInfo)
      }}
      resetOnPropsChange
    >
      {children}
    </ErrorBoundary>
  )
}

/**
 * Error boundary for individual pool cards
 */
export function PoolCardErrorBoundary({ 
  children, 
  poolId 
}: { 
  children: React.ReactNode
  poolId: string 
}) {
  return (
    <ErrorBoundary
      fallback={MinimalErrorFallback}
      resetKeys={[poolId]}
      isolate
    >
      {children}
    </ErrorBoundary>
  )
}

/**
 * Error boundary for forms with special handling
 */
export function FormErrorBoundary({ 
  children,
  onError
}: { 
  children: React.ReactNode
  onError?: (error: Error) => void
}) {
  return (
    <ErrorBoundary
      fallback={ChemicalTestErrorFallback}
      onError={(error, errorInfo) => {
        // Check if it's a validation error
        if (error.message.includes('validation')) {
          // Handle validation errors differently
          console.warn('Form validation error:', error)
        } else {
          // Log other errors
          console.error('Form error:', error, errorInfo)
        }
        onError?.(error)
      }}
    >
      {children}
    </ErrorBoundary>
  )
}

/**
 * Error boundary for data tables
 */
export function TableErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={({ error, resetError }) => (
        <div className="p-8 text-center">
          <p className="text-muted-foreground mb-4">
            Failed to load table data
          </p>
          <Button size="sm" onClick={resetError}>
            Refresh Table
          </Button>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  )
}

/**
 * Async component wrapper with error boundary
 */
export function AsyncBoundary({ 
  children,
  fallback
}: { 
  children: React.ReactNode
  fallback?: React.ComponentType<ErrorFallbackProps>
}) {
  return (
    <React.Suspense fallback={<div className="animate-pulse">Loading...</div>}>
      <ErrorBoundary fallback={fallback || MinimalErrorFallback}>
        {children}
      </ErrorBoundary>
    </React.Suspense>
  )
}