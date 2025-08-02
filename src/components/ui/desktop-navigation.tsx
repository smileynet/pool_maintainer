import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { 
  ChevronRight, 
  ChevronDown, 
  Menu, 
  ChevronLeft,
  MoreHorizontal 
} from 'lucide-react'
import { Button } from './button'

// Breadcrumb Navigation
interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ComponentType<{ className?: string }>
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
  maxItems?: number
  separator?: React.ReactNode
}

export function Breadcrumbs({ 
  items, 
  className,
  maxItems = 5,
  separator = <ChevronRight className="h-4 w-4 text-muted-foreground" />
}: BreadcrumbsProps) {
  const showCollapsed = items.length > maxItems
  const visibleItems = showCollapsed 
    ? [...items.slice(0, 1), { label: '...', href: undefined }, ...items.slice(-2)]
    : items

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center space-x-1', className)}>
      <ol className="flex items-center space-x-1">
        {visibleItems.map((item, index) => {
          const Icon = item.icon
          const isLast = index === visibleItems.length - 1
          const isEllipsis = item.label === '...'
          
          return (
            <li key={index} className="flex items-center">
              {index > 0 && <span className="mx-2">{separator}</span>}
              
              {isEllipsis ? (
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              ) : isLast ? (
                <span className="flex items-center gap-1 text-sm font-medium text-foreground">
                  {Icon && <Icon className="h-4 w-4" />}
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.href || '#'}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {item.label}
                </a>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

// Sidebar Navigation
interface NavItem {
  id: string
  label: string
  href?: string
  icon?: React.ComponentType<{ className?: string }>
  badge?: string | number
  children?: NavItem[]
}

interface SidebarNavProps {
  items: NavItem[]
  activeItem?: string
  onItemClick?: (item: NavItem) => void
  collapsible?: boolean
  defaultCollapsed?: boolean
  className?: string
}

export function SidebarNav({
  items,
  activeItem,
  onItemClick,
  collapsible = true,
  defaultCollapsed = false,
  className,
}: SidebarNavProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId)
    } else {
      newExpanded.add(itemId)
    }
    setExpandedItems(newExpanded)
  }

  const renderNavItem = (item: NavItem, depth = 0) => {
    const Icon = item.icon
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.has(item.id)
    const isActive = activeItem === item.id

    return (
      <li key={item.id}>
        <button
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.id)
            } else {
              onItemClick?.(item)
            }
          }}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all',
            'hover:bg-accent hover:text-accent-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            isActive && 'bg-accent text-accent-foreground',
            depth > 0 && 'ml-6'
          )}
        >
          {Icon && (
            <Icon className={cn('h-5 w-5 flex-shrink-0', collapsed && depth === 0 && 'h-6 w-6')} />
          )}
          
          {!collapsed && (
            <>
              <span className="flex-1 text-left">{item.label}</span>
              
              {item.badge && (
                <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1 text-xs text-primary-foreground">
                  {item.badge}
                </span>
              )}
              
              {hasChildren && (
                <ChevronDown
                  className={cn(
                    'h-4 w-4 transition-transform',
                    isExpanded && 'rotate-180'
                  )}
                />
              )}
            </>
          )}
        </button>

        {hasChildren && isExpanded && !collapsed && (
          <ul className="mt-1 space-y-1">
            {item.children!.map(child => renderNavItem(child, depth + 1))}
          </ul>
        )}
      </li>
    )
  }

  return (
    <nav className={cn('space-y-1', className)}>
      {collapsible && (
        <div className="mb-4 flex items-center justify-between">
          {!collapsed && (
            <h2 className="text-lg font-semibold">Navigation</h2>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className={cn('ml-auto', collapsed && 'mx-auto')}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      )}
      
      <ul className="space-y-1">
        {items.map(item => renderNavItem(item))}
      </ul>
    </nav>
  )
}

// Desktop App Shell with Navigation
interface DesktopAppShellProps {
  children: React.ReactNode
  sidebar?: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
  breadcrumbs?: BreadcrumbItem[]
  sidebarCollapsible?: boolean
  sidebarDefaultCollapsed?: boolean
  className?: string
}

export function DesktopAppShell({
  children,
  sidebar,
  header,
  footer,
  breadcrumbs,
  sidebarCollapsible = true,
  sidebarDefaultCollapsed = false,
  className,
}: DesktopAppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(!sidebarDefaultCollapsed)

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      {/* Header */}
      {header && (
        <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center gap-4">
            {sidebar && sidebarCollapsible && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            {header}
          </div>
        </header>
      )}

      <div className="flex flex-1">
        {/* Sidebar */}
        {sidebar && (
          <aside
            className={cn(
              'fixed inset-y-0 left-0 z-30 w-64 transform border-r border-border bg-background transition-transform duration-200 ease-in-out lg:static lg:translate-x-0',
              !sidebarOpen && '-translate-x-full',
              header && 'top-16'
            )}
          >
            <div className="h-full overflow-y-auto p-4">
              {sidebar}
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <div className="border-b border-border bg-muted/30 px-6 py-3">
              <Breadcrumbs items={breadcrumbs} />
            </div>
          )}
          
          <div className="container py-6">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      {footer && (
        <footer className="border-t border-border bg-muted/30">
          <div className="container py-4">
            {footer}
          </div>
        </footer>
      )}

      {/* Mobile Sidebar Overlay */}
      {sidebar && sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

// Tab Navigation for Desktop
interface TabItem {
  id: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
  badge?: string | number
}

interface TabNavigationProps {
  tabs: TabItem[]
  activeTab: string
  onTabChange: (tabId: string) => void
  variant?: 'default' | 'pills' | 'underline'
  className?: string
}

export function TabNavigation({
  tabs,
  activeTab,
  onTabChange,
  variant = 'default',
  className,
}: TabNavigationProps) {
  return (
    <nav className={cn('flex', variant === 'pills' && 'gap-2', className)}>
      {tabs.map(tab => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id

        if (variant === 'pills') {
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all',
                'hover:bg-accent hover:text-accent-foreground',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                isActive && 'bg-primary text-primary-foreground hover:bg-primary/90'
              )}
            >
              {Icon && <Icon className="h-4 w-4" />}
              {tab.label}
              {tab.badge && (
                <span className="ml-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-background px-1 text-xs">
                  {tab.badge}
                </span>
              )}
            </button>
          )
        }

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-all',
              'hover:text-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              isActive
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground',
              variant === 'underline' && 'border-b-2'
            )}
          >
            {Icon && <Icon className="h-4 w-4" />}
            {tab.label}
            {tab.badge && (
              <span className="ml-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-muted px-1 text-xs">
                {tab.badge}
              </span>
            )}
          </button>
        )
      })}
    </nav>
  )
}