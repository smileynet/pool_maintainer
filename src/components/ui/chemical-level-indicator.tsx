import React from 'react'
import { cn } from '@/lib/utils'
import { validateChemical, MAHC_STANDARDS } from '@/lib/mahc-validation'
import type { ChemicalType } from '@/lib/mahc-validation'

interface ChemicalLevelIndicatorProps {
  chemical: ChemicalType
  value: number
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ChemicalLevelIndicator({ 
  chemical, 
  value, 
  showLabel = true, 
  size = 'md',
  className 
}: ChemicalLevelIndicatorProps) {
  const validation = validateChemical(value, chemical)
  const standard = MAHC_STANDARDS[chemical]
  
  // Calculate position on the scale (0-100%)
  const range = standard.max - standard.min
  const position = Math.max(0, Math.min(100, ((value - standard.min) / range) * 100))
  
  // Ideal range positions
  const idealStart = ((standard.ideal.min - standard.min) / range) * 100
  const idealEnd = ((standard.ideal.max - standard.min) / range) * 100
  
  const statusColors = {
    good: 'bg-green-500',
    warning: 'bg-yellow-500',
    critical: 'bg-orange-500',
    emergency: 'bg-red-500'
  }
  
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  }
  
  const dotSizes = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4'
  }

  return (
    <div className={cn('space-y-1', className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground capitalize">
            {chemical === 'ph' ? 'pH' : chemical.replace(/([A-Z])/g, ' $1').trim()}
          </span>
          <span className={cn('font-medium', validation.color)}>
            {value} {standard.unit}
          </span>
        </div>
      )}
      
      <div className="relative">
        {/* Background track */}
        <div className={cn('bg-muted rounded-full', sizeClasses[size])} />
        
        {/* Ideal range */}
        <div 
          className={cn('absolute top-0 bg-green-200 rounded-full', sizeClasses[size])}
          style={{
            left: `${idealStart}%`,
            width: `${idealEnd - idealStart}%`
          }}
        />
        
        {/* Current value indicator */}
        <div 
          className={cn(
            'absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-white shadow-sm',
            statusColors[validation.status],
            dotSizes[size]
          )}
          style={{ left: `${position}%` }}
        />
        
        {/* Scale markers */}
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{standard.min}</span>
          <span className="text-green-600 font-medium">
            {standard.ideal.min}-{standard.ideal.max}
          </span>
          <span>{standard.max}</span>
        </div>
      </div>
    </div>
  )
}

// Compact version for dashboard cards
export function ChemicalMiniIndicator({ 
  chemical, 
  value, 
  className 
}: { 
  chemical: ChemicalType
  value: number
  className?: string 
}) {
  const validation = validateChemical(value, chemical)
  const standard = MAHC_STANDARDS[chemical]
  
  const statusColors = {
    good: 'bg-green-500',
    warning: 'bg-yellow-500', 
    critical: 'bg-orange-500',
    emergency: 'bg-red-500'
  }

  return (
    <div className={cn('flex items-center gap-2 text-sm', className)}>
      <div className={cn('h-2 w-2 rounded-full', statusColors[validation.status])} />
      <span className="text-muted-foreground min-w-0 flex-1">
        {chemical === 'ph' ? 'pH' : chemical.replace(/([A-Z])/g, ' $1').trim()}:
      </span>
      <span className="font-medium">
        {value} {standard.unit}
      </span>
    </div>
  )
}