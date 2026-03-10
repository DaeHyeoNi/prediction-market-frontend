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
    return <p className="text-sm text-gray-500">No positions yet.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-xs text-gray-500">
            {!marketId && <th className="pb-2 pr-4">Market ID</th>}
            <th className="pb-2 pr-4">Position</th>
            <th className="pb-2 pr-4">Quantity</th>
            <th className="pb-2">Avg Price</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {filtered.map((pos) => (
            <tr key={pos.id}>
              {!marketId && (
                <td className="py-2 pr-4 text-gray-700">#{pos.market_id}</td>
              )}
              <td className="py-2 pr-4 font-medium">{pos.position}</td>
              <td className="py-2 pr-4">{pos.quantity}</td>
              <td className="py-2 font-mono">{pos.avg_price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
