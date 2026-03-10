import Link from 'next/link'
import { Market } from '@/lib/types/api'
import MarketStatusBadge from './MarketStatusBadge'
import { formatDate } from '@/lib/utils/format'

export default function MarketCard({ market }: { market: Market }) {
  return (
    <Link
      href={`/markets/${market.id}`}
      className="block rounded-lg border bg-white p-5 shadow-sm transition hover:shadow-md"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900 leading-snug">{market.title}</h3>
        <MarketStatusBadge status={market.status} />
      </div>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Closes: {formatDate(market.closes_at)}</span>
        {market.result && (
          <span className="font-medium text-blue-600">Result: {market.result}</span>
        )}
      </div>
    </Link>
  )
}
