import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'
type ThemeVariant = 'default' | 'ocean' | 'sunset' | 'forest' | 'aurora'

interface ThemeConfig {
  theme: Theme
  variant: ThemeVariant
  reducedMotion?: boolean
  highContrast?: boolean
}

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'light' | 'dark'
  variant: ThemeVariant
  setVariant: (variant: ThemeVariant) => void
  config: ThemeConfig
  updateConfig: (config: Partial<ThemeConfig>) => void
  isMobile: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  defaultVariant?: ThemeVariant
  storageKey?: string
}

const STORAGE_KEY = 'pool-maintenance-theme-config'

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  defaultVariant = 'default',
  storageKey = STORAGE_KEY,
}: ThemeProviderProps) {
  const [config, setConfig] = useState<ThemeConfig>({
    theme: defaultTheme,
    variant: defaultVariant,
    reducedMotion: false,
    highContrast: false,
  })
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Load config from localStorage on mount
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem(storageKey)
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig) as ThemeConfig
        if (parsed.theme && ['light', 'dark', 'system'].includes(parsed.theme)) {
          setConfig(prev => ({ ...prev, ...parsed }))
        }
      }
    } catch (error) {
      console.warn('Failed to load theme config from localStorage:', error)
    }

    // Check accessibility preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches
    
    setConfig(prev => ({
      ...prev,
      reducedMotion: prefersReducedMotion,
      highContrast: prefersHighContrast,
    }))
  }, [storageKey])

  // Resolve theme and apply to document
  useEffect(() => {
    const resolveTheme = () => {
      if (config.theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        return systemTheme
      }
      return config.theme
    }

    const resolved = resolveTheme()
    setResolvedTheme(resolved)

    // Apply theme and variant to document
    const root = document.documentElement
    
    // Add theme switching class to disable transitions
    root.classList.add('theme-switching')
    
    // Apply theme attributes
    root.setAttribute('data-theme', resolved)
    root.setAttribute('data-theme-variant', config.variant)
    
    // Apply accessibility attributes
    if (config.reducedMotion) {
      root.setAttribute('data-reduced-motion', 'true')
    } else {
      root.removeAttribute('data-reduced-motion')
    }
    
    if (config.highContrast) {
      root.setAttribute('data-high-contrast', 'true')
    } else {
      root.removeAttribute('data-high-contrast')
    }
    
    // Remove theme switching class after a short delay
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        root.classList.remove('theme-switching')
      })
    })

    // Save config to localStorage
    try {
      localStorage.setItem(storageKey, JSON.stringify(config))
    } catch (error) {
      console.warn('Failed to save theme config to localStorage:', error)
    }
  }, [config, storageKey])

  // Listen for system theme changes
  useEffect(() => {
    if (config.theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = () => {
      const resolved = mediaQuery.matches ? 'dark' : 'light'
      setResolvedTheme(resolved)
      
      // Apply theme to document
      const root = document.documentElement
      root.classList.add('theme-switching')
      root.setAttribute('data-theme', resolved)
      root.setAttribute('data-theme-variant', config.variant)
      
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          root.classList.remove('theme-switching')
        })
      })
    }

    // Set initial value
    handleChange()

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange)
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [config.theme, config.variant])

  // Helper functions
  const setTheme = (theme: Theme) => {
    setConfig(prev => ({ ...prev, theme }))
  }

  const setVariant = (variant: ThemeVariant) => {
    setConfig(prev => ({ ...prev, variant }))
  }

  const updateConfig = (updates: Partial<ThemeConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }))
  }

  const value = {
    theme: config.theme,
    setTheme,
    resolvedTheme,
    variant: config.variant,
    setVariant,
    config,
    updateConfig,
    isMobile,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  
  return context
}