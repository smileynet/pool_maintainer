import * as React from 'react'

import { cn } from '@/lib/utils'

interface InputProps extends React.ComponentProps<'input'> {
  error?: boolean
  helperText?: string
  label?: string
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
}

function Input({ 
  className, 
  type = 'text', 
  error = false,
  helperText,
  label,
  startIcon,
  endIcon,
  ...props 
}: InputProps) {
  const inputComponent = (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'input-base file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex w-full min-w-0 bg-transparent text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        error && 'border-destructive aria-invalid',
        startIcon && 'pl-10',
        endIcon && 'pr-10',
        className
      )}
      aria-invalid={error}
      {...props}
    />
  )

  if (label || startIcon || endIcon || helperText) {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </label>
        )}
        <div className="relative">
          {startIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {startIcon}
            </div>
          )}
          {inputComponent}
          {endIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {endIcon}
            </div>
          )}
        </div>
        {helperText && (
          <p className={cn(
            'text-xs',
            error ? 'text-destructive' : 'text-muted-foreground'
          )}>
            {helperText}
          </p>
        )}
      </div>
    )
  }

  return inputComponent
}

export { Input }
