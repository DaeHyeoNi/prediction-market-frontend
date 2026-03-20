import { useQueries } from '@tanstack/react-query'
import { getOrderbook } from '@/lib/api/markets'
import { Market } from '@/lib/types/api'
import { queryKeys } from './queryKeys'

/**
 * Fetches best YES bid for each open market in parallel.
 * Returns a map of marketId → bestYesBid.
 */
export function useMarketPrices(markets: Market[] | undefined): Map<number, number> {
  const openMarkets = (markets ?? []).filter((m) => m.status === 'Open')

  const results = useQueries({
    queries: openMarkets.map((m) => ({
      queryKey: queryKeys.orderbook(m.id),
      queryFn: () => getOrderbook(m.id),
      staleTime: 10000,
      refetchInterval: 10000,
    })),
  })

  const priceMap = new Map<number, number>()
  openMarkets.forEach((market, i) => {
    const ob = results[i]?.data
    if (ob && ob.yes_bids.length > 0) {
      const bestBid = Math.max(...ob.yes_bids.map((e) => e.price))
      priceMap.set(market.id, bestBid)
    }
  })

  return priceMap
}
