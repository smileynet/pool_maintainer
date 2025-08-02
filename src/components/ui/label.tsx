'use client'

import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'

import { cn } from '@/lib/utils'
import type { FormComponentProps } from '@/types'

interface LabelProps extends React.ComponentProps<typeof LabelPrimitive.Root>,
  Pick<FormComponentProps, 'required' | 'error'> {}

function Label({ 
  className, 
  required = false,
  error = false,
  children,
  ...props 
}: LabelProps) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        'label-base flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        error && 'text-destructive',
        className
      )}
      {...props}
    >
      {children}
      {required && (
        <span className="text-destructive text-xs ml-1" aria-label="required">
          *
        </span>
      )}
    </LabelPrimitive.Root>
  )
}

export { Label }
