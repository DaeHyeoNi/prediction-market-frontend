import { OrderStatus } from '@/lib/types/api'
import { cn } from '@/lib/utils/cn'

const statusStyles: Record<OrderStatus, string> = {
  Pending: 'bg-gray-100 text-gray-600',
  Open: 'bg-yellow-100 text-yellow-800',
  Partial: 'bg-blue-100 text-blue-800',
  Filled: 'bg-green-100 text-green-800',
  Cancelled: 'bg-gray-100 text-gray-500',
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
