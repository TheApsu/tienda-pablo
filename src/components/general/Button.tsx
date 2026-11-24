import type { ComponentProps, ReactNode } from 'react'
import { buttonStyles, type ButtonSize, type ButtonVariant } from '@/lib/buttonStyles'
import { Spinner } from './Spinner'

type ButtonProps = ComponentProps<'button'> & {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  icon?: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  disabled,
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={buttonStyles(variant, size, className)}
      {...props}
    >
      {isLoading ? <Spinner className="size-4" /> : icon}
      {children}
    </button>
  )
}
