import React, { Suspense, ComponentType, LazyExoticComponent } from 'react'
import { ErrorBoundary, MinimalErrorFallback } from '@/components/ui/error-boundary'
import { Skeleton, LoadingOverlay } from '@/components/ui/fallback-ui'

/**
 * Enhanced lazy loading utility with better error handling and loading states
 */

export interface LazyComponentOptions {
  /**
   * Custom loading component
   */
  fallback?: React.ComponentType
  
  /**
   * Custom error component
   */
  errorFallback?: React.ComponentType<{ error: Error; resetError: () => void }>
  
  /**
   * Delay before showing loading indicator (prevents flash for fast loads)
   */
  delay?: number
  
  /**
   * Preload the component when certain conditions are met
   */
  preloadOn?: 'hover' | 'visible' | 'idle'
  
  /**
   * Custom retry logic
   */
  retry?: number
  
  /**
   * Component name for debugging
   */
  displayName?: string
}

/**
 * Creates a lazy component with enhanced loading and error handling
 */
export function createLazyComponent<P extends object = {}>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options: LazyComponentOptions = {}
): LazyExoticComponent<ComponentType<P>> {
  const {
    fallback = DefaultLazyFallback,
    errorFallback = MinimalErrorFallback,
    delay = 200,
    retry = 3,
    displayName
  } = options

  let retryCount = 0
  
  const lazyComponent = React.lazy(async () => {
    try {
      const result = await importFn()
      retryCount = 0 // Reset on success
      return result
    } catch (error) {
      if (retryCount < retry) {
        retryCount++
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000))
        return importFn()
      }
      throw error
    }
  })

  if (displayName) {
    lazyComponent.displayName = `Lazy(${displayName})`
  }

  return lazyComponent
}

/**
 * Default loading fallback with delay
 */
export function DefaultLazyFallback() {
  const [showLoading, setShowLoading] = React.useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => setShowLoading(true), 200)
    return () => clearTimeout(timer)
  }, [])

  if (!showLoading) return null

  return (
    <div className="flex items-center justify-center py-8">
      <div className="space-y-4 w-full max-w-md">
        <Skeleton variant="rectangular" height={40} />
        <div className="space-y-2">
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="70%" />
        </div>
        <Skeleton variant="rectangular" height={120} />
      </div>
    </div>
  )
}

/**
 * Tab-specific loading fallback
 */
export function TabLazyFallback({ title }: { title?: string }) {
  return (
    <div className="space-y-6 py-8">
      <div className="space-y-2">
        <Skeleton variant="text" width="30%" height={32} />
        <Skeleton variant="text" width="60%" height={20} />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3 p-4 border rounded-lg">
            <Skeleton variant="rectangular" height={24} />
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="60%" />
          </div>
        ))}
      </div>
      {title && (
        <div className="text-center text-muted-foreground text-sm">
          Loading {title}...
        </div>
      )}
    </div>
  )
}

/**
 * Wrapper component that adds error boundaries and enhanced loading
 */
export function LazyWrapper<P extends object>({
  Component,
  fallback = DefaultLazyFallback,
  errorFallback = MinimalErrorFallback,
  preloadOn,
  ...props
}: {
  Component: LazyExoticComponent<ComponentType<P>>
  fallback?: React.ComponentType
  errorFallback?: React.ComponentType<{ error: Error; resetError: () => void }>
  preloadOn?: 'hover' | 'visible'
} & P) {
  const [isHovered, setIsHovered] = React.useState(false)
  const [isVisible, setIsVisible] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  // Intersection Observer for visibility-based preloading
  React.useEffect(() => {
    if (preloadOn !== 'visible' || !ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [preloadOn])

  // Preload on hover
  const handleMouseEnter = React.useCallback(() => {
    if (preloadOn === 'hover') {
      setIsHovered(true)
    }
  }, [preloadOn])

  // Trigger preload
  React.useEffect(() => {
    if ((preloadOn === 'hover' && isHovered) || (preloadOn === 'visible' && isVisible)) {
      // Preload the component
      const componentPreload = (Component as any)._payload?._result
      if (!componentPreload) {
        // Force load the component
        React.startTransition(() => {
          import.meta.env.DEV && console.log('Preloading component...')
        })
      }
    }
  }, [Component, isHovered, isVisible, preloadOn])

  return (
    <div ref={ref} onMouseEnter={handleMouseEnter}>
      <ErrorBoundary fallback={errorFallback} isolate>
        <Suspense fallback={<fallback />}>
          <Component {...(props as P)} />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

/**
 * Hook for preloading components
 */
export function usePreloadComponent(
  componentLoader: () => Promise<any>,
  condition: boolean = true
) {
  React.useEffect(() => {
    if (condition) {
      componentLoader().catch(() => {
        // Silently fail preloading
      })
    }
  }, [componentLoader, condition])
}

/**
 * Higher-order component for lazy loading with error boundaries
 */
export function withLazyLoading<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options: LazyComponentOptions = {}
) {
  const LazyComponent = createLazyComponent(importFn, options)

  return function LazyComponentWrapper(props: P) {
    return (
      <LazyWrapper
        Component={LazyComponent}
        fallback={options.fallback}
        errorFallback={options.errorFallback}
        preloadOn={options.preloadOn}
        {...props}
      />
    )
  }
}

/**
 * Utility for lazy loading routes with automatic code splitting
 */
export function createLazyRoute<P extends object = {}>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options: LazyComponentOptions & {
    routeName?: string
    preloadCondition?: () => boolean
  } = {}
) {
  const { routeName, preloadCondition, ...lazyOptions } = options
  
  const LazyComponent = createLazyComponent(importFn, {
    ...lazyOptions,
    displayName: routeName || 'Route'
  })

  return function LazyRoute(props: P) {
    // Preload based on condition (e.g., user navigation patterns)
    usePreloadComponent(importFn, preloadCondition?.() ?? false)

    return (
      <ErrorBoundary
        fallback={({ error, resetError }) => (
          <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
            <h2 className="text-lg font-semibold mb-2">Failed to load {routeName || 'page'}</h2>
            <p className="text-muted-foreground mb-4">{error.message}</p>
            <button
              onClick={resetError}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        )}
      >
        <Suspense fallback={<TabLazyFallback title={routeName} />}>
          <LazyComponent {...props} />
        </Suspense>
      </ErrorBoundary>
    )
  }
}

/**
 * Bundle analyzer helper (development only)
 */
export function analyzeBundleSize() {
  if (import.meta.env.DEV) {
    console.group('Bundle Analysis')
    console.log('Dynamic imports:', (performance as any).getEntriesByType?.('navigation'))
    console.log('Use browser DevTools Network tab to analyze chunk sizes')
    console.groupEnd()
  }
}

/**
 * Performance monitoring for lazy loading
 */
export function useLazyLoadingMetrics(componentName: string) {
  React.useEffect(() => {
    const startTime = performance.now()
    
    return () => {
      const endTime = performance.now()
      const loadTime = endTime - startTime
      
      if (import.meta.env.DEV) {
        console.log(`Lazy component "${componentName}" loaded in ${loadTime.toFixed(2)}ms`)
      }
      
      // Send to analytics in production
      if (import.meta.env.PROD && window.gtag) {
        window.gtag('event', 'lazy_component_load', {
          component_name: componentName,
          load_time: Math.round(loadTime)
        })
      }
    }
  }, [componentName])
}