import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'

// Theme configuration types
export type ThemeMode = 'light' | 'dark' | 'system'
export type ThemeVariant = 'default' | 'ocean' | 'sunset' | 'forest' | 'aurora'
export type ContrastMode = 'normal' | 'high' | 'system'
export type MotionMode = 'normal' | 'reduced' | 'system'

export interface ThemeConfig {
  mode: ThemeMode
  variant: ThemeVariant
  contrast: ContrastMode
  motion: MotionMode
  fontScale: number
  dyslexicFont: boolean
}

export interface SafetyTheme {
  safeColor: string
  cautionColor: string
  criticalColor: string
  emergencyColor: string
  backgroundContrast: 'low' | 'medium' | 'high'
}

// Default theme configuration - Light mode for outdoor visibility
const defaultThemeConfig: ThemeConfig = {
  mode: 'light',
  variant: 'default',
  contrast: 'normal',
  motion: 'system',
  fontScale: 1.0,
  dyslexicFont: false,
}

// Theme context
interface ThemeContextType {
  config: ThemeConfig
  updateTheme: (updates: Partial<ThemeConfig>) => void
  safetyTheme: SafetyTheme
  isDarkMode: boolean
  isHighContrast: boolean
  isReducedMotion: boolean
  currentVariant: ThemeVariant
  resetToDefaults: () => void
  isMobile: boolean
  isTablet: boolean
  viewportWidth: number
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Custom hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// Utility functions for detecting system preferences
const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const getSystemContrast = (): 'normal' | 'high' => {
  if (typeof window === 'undefined') return 'normal'
  return window.matchMedia('(prefers-contrast: high)').matches ? 'high' : 'normal'
}

const getSystemMotion = (): 'normal' | 'reduced' => {
  if (typeof window === 'undefined') return 'normal'
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'reduced' : 'normal'
}

// Safety theme calculation based on current theme state
const calculateSafetyTheme = (isDark: boolean, isHighContrast: boolean): SafetyTheme => {
  if (isHighContrast) {
    return {
      safeColor: isDark ? '#22c55e' : '#15803d',
      cautionColor: isDark ? '#fbbf24' : '#ca8a04', 
      criticalColor: isDark ? '#f87171' : '#b91c1c',
      emergencyColor: isDark ? '#ef4444' : '#7f1d1d',
      backgroundContrast: 'high',
    }
  }

  if (isDark) {
    return {
      safeColor: '#22c55e',
      cautionColor: '#fbbf24',
      criticalColor: '#f87171',
      emergencyColor: '#ef4444',
      backgroundContrast: 'medium',
    }
  }

  return {
    safeColor: '#10b981',
    cautionColor: '#f59e0b',
    criticalColor: '#ef4444',
    emergencyColor: '#991b1b',
    backgroundContrast: 'low',
  }
}

// Theme provider component
interface ThemeProviderProps {
  children: ReactNode
  defaultConfig?: Partial<ThemeConfig>
  storageKey?: string
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultConfig = {},
  storageKey = 'pool-maintenance-theme',
}) => {
  // Initialize theme configuration
  const [config, setConfig] = useState<ThemeConfig>(() => {
    if (typeof window === 'undefined') {
      return { ...defaultThemeConfig, ...defaultConfig }
    }

    try {
      const stored = localStorage.getItem(storageKey)
      const storedConfig = stored ? JSON.parse(stored) : {}
      return { ...defaultThemeConfig, ...defaultConfig, ...storedConfig }
    } catch {
      return { ...defaultThemeConfig, ...defaultConfig }
    }
  })

  // Calculate effective theme states
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isHighContrast, setIsHighContrast] = useState(false)
  const [isReducedMotion, setIsReducedMotion] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [viewportWidth, setViewportWidth] = useState(0)

  // Mobile viewport detection
  useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth
      setViewportWidth(width)
      setIsMobile(width < 640)
      setIsTablet(width >= 640 && width < 1024)
    }

    updateViewport()
    window.addEventListener('resize', updateViewport)

    return () => window.removeEventListener('resize', updateViewport)
  }, [])

  // Update theme function
  const updateTheme = (updates: Partial<ThemeConfig>) => {
    const newConfig = { ...config, ...updates }
    setConfig(newConfig)
    
    try {
      localStorage.setItem(storageKey, JSON.stringify(newConfig))
    } catch (error) {
      console.warn('Failed to save theme configuration:', error)
    }
  }

  // Reset to defaults
  const resetToDefaults = () => {
    const resetConfig = { ...defaultThemeConfig, ...defaultConfig }
    setConfig(resetConfig)
    
    try {
      localStorage.setItem(storageKey, JSON.stringify(resetConfig))
    } catch (error) {
      console.warn('Failed to save theme configuration:', error)
    }
  }

  // Calculate safety theme
  const safetyTheme = calculateSafetyTheme(isDarkMode, isHighContrast)

  // Effect to handle system preference changes and apply theme
  useEffect(() => {
    const updateEffectiveTheme = () => {
      // Calculate dark mode
      const effectiveDarkMode = config.mode === 'system' 
        ? getSystemTheme() === 'dark'
        : config.mode === 'dark'
      
      // Calculate high contrast
      const effectiveHighContrast = config.contrast === 'system'
        ? getSystemContrast() === 'high'
        : config.contrast === 'high'
      
      // Calculate reduced motion
      const effectiveReducedMotion = config.motion === 'system'
        ? getSystemMotion() === 'reduced'
        : config.motion === 'reduced'

      setIsDarkMode(effectiveDarkMode)
      setIsHighContrast(effectiveHighContrast)
      setIsReducedMotion(effectiveReducedMotion)

      // Apply theme classes to document
      const root = document.documentElement
      
      // Add theme switching class to prevent flash
      root.classList.add('theme-switching')
      
      // Dark mode class (legacy support)
      root.classList.toggle('dark', effectiveDarkMode)
      
      // New data-theme attribute for OKLCH variables
      root.setAttribute('data-theme', effectiveDarkMode ? 'dark' : 'light')
      
      // Theme variant attribute for vibrant themes
      root.setAttribute('data-theme-variant', config.variant)
      
      // High contrast class
      root.classList.toggle('high-contrast', effectiveHighContrast)
      
      // Reduced motion class
      root.classList.toggle('reduced-motion', effectiveReducedMotion)
      
      // Dyslexic font class
      root.classList.toggle('dyslexic-font', config.dyslexicFont)
      
      // Font scale CSS custom property
      root.style.setProperty('--font-scale', config.fontScale.toString())
      
      // Mobile-specific attributes
      root.setAttribute('data-viewport', isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop')
      root.classList.toggle('touch-device', 'ontouchstart' in window)
      
      // Mobile-optimized font scale
      if (isMobile) {
        const mobileScale = Math.max(config.fontScale, 1.0) // Ensure minimum 1.0 scale on mobile
        root.style.setProperty('--mobile-font-scale', mobileScale.toString())
      }
      
      // Remove theme switching class after transitions
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          root.classList.remove('theme-switching')
        })
      })
    }

    updateEffectiveTheme()

    // Set up media query listeners for system preferences
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const contrastQuery = window.matchMedia('(prefers-contrast: high)')
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const handleChange = () => updateEffectiveTheme()
    
    darkModeQuery.addEventListener('change', handleChange)
    contrastQuery.addEventListener('change', handleChange)
    motionQuery.addEventListener('change', handleChange)

    return () => {
      darkModeQuery.removeEventListener('change', handleChange)
      contrastQuery.removeEventListener('change', handleChange)
      motionQuery.removeEventListener('change', handleChange)
    }
  }, [config, isMobile, isTablet])

  // Context value
  const value: ThemeContextType = {
    config,
    updateTheme,
    safetyTheme,
    isDarkMode,
    isHighContrast,
    isReducedMotion,
    currentVariant: config.variant,
    resetToDefaults,
    isMobile,
    isTablet,
    viewportWidth,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

// Utility hook for safety-critical color decisions
export const useSafetyColors = () => {
  const { safetyTheme } = useTheme()
  
  const getSafetyColor = (status: 'safe' | 'caution' | 'critical' | 'emergency') => {
    switch (status) {
      case 'safe':
        return safetyTheme.safeColor
      case 'caution':
        return safetyTheme.cautionColor
      case 'critical':
        return safetyTheme.criticalColor
      case 'emergency':
        return safetyTheme.emergencyColor
      default:
        return safetyTheme.safeColor
    }
  }

  const getSafetyTextColor = (_status: 'safe' | 'caution' | 'critical' | 'emergency') => {
    // Always return white text for safety colors to ensure readability
    return '#ffffff'
  }

  const getSafetyBackgroundColor = (status: 'safe' | 'caution' | 'critical' | 'emergency') => {
    // const baseColor = getSafetyColor(status) // Unused for now
    
    // Return lighter background variants for backgrounds
    switch (status) {
      case 'safe':
        return safetyTheme.backgroundContrast === 'high' ? '#ecfdf5' : '#f0fdf4'
      case 'caution':
        return safetyTheme.backgroundContrast === 'high' ? '#fffbeb' : '#fefce8'
      case 'critical':
        return safetyTheme.backgroundContrast === 'high' ? '#fef2f2' : '#fef2f2'
      case 'emergency':
        return safetyTheme.backgroundContrast === 'high' ? '#fef2f2' : '#fef2f2'
      default:
        return '#f8fafc'
    }
  }

  return {
    getSafetyColor,
    getSafetyTextColor,
    getSafetyBackgroundColor,
    safetyTheme,
  }
}

// Utility hook for chemical status styling
export const useChemicalStatusColors = () => {
  const { getSafetyColor, getSafetyBackgroundColor } = useSafetyColors()
  
  const getChemicalStatusStyle = (status: 'compliant' | 'warning' | 'critical' | 'emergency') => {
    const safetyStatus = status === 'compliant' ? 'safe' : 
                        status === 'warning' ? 'caution' : 
                        status === 'critical' ? 'critical' : 'emergency'
    
    return {
      color: getSafetyColor(safetyStatus),
      backgroundColor: getSafetyBackgroundColor(safetyStatus),
      borderColor: getSafetyColor(safetyStatus),
    }
  }

  const getChemicalStatusClasses = (status: 'compliant' | 'warning' | 'critical' | 'emergency') => {
    switch (status) {
      case 'compliant':
        return 'text-success bg-success/10 border-success/20'
      case 'warning':
        return 'text-warning bg-warning/10 border-warning/20'
      case 'critical':
        return 'text-destructive bg-destructive/10 border-destructive/20'
      case 'emergency':
        return 'text-destructive bg-destructive/20 border-destructive/30 font-bold'
      default:
        return 'text-muted-foreground bg-muted/10 border-muted/20'
    }
  }

  return {
    getChemicalStatusStyle,
    getChemicalStatusClasses,
  }
}

export default ThemeProvider