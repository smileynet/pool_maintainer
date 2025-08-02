import React, { useState } from 'react'
import { SunIcon, MoonIcon, DesktopIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/components/ui/theme-provider'

export function ThemeToggle() {
  const { config, updateTheme } = useTheme()
  const [showOptions, setShowOptions] = useState(false)

  const currentTheme = config.mode

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    updateTheme({ mode: theme })
    setShowOptions(false)
  }

  const getThemeIcon = () => {
    switch (currentTheme) {
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

  const getThemeLabel = () => {
    switch (currentTheme) {
      case 'light':
        return 'Light'
      case 'dark':
        return 'Dark'
      case 'system':
        return 'System'
      default:
        return 'Light'
    }
  }

  return (
    <div className="relative">
      <Button 
        variant="outline" 
        size="sm"
        className="w-auto gap-2"
        onClick={() => setShowOptions(!showOptions)}
        aria-label={`Current theme: ${getThemeLabel()}. Click to change theme.`}
      >
        {getThemeIcon()}
        <span className="hidden sm:inline">{getThemeLabel()}</span>
      </Button>
      
      {showOptions && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowOptions(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 top-full z-50 mt-2 w-40 rounded-md border bg-popover p-1 shadow-md">
            <button
              onClick={() => handleThemeChange('light')}
              className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
            >
              <SunIcon className="h-4 w-4" />
              <span>Light</span>
              {currentTheme === 'light' && (
                <span className="ml-auto text-primary">✓</span>
              )}
            </button>
            <button
              onClick={() => handleThemeChange('dark')}
              className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
            >
              <MoonIcon className="h-4 w-4" />
              <span>Dark</span>
              {currentTheme === 'dark' && (
                <span className="ml-auto text-primary">✓</span>
              )}
            </button>
            <button
              onClick={() => handleThemeChange('system')}
              className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
            >
              <DesktopIcon className="h-4 w-4" />
              <span>System</span>
              {currentTheme === 'system' && (
                <span className="ml-auto text-primary">✓</span>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// Simple toggle button version (alternative)
export function ThemeToggleSimple() {
  const { config, updateTheme } = useTheme()
  
  const toggleTheme = () => {
    const newTheme = config.mode === 'light' ? 'dark' : 'light'
    updateTheme({ mode: newTheme })
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      aria-label={`Switch to ${config.mode === 'light' ? 'dark' : 'light'} theme`}
    >
      {config.mode === 'light' ? (
        <MoonIcon className="h-4 w-4" />
      ) : (
        <SunIcon className="h-4 w-4" />
      )}
    </Button>
  )
}