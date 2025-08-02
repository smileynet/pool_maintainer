/**
 * Layout Wrapper Components for Auto-Constraints
 * Provides consistent layout patterns with automatic width and spacing constraints
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

interface LayoutWrapperProps extends React.ComponentProps<'div'> {
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'reading' | 'comfortable' | 'data' | 'full'
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  center?: boolean
  responsive?: boolean
}

/**
 * Main content wrapper with automatic width constraints
 */
function ContentWrapper({
  className,
  maxWidth = 'xl',
  spacing = 'md',
  center = true,
  responsive = true,
  children,
  ...props
}: LayoutWrapperProps) {
  const widthClasses = {
    xs: 'max-w-xs',
    sm: 'max-w-sm', 
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    reading: 'max-w-prose',
    comfortable: 'max-w-4xl',
    data: 'max-w-6xl',
    full: 'max-w-full'
  }

  const spacingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12'
  }

  return (
    <div
      className={cn(
        'w-full',
        widthClasses[maxWidth],
        spacingClasses[spacing],
        center && 'mx-auto',
        responsive && 'px-4 sm:px-6 lg:px-8',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * Page wrapper for main application content
 */
function PageWrapper({
  className,
  children,
  ...props
}: React.ComponentProps<'main'>) {
  return (
    <main
      className={cn(
        'layout-app min-h-screen py-8 page-enter',
        className
      )}
      {...props}
    >
      {children}
    </main>
  )
}

/**
 * Section wrapper for content grouping
 */
function SectionWrapper({
  className,
  spacing = 'md',
  children,
  ...props
}: LayoutWrapperProps) {
  const spacingClasses = {
    none: '',
    sm: 'space-y-4',
    md: 'space-y-6',
    lg: 'space-y-8',
    xl: 'space-y-12'
  }

  return (
    <section
      className={cn(
        'w-full',
        spacingClasses[spacing],
        className
      )}
      {...props}
    >
      {children}
    </section>
  )
}

/**
 * Grid wrapper with responsive columns
 */
interface GridWrapperProps extends React.ComponentProps<'div'> {
  cols?: 1 | 2 | 3 | 4 | 6 | 12
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  responsive?: boolean
}

function GridWrapper({
  className,
  cols = 1,
  gap = 'md',
  responsive = true,
  children,
  ...props
}: GridWrapperProps) {
  const colClasses = {
    1: 'grid-cols-1',
    2: responsive ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-2',
    3: responsive ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-3',
    4: responsive ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-4',
    6: responsive ? 'grid-cols-1 md:grid-cols-3 lg:grid-cols-6' : 'grid-cols-6',
    12: responsive ? 'grid-cols-1 md:grid-cols-6 lg:grid-cols-12' : 'grid-cols-12'
  }

  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  }

  return (
    <div
      className={cn(
        'grid',
        colClasses[cols],
        gapClasses[gap],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * Stack wrapper for vertical content flow
 */
interface StackWrapperProps extends React.ComponentProps<'div'> {
  spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  align?: 'start' | 'center' | 'end' | 'stretch'
}

function StackWrapper({
  className,
  spacing = 'md',
  align = 'stretch',
  children,
  ...props
}: StackWrapperProps) {
  const spacingClasses = {
    none: 'space-y-0',
    xs: 'space-y-1',
    sm: 'space-y-2',
    md: 'space-y-4',
    lg: 'space-y-6',
    xl: 'space-y-8'
  }

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  }

  return (
    <div
      className={cn(
        'flex flex-col',
        spacingClasses[spacing],
        alignClasses[align],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * Flex wrapper for horizontal content flow
 */
interface FlexWrapperProps extends React.ComponentProps<'div'> {
  direction?: 'row' | 'col'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch'
  wrap?: boolean
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

function FlexWrapper({
  className,
  direction = 'row',
  justify = 'start',
  align = 'start',
  wrap = false,
  gap = 'md',
  children,
  ...props
}: FlexWrapperProps) {
  const directionClasses = {
    row: 'flex-row',
    col: 'flex-col'
  }

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  }

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    baseline: 'items-baseline',
    stretch: 'items-stretch'
  }

  const gapClasses = {
    none: 'gap-0',
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  }

  return (
    <div
      className={cn(
        'flex',
        directionClasses[direction],
        justifyClasses[justify],
        alignClasses[align],
        wrap && 'flex-wrap',
        gapClasses[gap],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export {
  ContentWrapper,
  PageWrapper,
  SectionWrapper,
  GridWrapper,
  StackWrapper,
  FlexWrapper,
  type LayoutWrapperProps,
  type GridWrapperProps,
  type StackWrapperProps,
  type FlexWrapperProps
}