import { useQuery } from '@tanstack/react-query'
import { getMe } from '@/lib/api/auth'
import { queryKeys } from './queryKeys'

export function useMe() {
  const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('token')
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: getMe,
    refetchInterval: 5000,
    enabled: hasToken,
  })
}
