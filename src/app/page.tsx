'use client'

import { useState } from 'react'
import { useMarkets } from '@/lib/hooks/useMarkets'
import MarketCard from '@/components/markets/MarketCard'
import MarketFilter from '@/components/markets/MarketFilter'
import Spinner from '@/components/ui/Spinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import { MarketStatus } from '@/lib/types/api'

type FilterOption = MarketStatus | 'All'

export default function HomePage() {
  const [filter, setFilter] = useState<FilterOption>('All')
  const { data: markets, isLoading, error } = useMarkets()

  const filtered = markets
    ? filter === 'All'
      ? markets
      : markets.filter((m) => m.status === filter)
    : []

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Markets</h1>
        <MarketFilter value={filter} onChange={setFilter} />
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      )}

      {error && (
        <ErrorMessage message="Failed to load markets. Is the backend running?" />
      )}

      {!isLoading && !error && filtered.length === 0 && (
        <p className="py-12 text-center text-gray-500">No markets found.</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((market) => (
          <MarketCard key={market.id} market={market} />
        ))}
      </div>
    </div>
  )
}
