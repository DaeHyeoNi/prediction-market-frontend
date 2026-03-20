'use client'

import { useState, useEffect } from 'react'
import { usePositions } from '@/lib/hooks/usePositions'
import { useMarkets } from '@/lib/hooks/useMarkets'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Spinner from '@/components/ui/Spinner'
import { cn } from '@/lib/utils/cn'
import Link from 'next/link'

type Tab = 'active' | 'resolved'

export default function PositionsPage() {
  const [tab, setTab] = useState<Tab>('active')
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { data: positions, isLoading: posLoading } = usePositions()
  const { data: markets } = useMarkets()

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/login')
  }, [authLoading, user, router])

  if (authLoading || !user) {
    return <div className="flex justify-center py-12"><Spinner size="lg" /></div>
  }

  const marketMap = new Map(markets?.map((m) => [m.id, m]) ?? [])

  // 마켓 상태로 분류
  const activePositions = (positions ?? []).filter((pos) => {
    const market = marketMap.get(pos.market_id)
    return !market || market.status !== 'Resolved'
  })
  const resolvedPositions = (positions ?? []).filter((pos) => {
    const market = marketMap.get(pos.market_id)
    return market?.status === 'Resolved'
  })

  const displayed = tab === 'active' ? activePositions : resolvedPositions

  const PositionCard = ({ pos }: { pos: typeof displayed[number] }) => {
    const market = marketMap.get(pos.market_id)
    const totalCost = pos.quantity * pos.avg_price
    const isResolved = market?.status === 'Resolved'
    const isWinner = isResolved && market?.result === pos.position
    const isLoser = isResolved && market?.result !== null && market?.result !== pos.position
    // 해결된 경우 PnL 계산: 승리시 (100 - avg_price) * qty, 패배시 -avg_price * qty
    const resolvedPnl = isResolved
      ? isWinner
        ? (100 - pos.avg_price) * pos.quantity
        : -pos.avg_price * pos.quantity
      : null

    return (
      <Link
        href={`/markets/${pos.market_id}`}
        className={cn(
          'block rounded-lg border bg-white dark:bg-gray-900 p-4 transition hover:shadow-md',
          isWinner ? 'border-green-300 dark:border-green-800' : isLoser ? 'border-red-200 dark:border-red-900' : 'border-gray-200 dark:border-gray-700 dark:hover:border-gray-600'
        )}
      >
        <div className="mb-2 flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-2">
            {market?.title ?? `Market #${pos.market_id}`}
          </p>
          {isResolved && (
            <span className={cn(
              'shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold',
              isWinner ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
            )}>
              {isWinner ? 'Won' : 'Lost'}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className={cn(
            'rounded-full px-2.5 py-0.5 text-xs font-semibold',
            pos.position === 'YES' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
          )}>
            {pos.position}
          </span>
          <span className="font-mono text-sm text-gray-700 dark:text-gray-300">{pos.quantity} shares</span>
        </div>
        <div className="mt-2 flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Avg: <span className="font-mono">{pos.avg_price}</span></span>
          <span>Cost: <span className="font-mono">{totalCost.toLocaleString()}</span></span>
        </div>
        {resolvedPnl !== null && (
          <div className={cn(
            'mt-2 flex items-center justify-between text-xs font-semibold',
            resolvedPnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'
          )}>
            <span>P&L</span>
            <span className="font-mono">{resolvedPnl >= 0 ? '+' : ''}{resolvedPnl.toLocaleString()} pts</span>
          </div>
        )}
        {!isResolved && (
          <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
            Payout if wins: <span className="font-mono">{(pos.quantity * 100).toLocaleString()}</span>
          </div>
        )}
      </Link>
    )
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold dark:text-gray-100">My Positions</h1>

      <div className="mb-4 flex gap-1 border-b dark:border-gray-700">
        {(['active', 'resolved'] as Tab[]).map((t) => {
          const count = t === 'active' ? activePositions.length : resolvedPositions.length
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2 text-sm font-medium capitalize transition',
                tab === t
                  ? 'border-b-2 border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              )}
            >
              {t === 'active' ? 'Active' : 'Resolved'}
              {count > 0 && (
                <span className={cn(
                  'rounded-full px-1.5 py-0.5 text-xs',
                  tab === t ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                )}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {posLoading ? (
        <div className="flex justify-center py-8"><Spinner /></div>
      ) : displayed.length === 0 ? (
        <p className="py-8 text-center text-gray-400 dark:text-gray-500">
          {tab === 'active' ? 'No active positions.' : 'No resolved positions.'}
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {displayed.map((pos) => <PositionCard key={pos.id} pos={pos} />)}
        </div>
      )}
    </div>
  )
}
