import { OrderStatus } from '@/lib/types/api'
import { cn } from '@/lib/utils/cn'

const statusStyles: Record<OrderStatus, string> = {
  Pending: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
  Open: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400',
  Partial: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400',
  Filled: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400',
  Cancelled: 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-500',
}

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        statusStyles[status]
      )}
    >
      {status}
    </span>
  )
}
