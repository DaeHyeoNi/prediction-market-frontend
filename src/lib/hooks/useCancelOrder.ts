import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cancelOrder } from '@/lib/api/orders'
import { queryKeys } from './queryKeys'
import { useToast } from '@/context/ToastContext'

export function useCancelOrder() {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (orderId: number) => cancelOrder(orderId),
    onSuccess: () => {
      showToast('Order cancelled.', 'info')
      queryClient.invalidateQueries({ queryKey: queryKeys.orders })
      queryClient.invalidateQueries({ queryKey: queryKeys.me })
    },
    onError: () => {
      showToast('Failed to cancel order.', 'error')
    },
  })
}
