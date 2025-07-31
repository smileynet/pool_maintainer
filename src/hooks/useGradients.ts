/**
 * useGradients Hook
 *
 * React hook for accessing the gradient overlay system in components.
 * Provides type-safe access to pool-themed gradients and visual depth effects.
 *
 * @example
 * ```typescript
 * function GradientCard({ status }: { status: 'safe' | 'caution' | 'critical' }) {
 *   const { getGradient, createCustomGradient, GradientCategory, GradientVariant } = useGradients();
 *
 *   // Get pre-defined gradient
 *   const statusGradient = getGradient(GradientCategory.STATUS, GradientVariant[status.toUpperCase()]);
 *
 *   // Create custom gradient
 *   const customGradient = createCustomGradient(
 *     GradientType.LINEAR,
 *     GradientDirection.TO_BOTTOM,
 *     ['#ff0000', '#0000ff']
 *   );
 *
 *   return (
 *     <div
 *       className={statusGradient?.cssClass}
 *       style={{ background: statusGradient?.cssProperty }}
 *     >
 *       Status: {status}
 *     </div>
 *   );
 * }
 * ```
 */

import { useCallback, useMemo } from 'react'
import {
  getGradient,
  getGradientsByCategory,
  getGradientsByUsage,
  getAccessibleGradients,
  getPerformantGradients,
  getGradientCategories,
  getGradientVariants,
  createCustomGradient,
  validateGradientAccessibility,
  getGradientRecommendations,
  GradientCategory,
  GradientVariant,
  GradientDirection,
  GradientType,
  type GradientDefinition,
} from '@/utils/gradient-system'

export interface UseGradientsReturn {
  /**
   * Get a specific gradient by category and variant
   */
  getGradient: (
    category: GradientCategory,
    variant: GradientVariant
  ) => GradientDefinition | undefined

  /**
   * Get all gradients in a specific category
   */
  getGradientsByCategory: (category: GradientCategory) => GradientDefinition[]

  /**
   * Get gradients suitable for a specific use case
   */
  getGradientsByUsage: (usage: string) => GradientDefinition[]

  /**
   * Get accessibility-compliant gradients
   */
  getAccessibleGradients: (
    requireHighContrast?: boolean,
    requireDarkMode?: boolean
  ) => GradientDefinition[]

  /**
   * Get performance-optimized gradients
   */
  getPerformantGradients: (
    requireMobileOptimized?: boolean,
    requireGpuAccelerated?: boolean
  ) => GradientDefinition[]

  /**
   * Get available gradient categories
   */
  getGradientCategories: () => GradientCategory[]

  /**
   * Get available variants for a category
   */
  getGradientVariants: (category: GradientCategory) => GradientVariant[]

  /**
   * Create a custom gradient CSS property
   */
  createCustomGradient: (
    type: GradientType,
    direction: GradientDirection | string,
    colorStops: string[]
  ) => string

  /**
   * Validate gradient accessibility
   */
  validateGradientAccessibility: (
    gradient: GradientDefinition,
    requirements?: {
      highContrastMode?: boolean
      darkModeSupport?: boolean
      contrastSafe?: boolean
    }
  ) => {
    isValid: boolean
    issues: string[]
    recommendations: string[]
  }

  /**
   * Get gradient recommendations based on context
   */
  getGradientRecommendations: (context: {
    usage: string
    accessibility?: {
      highContrast?: boolean
      darkMode?: boolean
    }
    performance?: {
      mobile?: boolean
      gpuAcceleration?: boolean
    }
  }) => GradientDefinition[]

  /**
   * Enums for convenience
   */
  GradientCategory: typeof GradientCategory
  GradientVariant: typeof GradientVariant
  GradientDirection: typeof GradientDirection
  GradientType: typeof GradientType
}

/**
 * Hook for accessing gradient overlay system
 *
 * @returns Object with gradient utilities and helper functions
 */
export function useGradients(): UseGradientsReturn {
  // Memoize gradient getter for performance
  const getGradientMemo = useCallback((category: GradientCategory, variant: GradientVariant) => {
    return getGradient(category, variant)
  }, [])

  // Memoize category-based getter
  const getGradientsByCategoryMemo = useCallback((category: GradientCategory) => {
    return getGradientsByCategory(category)
  }, [])

  // Memoize usage-based getter
  const getGradientsByUsageMemo = useCallback((usage: string) => {
    return getGradientsByUsage(usage)
  }, [])

  // Memoize accessibility filter
  const getAccessibleGradientsMemo = useCallback(
    (requireHighContrast?: boolean, requireDarkMode?: boolean) => {
      return getAccessibleGradients(requireHighContrast, requireDarkMode)
    },
    []
  )

  // Memoize performance filter
  const getPerformantGradientsMemo = useCallback(
    (requireMobileOptimized?: boolean, requireGpuAccelerated?: boolean) => {
      return getPerformantGradients(requireMobileOptimized, requireGpuAccelerated)
    },
    []
  )

  // Memoize categories getter
  const getGradientCategoriesMemo = useCallback(() => {
    return getGradientCategories()
  }, [])

  // Memoize variants getter
  const getGradientVariantsMemo = useCallback((category: GradientCategory) => {
    return getGradientVariants(category)
  }, [])

  // Memoize custom gradient creator
  const createCustomGradientMemo = useCallback(
    (type: GradientType, direction: GradientDirection | string, colorStops: string[]) => {
      return createCustomGradient(type, direction, colorStops)
    },
    []
  )

  // Memoize validation function
  const validateGradientAccessibilityMemo = useCallback(
    (
      gradient: GradientDefinition,
      requirements?: {
        highContrastMode?: boolean
        darkModeSupport?: boolean
        contrastSafe?: boolean
      }
    ) => {
      return validateGradientAccessibility(gradient, requirements)
    },
    []
  )

  // Memoize recommendations getter
  const getGradientRecommendationsMemo = useCallback(
    (context: {
      usage: string
      accessibility?: {
        highContrast?: boolean
        darkMode?: boolean
      }
      performance?: {
        mobile?: boolean
        gpuAcceleration?: boolean
      }
    }) => {
      return getGradientRecommendations(context)
    },
    []
  )

  // Memoize the return object to prevent unnecessary re-renders
  const returnValue = useMemo(
    () => ({
      getGradient: getGradientMemo,
      getGradientsByCategory: getGradientsByCategoryMemo,
      getGradientsByUsage: getGradientsByUsageMemo,
      getAccessibleGradients: getAccessibleGradientsMemo,
      getPerformantGradients: getPerformantGradientsMemo,
      getGradientCategories: getGradientCategoriesMemo,
      getGradientVariants: getGradientVariantsMemo,
      createCustomGradient: createCustomGradientMemo,
      validateGradientAccessibility: validateGradientAccessibilityMemo,
      getGradientRecommendations: getGradientRecommendationsMemo,
      GradientCategory,
      GradientVariant,
      GradientDirection,
      GradientType,
    }),
    [
      getGradientMemo,
      getGradientsByCategoryMemo,
      getGradientsByUsageMemo,
      getAccessibleGradientsMemo,
      getPerformantGradientsMemo,
      getGradientCategoriesMemo,
      getGradientVariantsMemo,
      createCustomGradientMemo,
      validateGradientAccessibilityMemo,
      getGradientRecommendationsMemo,
    ]
  )

  return returnValue
}

/**
 * Higher-order component for automatic gradient injection
 *
 * @example
 * ```typescript
 * const GradientCard = withGradients(
 *   ({ gradients, category = GradientCategory.POOL, variant = GradientVariant.SURFACE, ...props }) => {
 *     const gradient = gradients.getGradient(category, variant);
 *
 *     return (
 *       <div
 *         className={gradient?.cssClass}
 *         style={{ background: gradient?.cssProperty }}
 *         {...props}
 *       />
 *     );
 *   }
 * );
 * ```
 */
export function withGradients<T extends object>(
  Component: React.ComponentType<T & { gradients: UseGradientsReturn }>
) {
  return function WrappedComponent(props: T) {
    const gradients = useGradients()

    return React.createElement(Component, { ...props, gradients })
  }
}

/**
 * Hook for automatic gradient selection based on context
 * Automatically selects appropriate gradients based on component context
 *
 * @param context - Context information for gradient selection
 * @returns Recommended gradient definition
 *
 * @example
 * ```typescript
 * function StatusCard({ status, isActive }: Props) {
 *   const gradient = useContextGradient({
 *     usage: 'status indicators',
 *     accessibility: { darkMode: true },
 *     performance: { mobile: true }
 *   });
 *
 *   return (
 *     <div className={gradient?.cssClass}>
 *       Status: {status}
 *     </div>
 *   );
 * }
 * ```
 */
export function useContextGradient(context: {
  usage: string
  accessibility?: {
    highContrast?: boolean
    darkMode?: boolean
  }
  performance?: {
    mobile?: boolean
    gpuAcceleration?: boolean
  }
}): GradientDefinition | undefined {
  const { getGradientRecommendations } = useGradients()

  return useMemo(() => {
    const recommendations = getGradientRecommendations(context)
    return recommendations[0] // Return top recommendation
  }, [context, getGradientRecommendations])
}

/**
 * Hook for gradient validation and development warnings
 * Validates gradient usage during development and shows warnings
 *
 * @param gradient - Gradient definition to validate
 * @param requirements - Accessibility and performance requirements
 * @param componentName - Name of component for debugging
 *
 * @example
 * ```typescript
 * function MyGradientComponent({ gradient }: Props) {
 *   useGradientValidation(gradient, {
 *     accessibility: { highContrastMode: true },
 *     performance: { mobileOptimized: true }
 *   }, 'MyGradientComponent');
 *
 *   return <div className={gradient.cssClass}>Content</div>;
 * }
 * ```
 */
export function useGradientValidation(
  gradient: GradientDefinition | undefined,
  requirements: {
    accessibility?: {
      highContrastMode?: boolean
      darkModeSupport?: boolean
      contrastSafe?: boolean
    }
    performance?: {
      mobileOptimized?: boolean
      gpuAccelerated?: boolean
    }
  } = {},
  componentName: string = 'Component'
) {
  const { validateGradientAccessibility, getGradientRecommendations } = useGradients()

  useMemo(() => {
    // Only validate in development
    if (process.env.NODE_ENV !== 'development' || !gradient) return

    // Validate accessibility
    if (requirements.accessibility) {
      const accessibilityValidation = validateGradientAccessibility(
        gradient,
        requirements.accessibility
      )

      if (!accessibilityValidation.isValid) {
        console.warn(
          `🎨 Gradient Accessibility Warning in ${componentName}:\n` +
            `Gradient "${gradient.name}" has accessibility issues:\n${accessibilityValidation.issues
              .map((issue) => `  - ${issue}`)
              .join('\n')}\n\nRecommendations:\n${accessibilityValidation.recommendations
              .map((rec) => `  - ${rec}`)
              .join('\n')}`
        )
      }
    }

    // Validate performance
    if (requirements.performance) {
      const performanceIssues: string[] = []

      if (requirements.performance.mobileOptimized && !gradient.performance.mobileOptimized) {
        performanceIssues.push('Gradient is not optimized for mobile devices')
      }

      if (requirements.performance.gpuAccelerated && !gradient.performance.gpuAccelerated) {
        performanceIssues.push('Gradient is not GPU accelerated')
      }

      if (performanceIssues.length > 0) {
        console.warn(
          `⚡ Gradient Performance Warning in ${componentName}:\n` +
            `Gradient "${gradient.name}" has performance issues:\n${performanceIssues
              .map((issue) => `  - ${issue}`)
              .join('\n')}`
        )

        // Suggest alternatives
        const alternatives = getGradientRecommendations({
          usage: gradient.usage[0] || 'general',
          performance: requirements.performance,
        })

        if (alternatives.length > 0) {
          // Development info - performance alternatives available
          // console.info(`Performance alternatives available for ${gradient.name}`);
        }
      }
    }
  }, [
    gradient,
    requirements,
    componentName,
    validateGradientAccessibility,
    getGradientRecommendations,
  ])
}

/**
 * Hook for responsive gradient selection
 * Automatically selects appropriate gradients based on screen size and capabilities
 *
 * @param gradients - Array of gradient options (desktop, tablet, mobile)
 * @returns Currently active gradient based on viewport
 *
 * @example
 * ```typescript
 * function ResponsiveHero() {
 *   const { getGradient, GradientCategory, GradientVariant } = useGradients();
 *
 *   const gradient = useResponsiveGradient([
 *     getGradient(GradientCategory.POOL, GradientVariant.SPARKLE), // Desktop
 *     getGradient(GradientCategory.POOL, GradientVariant.SURFACE), // Tablet
 *     getGradient(GradientCategory.POOL, GradientVariant.DEPTH)    // Mobile
 *   ]);
 *
 *   return <div className={gradient?.cssClass}>Hero Content</div>;
 * }
 * ```
 */
export function useResponsiveGradient(
  gradients: [
    desktop: GradientDefinition | undefined,
    tablet?: GradientDefinition | undefined,
    mobile?: GradientDefinition | undefined,
  ]
): GradientDefinition | undefined {
  const [desktop, tablet, mobile] = gradients

  // Simple responsive logic - could be enhanced with actual media query hooks
  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth < 768
  }, [])

  const isTablet = useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth >= 768 && window.innerWidth < 1024
  }, [])

  return useMemo(() => {
    if (isMobile && mobile) return mobile
    if (isTablet && tablet) return tablet
    return desktop
  }, [isMobile, isTablet, desktop, tablet, mobile])
}

// Re-export types and enums for convenience
export {
  GradientCategory,
  GradientVariant,
  GradientDirection,
  GradientType,
  type GradientDefinition,
}
