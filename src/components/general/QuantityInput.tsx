import { MinusIcon, PlusIcon } from './Icons'

type QuantityInputProps = {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  label?: string
}

export function QuantityInput({ value, onChange, min = 1, max = Number.POSITIVE_INFINITY, label = 'Cantidad' }: QuantityInputProps) {
  const set = (next: number) => onChange(Math.min(Math.max(next, min), max))

  return (
    <div className="inline-flex items-center rounded-lg border border-slate-300 bg-white" role="group" aria-label={label}>
      <button
        type="button"
        onClick={() => set(value - 1)}
        disabled={value <= min}
        aria-label="Disminuir"
        className="p-2 text-slate-600 hover:text-slate-900 disabled:opacity-40"
      >
        <MinusIcon className="size-4" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        value={value}
        min={min}
        max={Number.isFinite(max) ? max : undefined}
        aria-label={label}
        onChange={(event) => {
          const next = Number(event.target.value)
          if (!Number.isNaN(next)) set(next)
        }}
        className="w-12 border-x border-slate-200 py-1.5 text-center text-sm [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={() => set(value + 1)}
        disabled={value >= max}
        aria-label="Aumentar"
        className="p-2 text-slate-600 hover:text-slate-900 disabled:opacity-40"
      >
        <PlusIcon className="size-4" />
      </button>
    </div>
  )
}
