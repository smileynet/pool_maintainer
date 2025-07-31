/**
 * Gradient System Utilities
 * 
 * Programmatic access to the gradient overlay system with TypeScript support.
 * Provides type-safe access to pool-themed gradients and visual depth effects.
 * 
 * @example
 * ```typescript
 * import { getGradient, GradientCategory, GradientVariant } from '@/utils/gradient-system';
 * 
 * // Get a specific gradient
 * const poolGradient = getGradient(GradientCategory.POOL, GradientVariant.SURFACE);
 * 
 * // Apply gradient to element
 * element.style.background = poolGradient.cssProperty;
 * ```
 */

export enum GradientCategory {
  POOL = 'pool',
  NATURE = 'nature', 
  STATUS = 'status',
  OVERLAY = 'overlay',
  INTERACTIVE = 'interactive',
  EQUIPMENT = 'equipment',
  CHART = 'chart'
}

export enum GradientVariant {
  // Pool variants
  SURFACE = 'surface',
  DEPTH = 'depth',
  SPARKLE = 'sparkle',
  
  // Nature variants
  FRESH = 'fresh',
  LAWN_TO_POOL = 'lawn-to-pool',
  FOREST_DEPTH = 'forest-depth',
  
  // Status variants
  SAFE = 'safe',
  CAUTION = 'caution',
  CRITICAL = 'critical',
  EMERGENCY = 'emergency',
  
  // Overlay variants
  LIGHT = 'light',
  MEDIUM = 'medium',
  STRONG = 'strong',
  TOP = 'top',
  BOTTOM = 'bottom',
  LEFT = 'left',
  RIGHT = 'right',
  
  // Interactive variants
  HOVER_SUBTLE = 'hover-subtle',
  HOVER_MEDIUM = 'hover-medium',
  FOCUS_RING = 'focus-ring',
  
  // Equipment variants
  RUNNING = 'running',
  MAINTENANCE = 'maintenance',
  ERROR = 'error',
  
  // Chart variants
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  ACCENT = 'accent'
}

export enum GradientDirection {
  TO_TOP = '0deg',
  TO_TOP_RIGHT = '45deg',
  TO_RIGHT = '90deg',
  TO_BOTTOM_RIGHT = '135deg',
  TO_BOTTOM = '180deg',
  TO_BOTTOM_LEFT = '225deg',
  TO_LEFT = '270deg',
  TO_TOP_LEFT = '315deg'
}

export enum GradientType {
  LINEAR = 'linear',
  RADIAL = 'radial',
  CONIC = 'conic'
}

export interface GradientDefinition {
  name: string;
  cssProperty: string;
  cssClass: string;
  category: GradientCategory;
  variant: GradientVariant;
  type: GradientType;
  direction?: GradientDirection;
  description: string;
  colorStops: string[];
  usage: string[];
  accessibility: {
    contrastSafe: boolean;
    highContrastMode: boolean;
    darkModeAdapted: boolean;
  };
  performance: {
    gpuAccelerated: boolean;
    mobileOptimized: boolean;
  };
}

/**
 * Complete gradient definitions with metadata
 */
export const GRADIENT_DEFINITIONS: GradientDefinition[] = [
  // === POOL GRADIENTS ===
  {
    name: 'Pool Surface',
    cssProperty: 'var(--gradient-pool-surface)',
    cssClass: 'gradient-pool-surface',
    category: GradientCategory.POOL,
    variant: GradientVariant.SURFACE,
    type: GradientType.LINEAR,
    direction: GradientDirection.TO_BOTTOM_RIGHT,
    description: 'Light pool water surface gradient - main brand gradient',
    colorStops: ['var(--primitive-blue-50)', 'var(--primitive-blue-100)', 'var(--primitive-blue-200)'],
    usage: ['page backgrounds', 'main content areas', 'brand headers'],
    accessibility: {
      contrastSafe: true,
      highContrastMode: true,
      darkModeAdapted: true
    },
    performance: {
      gpuAccelerated: true,
      mobileOptimized: true
    }
  },
  {
    name: 'Pool Depth',
    cssProperty: 'var(--gradient-pool-depth)',
    cssClass: 'gradient-pool-depth',
    category: GradientCategory.POOL,
    variant: GradientVariant.DEPTH,
    type: GradientType.LINEAR,
    direction: GradientDirection.TO_BOTTOM,
    description: 'Deep pool water gradient for headers and navigation',
    colorStops: ['var(--primitive-blue-100)', 'var(--primitive-blue-300)'],
    usage: ['headers', 'navigation bars', 'hero sections'],
    accessibility: {
      contrastSafe: true,
      highContrastMode: true,
      darkModeAdapted: true
    },
    performance: {
      gpuAccelerated: true,
      mobileOptimized: true
    }
  },
  {
    name: 'Pool Sparkle',
    cssProperty: 'var(--gradient-pool-sparkle)',
    cssClass: 'gradient-pool-sparkle',
    category: GradientCategory.POOL,
    variant: GradientVariant.SPARKLE,
    type: GradientType.RADIAL,
    description: 'Sparkling pool water effect for cards and highlights',
    colorStops: ['var(--primitive-blue-50)', 'var(--primitive-blue-200)', 'var(--primitive-blue-400)'],
    usage: ['card hover states', 'feature highlights', 'call-to-action areas'],
    accessibility: {
      contrastSafe: true,
      highContrastMode: false, // Simplified to solid color
      darkModeAdapted: true
    },
    performance: {
      gpuAccelerated: true,
      mobileOptimized: false // Simplified on mobile
    }
  },
  
  // === NATURE GRADIENTS ===
  {
    name: 'Nature Fresh',
    cssProperty: 'var(--gradient-nature-fresh)',
    cssClass: 'gradient-nature-fresh',
    category: GradientCategory.NATURE,
    variant: GradientVariant.FRESH,
    type: GradientType.LINEAR,
    direction: GradientDirection.TO_TOP_RIGHT,
    description: 'Fresh outdoor gradient combining green and blue',
    colorStops: ['var(--primitive-green-100)', 'var(--primitive-green-200)', 'var(--primitive-blue-100)'],
    usage: ['secondary buttons', 'sidebar backgrounds', 'natural content areas'],
    accessibility: {
      contrastSafe: true,
      highContrastMode: true,
      darkModeAdapted: true
    },
    performance: {
      gpuAccelerated: true,
      mobileOptimized: true
    }
  },
  
  // === STATUS GRADIENTS ===
  {
    name: 'Status Safe',
    cssProperty: 'var(--gradient-status-safe)',
    cssClass: 'gradient-status-safe',
    category: GradientCategory.STATUS,
    variant: GradientVariant.SAFE,
    type: GradientType.LINEAR,
    direction: GradientDirection.TO_BOTTOM_RIGHT,
    description: 'Safe status gradient - green tones for positive states',
    colorStops: ['var(--primitive-green-400)', 'var(--primitive-green-600)'],
    usage: ['success messages', 'safe status indicators', 'positive feedback'],
    accessibility: {
      contrastSafe: true,
      highContrastMode: true,
      darkModeAdapted: true
    },
    performance: {
      gpuAccelerated: true,
      mobileOptimized: true
    }
  },
  {
    name: 'Status Caution',
    cssProperty: 'var(--gradient-status-caution)',
    cssClass: 'gradient-status-caution',
    category: GradientCategory.STATUS,
    variant: GradientVariant.CAUTION,
    type: GradientType.LINEAR,
    direction: GradientDirection.TO_BOTTOM_RIGHT,
    description: 'Caution status gradient - yellow tones for warnings',
    colorStops: ['var(--primitive-yellow-400)', 'var(--primitive-yellow-600)'],
    usage: ['warning messages', 'caution indicators', 'attention-needed states'],
    accessibility: {
      contrastSafe: true,
      highContrastMode: true,
      darkModeAdapted: true
    },
    performance: {
      gpuAccelerated: true,
      mobileOptimized: true
    }
  },
  {
    name: 'Status Critical',
    cssProperty: 'var(--gradient-status-critical)',
    cssClass: 'gradient-status-critical',
    category: GradientCategory.STATUS,
    variant: GradientVariant.CRITICAL,
    type: GradientType.LINEAR,
    direction: GradientDirection.TO_BOTTOM_RIGHT,
    description: 'Critical status gradient - coral tones for errors',
    colorStops: ['var(--primitive-coral-400)', 'var(--primitive-coral-600)'],
    usage: ['error messages', 'critical alerts', 'dangerous states'],
    accessibility: {
      contrastSafe: true,
      highContrastMode: true,
      darkModeAdapted: true
    },
    performance: {
      gpuAccelerated: true,
      mobileOptimized: true
    }
  },
  {
    name: 'Status Emergency',
    cssProperty: 'var(--gradient-status-emergency)',
    cssClass: 'gradient-status-emergency',
    category: GradientCategory.STATUS,
    variant: GradientVariant.EMERGENCY,
    type: GradientType.LINEAR,
    direction: GradientDirection.TO_BOTTOM_RIGHT,
    description: 'Emergency status gradient - deep coral for urgent situations',
    colorStops: ['var(--primitive-coral-500)', 'var(--primitive-coral-700)'],
    usage: ['emergency alerts', 'urgent notifications', 'safety-critical warnings'],
    accessibility: {
      contrastSafe: true,
      highContrastMode: true,
      darkModeAdapted: true
    },
    performance: {
      gpuAccelerated: true,
      mobileOptimized: true
    }
  },
  
  // === OVERLAY GRADIENTS ===
  {
    name: 'Overlay Light',
    cssProperty: 'var(--gradient-overlay-light)',
    cssClass: 'gradient-overlay-light',
    category: GradientCategory.OVERLAY,
    variant: GradientVariant.LIGHT,
    type: GradientType.LINEAR,
    direction: GradientDirection.TO_BOTTOM,
    description: 'Light overlay for subtle content layering',
    colorStops: ['oklch(0.98 0.01 210 / 0.0)', 'oklch(0.98 0.01 210 / 0.3)'],
    usage: ['content overlays', 'text readability', 'subtle depth'],
    accessibility: {
      contrastSafe: true,
      highContrastMode: true,
      darkModeAdapted: true
    },
    performance: {
      gpuAccelerated: true,
      mobileOptimized: true
    }
  },
  {
    name: 'Overlay Medium',
    cssProperty: 'var(--gradient-overlay-medium)',
    cssClass: 'gradient-overlay-medium',
    category: GradientCategory.OVERLAY,
    variant: GradientVariant.MEDIUM,
    type: GradientType.LINEAR,
    direction: GradientDirection.TO_BOTTOM,
    description: 'Medium overlay for content separation',
    colorStops: ['oklch(0.95 0.03 210 / 0.0)', 'oklch(0.95 0.03 210 / 0.5)'],
    usage: ['section dividers', 'content grouping', 'modal backgrounds'],
    accessibility: {
      contrastSafe: true,
      highContrastMode: true,
      darkModeAdapted: true
    },
    performance: {
      gpuAccelerated: true,
      mobileOptimized: true
    }
  },
  {
    name: 'Overlay Strong',
    cssProperty: 'var(--gradient-overlay-strong)',
    cssClass: 'gradient-overlay-strong',
    category: GradientCategory.OVERLAY,
    variant: GradientVariant.STRONG,
    type: GradientType.LINEAR,
    direction: GradientDirection.TO_BOTTOM,
    description: 'Strong overlay for clear content hierarchy',
    colorStops: ['oklch(0.18 0.00 0 / 0.0)', 'oklch(0.18 0.00 0 / 0.7)'],
    usage: ['image overlays', 'hero text backgrounds', 'modal backdrops'],
    accessibility: {
      contrastSafe: true,
      highContrastMode: true,
      darkModeAdapted: true
    },
    performance: {
      gpuAccelerated: true,
      mobileOptimized: true
    }
  }
];

/**
 * Get a gradient definition by category and variant
 * 
 * @param category - Gradient category
 * @param variant - Gradient variant
 * @returns GradientDefinition or undefined if not found
 */
export function getGradient(
  category: GradientCategory,
  variant: GradientVariant
): GradientDefinition | undefined {
  return GRADIENT_DEFINITIONS.find(
    grad => grad.category === category && grad.variant === variant
  );
}

/**
 * Get all gradients in a specific category
 * 
 * @param category - Gradient category to filter by
 * @returns Array of gradient definitions
 */
export function getGradientsByCategory(category: GradientCategory): GradientDefinition[] {
  return GRADIENT_DEFINITIONS.filter(grad => grad.category === category);
}

/**
 * Get gradients suitable for a specific use case
 * 
 * @param usage - Intended usage (e.g., 'headers', 'buttons', 'overlays')
 * @returns Array of gradient definitions
 */
export function getGradientsByUsage(usage: string): GradientDefinition[] {
  return GRADIENT_DEFINITIONS.filter(grad => 
    grad.usage.some(use => use.toLowerCase().includes(usage.toLowerCase()))
  );
}

/**
 * Get accessibility-compliant gradients
 * 
 * @param requireHighContrast - Whether high contrast mode support is required
 * @param requireDarkMode - Whether dark mode adaptation is required
 * @returns Array of accessible gradient definitions
 */
export function getAccessibleGradients(
  requireHighContrast: boolean = false,
  requireDarkMode: boolean = false
): GradientDefinition[] {
  return GRADIENT_DEFINITIONS.filter(grad => {
    const meetsHighContrast = !requireHighContrast || grad.accessibility.highContrastMode;
    const meetsDarkMode = !requireDarkMode || grad.accessibility.darkModeAdapted;
    
    return grad.accessibility.contrastSafe && meetsHighContrast && meetsDarkMode;
  });
}

/**
 * Get performance-optimized gradients
 * 
 * @param requireMobileOptimized - Whether mobile optimization is required
 * @param requireGpuAccelerated - Whether GPU acceleration is required
 * @returns Array of performance-optimized gradient definitions
 */
export function getPerformantGradients(
  requireMobileOptimized: boolean = false,
  requireGpuAccelerated: boolean = false
): GradientDefinition[] {
  return GRADIENT_DEFINITIONS.filter(grad => {
    const meetsMobile = !requireMobileOptimized || grad.performance.mobileOptimized;
    const meetsGpu = !requireGpuAccelerated || grad.performance.gpuAccelerated;
    
    return meetsMobile && meetsGpu;
  });
}

/**
 * Get available gradient categories
 * 
 * @returns Array of all gradient categories
 */
export function getGradientCategories(): GradientCategory[] {
  return Object.values(GradientCategory);
}

/**
 * Get available gradient variants for a category
 * 
 * @param category - Gradient category
 * @returns Array of variants available in the category
 */
export function getGradientVariants(category: GradientCategory): GradientVariant[] {
  const categoryGradients = getGradientsByCategory(category);
  return categoryGradients.map(grad => grad.variant);
}

/**
 * Create a custom gradient CSS property
 * 
 * @param type - Gradient type (linear, radial, conic)
 * @param direction - Gradient direction (for linear gradients)
 * @param colorStops - Array of color stops
 * @returns CSS gradient string
 */
export function createCustomGradient(
  type: GradientType,
  direction: GradientDirection | string,
  colorStops: string[]
): string {
  const stopsString = colorStops.join(', ');
  
  switch (type) {
    case GradientType.LINEAR:
      return `linear-gradient(${direction}, ${stopsString})`;
    case GradientType.RADIAL:
      return `radial-gradient(${stopsString})`;
    case GradientType.CONIC:
      return `conic-gradient(${stopsString})`;
    default:
      return `linear-gradient(${direction}, ${stopsString})`;
  }
}

/**
 * Validate gradient accessibility
 * 
 * @param gradient - Gradient definition to validate
 * @param requirements - Accessibility requirements
 * @returns Validation result with recommendations
 */
export function validateGradientAccessibility(
  gradient: GradientDefinition,
  requirements: {
    highContrastMode?: boolean;
    darkModeSupport?: boolean;
    contrastSafe?: boolean;
  } = {}
): {
  isValid: boolean;
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];
  
  if (requirements.contrastSafe && !gradient.accessibility.contrastSafe) {
    issues.push('Gradient may not provide sufficient contrast for text');
    recommendations.push('Consider using a darker gradient or adding text overlays');
  }
  
  if (requirements.highContrastMode && !gradient.accessibility.highContrastMode) {
    issues.push('Gradient does not support high contrast mode');
    recommendations.push('Provide a solid color fallback for high contrast environments');
  }
  
  if (requirements.darkModeSupport && !gradient.accessibility.darkModeAdapted) {
    issues.push('Gradient is not adapted for dark mode');
    recommendations.push('Create dark mode variants with appropriate lightness adjustments');
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    recommendations
  };
}

/**
 * Get gradient recommendations based on context
 * 
 * @param context - Usage context information
 * @returns Array of recommended gradient definitions
 */
export function getGradientRecommendations(context: {
  usage: string;
  accessibility?: {
    highContrast?: boolean;
    darkMode?: boolean;
  };
  performance?: {
    mobile?: boolean;
    gpuAcceleration?: boolean;
  };
}): GradientDefinition[] {
  let candidates = getGradientsByUsage(context.usage);
  
  if (context.accessibility) {
    candidates = candidates.filter(grad => {
      const meetsHighContrast = !context.accessibility?.highContrast || 
        grad.accessibility.highContrastMode;
      const meetsDarkMode = !context.accessibility?.darkMode || 
        grad.accessibility.darkModeAdapted;
      
      return meetsHighContrast && meetsDarkMode;
    });
  }
  
  if (context.performance) {
    candidates = candidates.filter(grad => {
      const meetsMobile = !context.performance?.mobile || 
        grad.performance.mobileOptimized;
      const meetsGpu = !context.performance?.gpuAcceleration || 
        grad.performance.gpuAccelerated;
      
      return meetsMobile && meetsGpu;
    });
  }
  
  return candidates.slice(0, 3); // Return top 3 recommendations
}

// Export types for external use
export type { GradientDefinition };