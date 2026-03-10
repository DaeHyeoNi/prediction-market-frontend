import { OrderbookEntry } from '@/lib/types/api'
import OrderbookRow from './OrderbookRow'

interface OrderbookSideProps {
  bids: OrderbookEntry[]
  asks: OrderbookEntry[]
  label: string
}

export default function OrderbookSide({ bids, asks, label }: OrderbookSideProps) {
  const allQty = [...bids, ...asks].map((e) => e.quantity)
  const maxQty = allQty.length > 0 ? Math.max(...allQty) : 1

  const sortedAsks = [...asks].sort((a, b) => b.price - a.price)
  const sortedBids = [...bids].sort((a, b) => b.price - a.price)

  return (
    <div className="flex-1">
      <h4 className="mb-1 text-center text-sm font-semibold text-gray-700">{label}</h4>
      <div className="mb-1 flex justify-between px-2 text-xs text-gray-400">
        <span>Price</span>
        <span>Qty</span>
      </div>
      <div className="space-y-px">
        {sortedAsks.map((entry, i) => (
          <OrderbookRow key={i} entry={entry} side="ask" maxQty={maxQty} />
        ))}
      </div>
      <div className="my-1 border-t border-gray-200" />
      <div className="space-y-px">
        {sortedBids.map((entry, i) => (
          <OrderbookRow key={i} entry={entry} side="bid" maxQty={maxQty} />
        ))}
      </div>
    </div>
  )
}
