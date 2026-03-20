'use client'

import { useState } from 'react'
import { useMarkets } from '@/lib/hooks/useMarkets'
import MarketCard from '@/components/markets/MarketCard'
import MarketCardSkeleton from '@/components/markets/MarketCardSkeleton'
import MarketFilter from '@/components/markets/MarketFilter'
import ErrorMessage from '@/components/ui/ErrorMessage'
import { MarketStatus } from '@/lib/types/api'

type FilterOption = MarketStatus | 'All'

export default function HomePage() {
  const [filter, setFilter] = useState<FilterOption>('All')
  const [search, setSearch] = useState('')
  const { data: markets, isLoading, error } = useMarkets()

  const filtered = markets
    ? markets
        .filter((m) => filter === 'All' || m.status === filter)
        .filter((m) => !search || m.title.toLowerCase().includes(search.toLowerCase()))
    : []

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold dark:text-gray-100">Markets</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search markets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 pr-8 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <MarketFilter value={filter} onChange={setFilter} />
        </div>
      </div>

      {error && (
        <ErrorMessage message="Failed to load markets. Is the backend running?" />
      )}

      {!isLoading && !error && filtered.length === 0 && (
        <p className="py-12 text-center text-gray-500 dark:text-gray-400">
          {search ? `No markets matching "${search}"` : 'No markets found.'}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <MarketCardSkeleton key={i} />)
          : filtered.map((market) => (
              <MarketCard key={market.id} market={market} />
            ))
        }
      </div>
    </div>
  )
}
