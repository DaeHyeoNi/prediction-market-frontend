import { UserPosition } from '@/lib/types/api'

interface PositionListProps {
  positions: UserPosition[]
  marketId?: number
}

export default function PositionList({ positions, marketId }: PositionListProps) {
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
            <th className="pb-2 pr-4">Quantity</th>
            <th className="pb-2">Avg Price</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
          {filtered.map((pos) => (
            <tr key={pos.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              {!marketId && (
                <td className="py-2 pr-4 text-gray-600 dark:text-gray-400">#{pos.market_id}</td>
              )}
              <td className={`py-2 pr-4 font-semibold ${pos.position === 'YES' ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                {pos.position}
              </td>
              <td className="py-2 pr-4 dark:text-gray-200">{pos.quantity}</td>
              <td className="py-2 font-mono dark:text-gray-200">{pos.avg_price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
