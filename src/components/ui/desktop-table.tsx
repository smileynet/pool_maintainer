import React from 'react'
import { cn } from '@/lib/utils'

interface DesktopTableProps {
  children: React.ReactNode
  className?: string
  density?: 'compact' | 'comfortable' | 'spacious'
  striped?: boolean
  hoverable?: boolean
}

export function DesktopTable({
  children,
  className,
  density = 'comfortable',
  striped = false,
  hoverable = true,
}: DesktopTableProps) {
  return (
    <div className="w-full overflow-auto">
      <table
        className={cn(
          'w-full border-collapse',
          density === 'compact' && 'table-compact',
          density === 'comfortable' && 'table-comfortable',
          density === 'spacious' && 'table-spacious',
          striped && 'table-striped',
          hoverable && 'table-hover',
          className
        )}
      >
        {children}
      </table>
    </div>
  )
}

interface DesktopTableHeaderProps {
  children: React.ReactNode
  className?: string
  sticky?: boolean
}

export function DesktopTableHeader({
  children,
  className,
  sticky = false,
}: DesktopTableHeaderProps) {
  return (
    <thead
      className={cn(
        'bg-muted/50 border-b border-border',
        sticky && 'sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        className
      )}
    >
      {children}
    </thead>
  )
}

interface DesktopTableBodyProps {
  children: React.ReactNode
  className?: string
}

export function DesktopTableBody({ children, className }: DesktopTableBodyProps) {
  return <tbody className={cn('', className)}>{children}</tbody>
}

interface DesktopTableRowProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'success' | 'warning' | 'destructive'
}

export function DesktopTableRow({
  children,
  className,
  variant = 'default',
}: DesktopTableRowProps) {
  return (
    <tr
      className={cn(
        'border-b border-border transition-colors',
        variant === 'success' && 'bg-success/5 hover:bg-success/10',
        variant === 'warning' && 'bg-warning/5 hover:bg-warning/10',
        variant === 'destructive' && 'bg-destructive/5 hover:bg-destructive/10',
        className
      )}
    >
      {children}
    </tr>
  )
}

interface DesktopTableCellProps {
  children: React.ReactNode
  className?: string
  align?: 'left' | 'center' | 'right'
  width?: 'auto' | 'min' | 'max'
}

export function DesktopTableCell({
  children,
  className,
  align = 'left',
  width = 'auto',
}: DesktopTableCellProps) {
  return (
    <td
      className={cn(
        'border-border text-foreground',
        align === 'left' && 'text-left',
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        width === 'min' && 'w-px whitespace-nowrap',
        width === 'max' && 'w-full',
        className
      )}
    >
      {children}
    </td>
  )
}

interface DesktopTableHeaderCellProps {
  children: React.ReactNode
  className?: string
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  sortDirection?: 'asc' | 'desc' | null
  onSort?: () => void
  width?: 'auto' | 'min' | 'max'
}

export function DesktopTableHeaderCell({
  children,
  className,
  align = 'left',
  sortable = false,
  sortDirection = null,
  onSort,
  width = 'auto',
}: DesktopTableHeaderCellProps) {
  return (
    <th
      className={cn(
        'border-border text-muted-foreground font-semibold text-sm',
        align === 'left' && 'text-left',
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        width === 'min' && 'w-px whitespace-nowrap',
        width === 'max' && 'w-full',
        sortable && 'cursor-pointer select-none hover:text-foreground',
        className
      )}
      onClick={sortable ? onSort : undefined}
    >
      <div className={cn('flex items-center', align === 'center' && 'justify-center', align === 'right' && 'justify-end')}>
        {children}
        {sortable && (
          <span className="ml-2 text-xs">
            {sortDirection === 'asc' && '↑'}
            {sortDirection === 'desc' && '↓'}
            {sortDirection === null && '↕'}
          </span>
        )}
      </div>
    </th>
  )
}

// Table density styles are applied via the spacing system
const tableStyles = `
/* Table spacing styles integrated with desktop spacing system */
.table-compact th,
.table-compact td {
  padding: var(--space-2) var(--space-4);
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.table-comfortable th,
.table-comfortable td {
  padding: var(--space-4) var(--space-6);
  font-size: 0.875rem;
  line-height: 1.5rem;
}

.table-spacious th,
.table-spacious td {
  padding: var(--space-6) var(--space-8);
  font-size: 1rem;
  line-height: 1.5rem;
}

@media (min-width: 1024px) {
  .table-comfortable th,
  .table-comfortable td {
    padding: var(--space-6) var(--space-8);
  }
  
  .table-spacious th,
  .table-spacious td {
    padding: var(--space-8) var(--space-10);
  }
}

.table-striped tbody tr:nth-child(even) {
  background-color: rgba(var(--muted), 0.3);
}

.table-hover tbody tr:hover {
  background-color: rgba(var(--accent), 0.1);
}

.table-striped.table-hover tbody tr:nth-child(even):hover {
  background-color: rgba(var(--accent), 0.15);
}
`

// Advanced table features for desktop usage
interface DesktopDataTableProps<T> {
  data: T[]
  columns: Array<{
    key: keyof T
    label: string
    sortable?: boolean
    align?: 'left' | 'center' | 'right'
    width?: 'auto' | 'min' | 'max'
    render?: (value: T[keyof T], item: T) => React.ReactNode
  }>
  className?: string
  density?: 'compact' | 'comfortable' | 'spacious'
  striped?: boolean
  hoverable?: boolean
  sortBy?: keyof T
  sortDirection?: 'asc' | 'desc'
  onSort?: (key: keyof T, direction: 'asc' | 'desc') => void
  emptyMessage?: string
  loading?: boolean
}

export function DesktopDataTable<T extends Record<string, unknown>>({
  data,
  columns,
  className,
  density = 'comfortable',
  striped = true,
  hoverable = true,
  sortBy,
  sortDirection,
  onSort,
  emptyMessage = 'No data available',
  loading = false,
}: DesktopDataTableProps<T>) {
  const handleSort = (key: keyof T) => {
    if (!onSort) return
    
    let newDirection: 'asc' | 'desc' = 'asc'
    if (sortBy === key && sortDirection === 'asc') {
      newDirection = 'desc'
    }
    onSort(key, newDirection)
  }

  if (loading) {
    return (
      <DesktopTable className={className} density={density} striped={striped} hoverable={hoverable}>
        <DesktopTableHeader>
          <DesktopTableRow>
            {columns.map((column) => (
              <DesktopTableHeaderCell key={String(column.key)} align={column.align} width={column.width}>
                {column.label}
              </DesktopTableHeaderCell>
            ))}
          </DesktopTableRow>
        </DesktopTableHeader>
        <DesktopTableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <DesktopTableRow key={index}>
              {columns.map((column) => (
                <DesktopTableCell key={String(column.key)} align={column.align} width={column.width}>
                  <div className="animate-pulse bg-muted rounded h-4 w-full" />
                </DesktopTableCell>
              ))}
            </DesktopTableRow>
          ))}
        </DesktopTableBody>
      </DesktopTable>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        {emptyMessage}
      </div>
    )
  }

  return (
    <DesktopTable className={className} density={density} striped={striped} hoverable={hoverable}>
      <DesktopTableHeader sticky>
        <DesktopTableRow>
          {columns.map((column) => (
            <DesktopTableHeaderCell
              key={String(column.key)}
              align={column.align}
              width={column.width}
              sortable={column.sortable}
              sortDirection={sortBy === column.key ? sortDirection : null}
              onSort={() => handleSort(column.key)}
            >
              {column.label}
            </DesktopTableHeaderCell>
          ))}
        </DesktopTableRow>
      </DesktopTableHeader>
      <DesktopTableBody>
        {data.map((item, index) => (
          <DesktopTableRow key={index}>
            {columns.map((column) => (
              <DesktopTableCell key={String(column.key)} align={column.align} width={column.width}>
                {column.render ? column.render(item[column.key], item) : String(item[column.key] || '')}
              </DesktopTableCell>
            ))}
          </DesktopTableRow>
        ))}
      </DesktopTableBody>
    </DesktopTable>
  )
}

// Inject styles if not already present
if (typeof document !== 'undefined') {
  const existingStyle = document.getElementById('desktop-table-styles')
  if (!existingStyle) {
    const style = document.createElement('style')
    style.id = 'desktop-table-styles'
    style.textContent = tableStyles
    document.head.appendChild(style)
  }
}

export {
  DesktopTable as Table,
  DesktopTableHeader as TableHeader,
  DesktopTableBody as TableBody,
  DesktopTableRow as TableRow,
  DesktopTableCell as TableCell,
  DesktopTableHeaderCell as TableHeaderCell,
  DesktopDataTable,
}