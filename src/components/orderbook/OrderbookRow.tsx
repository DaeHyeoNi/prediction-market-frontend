import { OrderbookEntry } from '@/lib/types/api'
import { cn } from '@/lib/utils/cn'

interface OrderbookRowProps {
  entry: OrderbookEntry
  side: 'bid' | 'ask'
  maxQty: number
}

export default function OrderbookRow({ entry, side, maxQty }: OrderbookRowProps) {
  const pct = maxQty > 0 ? (entry.quantity / maxQty) * 100 : 0

  return (
    <div className="relative flex items-center justify-between py-0.5 px-2 text-xs">
      <div
        className={cn(
          'absolute inset-0 opacity-15',
          side === 'bid' ? 'bg-green-400' : 'bg-red-400'
        )}
        style={{ width: `${pct}%` }}
      />
      <span className={cn('relative font-mono', side === 'bid' ? 'text-green-700' : 'text-red-700')}>
        {entry.price}
      </span>
      <span className="relative text-gray-700">{entry.quantity}</span>
    </div>
  )
}
