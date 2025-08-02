/**
 * Central type exports
 * Re-exports all shared types for easy importing
 */

export * from './common-props'

// Re-export common React types for convenience
export type { 
  FC, 
  ReactNode, 
  ReactElement, 
  ComponentProps,
  ComponentPropsWithRef,
  ComponentPropsWithoutRef,
  HTMLAttributes,
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  FormHTMLAttributes,
  AnchorHTMLAttributes,
  MouseEvent,
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  FocusEvent,
  Ref,
  RefObject,
  MutableRefObject,
  ForwardedRef,
  CSSProperties
} from 'react'