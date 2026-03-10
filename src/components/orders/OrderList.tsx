import { Order } from '@/lib/types/api'
import OrderStatusBadge from './OrderStatusBadge'
import { formatDate } from '@/lib/utils/format'

interface OrderListProps {
  orders: Order[]
  marketId?: number
}

export default function OrderList({ orders, marketId }: OrderListProps) {
  const filtered = marketId ? orders.filter((o) => o.market_id === marketId) : orders

  if (filtered.length === 0) {
    return <p className="text-sm text-gray-500">No orders yet.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-xs text-gray-500">
            <th className="pb-2 pr-4">Position</th>
            <th className="pb-2 pr-4">Type</th>
            <th className="pb-2 pr-4">Price</th>
            <th className="pb-2 pr-4">Qty</th>
            <th className="pb-2 pr-4">Filled</th>
            <th className="pb-2 pr-4">Status</th>
            <th className="pb-2">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {filtered.map((order) => (
            <tr key={order.id}>
              <td className="py-2 pr-4 font-medium">{order.position}</td>
              <td className="py-2 pr-4 text-gray-600">{order.order_type}</td>
              <td className="py-2 pr-4 font-mono">{order.price}</td>
              <td className="py-2 pr-4">{order.quantity}</td>
              <td className="py-2 pr-4">{order.filled_quantity}</td>
              <td className="py-2 pr-4">
                <OrderStatusBadge status={order.status} />
              </td>
              <td className="py-2 text-xs text-gray-500">{formatDate(order.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
