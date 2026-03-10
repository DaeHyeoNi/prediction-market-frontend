import { useQuery } from '@tanstack/react-query'
import { getMarket } from '@/lib/api/markets'
import { queryKeys } from './queryKeys'

export function useMarket(id: number) {
  return useQuery({
    queryKey: queryKeys.market(id),
    queryFn: () => getMarket(id),
    refetchInterval: 3000,
  })
}
