import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import type { PolymorphicComponentProps, IconableComponentProps } from '@/types'

const badgeVariants = cva(
  'badge-base focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden transition-[color,box-shadow] focus-visible:ring-[3px] [&>svg]:pointer-events-none [&>svg]:size-3',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground [a&]:hover:bg-primary/90 border-transparent',
        secondary:
          'bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90 border-transparent',
        destructive:
          'bg-destructive text-destructive-foreground [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 border-transparent',
        success:
          'border-transparent bg-success text-success-foreground focus-visible:ring-success/20 [a&]:hover:bg-success/90',
        warning:
          'border-transparent bg-warning text-warning-foreground focus-visible:ring-warning/20 [a&]:hover:bg-warning/90',
        critical:
          'border-transparent bg-destructive text-destructive-foreground focus-visible:ring-destructive/20 [a&]:hover:bg-destructive/90',
        outline: 'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

interface BadgeProps extends React.ComponentProps<'span'>, 
  VariantProps<typeof badgeVariants>,
  Omit<PolymorphicComponentProps, 'children' | 'className'>,
  Omit<IconableComponentProps, 'children' | 'className'> {
  removable?: boolean
  onRemove?: () => void
}

function Badge({
  className,
  variant = 'default',
  asChild = false,
  icon,
  iconPosition = 'left',
  removable = false,
  onRemove,
  children,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : 'span'

  return (
    <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props}>
      {icon && iconPosition === 'left' && icon}
      {children}
      {icon && iconPosition === 'right' && icon}
      {removable && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1 rounded-xs hover:bg-black/10 dark:hover:bg-white/10 p-0.5 transition-colors"
          aria-label="Remove"
        >
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </Comp>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export { Badge, badgeVariants }
