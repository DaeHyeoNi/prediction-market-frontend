import Link from 'next/link'
import { Market, Position } from '@/lib/types/api'
import MarketStatusBadge from './MarketStatusBadge'
import { formatDate, formatRelativeDate } from '@/lib/utils/format'

export default function MarketCard({ market, bestYesBid, myPosition }: { market: Market; bestYesBid?: number; myPosition?: Position }) {
  const hasPrice = bestYesBid !== undefined
  const noPrice = hasPrice ? 100 - bestYesBid! : undefined
  const lastPrice = market.last_trade_price

  return (
    <Link
      href={`/markets/${market.id}`}
      className="block rounded-lg border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-900 p-5 shadow-sm transition hover:shadow-md dark:hover:border-gray-600 hover:border-gray-300"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2">{market.title}</h3>
        <div className="shrink-0 flex items-center gap-1.5">
          {myPosition && (
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${myPosition === 'YES' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'}`}>
              {myPosition}
            </span>
          )}
          <MarketStatusBadge status={market.status} />
        </div>
      </div>

      {market.status === 'Resolved' && market.result ? (
        <div className="mb-3 flex items-center gap-2">
          <span className={`text-sm font-bold px-2 py-0.5 rounded ${market.result === 'YES' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
            Resolved: {market.result}
          </span>
        </div>
      ) : market.status === 'Open' ? (
        <div className="mb-3 flex gap-2">
          <div className="flex-1 rounded bg-green-50 dark:bg-green-900/20 px-3 py-2 text-center">
            <p className="text-xs text-green-600 dark:text-green-500 mb-0.5">YES</p>
            <p className="font-mono font-bold text-green-700 dark:text-green-400">
              {hasPrice ? `${bestYesBid}¢` : lastPrice ? <span className="text-gray-500 dark:text-gray-400">{lastPrice}¢</span> : <span className="text-gray-400 dark:text-gray-600">—</span>}
            </p>
          </div>
          <div className="flex-1 rounded bg-red-50 dark:bg-red-900/20 px-3 py-2 text-center">
            <p className="text-xs text-red-500 dark:text-red-400 mb-0.5">NO</p>
            <p className="font-mono font-bold text-red-600 dark:text-red-400">
              {hasPrice ? `${noPrice}¢` : lastPrice ? <span className="text-gray-500 dark:text-gray-400">{100 - lastPrice}¢</span> : <span className="text-gray-400 dark:text-gray-600">—</span>}
            </p>
          </div>
          {!hasPrice && lastPrice && (
            <div className="flex items-end pb-2">
              <span className="text-xs text-gray-400 dark:text-gray-500">last</span>
            </div>
          )}
        </div>
      ) : market.status === 'Closed' ? (
        <div className="mb-3 flex items-center gap-2">
          <span className="text-xs text-yellow-600 dark:text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-0.5 rounded border border-yellow-200 dark:border-yellow-800/50">
            Pending resolution
          </span>
          {lastPrice && (
            <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">Last: {lastPrice}¢</span>
          )}
        </div>
      ) : null}

      {/* 확률 바 (Open 마켓, 가격 데이터 있을 때) */}
      {market.status === 'Open' && (hasPrice || lastPrice) && (() => {
        const yesProb = hasPrice ? bestYesBid! : lastPrice!
        return (
          <div className="mb-3">
            <div className="h-1.5 w-full rounded-full overflow-hidden bg-red-100 dark:bg-red-900/30">
              <div
                className="h-full rounded-full bg-green-500 dark:bg-green-600 transition-all duration-500"
                style={{ width: `${yesProb}%` }}
              />
            </div>
          </div>
        )
      })()}

      <div className="text-xs text-gray-400 dark:text-gray-500 flex items-center justify-between">
        {market.status === 'Resolved' ? (
          <span>Resolved {formatRelativeDate(market.resolved_at ?? market.closes_at)}</span>
        ) : (
          <>
            <span>Closes {formatRelativeDate(market.closes_at)}</span>
            <span className="text-gray-300 dark:text-gray-600">{formatDate(market.closes_at).split(' ')[0]}</span>
          </>
        )}
      </div>
    </Link>
  )
}
