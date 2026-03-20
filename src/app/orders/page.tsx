'use client'

import { useState, useEffect } from 'react'
import { useOrders } from '@/lib/hooks/useOrders'
import { useMarkets } from '@/lib/hooks/useMarkets'
import { useAuth } from '@/context/AuthContext'
import { useCancelOrder } from '@/lib/hooks/useCancelOrder'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Spinner from '@/components/ui/Spinner'
import OrderStatusBadge from '@/components/orders/OrderStatusBadge'
import { formatDate } from '@/lib/utils/format'
import { OrderStatus } from '@/lib/types/api'
import { cn } from '@/lib/utils/cn'

type Tab = 'active' | 'all'
const CANCELLABLE: OrderStatus[] = ['Pending', 'Open', 'Partial']

export default function OrdersPage() {
  const [tab, setTab] = useState<Tab>('active')
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { data: orders, isLoading } = useOrders()
  const { data: markets } = useMarkets()
  const { mutate: cancel, isPending: cancelling } = useCancelOrder()

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/login')
  }, [authLoading, user, router])

  if (authLoading || !user) {
    return <div className="flex justify-center py-12"><Spinner size="lg" /></div>
  }

  const marketMap = new Map(markets?.map(m => [m.id, m]) ?? [])

  const activeStatuses: OrderStatus[] = ['Pending', 'Open', 'Partial']
  const activeOrders = (orders ?? []).filter(o => activeStatuses.includes(o.status))
  const displayed = tab === 'active' ? activeOrders : (orders ?? [])

  const totalLocked = activeOrders.reduce((sum, o) => sum + (o.locked_points ?? 0), 0)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-gray-100">My Orders</h1>
        {totalLocked > 0 && (
          <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/50 px-3 py-1.5 text-xs">
            <span className="text-yellow-700 dark:text-yellow-400">Locked in orders: </span>
            <span className="font-mono font-semibold text-yellow-800 dark:text-yellow-300">{totalLocked.toLocaleString()} pts</span>
          </div>
        )}
      </div>

      <div className="mb-4 flex gap-1 border-b dark:border-gray-700">
        {(['active', 'all'] as Tab[]).map((t) => {
          const count = t === 'active' ? activeOrders.length : (orders?.length ?? 0)
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition',
                tab === t
                  ? 'border-b-2 border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              )}
            >
              {t === 'active' ? 'Active' : 'All Orders'}
              {count > 0 && (
                <span className={cn(
                  'rounded-full px-1.5 py-0.5 text-xs',
                  tab === t ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                )}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8"><Spinner /></div>
      ) : displayed.length === 0 ? (
        <p className="py-8 text-center text-gray-400 dark:text-gray-500">
          {tab === 'active' ? 'No active orders.' : 'No orders yet.'}
        </p>
      ) : (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-left text-xs text-gray-500 dark:text-gray-400">
                  <th className="px-4 py-3">Market</th>
                  <th className="px-4 py-3">Side</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Qty</th>
                  <th className="px-4 py-3">Rem.</th>
                  <th className="px-4 py-3">Locked</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {displayed.map((order) => {
                  const market = marketMap.get(order.market_id)
                  return (
                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-3">
                        <Link
                          href={`/markets/${order.market_id}`}
                          className="text-blue-600 dark:text-blue-400 hover:underline line-clamp-1 max-w-[200px] block"
                        >
                          {market?.title ?? `#${order.market_id}`}
                        </Link>
                      </td>
                      <td className={`px-4 py-3 font-semibold ${order.position === 'YES' ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                        {order.position}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                        {order.order_type === 'Bid' ? 'Buy' : 'Sell'}
                      </td>
                      <td className="px-4 py-3 font-mono font-medium dark:text-gray-200">{order.price}</td>
                      <td className="px-4 py-3 dark:text-gray-300">{order.quantity}</td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{order.remaining_quantity}</td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">{order.locked_points?.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">{formatDate(order.created_at)}</td>
                      <td className="px-4 py-3">
                        {CANCELLABLE.includes(order.status) && (
                          <button
                            onClick={() => cancel(order.id)}
                            disabled={cancelling}
                            className="rounded px-2 py-0.5 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400 disabled:opacity-50 transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
