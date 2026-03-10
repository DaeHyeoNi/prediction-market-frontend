import { Orderbook as OrderbookType } from '@/lib/types/api'
import OrderbookSide from './OrderbookSide'

interface OrderbookProps {
  orderbook: OrderbookType
}

export default function Orderbook({ orderbook }: OrderbookProps) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-600">
        Orderbook
      </h3>
      <OrderbookSide
        label="YES"
        bids={orderbook.yes_bids}
        asks={orderbook.yes_asks}
      />
    </div>
  )
}
