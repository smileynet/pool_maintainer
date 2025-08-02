import { useState, useCallback, useEffect } from 'react'
import { z } from 'zod'

/**
 * Form validation hook with Zod schema support
 */
export interface UseFormValidationOptions<T> {
  initialValues: T
  validationSchema?: z.ZodSchema<T>
  validateOnChange?: boolean
  validateOnBlur?: boolean
  onSubmit?: (values: T) => void | Promise<void>
}

export interface FormField<T> {
  value: T
  error?: string
  touched: boolean
  isDirty: boolean
}

export interface UseFormValidationResult<T> {
  values: T
  errors: Partial<Record<keyof T, string>>
  touched: Partial<Record<keyof T, boolean>>
  isValid: boolean
  isSubmitting: boolean
  isDirty: boolean
  getFieldProps: (name: keyof T) => {
    value: any
    onChange: (value: any) => void
    onBlur: () => void
    error?: string
    name: string
  }
  setFieldValue: (name: keyof T, value: any) => void
  setFieldError: (name: keyof T, error: string) => void
  setFieldTouched: (name: keyof T, touched: boolean) => void
  handleSubmit: (e?: React.FormEvent) => Promise<void>
  reset: () => void
  validateForm: () => boolean
  validateField: (name: keyof T) => boolean
}

export function useFormValidation<T extends Record<string, any>>(
  options: UseFormValidationOptions<T>
): UseFormValidationResult<T> {
  const {
    initialValues,
    validationSchema,
    validateOnChange = true,
    validateOnBlur = true,
    onSubmit
  } = options

  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateField = useCallback((name: keyof T): boolean => {
    if (!validationSchema) return true

    try {
      const fieldSchema = validationSchema.shape[name as string] || validationSchema
      fieldSchema.parse(values[name])
      setErrors(prev => {
        const next = { ...prev }
        delete next[name]
        return next
      })
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({
          ...prev,
          [name]: error.errors[0]?.message || 'Invalid value'
        }))
      }
      return false
    }
  }, [values, validationSchema])

  const validateForm = useCallback((): boolean => {
    if (!validationSchema) return true

    try {
      validationSchema.parse(values)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof T, string>> = {}
        error.errors.forEach(err => {
          if (err.path.length > 0) {
            const field = err.path[0] as keyof T
            if (!newErrors[field]) {
              newErrors[field] = err.message
            }
          }
        })
        setErrors(newErrors)
      }
      return false
    }
  }, [values, validationSchema])

  const setFieldValue = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }))
    
    if (validateOnChange) {
      // Delay validation to next tick to ensure state is updated
      setTimeout(() => validateField(name), 0)
    }
  }, [validateField, validateOnChange])

  const setFieldError = useCallback((name: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [name]: error }))
  }, [])

  const setFieldTouched = useCallback((name: keyof T, isTouched: boolean) => {
    setTouched(prev => ({ ...prev, [name]: isTouched }))
    
    if (validateOnBlur && isTouched) {
      validateField(name)
    }
  }, [validateField, validateOnBlur])

  const getFieldProps = useCallback((name: keyof T) => {
    return {
      name: String(name),
      value: values[name],
      onChange: (value: any) => setFieldValue(name, value),
      onBlur: () => setFieldTouched(name, true),
      error: touched[name] ? errors[name] : undefined
    }
  }, [values, errors, touched, setFieldValue, setFieldTouched])

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault()

    // Touch all fields
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key as keyof T] = true
      return acc
    }, {} as Record<keyof T, boolean>)
    setTouched(allTouched)

    // Validate form
    const isValid = validateForm()
    if (!isValid) return

    // Submit
    setIsSubmitting(true)
    try {
      await onSubmit?.(values)
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }, [values, validateForm, onSubmit])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }, [initialValues])

  const isValid = Object.keys(errors).length === 0
  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues)

  return {
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    isDirty,
    getFieldProps,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    handleSubmit,
    reset,
    validateForm,
    validateField
  }
}

/**
 * Common validation schemas for pool maintenance
 */
export const poolValidationSchemas = {
  chemicalTest: z.object({
    poolId: z.string().min(1, 'Pool is required'),
    freeChlorine: z.number().min(0).max(10, 'Free chlorine must be between 0-10'),
    totalChlorine: z.number().min(0).max(10, 'Total chlorine must be between 0-10'),
    pH: z.number().min(0).max(14, 'pH must be between 0-14'),
    alkalinity: z.number().min(0).max(300, 'Alkalinity must be between 0-300'),
    cyanuricAcid: z.number().min(0).max(200, 'Cyanuric acid must be between 0-200'),
    temperature: z.number().min(0).max(120, 'Temperature must be between 0-120'),
    technicianId: z.string().min(1, 'Technician is required'),
    notes: z.string().optional()
  }),

  poolInfo: z.object({
    name: z.string().min(1, 'Pool name is required').max(100),
    location: z.string().min(1, 'Location is required'),
    volume: z.number().positive('Volume must be positive'),
    type: z.enum(['residential', 'commercial', 'public']),
    status: z.enum(['operational', 'maintenance', 'closed'])
  }),

  maintenance: z.object({
    poolId: z.string().min(1, 'Pool is required'),
    type: z.enum(['routine', 'repair', 'emergency']),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    scheduledDate: z.date(),
    technicianId: z.string().min(1, 'Technician is required'),
    estimatedDuration: z.number().positive()
  })
}

/**
 * Hook for multi-step form management
 */
export interface UseMultiStepFormOptions<T> {
  steps: Array<{
    name: string
    fields: (keyof T)[]
    validationSchema?: z.ZodSchema<Partial<T>>
  }>
  initialValues: T
  onComplete?: (values: T) => void | Promise<void>
}

export interface UseMultiStepFormResult<T> extends UseFormValidationResult<T> {
  currentStep: number
  totalSteps: number
  isFirstStep: boolean
  isLastStep: boolean
  canGoNext: boolean
  canGoPrevious: boolean
  nextStep: () => void
  previousStep: () => void
  goToStep: (step: number) => void
  currentStepInfo: {
    name: string
    fields: (keyof T)[]
    validationSchema?: z.ZodSchema<Partial<T>>
  }
}

export function useMultiStepForm<T extends Record<string, any>>(
  options: UseMultiStepFormOptions<T>
): UseMultiStepFormResult<T> {
  const { steps, initialValues, onComplete } = options
  const [currentStep, setCurrentStep] = useState(0)

  const currentStepInfo = steps[currentStep]
  
  const formValidation = useFormValidation({
    initialValues,
    validationSchema: currentStepInfo.validationSchema,
    onSubmit: async (values) => {
      if (currentStep === steps.length - 1) {
        await onComplete?.(values)
      } else {
        nextStep()
      }
    }
  })

  const validateCurrentStep = useCallback((): boolean => {
    if (!currentStepInfo.validationSchema) return true

    try {
      // Extract only current step fields for validation
      const stepValues = currentStepInfo.fields.reduce((acc, field) => {
        acc[field] = formValidation.values[field]
        return acc
      }, {} as Partial<T>)

      currentStepInfo.validationSchema.parse(stepValues)
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Update errors for current step fields only
        error.errors.forEach(err => {
          if (err.path.length > 0) {
            const field = err.path[0] as keyof T
            formValidation.setFieldError(field, err.message)
          }
        })
      }
      return false
    }
  }, [currentStepInfo, formValidation])

  const nextStep = useCallback(() => {
    if (currentStep < steps.length - 1 && validateCurrentStep()) {
      setCurrentStep(prev => prev + 1)
    }
  }, [currentStep, steps.length, validateCurrentStep])

  const previousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }, [currentStep])

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < steps.length) {
      // Validate all steps up to the target step
      let canGo = true
      for (let i = 0; i < step && i < currentStep; i++) {
        // Validate each step's fields
        const stepInfo = steps[i]
        if (stepInfo.validationSchema) {
          try {
            const stepValues = stepInfo.fields.reduce((acc, field) => {
              acc[field] = formValidation.values[field]
              return acc
            }, {} as Partial<T>)
            stepInfo.validationSchema.parse(stepValues)
          } catch {
            canGo = false
            break
          }
        }
      }
      
      if (canGo) {
        setCurrentStep(step)
      }
    }
  }, [steps, currentStep, formValidation.values])

  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1
  const canGoNext = !isLastStep && formValidation.isValid
  const canGoPrevious = !isFirstStep

  return {
    ...formValidation,
    currentStep,
    totalSteps: steps.length,
    isFirstStep,
    isLastStep,
    canGoNext,
    canGoPrevious,
    nextStep,
    previousStep,
    goToStep,
    currentStepInfo
  }
}