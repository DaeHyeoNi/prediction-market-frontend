import { Trade } from '@/lib/types/api'
import { formatDate, formatCompactRelative } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'

export default function TradeList({ trades }: { trades: Trade[] }) {
  if (trades.length === 0) {
    return <p className="text-sm text-gray-400 dark:text-gray-500">No trades yet.</p>
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b dark:border-gray-700 text-left text-xs text-gray-400 dark:text-gray-500">
            <th className="pb-2 pr-4">Position</th>
            <th className="pb-2 pr-4">Price</th>
            <th className="pb-2 pr-4">Qty</th>
            <th className="pb-2">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
          {trades.map((t, i) => {
            const prev = trades[i + 1]
            const dir = prev ? (t.price > prev.price ? 'up' : t.price < prev.price ? 'down' : 'flat') : 'flat'
            return (
              <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className={cn('py-1.5 pr-4 font-semibold', t.position === 'YES' ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400')}>
                  {t.position}
                </td>
                <td className="py-1.5 pr-4 font-mono">
                  <span className={cn(
                    'font-medium',
                    dir === 'up' ? 'text-green-600 dark:text-green-400' :
                    dir === 'down' ? 'text-red-500 dark:text-red-400' :
                    'text-gray-700 dark:text-gray-200'
                  )}>
                    {dir === 'up' ? '↑' : dir === 'down' ? '↓' : ''}{t.price}
                  </span>
                </td>
                <td className="py-1.5 pr-4 text-gray-600 dark:text-gray-300">{t.quantity}</td>
                <td className="py-1.5 text-xs text-gray-400 dark:text-gray-500" title={formatDate(t.created_at)}>
                  {formatCompactRelative(t.created_at)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
