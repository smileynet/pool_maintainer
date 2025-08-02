import React from 'react'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'
import { DesktopCard, DesktopButtonGroup } from './desktop-variants'
import type { BaseComponentProps, FormComponentProps, CollapsibleComponentProps } from '@/types'

// Desktop-optimized Form layout with intelligent grouping
type FormLayout = 'single' | 'two-column' | 'three-column'
type FormSpacing = 'compact' | 'default' | 'comfortable'

interface DesktopFormProps extends BaseComponentProps {
  onSubmit?: (e: React.FormEvent) => void
  title?: string
  description?: string
  actions?: React.ReactNode
  layout?: FormLayout
  spacing?: FormSpacing
}

export function DesktopForm({
  children,
  className,
  onSubmit,
  title,
  description,
  actions,
  layout = 'single',
  spacing = 'default',
}: DesktopFormProps) {
  const spacingClass = spacing === 'compact' ? 'space-y-4' :
                      spacing === 'comfortable' ? 'space-y-8' :
                      'space-y-6'

  const layoutClass = layout === 'two-column' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' :
                     layout === 'three-column' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' :
                     ''

  return (
    <DesktopCard className={className}>
      <form onSubmit={onSubmit} className={cn('p-6', spacingClass)}>
        {(title || description) && (
          <div className="header-section">
            {title && <h2 className="text-xl font-semibold">{title}</h2>}
            {description && <p className="text-muted-foreground">{description}</p>}
          </div>
        )}
        
        <div className={cn(spacingClass, layoutClass)}>
          {children}
        </div>
        
        {actions && (
          <div className="border-t border-border pt-6">
            {actions}
          </div>
        )}
      </form>
    </DesktopCard>
  )
}

// Desktop-optimized Form section with collapsible functionality
interface DesktopFormSectionProps extends BaseComponentProps, Omit<CollapsibleComponentProps, 'expanded' | 'onExpandedChange'> {
  title: string
  description?: string
  required?: boolean
}

export function DesktopFormSection({
  title,
  children,
  className,
  description,
  collapsible = false,
  defaultExpanded = true,
  required = false,
}: DesktopFormSectionProps) {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded)

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium flex items-center gap-2">
            {title}
            {required && <span className="text-destructive">*</span>}
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {collapsible && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2"
          >
            <span className={cn('transition-transform', isExpanded ? 'rotate-90' : '')}>
              ▶
            </span>
          </Button>
        )}
      </div>
      
      {(!collapsible || isExpanded) && (
        <div className="pl-4 border-l-2 border-muted space-y-4">
          {children}
        </div>
      )}
    </div>
  )
}

// Desktop-optimized Field group with enhanced layout
type FieldGroupLayout = 'horizontal' | 'vertical' | 'inline'
type FieldGroupAlign = 'start' | 'center' | 'end'

interface DesktopFieldGroupProps extends BaseComponentProps {
  layout?: FieldGroupLayout
  spacing?: FormSpacing
  align?: FieldGroupAlign
}

export function DesktopFieldGroup({
  children,
  className,
  layout = 'vertical',
  spacing = 'default',
  align = 'start',
}: DesktopFieldGroupProps) {
  const spacingClass = spacing === 'compact' ? 'gap-3' :
                      spacing === 'comfortable' ? 'gap-6' :
                      'gap-4'

  const layoutClasses = {
    horizontal: cn('flex flex-wrap', spacingClass, `items-${align}`),
    vertical: cn('flex flex-col', spacingClass),
    inline: cn('flex flex-wrap', spacingClass, 'items-end'),
  }

  return (
    <div className={cn(layoutClasses[layout], className)}>
      {children}
    </div>
  )
}

// Desktop-optimized Input field with enhanced UX
type InputFieldWidth = 'full' | 'auto' | 'sm' | 'md' | 'lg'

interface DesktopInputFieldProps extends Omit<FormComponentProps, 'error' | 'helperText'> {
  label: string
  type?: string
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  description?: string
  error?: string
  width?: InputFieldWidth
  prefix?: React.ReactNode
  suffix?: React.ReactNode
}

export function DesktopInputField({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  description,
  error,
  required = false,
  disabled = false,
  className,
  width = 'full',
  prefix,
  suffix,
}: DesktopInputFieldProps) {
  const widthClasses = {
    full: 'w-full',
    auto: 'w-auto',
    sm: 'w-32',
    md: 'w-48',
    lg: 'w-64',
  }

  return (
    <div className={cn('space-y-2', widthClasses[width], className)}>
      <Label htmlFor={id} className="flex items-center gap-1">
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      
      <div className="relative">
        {prefix && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            {prefix}
          </div>
        )}
        
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            prefix && 'pl-10',
            suffix && 'pr-10',
            error && 'border-destructive focus-visible:ring-destructive'
          )}
        />
        
        {suffix && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            {suffix}
          </div>
        )}
      </div>
      
      {description && !error && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  )
}

// Desktop-optimized Form actions with consistent spacing
type FormActionsAlignment = 'start' | 'center' | 'end' | 'between'
type FormActionsOrientation = 'horizontal' | 'vertical'

interface DesktopFormActionsProps extends BaseComponentProps {
  alignment?: FormActionsAlignment
  spacing?: FormSpacing
  orientation?: FormActionsOrientation
}

export function DesktopFormActions({
  children,
  className,
  alignment = 'end',
  spacing = 'default',
  orientation = 'horizontal',
}: DesktopFormActionsProps) {
  return (
    <DesktopButtonGroup
      orientation={orientation}
      spacing={spacing}
      alignment={alignment}
      className={className}
    >
      {children}
    </DesktopButtonGroup>
  )
}

// Desktop-optimized Multi-step form with progress indication
interface FormStep {
  title: string
  description?: string
  content: React.ReactNode
  optional?: boolean
}

interface DesktopMultiStepFormProps extends BaseComponentProps {
  steps: FormStep[]
  currentStep: number
  onStepChange: (step: number) => void
  showProgress?: boolean
}

export function DesktopMultiStepForm({
  steps,
  currentStep,
  onStepChange,
  className,
  showProgress = true,
}: DesktopMultiStepFormProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {showProgress && (
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <div
                className={cn(
                  'flex items-center gap-3 cursor-pointer transition-colors',
                  index === currentStep && 'text-primary',
                  index < currentStep && 'text-success',
                  index > currentStep && 'text-muted-foreground'
                )}
                onClick={() => onStepChange(index)}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-colors',
                    index === currentStep && 'border-primary bg-primary text-primary-foreground',
                    index < currentStep && 'border-success bg-success text-success-foreground',
                    index > currentStep && 'border-muted'
                  )}
                >
                  {index < currentStep ? '✓' : index + 1}
                </div>
                <div className="hidden md:block">
                  <div className="font-medium text-sm">{step.title}</div>
                  {step.optional && (
                    <div className="text-xs text-muted-foreground">Optional</div>
                  )}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 bg-muted mx-4',
                    index < currentStep && 'bg-success'
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      )}
      
      <DesktopCard>
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">{steps[currentStep]?.title}</h2>
            {steps[currentStep]?.description && (
              <p className="text-muted-foreground mt-1">{steps[currentStep].description}</p>
            )}
          </div>
          {steps[currentStep]?.content}
        </div>
      </DesktopCard>
    </div>
  )
}

// Desktop-optimized Form wizard navigation
interface DesktopFormWizardNavigationProps extends BaseComponentProps {
  currentStep: number
  totalSteps: number
  onPrevious: () => void
  onNext: () => void
  onSubmit?: () => void
  canGoNext?: boolean
  isSubmitting?: boolean
}

export function DesktopFormWizardNavigation({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSubmit,
  canGoNext = true,
  isSubmitting = false,
  className,
}: DesktopFormWizardNavigationProps) {
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === totalSteps - 1

  return (
    <DesktopFormActions alignment="between" className={className}>
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstStep}
      >
        Previous
      </Button>
      
      <div className="text-sm text-muted-foreground">
        Step {currentStep + 1} of {totalSteps}
      </div>
      
      {isLastStep ? (
        <Button
          type="submit"
          onClick={onSubmit}
          disabled={!canGoNext || isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onNext}
          disabled={!canGoNext}
        >
          Next
        </Button>
      )}
    </DesktopFormActions>
  )
}

export {
  DesktopForm,
  DesktopFormSection,
  DesktopFieldGroup,
  DesktopInputField,
  DesktopFormActions,
  DesktopMultiStepForm,
  DesktopFormWizardNavigation,
}