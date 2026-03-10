import { MarketDetail } from '@/lib/types/api'
import OrderbookSide from './OrderbookSide'

interface OrderbookProps {
  orderbook: MarketDetail['orderbook']
}

export default function Orderbook({ orderbook }: OrderbookProps) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold text-gray-600 uppercase tracking-wide">Orderbook</h3>
      <div className="flex gap-4">
        <OrderbookSide
          label="YES"
          bids={orderbook.YES.bids}
          asks={orderbook.YES.asks}
        />
        <div className="w-px bg-gray-200" />
        <OrderbookSide
          label="NO"
          bids={orderbook.NO.bids}
          asks={orderbook.NO.asks}
        />
      </div>
    </div>
  )
}
