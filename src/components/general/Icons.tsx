import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

function BaseIcon({ children, className = 'size-5', ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      {children}
    </svg>
  )
}

export const PlusIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M12 5v14M5 12h14" />
  </BaseIcon>
)

export const MinusIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M5 12h14" />
  </BaseIcon>
)

export const PencilIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </BaseIcon>
)

export const TrashIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6" />
  </BaseIcon>
)

export const CartIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <circle cx="9" cy="20" r="1" />
    <circle cx="18" cy="20" r="1" />
    <path d="M2 3h3l2.7 12.4a1 1 0 0 0 1 .8h9.7a1 1 0 0 0 1-.8L21 7H6" />
  </BaseIcon>
)

export const CheckIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="m5 12 5 5L20 7" />
  </BaseIcon>
)

export const XIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M18 6 6 18M6 6l12 12" />
  </BaseIcon>
)

export const LogoutIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
  </BaseIcon>
)

export const BoxIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M21 8 12 3 3 8v8l9 5 9-5Z" />
    <path d="m3 8 9 5 9-5M12 13v8" />
  </BaseIcon>
)

export const TagIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z" />
    <circle cx="7.5" cy="7.5" r="1.5" />
  </BaseIcon>
)

export const ReceiptIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2Z" />
    <path d="M9 8h6M9 12h6M9 16h3" />
  </BaseIcon>
)

export const HomeIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1Z" />
  </BaseIcon>
)

export const ChartIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M3 3v18h18M8 16v-5M13 16V8M18 16v-3" />
  </BaseIcon>
)

export const ImageIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-5-5L5 21" />
  </BaseIcon>
)

export const SearchIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </BaseIcon>
)

export const EyeIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
  </BaseIcon>
)

export const MenuIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </BaseIcon>
)

export const ArrowLeftIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </BaseIcon>
)

export const AlertIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
    <path d="M12 9v4M12 17h.01" />
  </BaseIcon>
)

export const InfoIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </BaseIcon>
)
