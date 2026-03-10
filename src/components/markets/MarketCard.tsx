import Link from 'next/link'
import { Market } from '@/lib/types/api'
import MarketStatusBadge from './MarketStatusBadge'
import { formatDate } from '@/lib/utils/format'

export default function MarketCard({ market, bestYesBid }: { market: Market; bestYesBid?: number }) {
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
        <div className="flex items-center gap-2">
          {bestYesBid !== undefined && (
            <span className="font-medium text-green-600">YES {bestYesBid}</span>
          )}
          {market.result && (
            <span className="font-medium text-blue-600">Result: {market.result}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
