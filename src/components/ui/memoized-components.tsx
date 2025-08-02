import React, { memo, useMemo, useCallback } from 'react'
import { cn } from '@/lib/utils'
import type { PoolStatus, ChemicalTest } from '@/test/fixtures/pool-data'

/**
 * Memoized pool card component
 * Only re-renders when pool data changes
 */
export const MemoizedPoolCard = memo<{
  pool: PoolStatus
  onViewPool?: (poolId: string) => void
  className?: string
}>(
  ({ pool, onViewPool, className }) => {
    const handleClick = useCallback(() => {
      onViewPool?.(pool.id)
    }, [pool.id, onViewPool])

    const statusColor = useMemo(() => {
      switch (pool.status) {
        case 'operational': return 'text-success'
        case 'maintenance': return 'text-warning'
        case 'closed': return 'text-destructive'
        default: return 'text-muted-foreground'
      }
    }, [pool.status])

    return (
      <div 
        className={cn('pool-card', className)}
        onClick={handleClick}
        role="button"
        tabIndex={0}
      >
        <h3>{pool.name}</h3>
        <p className={statusColor}>{pool.status}</p>
      </div>
    )
  },
  // Custom comparison function
  (prevProps, nextProps) => {
    return (
      prevProps.pool.id === nextProps.pool.id &&
      prevProps.pool.status === nextProps.pool.status &&
      prevProps.pool.lastUpdated === nextProps.pool.lastUpdated &&
      prevProps.className === nextProps.className
    )
  }
)

MemoizedPoolCard.displayName = 'MemoizedPoolCard'

/**
 * Memoized chemical reading display
 * Prevents re-renders when parent updates but readings haven't changed
 */
export const MemoizedChemicalReading = memo<{
  label: string
  value: number
  unit: string
  optimalRange?: { min: number; max: number }
}>(({ label, value, unit, optimalRange }) => {
  const isInRange = useMemo(() => {
    if (!optimalRange) return true
    return value >= optimalRange.min && value <= optimalRange.max
  }, [value, optimalRange])

  const displayValue = useMemo(() => {
    return value.toFixed(1)
  }, [value])

  return (
    <div className="chemical-reading">
      <span className="label">{label}</span>
      <span className={cn('value', !isInRange && 'text-warning')}>
        {displayValue} {unit}
      </span>
    </div>
  )
})

MemoizedChemicalReading.displayName = 'MemoizedChemicalReading'

/**
 * Hook for memoized pool statistics calculation
 */
export function usePoolStatistics(pools: PoolStatus[]) {
  return useMemo(() => {
    const stats = {
      total: pools.length,
      operational: 0,
      maintenance: 0,
      closed: 0,
      requiresAttention: 0
    }

    pools.forEach(pool => {
      stats[pool.status]++
      
      if (pool.chemicalBalance && 
          (pool.chemicalBalance.status === 'warning' || 
           pool.chemicalBalance.status === 'critical')) {
        stats.requiresAttention++
      }
    })

    return stats
  }, [pools])
}

/**
 * Hook for memoized chemical trend calculation
 */
export function useChemicalTrend(
  tests: ChemicalTest[],
  chemical: keyof ChemicalTest['readings']
) {
  return useMemo(() => {
    if (tests.length < 2) return 'stable'

    const sortedTests = [...tests].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )

    const recentTests = sortedTests.slice(-5)
    const values = recentTests
      .map(test => test.readings[chemical])
      .filter((v): v is number => v !== undefined)

    if (values.length < 2) return 'stable'

    const firstValue = values[0]
    const lastValue = values[values.length - 1]
    const change = ((lastValue - firstValue) / firstValue) * 100

    if (change > 10) return 'increasing'
    if (change < -10) return 'decreasing'
    return 'stable'
  }, [tests, chemical])
}

/**
 * Memoized table row component
 */
export const MemoizedTableRow = memo<{
  data: Record<string, any>
  columns: Array<{
    key: string
    render?: (value: any, row: any) => React.ReactNode
  }>
  onRowClick?: (row: any) => void
}>(({ data, columns, onRowClick }) => {
  const handleClick = useCallback(() => {
    onRowClick?.(data)
  }, [data, onRowClick])

  return (
    <tr onClick={handleClick} className="cursor-pointer hover:bg-accent">
      {columns.map(column => (
        <td key={column.key}>
          {column.render 
            ? column.render(data[column.key], data)
            : data[column.key]
          }
        </td>
      ))}
    </tr>
  )
})

MemoizedTableRow.displayName = 'MemoizedTableRow'

/**
 * Hook for memoized filtering and sorting
 */
export function useFilteredSortedData<T extends Record<string, any>>(
  data: T[],
  filters: Record<string, any>,
  sortConfig?: { key: keyof T; direction: 'asc' | 'desc' }
) {
  return useMemo(() => {
    let filtered = data

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        filtered = filtered.filter(item => {
          const itemValue = item[key]
          if (typeof value === 'string') {
            return String(itemValue).toLowerCase().includes(value.toLowerCase())
          }
          return itemValue === value
        })
      }
    })

    // Apply sorting
    if (sortConfig) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }

    return filtered
  }, [data, filters, sortConfig])
}

/**
 * Memoized form field component
 */
export const MemoizedFormField = memo<{
  name: string
  value: any
  onChange: (value: any) => void
  error?: string
  type?: string
  label?: string
  required?: boolean
}>(({ name, value, onChange, error, type = 'text', label, required }) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = type === 'number' ? parseFloat(e.target.value) : e.target.value
    onChange(newValue)
  }, [onChange, type])

  const inputId = useMemo(() => `field-${name}`, [name])

  return (
    <div className="form-field">
      {label && (
        <label htmlFor={inputId}>
          {label} {required && <span className="text-destructive">*</span>}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={handleChange}
        className={cn('input', error && 'border-destructive')}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
})

MemoizedFormField.displayName = 'MemoizedFormField'

/**
 * Hook for debounced values (useful for search inputs)
 */
export function useDebouncedValue<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = React.useState(value)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Hook for memoized chart data transformation
 */
export function useChartData(
  tests: ChemicalTest[],
  selectedChemical: keyof ChemicalTest['readings'],
  timeRange: number // days
) {
  return useMemo(() => {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - timeRange)

    const filteredTests = tests.filter(
      test => new Date(test.timestamp) >= cutoffDate
    )

    const chartData = filteredTests
      .map(test => ({
        date: new Date(test.timestamp).toLocaleDateString(),
        value: test.readings[selectedChemical] || 0,
        poolId: test.poolId
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Calculate statistics
    const values = chartData.map(d => d.value).filter(v => v > 0)
    const stats = {
      min: Math.min(...values),
      max: Math.max(...values),
      avg: values.reduce((a, b) => a + b, 0) / values.length || 0
    }

    return { chartData, stats }
  }, [tests, selectedChemical, timeRange])
}

/**
 * Memoized list component with virtualization support
 */
export const MemoizedVirtualList = memo<{
  items: any[]
  renderItem: (item: any, index: number) => React.ReactNode
  itemHeight: number
  containerHeight: number
}>(({ items, renderItem, itemHeight, containerHeight }) => {
  const [scrollTop, setScrollTop] = React.useState(0)

  const visibleRange = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight)
    const endIndex = Math.ceil((scrollTop + containerHeight) / itemHeight)
    return {
      start: Math.max(0, startIndex - 5), // Buffer
      end: Math.min(items.length, endIndex + 5)
    }
  }, [scrollTop, itemHeight, containerHeight, items.length])

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])

  const totalHeight = items.length * itemHeight

  return (
    <div 
      className="virtual-list-container"
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {items.slice(visibleRange.start, visibleRange.end).map((item, index) => (
          <div
            key={visibleRange.start + index}
            style={{
              position: 'absolute',
              top: (visibleRange.start + index) * itemHeight,
              height: itemHeight,
              width: '100%'
            }}
          >
            {renderItem(item, visibleRange.start + index)}
          </div>
        ))}
      </div>
    </div>
  )
})

MemoizedVirtualList.displayName = 'MemoizedVirtualList'