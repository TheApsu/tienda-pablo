import { Card } from '@/components/general/Card'
import { ErrorState } from '@/components/general/ErrorState'
import { Spinner } from '@/components/general/Spinner'
import { useSaleProofUrl } from '@/hooks/useSales'

type SaleProofCardProps = {
  proofPath: string
  reference: string
}

/** Muestra la foto del comprobante (bucket privado → URL firmada). */
export function SaleProofCard({ proofPath, reference }: SaleProofCardProps) {
  const { data: url, isLoading, error, refetch } = useSaleProofUrl(proofPath)

  return (
    <Card
      title="Comprobante de pago"
      actions={
        url && (
          <a href={url} target="_blank" rel="noreferrer" className="text-sm font-medium text-brand-600 hover:underline">
            Abrir original
          </a>
        )
      }
    >
      {isLoading && (
        <div className="flex h-64 items-center justify-center">
          <Spinner className="size-6 text-brand-600" />
        </div>
      )}
      {error && <ErrorState error={error} title="No se pudo cargar el comprobante" onRetry={() => void refetch()} />}
      {url && (
        <a href={url} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
          <img src={url} alt={`Comprobante de la referencia ${reference}`} className="max-h-[32rem] w-full object-contain" />
        </a>
      )}
    </Card>
  )
}
