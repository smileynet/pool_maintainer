import React from 'react'
import { cn } from '@/lib/utils'
import { DesktopCard, DesktopPanel, DesktopStatusIndicator } from './desktop-variants'

// Desktop-optimized Dashboard layout with intelligent grid
interface DesktopDashboardProps {
  children: React.ReactNode
  className?: string
  sidebar?: React.ReactNode
  toolbar?: React.ReactNode
  header?: React.ReactNode
}

export function DesktopDashboard({
  children,
  className,
  sidebar,
  toolbar,
  header,
}: DesktopDashboardProps) {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      {header && (
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="container py-4">
            {header}
          </div>
        </header>
      )}
      
      <div className="container py-6">
        {toolbar && (
          <div className="mb-6">
            {toolbar}
          </div>
        )}
        
        <div className={cn('grid gap-6', sidebar ? 'grid-cols-1 lg:grid-cols-[280px_1fr]' : 'grid-cols-1')}>
          {sidebar && (
            <aside className="space-y-6">
              {sidebar}
            </aside>
          )}
          
          <main className="min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

// Desktop-optimized Metrics grid with responsive breakpoints
interface DesktopMetricsGridProps {
  metrics: Array<{
    label: string
    value: string | number
    description?: string
    trend?: 'up' | 'down' | 'stable'
    status?: 'success' | 'warning' | 'error' | 'neutral'
    unit?: string
  }>
  className?: string
}

export function DesktopMetricsGrid({ metrics, className }: DesktopMetricsGridProps) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6', className)}>
      {metrics.map((metric, index) => (
        <DesktopCard key={index} hover className="text-center">
          <div className="p-6 space-y-2">
            <div className="text-2xl font-bold">
              {metric.value}
              {metric.unit && (
                <span className="text-lg text-muted-foreground ml-1">{metric.unit}</span>
              )}
            </div>
            <div className="text-sm font-medium text-muted-foreground">
              {metric.label}
            </div>
            {metric.description && (
              <div className="text-xs text-muted-foreground">
                {metric.description}
              </div>
            )}
            {metric.trend && (
              <div className={cn(
                'inline-flex items-center gap-1 text-xs',
                metric.trend === 'up' && 'text-success',
                metric.trend === 'down' && 'text-destructive',
                metric.trend === 'stable' && 'text-muted-foreground'
              )}>
                {metric.trend === 'up' && '↗'}
                {metric.trend === 'down' && '↘'}
                {metric.trend === 'stable' && '→'}
                <span className="capitalize">{metric.trend}</span>
              </div>
            )}
          </div>
        </DesktopCard>
      ))}
    </div>
  )
}

// Desktop-optimized Content sections with smart spacing
interface DesktopContentSectionProps {
  title: string
  children: React.ReactNode
  className?: string
  description?: string
  actions?: React.ReactNode
  collapsible?: boolean
  variant?: 'default' | 'contained' | 'outlined'
}

export function DesktopContentSection({
  title,
  children,
  className,
  description,
  actions,
  collapsible = false,
  variant = 'default',
}: DesktopContentSectionProps) {
  if (variant === 'contained' || variant === 'outlined') {
    return (
      <DesktopPanel
        title={title}
        description={description}
        actions={actions}
        collapsible={collapsible}
        className={className}
      >
        {children}
      </DesktopPanel>
    )
  }

  return (
    <section className={cn('space-y-6', className)}>
      <div className="header-section">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-semibold">{title}</h2>
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-2">{actions}</div>
          )}
        </div>
      </div>
      {children}
    </section>
  )
}

// Desktop-optimized Split view for comparing data
interface DesktopSplitViewProps {
  left: React.ReactNode
  right: React.ReactNode
  className?: string
  leftTitle?: string
  rightTitle?: string
  ratio?: '1:1' | '2:1' | '1:2'
}

export function DesktopSplitView({
  left,
  right,
  className,
  leftTitle,
  rightTitle,
  ratio = '1:1',
}: DesktopSplitViewProps) {
  const gridCols = ratio === '2:1' ? 'grid-cols-1 lg:grid-cols-[2fr_1fr]' :
                  ratio === '1:2' ? 'grid-cols-1 lg:grid-cols-[1fr_2fr]' :
                  'grid-cols-1 lg:grid-cols-2'

  return (
    <div className={cn('grid gap-6', gridCols, className)}>
      <div className="space-y-4">
        {leftTitle && (
          <h3 className="text-lg font-semibold border-b border-border pb-2">
            {leftTitle}
          </h3>
        )}
        {left}
      </div>
      <div className="space-y-4">
        {rightTitle && (
          <h3 className="text-lg font-semibold border-b border-border pb-2">
            {rightTitle}
          </h3>
        )}
        {right}
      </div>
    </div>
  )
}

// Desktop-optimized Status overview component
interface DesktopStatusOverviewProps {
  items: Array<{
    label: string
    status: 'success' | 'warning' | 'error' | 'info' | 'neutral'
    value?: string | number
    description?: string
    lastUpdated?: string
  }>
  className?: string
  compact?: boolean
}

export function DesktopStatusOverview({
  items,
  className,
  compact = false,
}: DesktopStatusOverviewProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {items.map((item, index) => (
        <DesktopStatusIndicator
          key={index}
          status={item.status}
          label={item.label}
          description={item.description}
          value={item.value}
          size={compact ? 'default' : 'large'}
        />
      ))}
    </div>
  )
}

// Desktop-optimized Multi-column layout
interface DesktopMultiColumnProps {
  children: React.ReactNode
  className?: string
  columns?: 2 | 3 | 4
  spacing?: 'compact' | 'default' | 'comfortable'
  equalHeight?: boolean
}

export function DesktopMultiColumn({
  children,
  className,
  columns = 3,
  spacing = 'default',
  equalHeight = false,
}: DesktopMultiColumnProps) {
  const spacingClass = spacing === 'compact' ? 'gap-4' :
                      spacing === 'comfortable' ? 'gap-8' :
                      'gap-6'

  const columnsClass = columns === 2 ? 'grid-cols-1 md:grid-cols-2' :
                      columns === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
                      'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'

  return (
    <div
      className={cn(
        'grid',
        columnsClass,
        spacingClass,
        equalHeight && 'items-stretch',
        className
      )}
    >
      {children}
    </div>
  )
}

// Desktop-optimized Collapsible sidebar
interface DesktopCollapsibleSidebarProps {
  children: React.ReactNode
  className?: string
  defaultCollapsed?: boolean
  title?: string
}

export function DesktopCollapsibleSidebar({
  children,
  className,
  defaultCollapsed = false,
  title,
}: DesktopCollapsibleSidebarProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)

  return (
    <div
      className={cn(
        'border-r border-border bg-card/50 transition-all duration-200',
        isCollapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          {!isCollapsed && title && (
            <h3 className="font-semibold text-sm">{title}</h3>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded hover:bg-accent transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <span className={cn('transition-transform', isCollapsed ? 'rotate-0' : 'rotate-180')}>
              ◀
            </span>
          </button>
        </div>
        <div className={cn('space-y-2', isCollapsed && 'hidden')}>
          {children}
        </div>
      </div>
    </div>
  )
}

