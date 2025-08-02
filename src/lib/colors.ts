import { oklch, formatCss, type Color } from 'culori'

/**
 * OKLCH Color System for Pool Maintenance System
 * 
 * OKLCH provides perceptual uniformity and predictable contrast relationships.
 * Format: oklch(lightness chroma hue)
 * - Lightness: 0-1 (0 = black, 1 = white)
 * - Chroma: 0-0.4 (saturation intensity)
 * - Hue: 0-360 (color wheel degrees)
 */

// Base color definitions using OKLCH
export const baseColors = {
  // Primary: Blue (pool water theme)
  primary: {
    50: oklch({ l: 0.97, c: 0.02, h: 220 }),
    100: oklch({ l: 0.93, c: 0.05, h: 220 }),
    200: oklch({ l: 0.85, c: 0.10, h: 220 }),
    300: oklch({ l: 0.75, c: 0.15, h: 220 }),
    400: oklch({ l: 0.65, c: 0.20, h: 220 }),
    500: oklch({ l: 0.55, c: 0.25, h: 220 }), // Base primary
    600: oklch({ l: 0.45, c: 0.25, h: 220 }),
    700: oklch({ l: 0.35, c: 0.25, h: 220 }),
    800: oklch({ l: 0.25, c: 0.20, h: 220 }),
    900: oklch({ l: 0.15, c: 0.15, h: 220 }),
    950: oklch({ l: 0.08, c: 0.10, h: 220 }),
  },

  // Neutral/Gray scale
  neutral: {
    50: oklch({ l: 0.98, c: 0.00, h: 0 }),
    100: oklch({ l: 0.95, c: 0.00, h: 0 }),
    200: oklch({ l: 0.90, c: 0.00, h: 0 }),
    300: oklch({ l: 0.80, c: 0.00, h: 0 }),
    400: oklch({ l: 0.65, c: 0.00, h: 0 }),
    500: oklch({ l: 0.50, c: 0.00, h: 0 }),
    600: oklch({ l: 0.40, c: 0.00, h: 0 }),
    700: oklch({ l: 0.30, c: 0.00, h: 0 }),
    800: oklch({ l: 0.20, c: 0.00, h: 0 }),
    900: oklch({ l: 0.10, c: 0.00, h: 0 }),
    950: oklch({ l: 0.05, c: 0.00, h: 0 }),
  },

  // Success: Green (safe chemical levels)
  success: {
    50: oklch({ l: 0.96, c: 0.02, h: 145 }),
    100: oklch({ l: 0.90, c: 0.05, h: 145 }),
    200: oklch({ l: 0.82, c: 0.10, h: 145 }),
    300: oklch({ l: 0.72, c: 0.15, h: 145 }),
    400: oklch({ l: 0.62, c: 0.18, h: 145 }),
    500: oklch({ l: 0.52, c: 0.20, h: 145 }), // Base success
    600: oklch({ l: 0.42, c: 0.20, h: 145 }),
    700: oklch({ l: 0.32, c: 0.18, h: 145 }),
    800: oklch({ l: 0.22, c: 0.15, h: 145 }),
    900: oklch({ l: 0.14, c: 0.10, h: 145 }),
    950: oklch({ l: 0.08, c: 0.08, h: 145 }),
  },

  // Warning: Yellow/Orange (caution levels)
  warning: {
    50: oklch({ l: 0.97, c: 0.02, h: 85 }),
    100: oklch({ l: 0.92, c: 0.05, h: 85 }),
    200: oklch({ l: 0.84, c: 0.10, h: 85 }),
    300: oklch({ l: 0.76, c: 0.15, h: 85 }),
    400: oklch({ l: 0.68, c: 0.18, h: 85 }),
    500: oklch({ l: 0.60, c: 0.20, h: 85 }), // Base warning
    600: oklch({ l: 0.50, c: 0.20, h: 85 }),
    700: oklch({ l: 0.40, c: 0.18, h: 85 }),
    800: oklch({ l: 0.30, c: 0.15, h: 85 }),
    900: oklch({ l: 0.20, c: 0.10, h: 85 }),
    950: oklch({ l: 0.12, c: 0.08, h: 85 }),
  },

  // Destructive: Red (critical/dangerous levels)
  destructive: {
    50: oklch({ l: 0.97, c: 0.02, h: 25 }),
    100: oklch({ l: 0.92, c: 0.05, h: 25 }),
    200: oklch({ l: 0.84, c: 0.10, h: 25 }),
    300: oklch({ l: 0.74, c: 0.15, h: 25 }),
    400: oklch({ l: 0.64, c: 0.18, h: 25 }),
    500: oklch({ l: 0.54, c: 0.20, h: 25 }), // Base destructive
    600: oklch({ l: 0.44, c: 0.20, h: 25 }),
    700: oklch({ l: 0.34, c: 0.18, h: 25 }),
    800: oklch({ l: 0.24, c: 0.15, h: 25 }),
    900: oklch({ l: 0.16, c: 0.10, h: 25 }),
    950: oklch({ l: 0.09, c: 0.08, h: 25 }),
  },
}

// Semantic color tokens for light theme
export const lightTheme = {
  // Background colors
  background: baseColors.neutral[50],
  foreground: baseColors.neutral[900],
  
  // Card/surface colors
  card: baseColors.neutral[50],
  cardForeground: baseColors.neutral[900],
  
  // Popup/overlay colors
  popover: baseColors.neutral[50],
  popoverForeground: baseColors.neutral[900],
  
  // Primary brand colors
  primary: baseColors.primary[500],
  primaryForeground: baseColors.neutral[50],
  
  // Secondary/muted colors
  secondary: baseColors.neutral[100],
  secondaryForeground: baseColors.neutral[900],
  
  // Muted/subtle colors
  muted: baseColors.neutral[100],
  mutedForeground: baseColors.neutral[500],
  
  // Accent colors
  accent: baseColors.neutral[100],
  accentForeground: baseColors.neutral[900],
  
  // Destructive colors
  destructive: baseColors.destructive[500],
  destructiveForeground: baseColors.neutral[50],
  
  // Success colors
  success: baseColors.success[500],
  successForeground: baseColors.neutral[50],
  
  // Warning colors
  warning: baseColors.warning[500],
  warningForeground: baseColors.neutral[900],
  
  // Border colors
  border: baseColors.neutral[200],
  input: baseColors.neutral[200],
  
  // Ring/focus colors
  ring: baseColors.primary[500],
}

// Semantic color tokens for dark theme
export const darkTheme = {
  // Background colors
  background: baseColors.neutral[950],
  foreground: baseColors.neutral[50],
  
  // Card/surface colors
  card: baseColors.neutral[950],
  cardForeground: baseColors.neutral[50],
  
  // Popup/overlay colors
  popover: baseColors.neutral[950],
  popoverForeground: baseColors.neutral[50],
  
  // Primary brand colors
  primary: baseColors.primary[400],
  primaryForeground: baseColors.neutral[900],
  
  // Secondary/muted colors
  secondary: baseColors.neutral[800],
  secondaryForeground: baseColors.neutral[50],
  
  // Muted/subtle colors
  muted: baseColors.neutral[800],
  mutedForeground: baseColors.neutral[400],
  
  // Accent colors
  accent: baseColors.neutral[800],
  accentForeground: baseColors.neutral[50],
  
  // Destructive colors
  destructive: baseColors.destructive[400],
  destructiveForeground: baseColors.neutral[50],
  
  // Success colors
  success: baseColors.success[400],
  successForeground: baseColors.neutral[900],
  
  // Warning colors
  warning: baseColors.warning[400],
  warningForeground: baseColors.neutral[900],
  
  // Border colors
  border: baseColors.neutral[800],
  input: baseColors.neutral[800],
  
  // Ring/focus colors
  ring: baseColors.primary[400],
}

// Utility function to convert OKLCH colors to CSS format
export function toCSS(color: Color): string {
  return formatCss(color)
}

// Export color scales for CSS variable generation
export const colorScales = {
  primary: baseColors.primary,
  neutral: baseColors.neutral,
  success: baseColors.success,
  warning: baseColors.warning,
  destructive: baseColors.destructive,
}

// Vibrant theme palettes for modern dynamic theming
export const vibrantThemes = {
  // Ocean theme - Deep blues, teals, aqua
  ocean: {
    primary: {
      50: oklch({ l: 0.97, c: 0.03, h: 200 }),
      100: oklch({ l: 0.93, c: 0.08, h: 200 }),
      200: oklch({ l: 0.85, c: 0.15, h: 200 }),
      300: oklch({ l: 0.75, c: 0.22, h: 200 }),
      400: oklch({ l: 0.65, c: 0.28, h: 200 }),
      500: oklch({ l: 0.55, c: 0.32, h: 200 }), // Base ocean
      600: oklch({ l: 0.45, c: 0.30, h: 200 }),
      700: oklch({ l: 0.35, c: 0.28, h: 200 }),
      800: oklch({ l: 0.25, c: 0.25, h: 200 }),
      900: oklch({ l: 0.15, c: 0.18, h: 200 }),
      950: oklch({ l: 0.08, c: 0.12, h: 200 }),
    },
    accent: {
      50: oklch({ l: 0.96, c: 0.03, h: 180 }),
      100: oklch({ l: 0.90, c: 0.08, h: 180 }),
      200: oklch({ l: 0.82, c: 0.15, h: 180 }),
      300: oklch({ l: 0.72, c: 0.22, h: 180 }),
      400: oklch({ l: 0.62, c: 0.28, h: 180 }),
      500: oklch({ l: 0.52, c: 0.30, h: 180 }), // Teal accent
      600: oklch({ l: 0.42, c: 0.28, h: 180 }),
      700: oklch({ l: 0.32, c: 0.25, h: 180 }),
      800: oklch({ l: 0.22, c: 0.20, h: 180 }),
      900: oklch({ l: 0.14, c: 0.15, h: 180 }),
      950: oklch({ l: 0.08, c: 0.10, h: 180 }),
    }
  },

  // Sunset theme - Warm oranges, pinks, corals
  sunset: {
    primary: {
      50: oklch({ l: 0.97, c: 0.03, h: 25 }),
      100: oklch({ l: 0.93, c: 0.08, h: 25 }),
      200: oklch({ l: 0.85, c: 0.15, h: 25 }),
      300: oklch({ l: 0.75, c: 0.22, h: 25 }),
      400: oklch({ l: 0.65, c: 0.28, h: 25 }),
      500: oklch({ l: 0.58, c: 0.32, h: 25 }), // Base sunset orange
      600: oklch({ l: 0.48, c: 0.30, h: 25 }),
      700: oklch({ l: 0.38, c: 0.28, h: 25 }),
      800: oklch({ l: 0.28, c: 0.25, h: 25 }),
      900: oklch({ l: 0.18, c: 0.18, h: 25 }),
      950: oklch({ l: 0.10, c: 0.12, h: 25 }),
    },
    accent: {
      50: oklch({ l: 0.96, c: 0.03, h: 350 }),
      100: oklch({ l: 0.90, c: 0.08, h: 350 }),
      200: oklch({ l: 0.82, c: 0.15, h: 350 }),
      300: oklch({ l: 0.72, c: 0.22, h: 350 }),
      400: oklch({ l: 0.62, c: 0.28, h: 350 }),
      500: oklch({ l: 0.55, c: 0.30, h: 350 }), // Pink accent
      600: oklch({ l: 0.45, c: 0.28, h: 350 }),
      700: oklch({ l: 0.35, c: 0.25, h: 350 }),
      800: oklch({ l: 0.25, c: 0.20, h: 350 }),
      900: oklch({ l: 0.16, c: 0.15, h: 350 }),
      950: oklch({ l: 0.09, c: 0.10, h: 350 }),
    }
  },

  // Forest theme - Rich greens, emeralds
  forest: {
    primary: {
      50: oklch({ l: 0.97, c: 0.03, h: 145 }),
      100: oklch({ l: 0.93, c: 0.08, h: 145 }),
      200: oklch({ l: 0.85, c: 0.15, h: 145 }),
      300: oklch({ l: 0.75, c: 0.22, h: 145 }),
      400: oklch({ l: 0.65, c: 0.28, h: 145 }),
      500: oklch({ l: 0.52, c: 0.32, h: 145 }), // Base forest green
      600: oklch({ l: 0.42, c: 0.30, h: 145 }),
      700: oklch({ l: 0.32, c: 0.28, h: 145 }),
      800: oklch({ l: 0.22, c: 0.25, h: 145 }),
      900: oklch({ l: 0.14, c: 0.18, h: 145 }),
      950: oklch({ l: 0.08, c: 0.12, h: 145 }),
    },
    accent: {
      50: oklch({ l: 0.96, c: 0.03, h: 165 }),
      100: oklch({ l: 0.90, c: 0.08, h: 165 }),
      200: oklch({ l: 0.82, c: 0.15, h: 165 }),
      300: oklch({ l: 0.72, c: 0.22, h: 165 }),
      400: oklch({ l: 0.62, c: 0.28, h: 165 }),
      500: oklch({ l: 0.50, c: 0.30, h: 165 }), // Emerald accent
      600: oklch({ l: 0.40, c: 0.28, h: 165 }),
      700: oklch({ l: 0.30, c: 0.25, h: 165 }),
      800: oklch({ l: 0.20, c: 0.20, h: 165 }),
      900: oklch({ l: 0.13, c: 0.15, h: 165 }),
      950: oklch({ l: 0.07, c: 0.10, h: 165 }),
    }
  },

  // Aurora theme - Purple, cyan, magenta
  aurora: {
    primary: {
      50: oklch({ l: 0.97, c: 0.03, h: 280 }),
      100: oklch({ l: 0.93, c: 0.08, h: 280 }),
      200: oklch({ l: 0.85, c: 0.15, h: 280 }),
      300: oklch({ l: 0.75, c: 0.22, h: 280 }),
      400: oklch({ l: 0.65, c: 0.28, h: 280 }),
      500: oklch({ l: 0.55, c: 0.32, h: 280 }), // Base aurora purple
      600: oklch({ l: 0.45, c: 0.30, h: 280 }),
      700: oklch({ l: 0.35, c: 0.28, h: 280 }),
      800: oklch({ l: 0.25, c: 0.25, h: 280 }),
      900: oklch({ l: 0.15, c: 0.18, h: 280 }),
      950: oklch({ l: 0.08, c: 0.12, h: 280 }),
    },
    accent: {
      50: oklch({ l: 0.96, c: 0.03, h: 200 }),
      100: oklch({ l: 0.90, c: 0.08, h: 200 }),
      200: oklch({ l: 0.82, c: 0.15, h: 200 }),
      300: oklch({ l: 0.72, c: 0.22, h: 200 }),
      400: oklch({ l: 0.62, c: 0.28, h: 200 }),
      500: oklch({ l: 0.52, c: 0.30, h: 200 }), // Cyan accent
      600: oklch({ l: 0.42, c: 0.28, h: 200 }),
      700: oklch({ l: 0.32, c: 0.25, h: 200 }),
      800: oklch({ l: 0.22, c: 0.20, h: 200 }),
      900: oklch({ l: 0.14, c: 0.15, h: 200 }),
      950: oklch({ l: 0.08, c: 0.10, h: 200 }),
    }
  }
}

// Create vibrant theme semantic tokens
export const createVibrantTheme = (themeName: keyof typeof vibrantThemes, isDark = false) => {
  const palette = vibrantThemes[themeName]
  
  if (isDark) {
    return {
      // Background colors
      background: baseColors.neutral[950],
      foreground: baseColors.neutral[50],
      
      // Card/surface colors with subtle theme tinting
      card: oklch({ l: 0.05, c: 0.01, h: palette.primary[500].h || 0 }),
      cardForeground: baseColors.neutral[50],
      
      // Popup/overlay colors
      popover: oklch({ l: 0.08, c: 0.02, h: palette.primary[500].h || 0 }),
      popoverForeground: baseColors.neutral[50],
      
      // Primary brand colors
      primary: palette.primary[400],
      primaryForeground: baseColors.neutral[900],
      
      // Secondary/muted colors with theme tinting
      secondary: oklch({ l: 0.20, c: 0.02, h: palette.primary[500].h || 0 }),
      secondaryForeground: baseColors.neutral[50],
      
      // Muted/subtle colors
      muted: oklch({ l: 0.20, c: 0.02, h: palette.primary[500].h || 0 }),
      mutedForeground: baseColors.neutral[400],
      
      // Accent colors
      accent: palette.accent[400],
      accentForeground: baseColors.neutral[900],
      
      // Status colors remain consistent
      destructive: baseColors.destructive[400],
      destructiveForeground: baseColors.neutral[50],
      success: baseColors.success[400],
      successForeground: baseColors.neutral[900],
      warning: baseColors.warning[400],
      warningForeground: baseColors.neutral[900],
      
      // Border colors with theme tinting
      border: oklch({ l: 0.20, c: 0.03, h: palette.primary[500].h || 0 }),
      input: oklch({ l: 0.20, c: 0.03, h: palette.primary[500].h || 0 }),
      
      // Ring/focus colors
      ring: palette.primary[400],
    }
  }
  
  // Light theme
  return {
    // Background colors
    background: baseColors.neutral[50],
    foreground: baseColors.neutral[900],
    
    // Card/surface colors with subtle theme tinting
    card: oklch({ l: 0.98, c: 0.005, h: palette.primary[500].h || 0 }),
    cardForeground: baseColors.neutral[900],
    
    // Popup/overlay colors
    popover: oklch({ l: 0.97, c: 0.01, h: palette.primary[500].h || 0 }),
    popoverForeground: baseColors.neutral[900],
    
    // Primary brand colors
    primary: palette.primary[500],
    primaryForeground: baseColors.neutral[50],
    
    // Secondary/muted colors with theme tinting
    secondary: oklch({ l: 0.95, c: 0.01, h: palette.primary[500].h || 0 }),
    secondaryForeground: baseColors.neutral[900],
    
    // Muted/subtle colors
    muted: oklch({ l: 0.95, c: 0.01, h: palette.primary[500].h || 0 }),
    mutedForeground: baseColors.neutral[500],
    
    // Accent colors
    accent: palette.accent[500],
    accentForeground: baseColors.neutral[50],
    
    // Status colors remain consistent
    destructive: baseColors.destructive[500],
    destructiveForeground: baseColors.neutral[50],
    success: baseColors.success[500],
    successForeground: baseColors.neutral[50],
    warning: baseColors.warning[500],
    warningForeground: baseColors.neutral[900],
    
    // Border colors with theme tinting
    border: oklch({ l: 0.90, c: 0.02, h: palette.primary[500].h || 0 }),
    input: oklch({ l: 0.90, c: 0.02, h: palette.primary[500].h || 0 }),
    
    // Ring/focus colors
    ring: palette.primary[500],
  }
}

// Pool-specific semantic colors
export const poolColors = {
  safe: baseColors.success[500],      // Chemical levels in safe range
  caution: baseColors.warning[500],   // Chemical levels need attention
  critical: baseColors.destructive[500], // Chemical levels dangerous
  unknown: baseColors.neutral[400],   // No recent test data
}