import { ButtonLink } from '@/components/general/ButtonLink'
import { CheckIcon } from '@/components/general/Icons'
import { paths } from '@/router/paths'

type ReportSuccessProps = {
  reference?: string
}

export function ReportSuccess({ reference }: ReportSuccessProps) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 rounded-3xl border border-emerald-200 bg-white px-6 py-12 text-center shadow-sm">
      <span className="flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        <CheckIcon className="size-8" />
      </span>
      <h1 className="text-2xl font-bold text-slate-900">¡Reporte enviado!</h1>
      <p className="text-slate-600">
        Recibimos tu reporte de pago{reference && (
          <>
            {' '}con la referencia <strong className="text-slate-900">{reference}</strong>
          </>
        )}
        . Lo revisaremos y te contactaremos por correo.
      </p>
      <ButtonLink to={paths.home} className="mt-2">
        Volver a la tienda
      </ButtonLink>
    </div>
  )
}
