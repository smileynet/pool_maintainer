# Error Handling Guide

This guide covers the error handling patterns and components available in the Pool Maintenance application.

## Error Boundaries

Error boundaries catch JavaScript errors in component trees and display fallback UI instead of crashing the entire app.

### Basic Usage

```typescript
import { ErrorBoundary, DefaultErrorFallback } from '@/components/ui/error-boundary'

function App() {
  return (
    <ErrorBoundary fallback={DefaultErrorFallback}>
      <YourComponent />
    </ErrorBoundary>
  )
}
```

### Custom Error Fallbacks

Create custom error UI for specific components:

```typescript
function CustomErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div className="error-container">
      <h2>Oops! {error.message}</h2>
      <button onClick={resetError}>Try again</button>
    </div>
  )
}

<ErrorBoundary fallback={CustomErrorFallback}>
  <YourComponent />
</ErrorBoundary>
```

### Error Boundary Props

- **fallback**: Custom error UI component
- **onError**: Callback when error is caught
- **resetKeys**: Array of values that trigger error reset when changed
- **resetOnPropsChange**: Reset error when props change
- **isolate**: Render error UI in isolation

## Specialized Error Boundaries

### Dashboard Error Boundary

Wraps the main dashboard with comprehensive error handling:

```typescript
import { DashboardErrorBoundary } from '@/components/ui/pool-error-boundaries'

<DashboardErrorBoundary>
  <PoolStatusDashboard />
</DashboardErrorBoundary>
```

### Form Error Boundary

Special handling for form validation and submission errors:

```typescript
import { FormErrorBoundary } from '@/components/ui/pool-error-boundaries'

<FormErrorBoundary onError={(error) => console.log('Form error:', error)}>
  <ChemicalTestForm />
</FormErrorBoundary>
```

### Table Error Boundary

Lightweight error handling for data tables:

```typescript
import { TableErrorBoundary } from '@/components/ui/pool-error-boundaries'

<TableErrorBoundary>
  <ChemicalTestHistory />
</TableErrorBoundary>
```

## Fallback UI Components

### Loading States

#### Skeleton

Display placeholder content while loading:

```typescript
import { Skeleton } from '@/components/ui/fallback-ui'

// Text skeleton
<Skeleton variant="text" width="80%" />

// Rectangular skeleton
<Skeleton variant="rectangular" height={200} />

// Circular skeleton (for avatars)
<Skeleton variant="circular" width={40} height={40} />
```

#### Spinner

Simple loading spinner:

```typescript
import { Spinner } from '@/components/ui/fallback-ui'

<Spinner size="lg" variant="primary" />
```

#### Loading Overlay

Full or partial overlay with loading indicator:

```typescript
import { LoadingOverlay } from '@/components/ui/fallback-ui'

<div className="relative">
  <YourContent />
  <LoadingOverlay visible={isLoading} message="Loading pools..." />
</div>
```

### Empty States

Display when there's no data:

```typescript
import { EmptyState } from '@/components/ui/fallback-ui'

<EmptyState
  icon={<PoolIcon />}
  title="No pools found"
  description="Start by adding your first pool to the system"
  action={<Button>Add Pool</Button>}
/>
```

### Error Messages

Inline error display:

```typescript
import { ErrorMessage } from '@/components/ui/fallback-ui'

// Inline error (for forms)
<Input {...props} />
<ErrorMessage error={fieldError} variant="inline" />

// Block error
<ErrorMessage 
  error="Failed to save changes" 
  variant="block" 
/>
```

### Retry Component

For retryable operations:

```typescript
import { Retry } from '@/components/ui/fallback-ui'

<Retry 
  error={error}
  onRetry={handleRetry}
  message="Failed to load chemical tests"
/>
```

## Loading State Helper

Comprehensive loading state management:

```typescript
import { LoadingState } from '@/components/ui/fallback-ui'

function PoolList() {
  const { data, loading, error } = usePools()
  
  return (
    <LoadingState
      loading={loading}
      error={error}
      empty={!data?.length}
      onRetry={refetch}
      loadingComponent={<CustomLoader />}
      errorComponent={<CustomError />}
      emptyComponent={<NoPoolsFound />}
    >
      {data?.map(pool => <PoolCard key={pool.id} pool={pool} />)}
    </LoadingState>
  )
}
```

## Error Handling Patterns

### 1. Component-Level Error Handling

```typescript
function PoolDetails({ poolId }: { poolId: string }) {
  const { data, error, loading } = usePool(poolId)
  
  if (loading) return <Skeleton />
  if (error) return <PoolDataErrorFallback error={error} resetError={refetch} />
  if (!data) return <EmptyState title="Pool not found" />
  
  return <PoolInfo pool={data} />
}
```

### 2. Form Error Handling

```typescript
function ChemicalTestForm() {
  const form = useFormValidation({
    validationSchema: chemicalTestSchema,
    onSubmit: async (values) => {
      try {
        await submitTest(values)
      } catch (error) {
        // Form-specific error handling
        if (error.code === 'VALIDATION_ERROR') {
          form.setFieldError('pH', 'Invalid pH value')
        } else {
          throw error // Let error boundary handle
        }
      }
    }
  })
  
  return (
    <FormErrorBoundary>
      <form onSubmit={form.handleSubmit}>
        {/* Form fields */}
      </form>
    </FormErrorBoundary>
  )
}
```

### 3. Async Component Error Handling

```typescript
const LazyChart = React.lazy(() => import('./ChemicalTrendChart'))

function Dashboard() {
  return (
    <AsyncBoundary fallback={ChartErrorFallback}>
      <LazyChart />
    </AsyncBoundary>
  )
}
```

### 4. Network Error Handling

```typescript
function usePoolsWithRetry() {
  const [retryCount, setRetryCount] = useState(0)
  
  const { data, error, loading, refetch } = usePools()
  
  const retryWithBackoff = useCallback(() => {
    const delay = Math.min(1000 * Math.pow(2, retryCount), 10000)
    setTimeout(() => {
      setRetryCount(c => c + 1)
      refetch()
    }, delay)
  }, [retryCount, refetch])
  
  return {
    data,
    error,
    loading,
    retry: retryWithBackoff,
    isRetrying: retryCount > 0
  }
}
```

## Best Practices

### 1. Granular Error Boundaries

Place error boundaries at strategic component levels:

```typescript
<DashboardErrorBoundary>
  <Header />
  <div className="grid">
    {pools.map(pool => (
      <PoolCardErrorBoundary key={pool.id} poolId={pool.id}>
        <PoolCard pool={pool} />
      </PoolCardErrorBoundary>
    ))}
  </div>
</DashboardErrorBoundary>
```

### 2. User-Friendly Messages

Avoid technical jargon in error messages:

```typescript
// Bad
error.message = "Failed to fetch: 500 Internal Server Error"

// Good
error.message = "Unable to load pool data. Please try again."
```

### 3. Provide Actions

Always give users a way to recover:

```typescript
<EmptyState
  title="Connection Lost"
  description="Check your internet connection"
  action={
    <>
      <Button onClick={retry}>Retry</Button>
      <Button variant="outline" onClick={workOffline}>
        Work Offline
      </Button>
    </>
  }
/>
```

### 4. Log Errors Appropriately

```typescript
<ErrorBoundary
  onError={(error, errorInfo) => {
    // Log to error tracking service
    errorTracker.logError(error, {
      componentStack: errorInfo.componentStack,
      userId: currentUser.id,
      poolId: currentPool?.id
    })
  }}
>
```

### 5. Progressive Enhancement

Start with basic functionality and enhance:

```typescript
// Basic version works without JavaScript
<form action="/api/chemical-test" method="POST">
  {/* form fields */}
</form>

// Enhanced with error boundary
<FormErrorBoundary>
  <EnhancedChemicalTestForm />
</FormErrorBoundary>
```

## Testing Error Scenarios

```typescript
import { render, screen } from '@testing-library/react'
import { ErrorBoundary } from '@/components/ui/error-boundary'

// Component that throws
function BrokenComponent() {
  throw new Error('Test error')
}

test('error boundary catches errors', () => {
  render(
    <ErrorBoundary fallback={({ error }) => <div>{error.message}</div>}>
      <BrokenComponent />
    </ErrorBoundary>
  )
  
  expect(screen.getByText('Test error')).toBeInTheDocument()
})
```