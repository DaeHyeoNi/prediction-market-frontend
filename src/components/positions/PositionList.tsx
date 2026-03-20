import { UserPosition } from '@/lib/types/api'

interface PositionListProps {
  positions: UserPosition[]
  marketId?: number
  currentYesPrice?: number | null
}

export default function PositionList({ positions, marketId, currentYesPrice }: PositionListProps) {
  const filtered = marketId
    ? positions.filter((p) => p.market_id === marketId)
    : positions

  if (filtered.length === 0) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">No positions yet.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b dark:border-gray-700 text-left text-xs text-gray-500 dark:text-gray-400">
            {!marketId && <th className="pb-2 pr-4">Market ID</th>}
            <th className="pb-2 pr-4">Position</th>
            <th className="pb-2 pr-4">Qty</th>
            <th className="pb-2 pr-4">Avg</th>
            {currentYesPrice !== undefined && <th className="pb-2 text-right">Unrealized P&L</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
          {filtered.map((pos) => {
            let unrealizedPnl: number | null = null
            if (currentYesPrice != null) {
              const currentPrice = pos.position === 'YES' ? currentYesPrice : 100 - currentYesPrice
              unrealizedPnl = Math.round((currentPrice - pos.avg_price) * pos.quantity)
            }
            return (
              <tr key={pos.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                {!marketId && (
                  <td className="py-2 pr-4 text-gray-600 dark:text-gray-400">#{pos.market_id}</td>
                )}
                <td className={`py-2 pr-4 font-semibold ${pos.position === 'YES' ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                  {pos.position}
                </td>
                <td className="py-2 pr-4 dark:text-gray-200">{pos.quantity}</td>
                <td className="py-2 pr-4 font-mono dark:text-gray-200">{pos.avg_price}¢</td>
                {currentYesPrice !== undefined && (
                  <td className={`py-2 text-right font-mono text-xs font-semibold ${
                    unrealizedPnl === null ? 'text-gray-400' :
                    unrealizedPnl > 0 ? 'text-green-600 dark:text-green-400' :
                    unrealizedPnl < 0 ? 'text-red-500 dark:text-red-400' :
                    'text-gray-500 dark:text-gray-400'
                  }`}>
                    {unrealizedPnl === null ? '—' : `${unrealizedPnl >= 0 ? '+' : ''}${unrealizedPnl}`}
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
