import { useEffect, useId, useRef, useState } from 'react'
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE_MB } from '@/config/constants'
import { cn } from '@/lib/utils'
import { FormField } from './FormField'
import { ImageIcon, XIcon } from './Icons'

type ImageInputProps = {
  value: File | null
  onChange: (file: File | null) => void
  onBlur?: () => void
  /** URL de una imagen ya guardada (modo edición) */
  currentUrl?: string | null
  label?: string
  error?: string
  hint?: string
  required?: boolean
  disabled?: boolean
}

export function ImageInput({
  value,
  onChange,
  onBlur,
  currentUrl,
  label,
  error,
  hint = `JPG, PNG o WEBP. Máximo ${MAX_IMAGE_SIZE_MB} MB.`,
  required,
  disabled,
}: ImageInputProps) {
  const id = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Sincroniza un recurso externo (object URL) con el archivo seleccionado y lo
  // libera al cambiar o desmontar. Es el caso de uso legítimo de un efecto.
  useEffect(() => {
    const url = value ? URL.createObjectURL(value) : null
    // oxlint-disable-next-line react/set-state-in-effect
    setPreviewUrl(url)
    return () => {
      if (url) URL.revokeObjectURL(url)
    }
  }, [value])

  const shownUrl = previewUrl ?? currentUrl ?? null

  const clear = () => {
    onChange(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <FormField id={id} label={label} error={error} hint={hint} required={required}>
      <div
        className={cn(
          'relative flex min-h-44 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed bg-white transition',
          error ? 'border-red-300' : 'border-slate-300 hover:border-brand-400',
          disabled && 'opacity-60',
        )}
      >
        {shownUrl ? (
          <img src={shownUrl} alt="Vista previa" className="max-h-72 w-full object-contain" />
        ) : (
          <div className="flex flex-col items-center gap-2 p-6 text-center text-slate-500">
            <ImageIcon className="size-8" />
            <span className="text-sm">Haz clic para seleccionar una imagen</span>
          </div>
        )}

        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES.join(',')}
          disabled={disabled}
          onBlur={onBlur}
          onChange={(event) => onChange(event.target.files?.[0] ?? null)}
          className="absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
        />

        {value && !disabled && (
          <button
            type="button"
            onClick={clear}
            aria-label="Quitar imagen seleccionada"
            className="absolute right-2 top-2 z-10 rounded-full bg-white/90 p-1.5 text-slate-600 shadow hover:text-red-600"
          >
            <XIcon className="size-4" />
          </button>
        )}
      </div>
      {value && <p className="truncate text-xs text-slate-500">{value.name}</p>}
    </FormField>
  )
}
