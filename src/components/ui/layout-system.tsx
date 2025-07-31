import React, { ReactNode } from 'react'
import { cn } from '@/lib/utils'

// ============================================================================
// CONTAINER QUERY LAYOUT COMPONENTS
// ============================================================================

/**
 * Advanced Layout System with Container Queries
 * 
 * This system provides responsive components that adapt based on their container size
 * rather than the viewport size, enabling more flexible and reusable components.
 */

// Container component that establishes container query context
interface ContainerProps {
  children: ReactNode
  className?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  type?: 'normal' | 'inline-size' | 'size'
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className,
  size = 'full',
  type = 'normal'
}) => {
  const containerClasses = cn(
    '@container', // Enable container queries
    size === 'xs' && 'max-w-xs',
    size === 'sm' && 'max-w-sm',
    size === 'md' && 'max-w-md',
    size === 'lg' && 'max-w-lg',
    size === 'xl' && 'max-w-xl',
    size === '2xl' && 'max-w-2xl',
    size === 'full' && 'w-full',
    type === 'inline-size' && '@container-inline-size',
    type === 'size' && '@container-size',
    className
  )

  return (
    <div className={containerClasses}>
      {children}
    </div>
  )
}

// ============================================================================
// ADAPTIVE GRID SYSTEM
// ============================================================================

interface AdaptiveGridProps {
  children: ReactNode
  className?: string
  minItemWidth?: string
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  columns?: {
    default: number
    xs?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
}

export const AdaptiveGrid: React.FC<AdaptiveGridProps> = ({
  children,
  className,
  minItemWidth = '280px',
  gap = 'md',
  columns
}) => {
  const gapClasses = {
    xs: 'gap-2',
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  }

  if (columns) {
    // Use explicit column definitions with container queries
    const gridClasses = cn(
      'grid',
      `grid-cols-${columns.default}`,
      columns.xs && `@xs:grid-cols-${columns.xs}`,
      columns.sm && `@sm:grid-cols-${columns.sm}`,
      columns.md && `@md:grid-cols-${columns.md}`,
      columns.lg && `@lg:grid-cols-${columns.lg}`,
      columns.xl && `@xl:grid-cols-${columns.xl}`,
      gapClasses[gap],
      className
    )

    return <div className={gridClasses}>{children}</div>
  }

  // Use auto-fit grid with minimum item width
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fit, minmax(${minItemWidth}, 1fr))`,
  }

  return (
    <div
      className={cn(gapClasses[gap], className)}
      style={gridStyle}
    >
      {children}
    </div>
  )
}

// ============================================================================
// RESPONSIVE CARD LAYOUT
// ============================================================================

interface ResponsiveCardProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'compact' | 'expanded'
  orientation?: 'horizontal' | 'vertical' | 'auto'
}

export const ResponsiveCard: React.FC<ResponsiveCardProps> = ({
  children,
  className,
  variant = 'default',
  orientation = 'auto'
}) => {
  const cardClasses = cn(
    // Base card styles
    'rounded-lg border bg-white shadow-sm transition-all duration-200',
    'dark:bg-gray-800 dark:border-gray-700',
    
    // Variant-specific styles
    variant === 'compact' && 'p-3 @sm:p-4',
    variant === 'default' && 'p-4 @sm:p-6',
    variant === 'expanded' && 'p-6 @sm:p-8',
    
    // Orientation-specific styles with container queries
    orientation === 'horizontal' && 'flex flex-row items-center space-x-4',
    orientation === 'vertical' && 'flex flex-col space-y-4',
    orientation === 'auto' && [
      'flex flex-col space-y-4', // Mobile default
      '@sm:flex-row @sm:space-y-0 @sm:space-x-4 @sm:items-center' // Desktop horizontal
    ],
    
    className
  )

  return <div className={cardClasses}>{children}</div>
}

// ============================================================================
// STACK LAYOUT COMPONENT
// ============================================================================

interface StackProps {
  children: ReactNode
  className?: string
  direction?: 'row' | 'column' | 'responsive'
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  wrap?: boolean
}

export const Stack: React.FC<StackProps> = ({
  children,
  className,
  direction = 'column',
  align = 'stretch',
  justify = 'start',
  gap = 'md',
  wrap = false
}) => {
  const gapClasses = {
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  }

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  }

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  }

  const directionClasses = {
    row: 'flex-row',
    column: 'flex-col',
    responsive: 'flex-col @sm:flex-row'
  }

  const stackClasses = cn(
    'flex',
    directionClasses[direction],
    alignClasses[align],
    justifyClasses[justify],
    gapClasses[gap],
    wrap && 'flex-wrap',
    className
  )

  return <div className={stackClasses}>{children}</div>
}

// ============================================================================
// SIDEBAR LAYOUT COMPONENT
// ============================================================================

interface SidebarLayoutProps {
  children: ReactNode
  sidebar: ReactNode
  className?: string
  sidebarWidth?: 'narrow' | 'normal' | 'wide'
  sidebarPosition?: 'left' | 'right'
  collapsible?: boolean
  defaultCollapsed?: boolean
}

export const SidebarLayout: React.FC<SidebarLayoutProps> = ({
  children,
  sidebar,
  className,
  sidebarWidth = 'normal',
  sidebarPosition = 'left',
  collapsible = false,
  defaultCollapsed = false
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)

  const sidebarWidthClasses = {
    narrow: 'w-48 @lg:w-56',
    normal: 'w-56 @lg:w-64',
    wide: 'w-64 @lg:w-72'
  }

  const layoutClasses = cn(
    'flex min-h-screen',
    sidebarPosition === 'right' && 'flex-row-reverse',
    className
  )

  const sidebarClasses = cn(
    'flex-shrink-0 border-r bg-gray-50 dark:bg-gray-900 dark:border-gray-700',
    sidebarPosition === 'right' && 'border-r-0 border-l',
    sidebarWidthClasses[sidebarWidth],
    isCollapsed && 'w-16',
    'transition-all duration-300'
  )

  const mainClasses = cn(
    'flex-1 overflow-hidden',
    'flex flex-col'
  )

  return (
    <Container className={layoutClasses}>
      <aside className={sidebarClasses}>
        {collapsible && (
          <div className="p-2 border-b dark:border-gray-700">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-full p-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isCollapsed ? '→' : '←'}
            </button>
          </div>
        )}
        <div className={cn('h-full', isCollapsed && 'overflow-hidden')}>
          {sidebar}
        </div>
      </aside>
      <main className={mainClasses}>
        {children}
      </main>
    </Container>
  )
}

// ============================================================================
// DASHBOARD LAYOUT COMPONENT
// ============================================================================

interface DashboardLayoutProps {
  children: ReactNode
  header?: ReactNode
  sidebar?: ReactNode
  className?: string
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  header,
  sidebar,
  className
}) => {
  const layoutClasses = cn(
    'min-h-screen bg-gray-50 dark:bg-gray-900',
    className
  )

  return (
    <Container className={layoutClasses}>
      {header && (
        <header className="sticky top-0 z-40 border-b bg-white dark:bg-gray-800 dark:border-gray-700">
          <div className="px-4 py-3 @lg:px-6">
            {header}
          </div>
        </header>
      )}
      
      <div className="flex flex-1">
        {sidebar && (
          <aside className="hidden @lg:flex @lg:w-64 @lg:flex-col @lg:fixed @lg:inset-y-0 @lg:z-50">
            <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white dark:bg-gray-800 border-r dark:border-gray-700">
              {sidebar}
            </div>
          </aside>
        )}
        
        <main className={cn(
          'flex-1 p-4 @lg:p-6',
          sidebar && '@lg:ml-64'
        )}>
          {children}
        </main>
      </div>
    </Container>
  )
}

// ============================================================================
// METRIC GRID COMPONENT (POOL-SPECIFIC)
// ============================================================================

interface MetricGridProps {
  children: ReactNode
  className?: string
  columns?: {
    mobile: number
    tablet: number
    desktop: number
  }
}

export const MetricGrid: React.FC<MetricGridProps> = ({
  children,
  className,
  columns = { mobile: 1, tablet: 2, desktop: 4 }
}) => {
  const gridClasses = cn(
    'grid gap-4 @sm:gap-6',
    `grid-cols-${columns.mobile}`,
    `@sm:grid-cols-${columns.tablet}`,
    `@lg:grid-cols-${columns.desktop}`,
    className
  )

  return <div className={gridClasses}>{children}</div>
}

// ============================================================================
// CHEMICAL READING LAYOUT (POOL-SPECIFIC)
// ============================================================================

interface ChemicalReadingLayoutProps {
  children: ReactNode
  className?: string
  variant?: 'grid' | 'list' | 'cards'
}

export const ChemicalReadingLayout: React.FC<ChemicalReadingLayoutProps> = ({
  children,
  className,
  variant = 'grid'
}) => {
  const variantClasses = cn(
    variant === 'grid' && [
      'grid gap-4',
      'grid-cols-1',
      '@sm:grid-cols-2',
      '@lg:grid-cols-3',
      '@xl:grid-cols-4'
    ],
    variant === 'list' && 'space-y-3',
    variant === 'cards' && [
      'grid gap-6',
      'grid-cols-1',
      '@md:grid-cols-2',
      '@xl:grid-cols-3'
    ],
    className
  )

  return <div className={variantClasses}>{children}</div>
}

// ============================================================================
// UTILITY BREAKPOINT WRAPPER
// ============================================================================

interface BreakpointProps {
  children: ReactNode
  show?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  hide?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  className?: string
}

export const Breakpoint: React.FC<BreakpointProps> = ({
  children,
  show,
  hide,
  className
}) => {
  const breakpointClasses = cn(
    show && `hidden @${show}:block`,
    hide && `@${hide}:hidden`,
    className
  )

  return <div className={breakpointClasses}>{children}</div>
}

// ============================================================================
// RESPONSIVE SPACER
// ============================================================================

interface SpacerProps {
  size?: {
    mobile?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    tablet?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    desktop?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  }
  className?: string
}

export const Spacer: React.FC<SpacerProps> = ({
  size = { mobile: 'md', tablet: 'lg', desktop: 'xl' },
  className
}) => {
  const sizeClasses = {
    xs: 'h-2',
    sm: 'h-4',
    md: 'h-6',
    lg: 'h-8',
    xl: 'h-12'
  }

  const spacerClasses = cn(
    sizeClasses[size.mobile || 'md'],
    size.tablet && `@sm:${sizeClasses[size.tablet]}`,
    size.desktop && `@lg:${sizeClasses[size.desktop]}`,
    className
  )

  return <div className={spacerClasses} />
}

export default {
  Container,
  AdaptiveGrid,
  ResponsiveCard,
  Stack,
  SidebarLayout,
  DashboardLayout,
  MetricGrid,
  ChemicalReadingLayout,
  Breakpoint,
  Spacer,
}