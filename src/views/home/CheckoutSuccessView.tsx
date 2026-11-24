import { useLocation } from 'react-router-dom'
import { ReportSuccess } from '@/components/home/ReportSuccess'

type LocationState = { reference?: string } | null

export function CheckoutSuccessView() {
  const location = useLocation()
  const reference = (location.state as LocationState)?.reference

  return <ReportSuccess reference={reference} />
}
