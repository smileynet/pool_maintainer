import React, { useState } from 'react'
import { useTheme } from './theme-provider'
import { cn } from '@/lib/utils'
import { ChevronRight, Sun, Moon, Monitor, Palette, Check } from 'lucide-react'

interface MobileThemeSelectorProps {
  className?: string
}

const themeVariants = [
  { value: 'default', label: 'Default', color: 'oklch(0.55 0.25 220)' },
  { value: 'ocean', label: 'Ocean', color: 'oklch(0.55 0.32 200)' },
  { value: 'sunset', label: 'Sunset', color: 'oklch(0.58 0.32 25)' },
  { value: 'forest', label: 'Forest', color: 'oklch(0.52 0.32 145)' },
  { value: 'aurora', label: 'Aurora', color: 'oklch(0.55 0.32 280)' },
] as const

const themeModes = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
] as const

export function MobileThemeSelector({ className }: MobileThemeSelectorProps) {
  const { config, updateTheme, isMobile } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'mode' | 'variant'>('mode')

  const handleModeChange = (mode: 'light' | 'dark' | 'system') => {
    updateTheme({ mode })
    if (isMobile) {
      setTimeout(() => setIsOpen(false), 300)
    }
  }

  const handleVariantChange = (variant: typeof config.variant) => {
    updateTheme({ variant })
    if (isMobile) {
      setTimeout(() => setIsOpen(false), 300)
    }
  }

  return (
    <>
      {/* Mobile-optimized trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'inline-flex items-center justify-center gap-2',
          'min-h-[44px] min-w-[44px] px-4 py-2',
          'rounded-lg border border-border',
          'bg-card text-card-foreground',
          'transition-all duration-200',
          'hover:bg-accent hover:text-accent-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'touch-action-manipulation',
          className
        )}
        aria-label="Theme settings"
      >
        <Palette className="h-5 w-5" />
        <span className="hidden sm:inline">Theme</span>
        <ChevronRight className={cn(
          'h-4 w-4 transition-transform',
          isOpen && 'rotate-90'
        )} />
      </button>

      {/* Mobile-optimized dropdown panel */}
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          {isMobile && (
            <div
              className="fixed inset-0 z-40 bg-black/50"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />
          )}

          <div
            className={cn(
              'absolute z-50 mt-2 w-full min-w-[280px] max-w-sm',
              'rounded-xl border border-border',
              'bg-card/95 backdrop-blur-xl',
              'shadow-lg shadow-black/10',
              'animate-in fade-in-0 zoom-in-95',
              isMobile && 'fixed inset-x-4 bottom-4 mt-0 max-w-none'
            )}
          >
            {/* Tab navigation */}
            <div className="flex border-b border-border">
              <button
                onClick={() => setActiveTab('mode')}
                className={cn(
                  'flex-1 px-4 py-3 text-sm font-medium',
                  'transition-colors duration-200',
                  'focus-visible:outline-none',
                  activeTab === 'mode'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Mode
              </button>
              <button
                onClick={() => setActiveTab('variant')}
                className={cn(
                  'flex-1 px-4 py-3 text-sm font-medium',
                  'transition-colors duration-200',
                  'focus-visible:outline-none',
                  activeTab === 'variant'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Variant
              </button>
            </div>

            {/* Content */}
            <div className="p-2">
              {activeTab === 'mode' ? (
                <div className="space-y-1">
                  {themeModes.map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => handleModeChange(value)}
                      className={cn(
                        'flex w-full items-center gap-3 px-4 py-3',
                        'rounded-lg text-left',
                        'transition-all duration-200',
                        'hover:bg-accent/50',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        config.mode === value && 'bg-accent'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="flex-1 font-medium">{label}</span>
                      {config.mode === value && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-1">
                  {themeVariants.map(({ value, label, color }) => (
                    <button
                      key={value}
                      onClick={() => handleVariantChange(value)}
                      className={cn(
                        'flex w-full items-center gap-3 px-4 py-3',
                        'rounded-lg text-left',
                        'transition-all duration-200',
                        'hover:bg-accent/50',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        config.variant === value && 'bg-accent'
                      )}
                    >
                      <div
                        className="h-5 w-5 rounded-full border border-border"
                        style={{ backgroundColor: color }}
                      />
                      <span className="flex-1 font-medium">{label}</span>
                      {config.variant === value && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Additional options */}
            <div className="border-t border-border p-4">
              <div className="space-y-3">
                {/* Font scale slider for mobile */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Text Size
                  </label>
                  <input
                    type="range"
                    min="0.9"
                    max="1.3"
                    step="0.1"
                    value={config.fontScale}
                    onChange={(e) => updateTheme({ fontScale: parseFloat(e.target.value) })}
                    className="mt-2 w-full"
                  />
                  <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                    <span>Small</span>
                    <span>Large</span>
                  </div>
                </div>

                {/* Accessibility toggles */}
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={config.contrast === 'high'}
                    onChange={(e) => updateTheme({ contrast: e.target.checked ? 'high' : 'normal' })}
                    className="h-4 w-4 rounded border-border"
                  />
                  <span className="text-sm font-medium">High Contrast</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={config.motion === 'reduced'}
                    onChange={(e) => updateTheme({ motion: e.target.checked ? 'reduced' : 'normal' })}
                    className="h-4 w-4 rounded border-border"
                  />
                  <span className="text-sm font-medium">Reduce Motion</span>
                </label>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}