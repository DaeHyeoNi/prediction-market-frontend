import { Trade } from '@/lib/types/api'
import { formatDate } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'

export default function TradeList({ trades }: { trades: Trade[] }) {
  if (trades.length === 0) {
    return <p className="text-sm text-gray-400">No trades yet.</p>
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-xs text-gray-400">
            <th className="pb-2 pr-4">Position</th>
            <th className="pb-2 pr-4">Price</th>
            <th className="pb-2 pr-4">Qty</th>
            <th className="pb-2">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {trades.map((t) => (
            <tr key={t.id}>
              <td className={cn('py-1.5 pr-4 font-medium', t.position === 'YES' ? 'text-green-600' : 'text-red-500')}>
                {t.position}
              </td>
              <td className="py-1.5 pr-4 font-mono">{t.price}</td>
              <td className="py-1.5 pr-4">{t.quantity}</td>
              <td className="py-1.5 text-xs text-gray-400">{formatDate(t.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
