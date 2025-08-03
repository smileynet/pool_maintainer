import React from 'react'
import { cn } from '@/lib/utils'

// Mobile-optimized card component
export function MobileCard({ 
  children, 
  className, 
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn(
        'rounded-lg border bg-card text-card-foreground shadow-sm',
        'p-3 md:p-6', // Smaller padding on mobile
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Mobile-optimized grid
export function ResponsiveGrid({ 
  children, 
  className,
  cols = { mobile: 1, tablet: 2, desktop: 3 }
}: {
  children: React.ReactNode
  className?: string
  cols?: {
    mobile?: number
    tablet?: number
    desktop?: number
  }
}) {
  const gridClasses = cn(
    'grid gap-3 md:gap-4 lg:gap-6',
    `grid-cols-${cols.mobile}`,
    `md:grid-cols-${cols.tablet}`,
    `lg:grid-cols-${cols.desktop}`,
    className
  )

  return (
    <div className={gridClasses}>
      {children}
    </div>
  )
}

// Mobile-optimized button group
export function MobileButtonGroup({ 
  children, 
  className 
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn(
      'flex flex-col sm:flex-row gap-2 sm:gap-3',
      className
    )}>
      {children}
    </div>
  )
}

// Mobile-optimized stack layout
export function MobileStack({ 
  children, 
  spacing = 'md',
  className 
}: {
  children: React.ReactNode
  spacing?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const spacingClasses = {
    sm: 'space-y-2 md:space-y-3',
    md: 'space-y-4 md:space-y-6',
    lg: 'space-y-6 md:space-y-8'
  }

  return (
    <div className={cn(spacingClasses[spacing], className)}>
      {children}
    </div>
  )
}

// Mobile navigation helper
export function MobileNavigation({ 
  tabs, 
  activeTab, 
  onTabChange,
  className 
}: {
  tabs: Array<{ id: string; label: string; icon?: React.ComponentType<any> }>
  activeTab: string
  onTabChange: (tabId: string) => void
  className?: string
}) {
  return (
    <div className={cn('w-full', className)}>
      {/* Mobile: Horizontal scroll tabs */}
      <div className="md:hidden">
        <div className="flex overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          <div className="flex space-x-1 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={cn(
                    'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap',
                    'transition-colors min-w-0 flex-shrink-0',
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  <span className="hidden xs:inline">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Desktop: Standard tabs */}
      <div className="hidden md:block">
        <nav className="flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  'flex items-center space-x-2 border-b-2 px-1 py-4 text-sm font-medium',
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
                )}
              >
                {Icon && <Icon className="h-4 w-4" />}
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

// Responsive text sizes
export const responsiveText = {
  title: 'text-xl md:text-2xl lg:text-3xl',
  subtitle: 'text-lg md:text-xl',
  body: 'text-sm md:text-base',
  caption: 'text-xs md:text-sm'
}

// Responsive spacing utilities
export const responsiveSpacing = {
  section: 'space-y-4 md:space-y-6 lg:space-y-8',
  component: 'space-y-2 md:space-y-3 lg:space-y-4',
  padding: 'p-3 md:p-4 lg:p-6',
  margin: 'm-3 md:m-4 lg:m-6'
}

// Touch-friendly component wrapper
export function TouchFriendly({ 
  children, 
  className 
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn(
      'touch-manipulation', // Improves touch responsiveness
      'min-h-[44px]', // Minimum touch target size
      className
    )}>
      {children}
    </div>
  )
}

// Mobile-optimized modal/sheet
export function MobileSheet({ 
  children, 
  isOpen, 
  onClose,
  title 
}: {
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
  title?: string
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 bg-background rounded-t-xl border-t shadow-xl">
        <div className="p-4">
          {title && (
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{title}</h3>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-muted"
              >
                ×
              </button>
            </div>
          )}
          <div className="max-h-[70vh] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}