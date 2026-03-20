import { MarketStatus } from '@/lib/types/api'
import { cn } from '@/lib/utils/cn'

const statusStyles: Record<MarketStatus, string> = {
  Open: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400',
  Closed: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400',
  Resolved: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400',
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
