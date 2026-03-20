import { useQuery } from '@tanstack/react-query'
import { getMyPositions } from '@/lib/api/positions'
import { queryKeys } from './queryKeys'

export function usePositions(enabled = true) {
  return useQuery({
    queryKey: queryKeys.positions,
    queryFn: getMyPositions,
    enabled,
  })
}
