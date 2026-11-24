import { useId, type ReactNode } from 'react'

type TooltipProps = {
  content: string
  children: ReactNode
  position?: 'top' | 'bottom'
}

/** Tooltip ligero solo con CSS: aparece al pasar el mouse o al enfocar. */
export function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  const id = useId()
  const placement = position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'

  return (
    <span className="group relative inline-flex" aria-describedby={id}>
      {children}
      <span
        id={id}
        role="tooltip"
        className={`pointer-events-none absolute left-1/2 z-40 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs text-white opacity-0 shadow transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 ${placement}`}
      >
        {content}
      </span>
    </span>
  )
}
