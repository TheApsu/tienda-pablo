import { Card } from '@/components/general/Card'
import { storeConfig } from '@/config/store.config'

export function PaymentInstructions() {
  return (
    <Card title="¿Cómo reportar tu pago?">
      <ol className="flex flex-col gap-3">
        {storeConfig.paymentInstructions.map((step, index) => (
          <li key={step} className="flex gap-3 text-sm text-slate-600">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
              {index + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>
    </Card>
  )
}
