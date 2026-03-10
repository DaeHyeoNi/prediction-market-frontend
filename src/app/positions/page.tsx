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

  // Build market title map
  const marketMap = new Map(markets?.map((m) => [m.id, m]) ?? [])

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">My Positions</h1>

      {/* Tabs */}
      <div className="mb-4 flex gap-1 border-b">
        {(['active', 'resolved'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'px-4 py-2 text-sm font-medium capitalize transition',
              tab === t
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            {t === 'active' ? 'Active' : 'Resolved'}
          </button>
        ))}
      </div>

      {tab === 'active' ? (
        posLoading ? (
          <div className="flex justify-center py-8"><Spinner /></div>
        ) : !positions || positions.length === 0 ? (
          <p className="py-8 text-center text-gray-400">No active positions.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {positions.map((pos) => {
              const market = marketMap.get(pos.market_id)
              const totalCost = pos.quantity * pos.avg_price
              return (
                <Link
                  key={pos.id}
                  href={`/markets/${pos.market_id}`}
                  className="block rounded-lg border bg-white p-4 transition hover:shadow-md"
                >
                  <p className="mb-2 text-sm font-medium text-gray-800 line-clamp-2">
                    {market?.title ?? `Market #${pos.market_id}`}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={cn(
                      'rounded-full px-2.5 py-0.5 text-xs font-semibold',
                      pos.position === 'YES' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    )}>
                      {pos.position}
                    </span>
                    <span className="text-sm font-mono text-gray-700">{pos.quantity} shares</span>
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-gray-500">
                    <span>Avg: {pos.avg_price}</span>
                    <span>Cost: {totalCost.toLocaleString()}</span>
                  </div>
                </Link>
              )
            })}
          </div>
        )
      ) : (
        <p className="py-8 text-center text-gray-400">
          Resolved positions are not yet available.
        </p>
      )}
    </div>
  )
}
