# Memoization Guide

This guide explains how to implement strategic memoization in the Pool Maintenance application for optimal performance.

## When to Use Memoization

### Use Memoization When:

1. **Expensive Computations**: Complex calculations that don't need to run on every render
2. **Heavy Lists**: Rendering many items with stable data
3. **Callback Stability**: Functions passed to child components as props
4. **Derived State**: Values computed from props or state

### Avoid Memoization When:

1. **Simple Components**: Basic components with primitive props
2. **Frequently Changing Data**: Props that change on almost every render
3. **Premature Optimization**: Before identifying actual performance issues

## React.memo

Prevents re-renders when props haven't changed:

```typescript
// Before
export function PoolCard({ pool, onViewPool }) {
  return <div onClick={() => onViewPool(pool.id)}>{pool.name}</div>
}

// After - with memo
export const PoolCard = memo(({ pool, onViewPool }) => {
  return <div onClick={() => onViewPool(pool.id)}>{pool.name}</div>
})

// With custom comparison
export const PoolCard = memo(
  ({ pool, onViewPool }) => {
    return <div onClick={() => onViewPool(pool.id)}>{pool.name}</div>
  },
  (prevProps, nextProps) => {
    // Return true if props are equal (skip re-render)
    return prevProps.pool.id === nextProps.pool.id &&
           prevProps.pool.status === nextProps.pool.status
  }
)
```

## useMemo

Memoizes expensive computations:

```typescript
// Before - recalculates on every render
function PoolDashboard({ pools }) {
  const stats = {
    total: pools.length,
    operational: pools.filter(p => p.status === 'operational').length,
    maintenance: pools.filter(p => p.status === 'maintenance').length
  }
  
  return <StatsDisplay stats={stats} />
}

// After - only recalculates when pools change
function PoolDashboard({ pools }) {
  const stats = useMemo(() => ({
    total: pools.length,
    operational: pools.filter(p => p.status === 'operational').length,
    maintenance: pools.filter(p => p.status === 'maintenance').length
  }), [pools])
  
  return <StatsDisplay stats={stats} />
}
```

## useCallback

Memoizes functions to maintain reference equality:

```typescript
// Before - creates new function on every render
function PoolList({ pools }) {
  const handlePoolClick = (poolId) => {
    navigate(`/pools/${poolId}`)
  }
  
  return pools.map(pool => (
    <PoolCard key={pool.id} pool={pool} onClick={handlePoolClick} />
  ))
}

// After - stable function reference
function PoolList({ pools }) {
  const handlePoolClick = useCallback((poolId) => {
    navigate(`/pools/${poolId}`)
  }, [navigate])
  
  return pools.map(pool => (
    <PoolCard key={pool.id} pool={pool} onClick={handlePoolClick} />
  ))
}
```

## Real-World Examples

### 1. Memoized Chemical Trend Calculation

```typescript
import { useMemo } from 'react'
import { useChemicalTests } from '@/hooks'

function ChemicalTrendAnalysis({ poolId }) {
  const { data: tests } = useChemicalTests(poolId)
  
  // Expensive trend calculation
  const trends = useMemo(() => {
    if (!tests || tests.length < 2) return null
    
    const chemicals = ['pH', 'chlorine', 'alkalinity'] as const
    
    return chemicals.map(chemical => {
      const values = tests
        .map(test => test.readings[chemical])
        .filter(Boolean)
      
      const avg = values.reduce((a, b) => a + b, 0) / values.length
      const trend = calculateTrend(values) // Complex calculation
      
      return { chemical, avg, trend }
    })
  }, [tests])
  
  return <TrendChart data={trends} />
}
```

### 2. Memoized Filter and Sort

```typescript
function ChemicalTestHistory({ poolId }) {
  const { data: tests } = useChemicalTests(poolId)
  const [filter, setFilter] = useState('')
  const [sortBy, setSortBy] = useState('date')
  
  const filteredSortedTests = useMemo(() => {
    if (!tests) return []
    
    return tests
      .filter(test => 
        test.technicianId.includes(filter) ||
        test.notes?.includes(filter)
      )
      .sort((a, b) => {
        if (sortBy === 'date') {
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        }
        // Other sort logic
        return 0
      })
  }, [tests, filter, sortBy])
  
  return <TestTable tests={filteredSortedTests} />
}
```

### 3. Memoized Form Handlers

```typescript
function ChemicalTestForm({ poolId, onSubmit }) {
  const [values, setValues] = useState(initialValues)
  
  // Memoize individual field handlers
  const handleFieldChange = useCallback((fieldName: string) => {
    return (value: any) => {
      setValues(prev => ({ ...prev, [fieldName]: value }))
    }
  }, [])
  
  // Memoize validation
  const errors = useMemo(() => {
    const errs: Record<string, string> = {}
    
    if (values.pH < 0 || values.pH > 14) {
      errs.pH = 'pH must be between 0 and 14'
    }
    
    if (values.chlorine < 0) {
      errs.chlorine = 'Chlorine cannot be negative'
    }
    
    return errs
  }, [values])
  
  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors])
  
  return (
    <form>
      <Input
        value={values.pH}
        onChange={handleFieldChange('pH')}
        error={errors.pH}
      />
      {/* More fields */}
    </form>
  )
}
```

### 4. Memoized Data Transformation

```typescript
function PoolMap({ pools }) {
  // Expensive geo calculations
  const mapMarkers = useMemo(() => {
    return pools.map(pool => ({
      id: pool.id,
      position: {
        lat: parseFloat(pool.latitude),
        lng: parseFloat(pool.longitude)
      },
      label: pool.name,
      color: getStatusColor(pool.status),
      // Complex calculations
      nearbyPools: findNearbyPools(pool, pools, 5), // 5km radius
      maintenanceScore: calculateMaintenanceScore(pool)
    }))
  }, [pools])
  
  return <MapComponent markers={mapMarkers} />
}
```

## Performance Patterns

### 1. Memoize at the Right Level

```typescript
// Bad - memoizing too low
function App() {
  const value = useMemo(() => 1 + 1, []) // Unnecessary
  return <div>{value}</div>
}

// Good - memoizing expensive computation
function App({ data }) {
  const processed = useMemo(() => 
    processLargeDataset(data), // Actually expensive
    [data]
  )
  return <DataVisualization data={processed} />
}
```

### 2. Stable Dependencies

```typescript
// Bad - unstable dependency
function Component() {
  const config = { limit: 10 } // New object every render
  
  const data = useMemo(() => 
    fetchData(config),
    [config] // Will re-run every render!
  )
}

// Good - stable dependency
const CONFIG = { limit: 10 } // Outside component

function Component() {
  const data = useMemo(() => 
    fetchData(CONFIG),
    [CONFIG] // Stable reference
  )
}

// Or use useMemo for the config too
function Component() {
  const config = useMemo(() => ({ limit: 10 }), [])
  
  const data = useMemo(() => 
    fetchData(config),
    [config]
  )
}
```

### 3. Callback Optimization

```typescript
// Before - creates new callbacks for each item
function PoolList({ pools, onEdit, onDelete }) {
  return pools.map(pool => (
    <PoolCard
      key={pool.id}
      pool={pool}
      onEdit={() => onEdit(pool.id)}
      onDelete={() => onDelete(pool.id)}
    />
  ))
}

// After - single stable callback
function PoolList({ pools, onEdit, onDelete }) {
  const handleEdit = useCallback((poolId: string) => {
    onEdit(poolId)
  }, [onEdit])
  
  const handleDelete = useCallback((poolId: string) => {
    onDelete(poolId)
  }, [onDelete])
  
  return pools.map(pool => (
    <MemoizedPoolCard
      key={pool.id}
      pool={pool}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  ))
}

// Even better - pass ID to child
const MemoizedPoolCard = memo(({ pool, onEdit, onDelete }) => {
  const handleEdit = useCallback(() => onEdit(pool.id), [onEdit, pool.id])
  const handleDelete = useCallback(() => onDelete(pool.id), [onDelete, pool.id])
  
  return (
    <Card>
      <Button onClick={handleEdit}>Edit</Button>
      <Button onClick={handleDelete}>Delete</Button>
    </Card>
  )
})
```

## Testing Memoization

```typescript
import { render } from '@testing-library/react'

// Test that component doesn't re-render unnecessarily
test('PoolCard does not re-render when props are same', () => {
  const renderSpy = jest.fn()
  
  const TestComponent = memo(({ pool }) => {
    renderSpy()
    return <div>{pool.name}</div>
  })
  
  const pool = { id: '1', name: 'Main Pool' }
  const { rerender } = render(<TestComponent pool={pool} />)
  
  expect(renderSpy).toHaveBeenCalledTimes(1)
  
  // Re-render with same props
  rerender(<TestComponent pool={pool} />)
  
  // Should not have rendered again
  expect(renderSpy).toHaveBeenCalledTimes(1)
  
  // Change props
  rerender(<TestComponent pool={{ ...pool, name: 'Updated' }} />)
  
  // Now it should render
  expect(renderSpy).toHaveBeenCalledTimes(2)
})
```

## Common Pitfalls

### 1. Over-Memoization

```typescript
// Bad - memoizing everything
const SimpleComponent = memo(() => {
  const text = useMemo(() => 'Hello', [])
  const handleClick = useCallback(() => console.log('clicked'), [])
  
  return <button onClick={handleClick}>{text}</button>
})
```

### 2. Incorrect Dependencies

```typescript
// Bad - missing dependency
const data = useMemo(() => 
  processData(input, options), // options not in deps!
  [input]
)

// Good - all dependencies included
const data = useMemo(() => 
  processData(input, options),
  [input, options]
)
```

### 3. Memoizing Unstable Values

```typescript
// Bad - function creates new array
const getItems = () => [1, 2, 3]
const items = useMemo(() => getItems(), [getItems]) // Unstable!

// Good - stable value
const items = useMemo(() => [1, 2, 3], [])
```

## Performance Monitoring

Use React DevTools Profiler to identify components that need memoization:

1. Record a profiling session
2. Look for components that render frequently
3. Check if props actually changed
4. Apply memoization if props are stable but component re-renders

## Conclusion

Memoization is a powerful optimization technique, but use it strategically:

- Profile first, optimize second
- Focus on actually expensive operations
- Ensure dependencies are stable
- Test that memoization is working as expected
- Remember that memoization has its own overhead