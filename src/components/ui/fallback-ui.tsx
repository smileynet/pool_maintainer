import React from 'react'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { Card } from './card'
import type { BaseComponentProps } from '@/types'

/**
 * Loading skeleton component for content placeholders
 */
interface SkeletonProps extends BaseComponentProps {
  variant?: 'text' | 'rectangular' | 'circular'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'wave' | 'none'
}

export function Skeleton({
  className,
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  ...props
}: SkeletonProps) {
  const animationClass = animation === 'pulse' ? 'animate-pulse' :
                        animation === 'wave' ? 'animate-shimmer' :
                        ''

  const variantClass = variant === 'circular' ? 'rounded-full' :
                      variant === 'rectangular' ? 'rounded-md' :
                      'rounded'

  return (
    <div
      className={cn(
        'bg-muted',
        animationClass,
        variantClass,
        variant === 'text' && 'h-4 w-full',
        className
      )}
      style={{
        width: width,
        height: height
      }}
      {...props}
    />
  )
}

/**
 * Empty state component for when there's no data
 */
interface EmptyStateProps extends BaseComponentProps {
  icon?: React.ReactNode
  title?: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({
  icon,
  title = 'No data found',
  description,
  action,
  className,
  children
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}>
      {icon && (
        <div className="mb-4 text-muted-foreground">
          {icon}
        </div>
      )}
      
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      
      {description && (
        <p className="text-muted-foreground mb-6 max-w-md">
          {description}
        </p>
      )}
      
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
      
      {children}
    </div>
  )
}

/**
 * Error message component for form fields and inline errors
 */
interface ErrorMessageProps extends BaseComponentProps {
  error?: string | Error | null
  variant?: 'inline' | 'block' | 'toast'
}

export function ErrorMessage({
  error,
  variant = 'inline',
  className
}: ErrorMessageProps) {
  if (!error) return null

  const errorMessage = error instanceof Error ? error.message : error

  if (variant === 'inline') {
    return (
      <p className={cn('text-sm text-destructive mt-1', className)}>
        {errorMessage}
      </p>
    )
  }

  if (variant === 'block') {
    return (
      <div className={cn('p-4 bg-destructive/10 border border-destructive/20 rounded-md', className)}>
        <p className="text-sm text-destructive">{errorMessage}</p>
      </div>
    )
  }

  // Toast variant would typically use a toast library
  return null
}

/**
 * Loading spinner component
 */
interface SpinnerProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'muted'
}

export function Spinner({
  size = 'md',
  variant = 'primary',
  className
}: SpinnerProps) {
  const sizeClass = size === 'sm' ? 'h-4 w-4' :
                   size === 'lg' ? 'h-8 w-8' :
                   'h-6 w-6'

  const colorClass = variant === 'secondary' ? 'text-secondary' :
                    variant === 'muted' ? 'text-muted-foreground' :
                    'text-primary'

  return (
    <svg 
      className={cn('animate-spin', sizeClass, colorClass, className)} 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

/**
 * Loading overlay component
 */
interface LoadingOverlayProps extends BaseComponentProps {
  visible?: boolean
  message?: string
  fullScreen?: boolean
}

export function LoadingOverlay({
  visible = true,
  message,
  fullScreen = false,
  className
}: LoadingOverlayProps) {
  if (!visible) return null

  return (
    <div 
      className={cn(
        'flex items-center justify-center bg-background/80 backdrop-blur-sm',
        fullScreen ? 'fixed inset-0 z-50' : 'absolute inset-0 z-10',
        className
      )}
    >
      <div className="flex flex-col items-center gap-3">
        <Spinner size="lg" />
        {message && (
          <p className="text-sm text-muted-foreground">{message}</p>
        )}
      </div>
    </div>
  )
}

/**
 * Retry component for failed operations
 */
interface RetryProps extends BaseComponentProps {
  onRetry: () => void
  error?: Error | null
  message?: string
}

export function Retry({
  onRetry,
  error,
  message = 'Something went wrong. Please try again.',
  className
}: RetryProps) {
  return (
    <Card className={cn('p-6 text-center', className)}>
      <svg 
        className="h-12 w-12 text-muted-foreground mx-auto mb-4" 
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
      
      <p className="text-muted-foreground mb-4">
        {error?.message || message}
      </p>
      
      <Button onClick={onRetry}>
        Try Again
      </Button>
    </Card>
  )
}

/**
 * Component loading states helper
 */
interface LoadingStateProps extends BaseComponentProps {
  loading?: boolean
  error?: Error | null
  empty?: boolean
  onRetry?: () => void
  loadingComponent?: React.ReactNode
  errorComponent?: React.ReactNode
  emptyComponent?: React.ReactNode
}

export function LoadingState({
  loading,
  error,
  empty,
  onRetry,
  loadingComponent,
  errorComponent,
  emptyComponent,
  children
}: LoadingStateProps) {
  if (loading) {
    return <>{loadingComponent || <LoadingOverlay />}</>
  }

  if (error) {
    return <>{errorComponent || <Retry error={error} onRetry={onRetry || (() => {})} />}</>
  }

  if (empty) {
    return <>{emptyComponent || <EmptyState />}</>
  }

  return <>{children}</>
}

/**
 * CSS for shimmer animation
 */
const shimmerStyles = `
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.animate-shimmer {
  background: linear-gradient(
    90deg,
    rgba(var(--muted), 0.8) 25%,
    rgba(var(--muted), 0.5) 50%,
    rgba(var(--muted), 0.8) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
`

// Inject shimmer styles
if (typeof document !== 'undefined') {
  const existingStyle = document.getElementById('fallback-ui-styles')
  if (!existingStyle) {
    const style = document.createElement('style')
    style.id = 'fallback-ui-styles'
    style.textContent = shimmerStyles
    document.head.appendChild(style)
  }
}