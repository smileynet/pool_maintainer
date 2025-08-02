/**
 * Custom hooks for the Pool Maintenance application
 * 
 * These hooks provide reusable logic for common patterns like:
 * - Data fetching with loading states
 * - Form validation and management
 * - Pool-specific data operations
 * - Offline queue management
 * - Real-time synchronization
 */

// Data fetching hooks
export {
  useFetchData,
  usePaginatedData,
  useOptimisticData,
  type UseFetchDataOptions,
  type UseFetchDataResult,
  type UsePaginatedDataOptions,
  type UsePaginatedDataResult,
  type UseOptimisticDataOptions,
  type UseOptimisticDataResult
} from './use-fetch-data'

// Pool-specific hooks
export {
  usePools,
  usePool,
  useChemicalTests,
  useCreateChemicalTest,
  useChemicalTrends,
  useOfflineQueue,
  useRealtimeSync,
  type ChemicalTrendData
} from './use-pool-data'

// Form validation hooks
export {
  useFormValidation,
  useMultiStepForm,
  poolValidationSchemas,
  type UseFormValidationOptions,
  type UseFormValidationResult,
  type FormField,
  type UseMultiStepFormOptions,
  type UseMultiStepFormResult
} from './use-form-validation'

// Re-export the existing useTheme hook
export { useTheme } from './use-theme'