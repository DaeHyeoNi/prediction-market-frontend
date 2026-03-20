import { Orderbook as OrderbookType, OrderbookEntry, Position } from '@/lib/types/api'
import OrderbookSide from './OrderbookSide'

interface OrderbookProps {
  orderbook: OrderbookType
  selectedPosition: Position
}

function mirrorEntries(entries: OrderbookEntry[]): OrderbookEntry[] {
  return entries.map((e) => ({ price: 100 - e.price, quantity: e.quantity }))
}

export default function Orderbook({ orderbook, selectedPosition }: OrderbookProps) {
  let bids: OrderbookEntry[]
  let asks: OrderbookEntry[]

  if (selectedPosition === 'YES') {
    bids = orderbook.yes_bids
    asks = orderbook.yes_asks
  } else {
    // NO 관점: YES ask → NO bid (100-price), YES bid → NO ask (100-price)
    bids = mirrorEntries(orderbook.yes_asks).sort((a, b) => b.price - a.price)
    asks = mirrorEntries(orderbook.yes_bids).sort((a, b) => a.price - b.price)
  }

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        Orderbook — {selectedPosition}
      </h3>
      <OrderbookSide label={selectedPosition} bids={bids} asks={asks} />
    </div>
  )
}
