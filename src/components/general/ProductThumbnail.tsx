import { cn } from '@/lib/utils'
import { ImageIcon } from './Icons'

type ProductThumbnailProps = {
  src: string | null
  alt: string
  className?: string
}

/** Imagen de producto con un fallback cuando no hay foto. */
export function ProductThumbnail({ src, alt, className }: ProductThumbnailProps) {
  if (!src) {
    return (
      <div className={cn('flex items-center justify-center bg-slate-100 text-slate-400', className)}>
        <ImageIcon className="size-1/3 max-h-10 max-w-10" />
      </div>
    )
  }
  return <img src={src} alt={alt} loading="lazy" className={cn('bg-slate-100 object-cover', className)} />
}
