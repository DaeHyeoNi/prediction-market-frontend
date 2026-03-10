import { useQuery } from '@tanstack/react-query'
import { getMarkets } from '@/lib/api/markets'
import { queryKeys } from './queryKeys'

export function useMarkets() {
  return useQuery({
    queryKey: queryKeys.markets,
    queryFn: getMarkets,
  })
}
