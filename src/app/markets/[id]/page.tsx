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
import PriceSparkline from '@/components/markets/PriceSparkline'
import Link from 'next/link'

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

  // 최우선 YES 가격 계산
  const yesBestBid = orderbook?.yes_bids?.length ? Math.max(...orderbook.yes_bids.map(e => e.price)) : null
  const yesBestAsk = orderbook?.yes_asks?.length ? Math.min(...orderbook.yes_asks.map(e => e.price)) : null
  const yesMid = yesBestBid !== null && yesBestAsk !== null ? Math.round((yesBestBid + yesBestAsk) / 2) : (yesBestBid ?? yesBestAsk)
  const noMid = yesMid !== null ? 100 - yesMid : null

  // 마지막 체결가
  const lastPrice = trades && trades.length > 0 ? trades[0].price : null

  return (
    <div>
      {/* Back nav */}
      <div className="mb-4">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Markets
        </Link>
      </div>

      {/* Header */}
      <div className="mb-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold dark:text-gray-100 leading-snug">{market.title}</h1>
            {market.description && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{market.description}</p>
            )}
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              {market.status === 'Resolved'
                ? `Resolved ${formatDate(market.resolved_at ?? market.closes_at)}`
                : `Closes ${formatDate(market.closes_at)}`}
            </p>
          </div>
          <MarketStatusBadge status={market.status} />
        </div>

        {/* Live price strip */}
        {market.status !== 'Resolved' ? (
          <div className="flex gap-3">
            <div className="flex-1 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 px-4 py-3">
              <p className="text-xs text-green-600 dark:text-green-500 mb-1 font-medium">YES</p>
              <p className="text-2xl font-bold font-mono text-green-700 dark:text-green-400">
                {yesMid ?? '—'}
              </p>
              {yesBestBid !== null && yesBestAsk !== null && (
                <p className="text-xs text-green-600/70 dark:text-green-600 mt-0.5">{yesBestBid} / {yesBestAsk}</p>
              )}
            </div>
            <div className="flex-1 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 px-4 py-3">
              <p className="text-xs text-red-500 dark:text-red-400 mb-1 font-medium">NO</p>
              <p className="text-2xl font-bold font-mono text-red-600 dark:text-red-400">
                {noMid ?? '—'}
              </p>
              {yesBestBid !== null && yesBestAsk !== null && (
                <p className="text-xs text-red-500/70 dark:text-red-600 mt-0.5">{100 - yesBestAsk} / {100 - yesBestBid}</p>
              )}
            </div>
            {lastPrice !== null && (
              <div className="rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">Last</p>
                <p className="text-2xl font-bold font-mono text-gray-700 dark:text-gray-200">{lastPrice}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">YES</p>
              </div>
            )}
          </div>
        ) : (
          <div className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold ${market.result === 'YES' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
            Result: {market.result}
          </div>
        )}
      </div>

      {/* Main grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        {orderbook ? (
          <Orderbook orderbook={orderbook} selectedPosition={selectedPosition} />
        ) : (
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4"></div>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-6 bg-gray-100 dark:bg-gray-800 rounded mb-1"></div>
            ))}
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
              orderbook={orderbook}
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

      {/* Recent Trades with price chart */}
      <div className="mt-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Recent Trades</h3>
          {trades && trades.length >= 2 && (
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400 dark:text-gray-500">Price history</span>
              <PriceSparkline trades={trades} width={100} height={32} />
            </div>
          )}
        </div>
        <TradeList trades={trades || []} />
      </div>
    </div>
  )
}
