import { OrderbookEntry } from '@/lib/types/api'
import { cn } from '@/lib/utils/cn'

interface OrderbookRowProps {
  entry: OrderbookEntry
  side: 'bid' | 'ask'
  maxQty: number
  onPriceClick?: (price: number) => void
}

export default function OrderbookRow({ entry, side, maxQty, onPriceClick }: OrderbookRowProps) {
  const pct = maxQty > 0 ? (entry.quantity / maxQty) * 100 : 0

  return (
    <div
      className={cn(
        'relative flex items-center justify-between py-0.5 px-2 text-xs',
        onPriceClick && 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors'
      )}
      onClick={() => onPriceClick?.(entry.price)}
    >
      <div
        className={cn(
          'absolute inset-0 opacity-15',
          side === 'bid' ? 'bg-green-400' : 'bg-red-400'
        )}
        style={{ width: `${pct}%` }}
      />
      <span className={cn('relative font-mono', side === 'bid' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400')}>
        {entry.price}
      </span>
      <span className="relative text-gray-700 dark:text-gray-300">{entry.quantity}</span>
    </div>
  )
}
