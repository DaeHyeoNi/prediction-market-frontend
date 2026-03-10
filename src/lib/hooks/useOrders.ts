import { useQuery } from '@tanstack/react-query'
import { getMyOrders } from '@/lib/api/orders'
import { queryKeys } from './queryKeys'

export function useOrders() {
  return useQuery({
    queryKey: queryKeys.orders,
    queryFn: getMyOrders,
  })
}
