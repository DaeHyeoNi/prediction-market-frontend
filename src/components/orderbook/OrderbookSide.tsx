import { OrderbookEntry } from '@/lib/types/api'
import OrderbookRow from './OrderbookRow'

interface OrderbookSideProps {
  bids: OrderbookEntry[]
  asks: OrderbookEntry[]
  label: string
}

export default function OrderbookSide({ bids, asks, label }: OrderbookSideProps) {
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

  return (
    <div className="w-full">
      {/* 헤더 */}
      <div className="mb-1 flex justify-between px-2 text-xs font-medium text-gray-400">
        <span>Price ({label})</span>
        <span>Qty</span>
      </div>

      {/* ASK 영역 (높은 가격 → 낮은 가격) */}
      <div className="space-y-px">
        {sortedAsks.length === 0 ? (
          <p className="py-2 text-center text-xs text-gray-300">No asks</p>
        ) : (
          sortedAsks.map((entry, i) => (
            <OrderbookRow key={i} entry={entry} side="ask" maxQty={maxQty} />
          ))
        )}
      </div>

      {/* 스프레드 / 미드 */}
      <div className="my-2 flex items-center gap-2 border-y border-gray-100 px-2 py-1.5">
        {spread !== null ? (
          <>
            <span className="text-sm font-bold text-gray-700">{mid}</span>
            <span className="text-xs text-gray-400">Mid</span>
            <span className="ml-auto text-xs text-gray-400">
              Spread <span className="font-medium text-gray-600">{spread}</span>
            </span>
          </>
        ) : (
          <span className="w-full text-center text-xs text-gray-300">No spread</span>
        )}
      </div>

      {/* BID 영역 (높은 가격 → 낮은 가격) */}
      <div className="space-y-px">
        {sortedBids.length === 0 ? (
          <p className="py-2 text-center text-xs text-gray-300">No bids</p>
        ) : (
          sortedBids.map((entry, i) => (
            <OrderbookRow key={i} entry={entry} side="bid" maxQty={maxQty} />
          ))
        )}
      </div>
    </div>
  )
}
