import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Generic data fetching hook with loading, error, and refetch capabilities
 */
export interface UseFetchDataOptions<T> {
  initialData?: T
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  retryCount?: number
  retryDelay?: number
  enabled?: boolean
  refetchInterval?: number
  transform?: (data: any) => T
}

export interface UseFetchDataResult<T> {
  data: T | undefined
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
  isRefetching: boolean
}

export function useFetchData<T>(
  fetchFn: () => Promise<T>,
  dependencies: any[] = [],
  options: UseFetchDataOptions<T> = {}
): UseFetchDataResult<T> {
  const {
    initialData,
    onSuccess,
    onError,
    retryCount = 0,
    retryDelay = 1000,
    enabled = true,
    refetchInterval,
    transform
  } = options

  const [data, setData] = useState<T | undefined>(initialData)
  const [loading, setLoading] = useState(enabled)
  const [error, setError] = useState<Error | null>(null)
  const [isRefetching, setIsRefetching] = useState(false)
  const attemptRef = useRef(0)
  const mountedRef = useRef(true)
  const intervalRef = useRef<NodeJS.Timeout>()

  const fetchData = useCallback(async (isRefetch = false) => {
    if (!enabled) return

    try {
      if (isRefetch) {
        setIsRefetching(true)
      } else {
        setLoading(true)
      }
      setError(null)

      const result = await fetchFn()
      
      if (mountedRef.current) {
        const transformedData = transform ? transform(result) : result
        setData(transformedData)
        onSuccess?.(transformedData)
        attemptRef.current = 0
      }
    } catch (err) {
      if (mountedRef.current) {
        const error = err instanceof Error ? err : new Error(String(err))
        
        if (attemptRef.current < retryCount) {
          attemptRef.current++
          setTimeout(() => {
            if (mountedRef.current) {
              fetchData(isRefetch)
            }
          }, retryDelay * attemptRef.current)
        } else {
          setError(error)
          onError?.(error)
          attemptRef.current = 0
        }
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false)
        setIsRefetching(false)
      }
    }
  }, [enabled, fetchFn, onSuccess, onError, retryCount, retryDelay, transform])

  const refetch = useCallback(async () => {
    await fetchData(true)
  }, [fetchData])

  useEffect(() => {
    mountedRef.current = true
    fetchData()

    return () => {
      mountedRef.current = false
    }
  }, [...dependencies, fetchData])

  useEffect(() => {
    if (refetchInterval && enabled) {
      intervalRef.current = setInterval(() => {
        refetch()
      }, refetchInterval)

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    }
  }, [refetchInterval, enabled, refetch])

  return { data, loading, error, refetch, isRefetching }
}

/**
 * Hook for fetching paginated data
 */
export interface UsePaginatedDataOptions<T> extends UseFetchDataOptions<T> {
  pageSize?: number
  initialPage?: number
}

export interface UsePaginatedDataResult<T> extends UseFetchDataResult<T> {
  page: number
  pageSize: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  nextPage: () => void
  previousPage: () => void
  goToPage: (page: number) => void
  setPageSize: (size: number) => void
}

export function usePaginatedData<T>(
  fetchFn: (page: number, pageSize: number) => Promise<{ data: T; total: number }>,
  options: UsePaginatedDataOptions<T> = {}
): UsePaginatedDataResult<T> {
  const { pageSize: initialPageSize = 10, initialPage = 1, ...fetchOptions } = options

  const [page, setPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [total, setTotal] = useState(0)

  const paginatedFetchFn = useCallback(async () => {
    const result = await fetchFn(page, pageSize)
    setTotal(result.total)
    return result.data
  }, [fetchFn, page, pageSize])

  const { data, loading, error, refetch, isRefetching } = useFetchData(
    paginatedFetchFn,
    [page, pageSize],
    fetchOptions
  )

  const hasNextPage = page * pageSize < total
  const hasPreviousPage = page > 1

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      setPage(p => p + 1)
    }
  }, [hasNextPage])

  const previousPage = useCallback(() => {
    if (hasPreviousPage) {
      setPage(p => p - 1)
    }
  }, [hasPreviousPage])

  const goToPage = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= Math.ceil(total / pageSize)) {
      setPage(newPage)
    }
  }, [total, pageSize])

  const updatePageSize = useCallback((newSize: number) => {
    setPageSize(newSize)
    setPage(1) // Reset to first page when page size changes
  }, [])

  return {
    data,
    loading,
    error,
    refetch,
    isRefetching,
    page,
    pageSize,
    hasNextPage,
    hasPreviousPage,
    nextPage,
    previousPage,
    goToPage,
    setPageSize: updatePageSize
  }
}

/**
 * Hook for managing optimistic updates
 */
export interface UseOptimisticDataOptions<T> extends UseFetchDataOptions<T> {
  updateFn: (data: T) => Promise<T>
}

export interface UseOptimisticDataResult<T> extends UseFetchDataResult<T> {
  update: (optimisticData: T) => Promise<void>
  isUpdating: boolean
}

export function useOptimisticData<T>(
  fetchFn: () => Promise<T>,
  options: UseOptimisticDataOptions<T>
): UseOptimisticDataResult<T> {
  const { updateFn, ...fetchOptions } = options
  const [isUpdating, setIsUpdating] = useState(false)
  const [optimisticData, setOptimisticData] = useState<T | undefined>()

  const { data: serverData, loading, error, refetch, isRefetching } = useFetchData(
    fetchFn,
    [],
    fetchOptions
  )

  const data = optimisticData ?? serverData

  const update = useCallback(async (newData: T) => {
    setIsUpdating(true)
    setOptimisticData(newData)

    try {
      const result = await updateFn(newData)
      setOptimisticData(result)
      await refetch()
    } catch (err) {
      // Revert optimistic update on error
      setOptimisticData(undefined)
      throw err
    } finally {
      setIsUpdating(false)
      setOptimisticData(undefined)
    }
  }, [updateFn, refetch])

  return {
    data,
    loading,
    error,
    refetch,
    isRefetching,
    update,
    isUpdating
  }
}