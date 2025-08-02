# Custom Hooks Guide

This guide explains the custom hooks available in the Pool Maintenance application and how to use them effectively.

## Data Fetching Hooks

### `useFetchData`

Generic hook for fetching data with loading states, error handling, and retry logic.

```typescript
const { data, loading, error, refetch } = useFetchData(
  () => fetchPoolData(poolId),
  [poolId], // dependencies
  {
    retryCount: 3,
    retryDelay: 1000,
    onSuccess: (data) => console.log('Data loaded:', data),
    onError: (error) => console.error('Error:', error)
  }
)
```

### `usePaginatedData`

Handles paginated data fetching with navigation controls.

```typescript
const {
  data,
  loading,
  page,
  pageSize,
  hasNextPage,
  nextPage,
  previousPage
} = usePaginatedData(
  (page, size) => fetchTests(poolId, page, size),
  { pageSize: 20 }
)
```

### `useOptimisticData`

Manages optimistic updates for better UX.

```typescript
const { data, update, isUpdating } = useOptimisticData(
  () => fetchPool(poolId),
  {
    updateFn: (pool) => updatePool(pool)
  }
)

// Usage
await update({ ...data, status: 'maintenance' }) // Updates UI immediately
```

## Pool-Specific Hooks

### `usePools`

Fetches all pools with optional auto-refresh.

```typescript
const { data: pools, loading, refetch } = usePools(30000) // Refresh every 30s
```

### `usePool`

Manages a single pool with optimistic updates.

```typescript
const { data: pool, update, loading } = usePool(poolId)

// Update pool status
await update({ ...pool, status: 'closed' })
```

### `useChemicalTests`

Paginated chemical test data for a pool.

```typescript
const {
  data: tests,
  loading,
  page,
  nextPage,
  previousPage
} = useChemicalTests(poolId, 25) // 25 items per page
```

### `useChemicalTrends`

Calculates trends from chemical test data.

```typescript
const trends = useChemicalTrends(tests, 'pH', poolsMap)

if (trends) {
  console.log(`pH trend: ${trends.trend}`) // 'increasing', 'decreasing', or 'stable'
  console.log(`Average pH: ${trends.average}`)
}
```

### `useOfflineQueue`

Manages actions when offline.

```typescript
const { isOnline, addToQueue, processQueue, queueSize } = useOfflineQueue()

// Add action when offline
if (!isOnline) {
  addToQueue({
    type: 'CREATE_TEST',
    data: testData
  })
}

// Process queue when back online
useEffect(() => {
  if (isOnline && queueSize > 0) {
    processQueue()
  }
}, [isOnline, queueSize])
```

## Form Validation Hooks

### `useFormValidation`

Complete form management with Zod validation.

```typescript
const form = useFormValidation({
  initialValues: {
    freeChlorine: 0,
    pH: 7.2,
    poolId: ''
  },
  validationSchema: poolValidationSchemas.chemicalTest,
  onSubmit: async (values) => {
    await createChemicalTest(values)
  }
})

// In component
<Input {...form.getFieldProps('pH')} />
<Button onClick={form.handleSubmit} disabled={!form.isValid}>
  Submit
</Button>
```

### `useMultiStepForm`

Manages multi-step forms with per-step validation.

```typescript
const multiForm = useMultiStepForm({
  steps: [
    {
      name: 'Pool Selection',
      fields: ['poolId'],
      validationSchema: z.object({ poolId: z.string().min(1) })
    },
    {
      name: 'Chemical Readings',
      fields: ['freeChlorine', 'pH', 'alkalinity'],
      validationSchema: chemicalSchema
    },
    {
      name: 'Notes',
      fields: ['notes', 'technicianId'],
      validationSchema: notesSchema
    }
  ],
  initialValues: defaultValues,
  onComplete: async (values) => {
    await submitTest(values)
  }
})

// Navigation
<Button onClick={multiForm.previousStep} disabled={multiForm.isFirstStep}>
  Previous
</Button>
<Button onClick={multiForm.nextStep} disabled={!multiForm.canGoNext}>
  {multiForm.isLastStep ? 'Submit' : 'Next'}
</Button>
```

## Best Practices

### 1. Error Handling

Always handle errors gracefully:

```typescript
const { data, error } = useFetchData(fetchFn, [], {
  onError: (error) => {
    // Log to error tracking service
    trackError(error)
    // Show user-friendly message
    showToast('Failed to load data. Please try again.')
  }
})
```

### 2. Loading States

Show appropriate loading indicators:

```typescript
if (loading) return <Skeleton />
if (error) return <ErrorMessage error={error} />
if (!data) return <EmptyState />
```

### 3. Dependency Management

Be careful with dependencies to avoid infinite loops:

```typescript
// Good - stable dependencies
const { data } = useFetchData(
  () => fetchData(id),
  [id] // Only re-fetch when ID changes
)

// Bad - unstable dependencies
const options = { limit: 10 }
const { data } = useFetchData(
  () => fetchData(options),
  [options] // Creates new object every render!
)
```

### 4. Cleanup

Hooks handle cleanup automatically, but be aware of component unmounting:

```typescript
const { data, refetch } = useFetchData(fetchFn)

// Safe - hook handles cleanup
useEffect(() => {
  const interval = setInterval(refetch, 5000)
  return () => clearInterval(interval)
}, [refetch])
```

### 5. TypeScript

Always provide proper types for better IntelliSense:

```typescript
interface PoolData {
  id: string
  name: string
  status: 'operational' | 'maintenance' | 'closed'
}

const { data } = useFetchData<PoolData>(
  () => api.getPool(poolId),
  [poolId]
)

// TypeScript knows data is PoolData | undefined
```

## Performance Considerations

1. **Memoize fetch functions** to prevent unnecessary re-renders
2. **Use pagination** for large datasets
3. **Implement caching** for frequently accessed data
4. **Debounce** form validation for better performance
5. **Use optimistic updates** for instant feedback

## Testing Hooks

Example of testing a custom hook:

```typescript
import { renderHook, act } from '@testing-library/react'
import { usePools } from '@/hooks'

test('usePools fetches data on mount', async () => {
  const { result } = renderHook(() => usePools())
  
  expect(result.current.loading).toBe(true)
  
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 100))
  })
  
  expect(result.current.loading).toBe(false)
  expect(result.current.data).toHaveLength(5)
})