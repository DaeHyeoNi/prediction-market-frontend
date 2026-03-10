import { useQuery } from '@tanstack/react-query'
import { getMarket, getOrderbook, getTrades } from '@/lib/api/markets'
import { queryKeys } from './queryKeys'

export function useMarket(id: number) {
  return useQuery({
    queryKey: queryKeys.market(id),
    queryFn: () => getMarket(id),
  })
}

export function useOrderbook(id: number) {
  return useQuery({
    queryKey: queryKeys.orderbook(id),
    queryFn: () => getOrderbook(id),
    refetchInterval: 3000,
  })
}

export function useTrades(id: number) {
  return useQuery({
    queryKey: queryKeys.trades(id),
    queryFn: () => getTrades(id),
    refetchInterval: 3000,
  })
}
