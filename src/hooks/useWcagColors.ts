/**
 * useWcagColors Hook
 * 
 * React hook for accessing WCAG-compliant color combinations in components.
 * Provides type-safe access to pre-tested color pairs and validation utilities.
 * 
 * @example
 * ```typescript
 * function StatusBadge({ status }: { status: 'safe' | 'caution' | 'critical' }) {
 *   const { getColorPair, validateCustomColors } = useWcagColors();
 *   
 *   // Get pre-tested color pair
 *   const colors = getColorPair('status', status, WcagStandard.AA);
 *   
 *   // Validate custom colors
 *   const validation = validateCustomColors('#ff0000', '#ffffff');
 *   
 *   return (
 *     <div className={colors?.cssClass} style={{ 
 *       backgroundColor: colors?.background,
 *       color: colors?.foreground 
 *     }}>
 *       Status: {status}
 *     </div>
 *   );
 * }
 * ```
 */

import { useCallback, useMemo, createElement } from 'react';
import {
  getWcagColorPair,
  validateColorPair,
  calculateContrastRatio,
  getAvailableCategories,
  getColorPairsByCategory,
  checkKnownFailure,
  suggestAlternatives,
  WcagStandard,
  WcagSize,
  type ColorPair,
  type WcagValidationResult,
} from '@/utils/wcag-color-pairs';

export interface UseWcagColorsReturn {
  /**
   * Get a pre-tested WCAG-compliant color pair
   */
  getColorPair: (
    category: string,
    variant: string,
    standard?: WcagStandard
  ) => ColorPair | undefined;
  
  /**
   * Validate custom color combinations
   */
  validateCustomColors: (
    background: string,
    foreground: string,
    standard?: WcagStandard,
    size?: WcagSize
  ) => WcagValidationResult;
  
  /**
   * Calculate contrast ratio between two colors
   */
  calculateContrast: (color1: string, color2: string) => number;
  
  /**
   * Get all available color pair categories
   */
  getCategories: () => string[];
  
  /**
   * Get all color pairs in a category
   */
  getCategoryPairs: (category: string, standard?: WcagStandard) => ColorPair[];
  
  /**
   * Check if a combination is known to fail
   */
  checkFailure: (background: string, foreground: string) => { reason: string; contrastRatio: number } | null;
  
  /**
   * Get alternative color suggestions
   */
  getAlternatives: (category: string, standard?: WcagStandard) => ColorPair[];
  
  /**
   * WCAG standards enum for convenience
   */
  WcagStandard: typeof WcagStandard;
  
  /**
   * WCAG size classifications enum
   */
  WcagSize: typeof WcagSize;
}

/**
 * Hook for accessing WCAG-compliant color combinations
 * 
 * @returns Object with color pair utilities and validation functions
 */
export function useWcagColors(): UseWcagColorsReturn {
  
  // Memoize the color pair getter for performance
  const getColorPair = useCallback((
    category: string,
    variant: string,
    standard: WcagStandard = WcagStandard.AA
  ) => {
    return getWcagColorPair(category, variant, standard);
  }, []);
  
  // Memoize validation function
  const validateCustomColors = useCallback((
    background: string,
    foreground: string,
    standard: WcagStandard = WcagStandard.AA,
    size: WcagSize = WcagSize.NORMAL
  ) => {
    return validateColorPair(background, foreground, standard, size);
  }, []);
  
  // Memoize contrast calculation
  const calculateContrast = useCallback((color1: string, color2: string) => {
    return calculateContrastRatio(color1, color2);
  }, []);
  
  // Memoize categories getter
  const getCategories = useCallback(() => {
    return getAvailableCategories();
  }, []);
  
  // Memoize category pairs getter
  const getCategoryPairs = useCallback((
    category: string,
    standard: WcagStandard = WcagStandard.AA
  ) => {
    return getColorPairsByCategory(category, standard);
  }, []);
  
  // Memoize failure checker
  const checkFailure = useCallback((background: string, foreground: string) => {
    return checkKnownFailure(background, foreground);
  }, []);
  
  // Memoize alternatives getter
  const getAlternatives = useCallback((
    category: string,
    standard: WcagStandard = WcagStandard.AA
  ) => {
    return suggestAlternatives(category, standard);
  }, []);
  
  // Memoize the return object to prevent unnecessary re-renders
  const returnValue = useMemo(() => ({
    getColorPair,
    validateCustomColors,
    calculateContrast,
    getCategories,
    getCategoryPairs,
    checkFailure,
    getAlternatives,
    WcagStandard,
    WcagSize,
  }), [
    getColorPair,
    validateCustomColors,
    calculateContrast,
    getCategories,
    getCategoryPairs,
    checkFailure,
    getAlternatives,
  ]);
  
  return returnValue;
}

/**
 * Higher-order component for automatic WCAG color injection
 * 
 * @example
 * ```typescript
 * const AccessibleButton = withWcagColors(
 *   ({ wcagColors, variant = 'primary', ...props }) => {
 *     const colors = wcagColors.getColorPair('button', variant);
 *     
 *     return (
 *       <button 
 *         className={colors?.cssClass}
 *         style={{ 
 *           backgroundColor: colors?.background,
 *           color: colors?.foreground 
 *         }}
 *         {...props}
 *       />
 *     );
 *   }
 * );
 * ```
 */
export function withWcagColors<T extends object>(
  Component: React.ComponentType<T & { wcagColors: UseWcagColorsReturn }>
) {
  return function WrappedComponent(props: T) {
    const wcagColors = useWcagColors();
    
    return createElement(Component, { ...props, wcagColors });
  };
}

/**
 * Utility hook for component-specific color validation
 * Validates colors on mount and warns in development if they fail WCAG standards
 * 
 * @param background - Background color to validate
 * @param foreground - Foreground color to validate
 * @param standard - WCAG standard to validate against
 * @param componentName - Name of component for debugging
 * 
 * @example
 * ```typescript
 * function MyComponent({ backgroundColor, textColor }: Props) {
 *   useWcagValidation(backgroundColor, textColor, WcagStandard.AA, 'MyComponent');
 *   
 *   return <div style={{ backgroundColor, color: textColor }}>Content</div>;
 * }
 * ```
 */
export function useWcagValidation(
  background: string,
  foreground: string,
  standard: WcagStandard = WcagStandard.AA,
  componentName: string = 'Component'
) {
  const { validateCustomColors, getAlternatives } = useWcagColors();
  
  useMemo(() => {
    // Only validate in development
    if (process.env.NODE_ENV !== 'development') return;
    
    const validation = validateCustomColors(background, foreground, standard);
    
    if (!validation.isValid) {
      console.warn(
        `🚨 WCAG Accessibility Warning in ${componentName}:\n` +
        `Colors ${background} + ${foreground} fail ${standard} standard.\n` +
        `${validation.recommendation}\n` +
        `Consider using pre-tested combinations from useWcagColors.`
      );
      
      // Suggest alternatives
      const alternatives = getAlternatives('button', standard);
      if (alternatives.length > 0) {
        console.info(
          `💡 Suggested accessible alternatives:\n` +
          alternatives.map(alt => `  - ${alt.cssClass}: ${alt.description}`).join('\n')
        );
      }
    }
  }, [background, foreground, standard, componentName, validateCustomColors, getAlternatives]);
}

/**
 * Hook for automatic theme-aware color selection
 * Automatically selects appropriate colors based on current theme
 * 
 * @param category - Color pair category
 * @param variant - Color pair variant
 * @param standard - WCAG standard requirement
 * @returns Color pair with theme-aware CSS variables
 * 
 * @example
 * ```typescript
 * function ThemedButton({ variant = 'primary' }: Props) {
 *   const colors = useThemeAwareColors('button', variant, WcagStandard.AA);
 *   
 *   return (
 *     <button className={colors?.cssClass}>
 *       {colors?.description}
 *     </button>
 *   );
 * }
 * ```
 */
export function useThemeAwareColors(
  category: string,
  variant: string,
  standard: WcagStandard = WcagStandard.AA
): ColorPair | undefined {
  const { getColorPair } = useWcagColors();
  
  return useMemo(() => {
    return getColorPair(category, variant, standard);
  }, [category, variant, standard, getColorPair]);
}

// Re-export types and enums for convenience
export { WcagStandard, WcagSize, type ColorPair, type WcagValidationResult };