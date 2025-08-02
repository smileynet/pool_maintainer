import React, { useState } from 'react'
import { SunIcon, MoonIcon, DesktopIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import { useTheme, type ThemeVariant, type ThemeMode } from '@/components/ui/theme-provider'

interface ThemeOption {
  variant: ThemeVariant
  name: string
  description: string
  colors: {
    primary: string
    accent: string
  }
}

const themeOptions: ThemeOption[] = [
  {
    variant: 'default',
    name: 'Default',
    description: 'Classic pool blue theme',
    colors: { primary: '#3b82f6', accent: '#06b6d4' }
  },
  {
    variant: 'ocean',
    name: 'Ocean',
    description: 'Deep blues and teals',
    colors: { primary: '#0ea5e9', accent: '#06b6d4' }
  },
  {
    variant: 'sunset',
    name: 'Sunset',
    description: 'Warm oranges and pinks',
    colors: { primary: '#f97316', accent: '#ec4899' }
  },
  {
    variant: 'forest',
    name: 'Forest',
    description: 'Rich greens and emeralds',
    colors: { primary: '#22c55e', accent: '#10b981' }
  },
  {
    variant: 'aurora',
    name: 'Aurora',
    description: 'Purple and cyan magic',
    colors: { primary: '#8b5cf6', accent: '#06b6d4' }
  }
]

export function VibrantThemeSelector() {
  const { config, updateTheme } = useTheme()
  const [showSelector, setShowSelector] = useState(false)
  const [selectedTab, setSelectedTab] = useState<'mode' | 'variant'>('variant')

  const currentThemeOption = themeOptions.find(option => option.variant === config.variant) || themeOptions[0]

  const handleModeChange = (mode: ThemeMode) => {
    updateTheme({ mode })
  }

  const handleVariantChange = (variant: ThemeVariant) => {
    updateTheme({ variant })
    setShowSelector(false)
  }

  const getModeIcon = () => {
    switch (config.mode) {
      case 'light':
        return <SunIcon className="h-4 w-4" />
      case 'dark':
        return <MoonIcon className="h-4 w-4" />
      case 'system':
        return <DesktopIcon className="h-4 w-4" />
      default:
        return <SunIcon className="h-4 w-4" />
    }
  }

  return (
    <div className="relative">
      <Button 
        variant="outline" 
        size="sm"
        className="w-auto gap-2 theme-toggle"
        onClick={() => setShowSelector(!showSelector)}
        aria-label={`Current theme: ${currentThemeOption.name} ${config.mode}. Click to change theme.`}
      >
        {getModeIcon()}
        <div 
          className="w-3 h-3 rounded-full border border-white/30"
          style={{ backgroundColor: currentThemeOption.colors.primary }}
        />
        <span className="hidden sm:inline">{currentThemeOption.name}</span>
      </Button>
      
      {showSelector && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowSelector(false)}
          />
          
          {/* Advanced Theme Selector */}
          <div className="absolute right-0 top-full z-50 mt-2 w-80 dropdown-glass dropdown-enter">
            {/* Header */}
            <div className="p-4 border-b">
              <h3 className="font-semibold text-sm">Theme Settings</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Choose your preferred theme style and mode
              </p>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex border-b">
              <button
                onClick={() => setSelectedTab('variant')}
                className={`flex-1 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  selectedTab === 'variant' 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Style
              </button>
              <button
                onClick={() => setSelectedTab('mode')}
                className={`flex-1 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  selectedTab === 'mode' 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Mode
              </button>
            </div>
            
            {/* Content */}
            <div className="p-4">
              {selectedTab === 'variant' && (
                <div className="space-y-2">
                  {themeOptions.map((option) => (
                    <button
                      key={option.variant}
                      onClick={() => handleVariantChange(option.variant)}
                      className={`w-full flex items-center gap-3 p-3 rounded-md text-left transition-colors hover:bg-accent ${
                        config.variant === option.variant 
                          ? 'bg-accent/50 ring-1 ring-primary' 
                          : ''
                      }`}
                    >
                      <div className="flex gap-1">
                        <div 
                          className="w-4 h-4 rounded-full border border-white/30"
                          style={{ backgroundColor: option.colors.primary }}
                        />
                        <div 
                          className="w-4 h-4 rounded-full border border-white/30"
                          style={{ backgroundColor: option.colors.accent }}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{option.name}</div>
                        <div className="text-xs text-muted-foreground">{option.description}</div>
                      </div>
                      {config.variant === option.variant && (
                        <span className="text-primary text-sm">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
              
              {selectedTab === 'mode' && (
                <div className="space-y-2">
                  <button
                    onClick={() => handleModeChange('light')}
                    className={`w-full flex items-center gap-3 p-3 rounded-md text-left transition-colors hover:bg-accent ${
                      config.mode === 'light' 
                        ? 'bg-accent/50 ring-1 ring-primary' 
                        : ''
                    }`}
                  >
                    <SunIcon className="h-4 w-4" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">Light</div>
                      <div className="text-xs text-muted-foreground">Bright and clear</div>
                    </div>
                    {config.mode === 'light' && (
                      <span className="text-primary text-sm">✓</span>
                    )}
                  </button>
                  
                  <button
                    onClick={() => handleModeChange('dark')}
                    className={`w-full flex items-center gap-3 p-3 rounded-md text-left transition-colors hover:bg-accent ${
                      config.mode === 'dark' 
                        ? 'bg-accent/50 ring-1 ring-primary' 
                        : ''
                    }`}
                  >
                    <MoonIcon className="h-4 w-4" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">Dark</div>
                      <div className="text-xs text-muted-foreground">Easy on the eyes</div>
                    </div>
                    {config.mode === 'dark' && (
                      <span className="text-primary text-sm">✓</span>
                    )}
                  </button>
                  
                  <button
                    onClick={() => handleModeChange('system')}
                    className={`w-full flex items-center gap-3 p-3 rounded-md text-left transition-colors hover:bg-accent ${
                      config.mode === 'system' 
                        ? 'bg-accent/50 ring-1 ring-primary' 
                        : ''
                    }`}
                  >
                    <DesktopIcon className="h-4 w-4" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">System</div>
                      <div className="text-xs text-muted-foreground">Follow device setting</div>
                    </div>
                    {config.mode === 'system' && (
                      <span className="text-primary text-sm">✓</span>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// Keep the simple toggle for backward compatibility
export function ThemeToggle() {
  const { config, updateTheme } = useTheme()
  
  const toggleMode = () => {
    const modes: ThemeMode[] = ['light', 'dark', 'system']
    const currentIndex = modes.indexOf(config.mode)
    const nextMode = modes[(currentIndex + 1) % modes.length]
    updateTheme({ mode: nextMode })
  }

  const getModeIcon = () => {
    switch (config.mode) {
      case 'light':
        return <SunIcon className="h-4 w-4" />
      case 'dark':
        return <MoonIcon className="h-4 w-4" />
      case 'system':
        return <DesktopIcon className="h-4 w-4" />
      default:
        return <SunIcon className="h-4 w-4" />
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleMode}
      aria-label={`Current: ${config.mode}. Click to cycle theme mode.`}
    >
      {getModeIcon()}
    </Button>
  )
}