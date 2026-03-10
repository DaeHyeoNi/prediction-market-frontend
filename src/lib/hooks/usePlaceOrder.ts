import { useMutation, useQueryClient } from '@tanstack/react-query'
import { placeOrder, getOrder } from '@/lib/api/orders'
import { PlaceOrderRequest, Order, OrderStatus } from '@/lib/types/api'
import { queryKeys } from './queryKeys'
import { useToast } from '@/context/ToastContext'

const POLL_INTERVAL_MS = 1000
const MAX_POLL_MS = 15000

async function pollOrderStatus(orderId: number): Promise<Order> {
  const start = Date.now()

  while (Date.now() - start < MAX_POLL_MS) {
    const order = await getOrder(orderId)
    if (order.status !== 'Pending') {
      return order
    }
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS))
  }

  // Return last known order even if still pending
  return getOrder(orderId)
}

export function usePlaceOrder(marketId: number) {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: async (data: PlaceOrderRequest) => {
      const response = await placeOrder(data)
      const finalOrder = await pollOrderStatus(response.order_id)
      return finalOrder
    },
    onMutate: async () => {
      // Optimistic: nothing to do without knowing order details yet
    },
    onSuccess: (order) => {
      const statusMessages: Record<OrderStatus, string> = {
        Filled: 'Order filled successfully!',
        PartiallyFilled: 'Order partially filled.',
        Cancelled: 'Order was cancelled.',
        Pending: 'Order is still pending.',
      }
      showToast(statusMessages[order.status] || 'Order placed.', 'success')
      queryClient.invalidateQueries({ queryKey: queryKeys.market(marketId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.orders })
      queryClient.invalidateQueries({ queryKey: queryKeys.positions })
    },
    onError: (error: unknown) => {
      const msg =
        (error as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        'Failed to place order.'
      showToast(msg, 'error')
    },
  })
}
