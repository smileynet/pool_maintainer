import React from 'react'
import { Button } from './button'
import { Card } from './card'
import type { BaseComponentProps } from '@/types'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

interface ErrorBoundaryProps extends BaseComponentProps {
  fallback?: React.ComponentType<ErrorFallbackProps>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  resetKeys?: Array<string | number>
  resetOnPropsChange?: boolean
  isolate?: boolean
}

export interface ErrorFallbackProps {
  error: Error
  resetError: () => void
  errorInfo?: React.ErrorInfo
}

/**
 * Error boundary component that catches JavaScript errors anywhere in the child component tree
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to error reporting service
    console.error('Error caught by boundary:', error, errorInfo)
    
    // Call onError callback if provided
    this.props.onError?.(error, errorInfo)
    
    // Update state with error info
    this.setState({
      errorInfo
    })
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetKeys, resetOnPropsChange } = this.props
    const { hasError } = this.state
    
    if (hasError) {
      // Reset on prop changes if enabled
      if (resetOnPropsChange && prevProps.children !== this.props.children) {
        this.resetError()
      }
      
      // Reset if resetKeys changed
      if (resetKeys && prevProps.resetKeys) {
        const hasResetKeyChanged = resetKeys.some((key, index) => key !== prevProps.resetKeys![index])
        if (hasResetKeyChanged) {
          this.resetError()
        }
      }
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  render() {
    const { hasError, error, errorInfo } = this.state
    const { fallback: Fallback = DefaultErrorFallback, children, isolate } = this.props

    if (hasError && error) {
      const errorProps: ErrorFallbackProps = {
        error,
        resetError: this.resetError,
        errorInfo
      }

      if (isolate) {
        // Render error in isolation to prevent cascading errors
        return (
          <div style={{ isolation: 'isolate' }}>
            <Fallback {...errorProps} />
          </div>
        )
      }

      return <Fallback {...errorProps} />
    }

    return children
  }
}

/**
 * Default error fallback component
 */
export function DefaultErrorFallback({ error, resetError, errorInfo }: ErrorFallbackProps) {
  const isDevelopment = process.env.NODE_ENV === 'development'

  return (
    <Card className="p-6 m-4 border-destructive">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <svg 
            className="h-6 w-6 text-destructive" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
          <h2 className="text-lg font-semibold">Something went wrong</h2>
        </div>
        
        <p className="text-muted-foreground">
          We're sorry, but something unexpected happened. Please try refreshing the page or contact support if the problem persists.
        </p>

        {isDevelopment && (
          <details className="mt-4">
            <summary className="cursor-pointer text-sm font-medium">
              Error details (Development only)
            </summary>
            <div className="mt-2 space-y-2">
              <pre className="p-4 bg-muted rounded-md text-xs overflow-auto">
                {error.toString()}
              </pre>
              {errorInfo && (
                <pre className="p-4 bg-muted rounded-md text-xs overflow-auto">
                  {errorInfo.componentStack}
                </pre>
              )}
            </div>
          </details>
        )}

        <div className="flex gap-2">
          <Button onClick={resetError} variant="default">
            Try Again
          </Button>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
          >
            Refresh Page
          </Button>
        </div>
      </div>
    </Card>
  )
}

/**
 * Minimal error fallback for small components
 */
export function MinimalErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div className="p-4 text-center">
      <p className="text-sm text-muted-foreground mb-2">
        Failed to load this section
      </p>
      <Button size="sm" variant="outline" onClick={resetError}>
        Retry
      </Button>
    </div>
  )
}

/**
 * Hook to easily use error boundaries
 */
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])

  const resetError = React.useCallback(() => {
    setError(null)
  }, [])

  const captureError = React.useCallback((error: Error) => {
    setError(error)
  }, [])

  return { resetError, captureError }
}

/**
 * HOC to wrap components with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: ErrorBoundaryProps
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`

  return WrappedComponent
}