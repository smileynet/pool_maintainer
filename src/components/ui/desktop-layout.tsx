import React from 'react'
import { cn } from '@/lib/utils'

interface DesktopLayoutProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'sidebar' | 'split' | 'holy-grail'
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'
  contentWidth?: 'narrow' | 'medium' | 'wide' | 'full'
}

export function DesktopLayout({
  children,
  className,
  variant = 'default',
  maxWidth = '2xl',
  contentWidth = 'full',
}: DesktopLayoutProps) {
  const containerClass = maxWidth === 'full' ? 'container' : `container container-${maxWidth}`
  
  if (variant === 'default') {
    return (
      <div className={cn(containerClass, `content-${contentWidth}`, className)}>
        {children}
      </div>
    )
  }
  
  const layoutClass = variant === 'sidebar' ? 'layout-sidebar' :
                     variant === 'split' ? 'layout-split' :
                     variant === 'holy-grail' ? 'layout-holy-grail' : ''
  
  return (
    <div className={cn(containerClass, layoutClass, className)}>
      {children}
    </div>
  )
}

interface GridContainerProps {
  children: React.ReactNode
  className?: string
  columns?: 'default' | 'wide' | 'ultra'
  gap?: 'sm' | 'md' | 'lg' | 'xl'
}

export function GridContainer({
  children,
  className,
  columns = 'default',
  gap,
}: GridContainerProps) {
  const gridClass = columns === 'wide' ? 'grid-container grid-container--wide' :
                   columns === 'ultra' ? 'grid-container grid-container--ultra' :
                   'grid-container'
  
  const gapClass = gap ? `gap-${gap}` : ''
  
  return (
    <div className={cn(gridClass, gapClass, className)}>
      {children}
    </div>
  )
}

interface GridItemProps {
  children: React.ReactNode
  className?: string
  span?: number | { mobile?: number; tablet?: number; desktop?: number }
  align?: 'start' | 'center' | 'end'
}

export function GridItem({
  children,
  className,
  span = 1,
  align,
}: GridItemProps) {
  let spanClasses = ''
  
  if (typeof span === 'number') {
    spanClasses = `col-span-${span}`
  } else {
    if (span.mobile) spanClasses += `col-span-${span.mobile} `
    if (span.tablet) spanClasses += `md:col-span-${span.tablet} `
    if (span.desktop) spanClasses += `lg:col-span-${span.desktop}`
  }
  
  const alignClass = align ? `self-${align}` : ''
  
  return (
    <div className={cn(spanClasses, alignClass, className)}>
      {children}
    </div>
  )
}

interface SidebarLayoutProps {
  sidebar: React.ReactNode
  main: React.ReactNode
  sidebarWidth?: 'narrow' | 'medium' | 'wide'
  className?: string
}

export function SidebarLayout({
  sidebar,
  main,
  sidebarWidth = 'medium',
  className,
}: SidebarLayoutProps) {
  const widthClass = sidebarWidth !== 'medium' ? `layout-sidebar--${sidebarWidth}` : ''
  
  return (
    <div className={cn('layout-sidebar', widthClass, className)}>
      <aside className="layout-sidebar__aside">
        {sidebar}
      </aside>
      <main className="layout-sidebar__main">
        {main}
      </main>
    </div>
  )
}

interface DashboardGridProps {
  children: React.ReactNode
  className?: string
}

export function DashboardGrid({ children, className }: DashboardGridProps) {
  return (
    <div className={cn('dashboard-grid', className)}>
      {children}
    </div>
  )
}

interface DashboardCardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'feature' | 'hero'
}

export function DashboardCard({
  children,
  className,
  variant = 'default',
}: DashboardCardProps) {
  const variantClass = variant === 'feature' ? 'dashboard-grid__feature' :
                      variant === 'hero' ? 'dashboard-grid__hero' : ''
  
  return (
    <div className={cn(variantClass, className)}>
      {children}
    </div>
  )
}

// Desktop-optimized spacing component
interface DesktopSpacerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  axis?: 'vertical' | 'horizontal' | 'both'
}

export function DesktopSpacer({ size = 'md', axis = 'vertical' }: DesktopSpacerProps) {
  const sizeMap = {
    xs: 'var(--layout-spacing-xs)',
    sm: 'var(--layout-spacing-sm)',
    md: 'var(--layout-spacing-md)',
    lg: 'var(--layout-spacing-lg)',
    xl: 'var(--layout-spacing-xl)',
    '2xl': 'var(--layout-spacing-2xl)',
    '3xl': 'var(--layout-spacing-3xl)',
  }
  
  const spacing = sizeMap[size]
  
  const style: React.CSSProperties = {
    display: 'block',
    width: axis === 'horizontal' || axis === 'both' ? spacing : undefined,
    height: axis === 'vertical' || axis === 'both' ? spacing : undefined,
    minWidth: axis === 'horizontal' || axis === 'both' ? spacing : undefined,
    minHeight: axis === 'vertical' || axis === 'both' ? spacing : undefined,
  }
  
  return <div style={style} aria-hidden="true" />
}

// Responsive visibility utilities
interface ResponsiveShowProps {
  children: React.ReactNode
  above?: 'sm' | 'md' | 'lg' | 'xl'
  below?: 'sm' | 'md' | 'lg' | 'xl'
  only?: 'mobile' | 'tablet' | 'desktop'
}

export function ResponsiveShow({ children, above, below, only }: ResponsiveShowProps) {
  let className = ''
  
  if (only === 'desktop') className = 'desktop-only'
  else if (only === 'mobile') className = 'mobile-only'
  else if (above) className = `hidden ${above}:block`
  else if (below) className = `block ${below}:hidden`
  
  return <div className={className}>{children}</div>
}