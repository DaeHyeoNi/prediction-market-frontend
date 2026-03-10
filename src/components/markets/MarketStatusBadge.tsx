import { MarketStatus } from '@/lib/types/api'
import { cn } from '@/lib/utils/cn'

const statusStyles: Record<MarketStatus, string> = {
  Open: 'bg-green-100 text-green-800',
  Closed: 'bg-yellow-100 text-yellow-800',
  Resolved: 'bg-gray-100 text-gray-800',
}

export default function MarketStatusBadge({ status }: { status: MarketStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        statusStyles[status]
      )}
    >
      {status}
    </span>
  )
}
