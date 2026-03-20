'use client'

import { Order, OrderStatus } from '@/lib/types/api'
import OrderStatusBadge from './OrderStatusBadge'
import { formatDate } from '@/lib/utils/format'
import { useCancelOrder } from '@/lib/hooks/useCancelOrder'

const CANCELLABLE: OrderStatus[] = ['Pending', 'Open', 'Partial']

interface OrderListProps {
  orders: Order[]
  marketId?: number
}

export default function OrderList({ orders, marketId }: OrderListProps) {
  const filtered = marketId ? orders.filter((o) => o.market_id === marketId) : orders
  const { mutate: cancel, isPending } = useCancelOrder()

  if (filtered.length === 0) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">No orders yet.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b dark:border-gray-700 text-left text-xs text-gray-500 dark:text-gray-400">
            <th className="pb-2 pr-4">Position</th>
            <th className="pb-2 pr-4">Type</th>
            <th className="pb-2 pr-4">Price</th>
            <th className="pb-2 pr-4">Qty</th>
            <th className="pb-2 pr-4">Rem.</th>
            <th className="pb-2 pr-4">Status</th>
            <th className="pb-2 pr-4">Date</th>
            <th className="pb-2"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
          {filtered.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td className={`py-2 pr-4 font-semibold ${order.position === 'YES' ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                {order.position}
              </td>
              <td className="py-2 pr-4 text-gray-600 dark:text-gray-400">{order.order_type === 'Bid' ? 'Buy' : 'Sell'}</td>
              <td className="py-2 pr-4 font-mono font-medium dark:text-gray-200">{order.price}</td>
              <td className="py-2 pr-4 dark:text-gray-200">{order.quantity}</td>
              <td className="py-2 pr-4 text-gray-500 dark:text-gray-400">{order.remaining_quantity}</td>
              <td className="py-2 pr-4">
                <OrderStatusBadge status={order.status} />
              </td>
              <td className="py-2 pr-4 text-xs text-gray-400">{formatDate(order.created_at)}</td>
              <td className="py-2">
                {CANCELLABLE.includes(order.status) && (
                  <button
                    onClick={() => cancel(order.id)}
                    disabled={isPending}
                    className="rounded px-2 py-0.5 text-xs text-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20 dark:text-red-400 disabled:opacity-50 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
