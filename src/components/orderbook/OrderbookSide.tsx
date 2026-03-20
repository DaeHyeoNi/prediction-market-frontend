'use client'

import { useState } from 'react'
import { OrderbookEntry } from '@/lib/types/api'
import OrderbookRow from './OrderbookRow'

const DEFAULT_LEVELS = 5

interface OrderbookSideProps {
  bids: OrderbookEntry[]
  asks: OrderbookEntry[]
  label: string
  onPriceClick?: (price: number) => void
}

export default function OrderbookSide({ bids, asks, label, onPriceClick }: OrderbookSideProps) {
  const [expanded, setExpanded] = useState(false)
  // 큰 가격 → 작은 가격 (위 → 아래)
  const sortedAsks = [...asks].sort((a, b) => b.price - a.price)
  const sortedBids = [...bids].sort((a, b) => b.price - a.price)

  const allQty = [...bids, ...asks].map((e) => e.quantity)
  const maxQty = allQty.length > 0 ? Math.max(...allQty) : 1

  // 최우선 호가
  const bestAsk = sortedAsks.length > 0 ? sortedAsks[sortedAsks.length - 1].price : null
  const bestBid = sortedBids.length > 0 ? sortedBids[0].price : null
  const spread = bestAsk !== null && bestBid !== null ? bestAsk - bestBid : null
  const mid = bestAsk !== null && bestBid !== null ? ((bestAsk + bestBid) / 2).toFixed(1) : null

  const visibleAsks = expanded ? sortedAsks : sortedAsks.slice(-DEFAULT_LEVELS)
  const visibleBids = expanded ? sortedBids : sortedBids.slice(0, DEFAULT_LEVELS)
  const hasMore = sortedAsks.length > DEFAULT_LEVELS || sortedBids.length > DEFAULT_LEVELS

  return (
    <div className="w-full">
      {/* 헤더 */}
      <div className="mb-1 flex justify-between px-2 text-xs font-medium text-gray-400 dark:text-gray-500">
        <span>Price ({label})</span>
        <span>Qty</span>
      </div>

      {/* ASK 영역 (높은 가격 → 낮은 가격) */}
      <div className="space-y-px">
        {sortedAsks.length === 0 ? (
          <p className="py-2 text-center text-xs text-gray-400 dark:text-gray-500">No asks</p>
        ) : (
          visibleAsks.map((entry, i) => (
            <OrderbookRow key={i} entry={entry} side="ask" maxQty={maxQty} onPriceClick={onPriceClick} />
          ))
        )}
      </div>

      {/* 스프레드 / 미드 */}
      <div className="my-2 flex items-center gap-2 border-y border-gray-100 dark:border-gray-700/60 px-2 py-1.5">
        {spread !== null ? (
          <>
            <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{mid}</span>
            <span className="text-xs text-gray-400 dark:text-gray-500">Mid</span>
            <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
              Spread <span className="font-medium text-gray-600 dark:text-gray-300">{spread}</span>
            </span>
          </>
        ) : (
          <span className="w-full text-center text-xs text-gray-400 dark:text-gray-500">No spread</span>
        )}
      </div>

      {/* BID 영역 (높은 가격 → 낮은 가격) */}
      <div className="space-y-px">
        {sortedBids.length === 0 ? (
          <p className="py-2 text-center text-xs text-gray-400 dark:text-gray-500">No bids</p>
        ) : (
          visibleBids.map((entry, i) => (
            <OrderbookRow key={i} entry={entry} side="bid" maxQty={maxQty} onPriceClick={onPriceClick} />
          ))
        )}
      </div>

      {/* 더 보기 버튼 */}
      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 w-full py-1 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          {expanded ? '▲ Show less' : `▼ Show all (${sortedAsks.length + sortedBids.length} levels)`}
        </button>
      )}
    </div>
  )
}
