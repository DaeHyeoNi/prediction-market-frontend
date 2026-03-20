'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useMarket, useOrderbook, useTrades } from '@/lib/hooks/useMarket'
import { useOrders } from '@/lib/hooks/useOrders'
import { usePositions } from '@/lib/hooks/usePositions'
import { useAuth } from '@/context/AuthContext'
import Orderbook from '@/components/orderbook/Orderbook'
import OrderForm from '@/components/orders/OrderForm'
import OrderList from '@/components/orders/OrderList'
import PositionList from '@/components/positions/PositionList'
import MarketStatusBadge from '@/components/markets/MarketStatusBadge'
import TradeList from '@/components/trades/TradeList'
import Spinner from '@/components/ui/Spinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import { formatDate } from '@/lib/utils/format'
import { Position } from '@/lib/types/api'

export default function MarketDetailPage() {
  const params = useParams()
  const marketId = Number(params.id)
  const { user } = useAuth()

  const [selectedPosition, setSelectedPosition] = useState<Position>('YES')

  const { data: market, isLoading, error } = useMarket(marketId)
  const { data: orderbook } = useOrderbook(marketId)
  const { data: orders } = useOrders()
  const { data: positions } = usePositions()
  const { data: trades } = useTrades(marketId)

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

  // 현재 마켓에서 선택된 포지션의 보유량
  const heldQuantity =
    positions?.find(
      (p) => p.market_id === marketId && p.position === selectedPosition
    )?.quantity ?? 0

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
          <Orderbook orderbook={orderbook} selectedPosition={selectedPosition} />
        ) : (
          <div className="flex items-center justify-center rounded-lg border bg-white p-8">
            <Spinner />
          </div>
        )}

        <div>
          {user ? (
            <OrderForm
              marketId={marketId}
              disabled={!isOpen}
              selectedPosition={selectedPosition}
              onPositionChange={setSelectedPosition}
              heldQuantity={heldQuantity}
            />
          ) : (
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 text-center text-sm text-gray-500 dark:text-gray-400">
              <a href="/auth/login" className="text-blue-600 dark:text-blue-400 hover:underline">Login</a> to place orders
            </div>
          )}
        </div>
      </div>

      {/* User data for this market */}
      {user && (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">My Positions</h3>
            <PositionList positions={positions || []} marketId={marketId} />
          </div>
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">My Orders</h3>
            <OrderList orders={orders || []} marketId={marketId} />
          </div>
        </div>
      )}

      {/* Recent Trades */}
      <div className="mt-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Recent Trades</h3>
        <TradeList trades={trades || []} />
      </div>
    </div>
  )
}
