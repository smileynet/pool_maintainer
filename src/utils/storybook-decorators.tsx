import React from 'react'
import type { Decorator } from '@storybook/react'

/**
 * Theme wrapper component to handle theme effects
 */
const ThemeWrapper: React.FC<{ theme: string; children: React.ReactNode }> = ({
  theme,
  children,
}) => {
  React.useEffect(() => {
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(theme)
  }, [theme])

  return <div className={`${theme} bg-background text-foreground min-h-screen`}>{children}</div>
}

/**
 * Theme decorator for consistent styling across stories
 */
export const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme || 'light'

  return (
    <ThemeWrapper theme={theme}>
      <Story />
    </ThemeWrapper>
  )
}

/**
 * Pool maintenance theme decorator with branded colors
 */
export const withPoolMaintenanceTheme: Decorator = (Story) => {
  return (
    <div
      className="rounded-lg p-4"
      style={{
        backgroundColor: 'var(--color-surface, #E3FAFF)',
      }}
    >
      <style>{`
        .pool-theme {
          --primary: var(--pool-primary);
          --secondary: var(--pool-secondary);
          --warning: var(--pool-warning);
          --destructive: var(--pool-danger);
        }
      `}</style>
      <div className="pool-theme">
        <Story />
      </div>
    </div>
  )
}

/**
 * Accessibility decorator for enhanced testing
 */
export const withA11y: Decorator = (Story) => {
  return (
    <div role="main" aria-label="Storybook story">
      <Story />
    </div>
  )
}

/**
 * Mobile viewport decorator
 */
export const withMobileViewport: Decorator = (Story) => {
  return (
    <div className="mx-auto max-w-[375px] overflow-hidden rounded-lg border border-gray-200">
      <div className="bg-gray-100 p-2 text-center text-xs text-gray-600">Mobile View (375px)</div>
      <div className="p-4">
        <Story />
      </div>
    </div>
  )
}

/**
 * Grid decorator for component showcases
 */
export const withGrid: Decorator = (Story) => {
  return (
    <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
      <Story />
    </div>
  )
}

/**
 * Centered decorator for single component display
 */
export const withCentered: Decorator = (Story) => {
  return (
    <div className="flex min-h-[400px] items-center justify-center p-8">
      <Story />
    </div>
  )
}

/**
 * Padding decorator with consistent spacing
 */
export const withPadding: Decorator = (Story) => {
  return (
    <div className="p-8">
      <Story />
    </div>
  )
}

/**
 * Background decorator for components that need contrast
 */
export const withBackground: Decorator = (Story, context) => {
  const backgrounds = {
    light: '#ffffff',
    dark: '#0a0a0a',
    gray: '#f3f4f6',
    pool: '#e6f4f1',
  }

  const bg = context.parameters.background || 'light'

  return (
    <div
      className="min-h-[400px] p-8"
      style={{ backgroundColor: backgrounds[bg as keyof typeof backgrounds] || bg }}
    >
      <Story />
    </div>
  )
}

/**
 * RTL wrapper component to handle direction effects
 */
const RTLWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  React.useEffect(() => {
    document.documentElement.dir = 'rtl'
    return () => {
      document.documentElement.dir = 'ltr'
    }
  }, [])

  return <>{children}</>
}

/**
 * RTL (Right-to-Left) decorator for internationalization testing
 */
export const withRTL: Decorator = (Story) => {
  return (
    <RTLWrapper>
      <Story />
    </RTLWrapper>
  )
}

/**
 * High contrast mode decorator for accessibility testing
 */
export const withHighContrast: Decorator = (Story) => {
  return (
    <>
      <style>{`
        .high-contrast {
          filter: contrast(2);
        }
        .high-contrast * {
          border-width: 2px !important;
        }
      `}</style>
      <div className="high-contrast">
        <Story />
      </div>
    </>
  )
}

/**
 * Combine multiple decorators
 */
export const poolMaintenanceDecorators = [withTheme, withA11y, withPadding]

/**
 * Export all decorators as a collection
 */
export const decorators = {
  withTheme,
  withPoolMaintenanceTheme,
  withA11y,
  withMobileViewport,
  withGrid,
  withCentered,
  withPadding,
  withBackground,
  withRTL,
  withHighContrast,
} as const
