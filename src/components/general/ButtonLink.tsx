import type { ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { buttonStyles, type ButtonSize, type ButtonVariant } from '@/lib/buttonStyles'

type ButtonLinkProps = LinkProps & {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: ReactNode
}

export function ButtonLink({ variant = 'primary', size = 'md', icon, className, children, ...props }: ButtonLinkProps) {
  return (
    <Link className={buttonStyles(variant, size, typeof className === 'string' ? className : undefined)} {...props}>
      {icon}
      {children}
    </Link>
  )
}
