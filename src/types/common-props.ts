/**
 * Common Props Interfaces
 * Consolidates shared prop patterns across components to reduce duplication
 * and improve type consistency
 */

import React from 'react'

/**
 * Base props for all components that render HTML elements
 */
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

/**
 * Props for components that can be rendered as a different element
 */
export interface PolymorphicComponentProps extends BaseComponentProps {
  asChild?: boolean
}

/**
 * Props for interactive components
 */
export interface InteractiveComponentProps extends BaseComponentProps {
  disabled?: boolean
  'aria-label'?: string
  'aria-describedby'?: string
  'aria-invalid'?: boolean
}

/**
 * Props for form-related components
 */
export interface FormComponentProps extends InteractiveComponentProps {
  id?: string
  name?: string
  required?: boolean
  error?: boolean
  helperText?: string
}

/**
 * Props for components with loading states
 */
export interface LoadableComponentProps extends BaseComponentProps {
  loading?: boolean
  loadingText?: string
}

/**
 * Props for container/layout components
 */
export interface ContainerComponentProps extends BaseComponentProps {
  as?: keyof JSX.IntrinsicElements
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

/**
 * Props for components with icons
 */
export interface IconableComponentProps extends BaseComponentProps {
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

/**
 * Props for components with variants
 */
export interface VariantComponentProps<T = string> extends BaseComponentProps {
  variant?: T
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

/**
 * Props for data display components
 */
export interface DataComponentProps<T = unknown> extends BaseComponentProps {
  data: T[]
  emptyMessage?: string
  loading?: boolean
  error?: Error | null
}

/**
 * Props for grid-based components
 */
export interface GridComponentProps extends ContainerComponentProps {
  cols?: 1 | 2 | 3 | 4 | 6 | 12
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  responsive?: boolean
}

/**
 * Props for flex-based components
 */
export interface FlexComponentProps extends ContainerComponentProps {
  direction?: 'row' | 'col'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch'
  wrap?: boolean
}

/**
 * Props for visibility control
 */
export interface VisibilityProps extends BaseComponentProps {
  show?: boolean
  showAbove?: 'sm' | 'md' | 'lg' | 'xl'
  showBelow?: 'sm' | 'md' | 'lg' | 'xl'
  hideOnPrint?: boolean
}

/**
 * Props for collapsible components
 */
export interface CollapsibleComponentProps extends BaseComponentProps {
  defaultExpanded?: boolean
  expanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
  collapsible?: boolean
}

/**
 * Props for components with actions
 */
export interface ActionableComponentProps<T = unknown> extends BaseComponentProps {
  onAction?: (item: T) => void
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  onView?: (item: T) => void
}

/**
 * Props for navigable components
 */
export interface NavigableComponentProps extends BaseComponentProps {
  href?: string
  to?: string
  onClick?: (event: React.MouseEvent) => void
  target?: '_blank' | '_self' | '_parent' | '_top'
  rel?: string
}

/**
 * Props for status-aware components
 */
export interface StatusComponentProps extends BaseComponentProps {
  status?: 'success' | 'warning' | 'error' | 'info' | 'neutral'
  statusMessage?: string
}

/**
 * Props for selectable components
 */
export interface SelectableComponentProps<T = unknown> extends BaseComponentProps {
  selected?: boolean
  onSelect?: (value: T) => void
  value?: T
  multiple?: boolean
}

/**
 * Props for sortable components
 */
export interface SortableComponentProps<T = string> extends BaseComponentProps {
  sortKey?: T
  sortDirection?: 'asc' | 'desc'
  onSort?: (key: T, direction: 'asc' | 'desc') => void
}

/**
 * Props for paginated components
 */
export interface PaginatedComponentProps extends BaseComponentProps {
  page?: number
  pageSize?: number
  totalItems?: number
  onPageChange?: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
}

/**
 * Props for theme-aware components
 */
export interface ThemeableComponentProps extends BaseComponentProps {
  theme?: 'light' | 'dark' | 'auto'
  colorScheme?: string
}

/**
 * Props for responsive components
 */
export interface ResponsiveComponentProps extends BaseComponentProps {
  hideOnMobile?: boolean
  hideOnTablet?: boolean
  hideOnDesktop?: boolean
  stackOnMobile?: boolean
}

/**
 * Utility type to combine multiple prop interfaces
 */
export type CombineProps<T extends Record<string, any>[]> = T extends [
  infer First,
  ...infer Rest
]
  ? First & CombineProps<Rest extends Record<string, any>[] ? Rest : []>
  : {}

/**
 * Utility type to make specific props required
 */
export type RequireProps<T, K extends keyof T> = T & Required<Pick<T, K>>

/**
 * Utility type to omit children from props (for void elements)
 */
export type PropsWithoutChildren<T> = Omit<T, 'children'>

/**
 * Utility type for ref-forwarded components
 */
export type ForwardedComponentProps<E extends React.ElementType, P = {}> = 
  React.ComponentPropsWithRef<E> & P

/**
 * Type guard to check if component has children
 */
export function hasChildren<T extends { children?: React.ReactNode }>(
  props: T
): props is T & { children: React.ReactNode } {
  return props.children !== undefined && props.children !== null
}

/**
 * Type guard to check if component is loading
 */
export function isLoading<T extends { loading?: boolean }>(
  props: T
): props is T & { loading: true } {
  return props.loading === true
}

/**
 * Type guard to check if component has error
 */
export function hasError<T extends { error?: boolean | Error | null }>(
  props: T
): boolean {
  return Boolean(props.error)
}