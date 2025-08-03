import React from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Button } from './button'
import { Badge } from './badge'

// Desktop-optimized Card variant with enhanced layout
interface DesktopCardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'outlined' | 'elevated' | 'ghost' | 'featured'
  padding?: 'default' | 'comfortable' | 'spacious'
  hover?: boolean
}

export function DesktopCard({
  children,
  className,
  variant = 'default',
  padding = 'comfortable',
  hover = true,
}: DesktopCardProps) {
  return (
    <Card
      className={cn(
        'transition-all duration-200',
        padding === 'comfortable' && 'density-comfortable',
        padding === 'spacious' && 'density-spacious',
        variant === 'featured' && 'border-2 border-primary/20 shadow-lg',
        hover && 'hover:shadow-lg hover:border-border/60 hover:-translate-y-0.5',
        '@container', // Enable container queries
        className
      )}
      variant={variant === 'featured' ? 'default' : variant}
    >
      {children}
    </Card>
  )
}

// Desktop-optimized Button group with intelligent spacing
interface DesktopButtonGroupProps {
  children: React.ReactNode
  className?: string
  orientation?: 'horizontal' | 'vertical'
  spacing?: 'compact' | 'default' | 'comfortable'
  alignment?: 'start' | 'center' | 'end' | 'stretch'
}

export function DesktopButtonGroup({
  children,
  className,
  orientation = 'horizontal',
  spacing = 'default',
  alignment = 'start',
}: DesktopButtonGroupProps) {
  const spacingClass = spacing === 'compact' ? 'button-group-sm' :
                      spacing === 'comfortable' ? 'button-group-lg' : 
                      'button-group'
                      
  return (
    <div
      className={cn(
        spacingClass,
        orientation === 'vertical' && 'flex-col',
        alignment === 'center' && 'justify-center items-center',
        alignment === 'end' && 'justify-end items-end',
        alignment === 'stretch' && 'items-stretch',
        className
      )}
    >
      {children}
    </div>
  )
}

// Desktop-optimized Status indicator with enhanced information density
interface DesktopStatusIndicatorProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'neutral'
  label: string
  description?: string
  value?: string | number
  className?: string
  size?: 'default' | 'large'
  showIcon?: boolean
}

export function DesktopStatusIndicator({
  status,
  label,
  description,
  value,
  className,
  size = 'default',
  showIcon = true,
}: DesktopStatusIndicatorProps) {
  const statusColors = {
    success: 'text-success border-success bg-success/5',
    warning: 'text-warning border-warning bg-warning/5',
    error: 'text-destructive border-destructive bg-destructive/5',
    info: 'text-primary border-primary bg-primary/5',
    neutral: 'text-muted-foreground border-border bg-muted/5',
  }

  const statusIcons = {
    success: '✓',
    warning: '⚠',
    error: '✕',
    info: 'ⓘ',
    neutral: '○',
  }

  return (
    <div
      className={cn(
        'rounded-lg border px-4 py-3 transition-colors',
        statusColors[status],
        size === 'large' && 'px-6 py-4',
        className
      )}
    >
      <div className={cn('flex items-center', size === 'large' ? 'gap-3' : 'gap-2')}>
        {showIcon && (
          <span className={cn('font-mono', size === 'large' ? 'text-lg' : 'text-sm')}>
            {statusIcons[status]}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <div className={cn('font-medium', size === 'large' ? 'text-base' : 'text-sm')}>
            {label}
          </div>
          {description && (
            <div className={cn('text-muted-foreground', size === 'large' ? 'text-sm' : 'text-xs')}>
              {description}
            </div>
          )}
        </div>
        {value && (
          <div className={cn('font-mono font-medium text-right', size === 'large' ? 'text-lg' : 'text-sm')}>
            {value}
          </div>
        )}
      </div>
    </div>
  )
}

// Desktop-optimized Data display with enhanced readability
interface DesktopDataDisplayProps {
  data: Array<{
    label: string
    value: string | number
    description?: string
    status?: 'success' | 'warning' | 'error' | 'neutral'
    unit?: string
  }>
  className?: string
  columns?: 1 | 2 | 3 | 4
  spacing?: 'compact' | 'default' | 'comfortable'
}

export function DesktopDataDisplay({
  data,
  className,
  columns = 2,
  spacing = 'default',
}: DesktopDataDisplayProps) {
  const spacingClass = spacing === 'compact' ? 'gap-4' :
                      spacing === 'comfortable' ? 'gap-8' :
                      'gap-6'

  return (
    <dl
      className={cn(
        'grid',
        `grid-cols-1 md:grid-cols-${columns}`,
        spacingClass,
        'data-list',
        className
      )}
    >
      {data.map((item, index) => (
        <div key={index} className="space-y-1">
          <dt className="text-sm font-medium text-muted-foreground">
            {item.label}
          </dt>
          <dd className="flex items-baseline gap-2">
            <span
              className={cn(
                'text-lg font-semibold',
                item.status === 'success' && 'text-success',
                item.status === 'warning' && 'text-warning',
                item.status === 'error' && 'text-destructive'
              )}
            >
              {item.value}
            </span>
            {item.unit && (
              <span className="text-sm text-muted-foreground">{item.unit}</span>
            )}
          </dd>
          {item.description && (
            <div className="text-xs text-muted-foreground">
              {item.description}
            </div>
          )}
        </div>
      ))}
    </dl>
  )
}

// Desktop-optimized Badge group with overflow handling
interface DesktopBadgeGroupProps {
  badges: Array<{
    label: string
    variant?: 'default' | 'secondary' | 'outline' | 'destructive'
    count?: number
  }>
  className?: string
  maxVisible?: number
  spacing?: 'compact' | 'default' | 'comfortable'
}

export function DesktopBadgeGroup({
  badges,
  className,
  maxVisible = 5,
  spacing = 'default',
}: DesktopBadgeGroupProps) {
  const visibleBadges = badges.slice(0, maxVisible)
  const remainingCount = badges.length - maxVisible

  const spacingClass = spacing === 'compact' ? 'gap-2' :
                      spacing === 'comfortable' ? 'gap-4' :
                      'gap-3'

  return (
    <div className={cn('flex flex-wrap items-center', spacingClass, className)}>
      {visibleBadges.map((badge, index) => (
        <Badge key={index} variant={badge.variant}>
          {badge.label}
          {badge.count && (
            <span className="ml-1 rounded-full bg-background/20 px-1 text-xs">
              {badge.count}
            </span>
          )}
        </Badge>
      ))}
      {remainingCount > 0 && (
        <Badge variant="outline" className="text-muted-foreground">
          +{remainingCount} more
        </Badge>
      )}
    </div>
  )
}

// Desktop-optimized Panel with collapsible sections
interface DesktopPanelProps {
  title: string
  children: React.ReactNode
  className?: string
  collapsible?: boolean
  defaultExpanded?: boolean
  actions?: React.ReactNode
  description?: string
}

export function DesktopPanel({
  title,
  children,
  className,
  collapsible = false,
  defaultExpanded = true,
  actions,
  description,
}: DesktopPanelProps) {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded)

  return (
    <DesktopCard className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              {collapsible && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-0 h-auto hover:bg-transparent"
                >
                  <span className={cn('transition-transform', isExpanded ? 'rotate-90' : '')}>
                    ▶
                  </span>
                </Button>
              )}
              <span>{title}</span>
            </CardTitle>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-2">{actions}</div>
          )}
        </div>
      </CardHeader>
      {(!collapsible || isExpanded) && (
        <CardContent className="pt-0">
          {children}
        </CardContent>
      )}
    </DesktopCard>
  )
}

// Desktop-optimized Toolbar with responsive layout
interface DesktopToolbarProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'compact' | 'prominent'
  alignment?: 'start' | 'center' | 'end' | 'between'
}

export function DesktopToolbar({
  children,
  className,
  variant = 'default',
  alignment = 'between',
}: DesktopToolbarProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-4 rounded-lg border bg-card p-4',
        variant === 'compact' && 'p-3 gap-3',
        variant === 'prominent' && 'p-6 gap-6 shadow-sm',
        alignment === 'start' && 'justify-start',
        alignment === 'center' && 'justify-center',
        alignment === 'end' && 'justify-end',
        alignment === 'between' && 'justify-between',
        className
      )}
    >
      {children}
    </div>
  )
}

// Desktop-optimized Quick Actions component
interface DesktopQuickActionsProps {
  actions: Array<{
    label: string
    icon?: React.ReactNode
    onClick: () => void
    variant?: 'default' | 'primary' | 'secondary'
    disabled?: boolean
  }>
  className?: string
  orientation?: 'horizontal' | 'vertical'
}

export function DesktopQuickActions({
  actions,
  className,
  orientation = 'horizontal',
}: DesktopQuickActionsProps) {
  return (
    <DesktopButtonGroup
      orientation={orientation}
      spacing="default"
      className={className}
    >
      {actions.map((action, index) => (
        <Button
          key={index}
          variant={action.variant}
          onClick={action.onClick}
          disabled={action.disabled}
          className="justify-start gap-2"
        >
          {action.icon}
          {action.label}
        </Button>
      ))}
    </DesktopButtonGroup>
  )
}

