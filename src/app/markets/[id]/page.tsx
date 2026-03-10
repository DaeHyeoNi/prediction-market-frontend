'use client'

import { useParams } from 'next/navigation'
import { useMarket, useOrderbook } from '@/lib/hooks/useMarket'
import { useOrders } from '@/lib/hooks/useOrders'
import { usePositions } from '@/lib/hooks/usePositions'
import { useAuth } from '@/context/AuthContext'
import Orderbook from '@/components/orderbook/Orderbook'
import OrderForm from '@/components/orders/OrderForm'
import OrderList from '@/components/orders/OrderList'
import PositionList from '@/components/positions/PositionList'
import MarketStatusBadge from '@/components/markets/MarketStatusBadge'
import Spinner from '@/components/ui/Spinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import { formatDate } from '@/lib/utils/format'

export default function MarketDetailPage() {
  const params = useParams()
  const marketId = Number(params.id)
  const { user } = useAuth()

  const { data: market, isLoading, error } = useMarket(marketId)
  const { data: orderbook } = useOrderbook(marketId)
  const { data: orders } = useOrders()
  const { data: positions } = usePositions()

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !market) {
    return <ErrorMessage message="Market not found." />
  }

  const isOpen = market.status === 'Open'

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{market.title}</h1>
          {market.description && (
            <p className="mt-1 text-sm text-gray-500">{market.description}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">Closes: {formatDate(market.closes_at)}</p>
          {market.result && (
            <p className="mt-1 text-sm font-medium text-blue-600">Result: {market.result}</p>
          )}
        </div>
        <MarketStatusBadge status={market.status} />
      </div>

      {/* Main grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        {orderbook ? (
          <Orderbook orderbook={orderbook} />
        ) : (
          <div className="flex items-center justify-center rounded-lg border bg-white p-8">
            <Spinner />
          </div>
        )}

        <div>
          {user ? (
            <OrderForm marketId={marketId} disabled={!isOpen} />
          ) : (
            <div className="rounded-lg border bg-white p-6 text-center text-sm text-gray-500">
              <a href="/auth/login" className="text-blue-600 hover:underline">Login</a> to place orders
            </div>
          )}
        </div>
      </div>

      {/* User data for this market */}
      {user && (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border bg-white p-4">
            <h3 className="mb-3 text-sm font-semibold text-gray-600 uppercase tracking-wide">My Positions</h3>
            <PositionList positions={positions || []} marketId={marketId} />
          </div>
          <div className="rounded-lg border bg-white p-4">
            <h3 className="mb-3 text-sm font-semibold text-gray-600 uppercase tracking-wide">My Orders</h3>
            <OrderList orders={orders || []} marketId={marketId} />
          </div>
        </div>
      )}
    </div>
  )
}
