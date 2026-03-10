import { useMutation, useQueryClient } from '@tanstack/react-query'
import { placeOrder, getMyOrders } from '@/lib/api/orders'
import { PlaceOrderRequest, Order, OrderStatus } from '@/lib/types/api'
import { queryKeys } from './queryKeys'
import { useToast } from '@/context/ToastContext'

const MAX_POLL_MS = 10000
// 빠른 초기 체크 후 점진적으로 간격 증가: 200, 200, 300, 500, 1000, 1000...
const POLL_INTERVALS = [200, 200, 300, 500, 1000]

const TERMINAL_STATUSES: OrderStatus[] = ['Filled', 'Cancelled', 'Partial']

async function pollOrderStatus(orderId: number): Promise<Order> {
  const start = Date.now()
  let attempt = 0

  while (Date.now() - start < MAX_POLL_MS) {
    const interval = POLL_INTERVALS[Math.min(attempt, POLL_INTERVALS.length - 1)]
    await new Promise((resolve) => setTimeout(resolve, interval))

    const orders = await getMyOrders()
    const order = orders.find((o) => o.id === orderId)
    if (order && TERMINAL_STATUSES.includes(order.status)) {
      return order
    }
    attempt++
  }

  // Return last known state
  const orders = await getMyOrders()
  const order = orders.find((o) => o.id === orderId)
  if (!order) throw new Error('Order not found')
  return order
}

export function usePlaceOrder(marketId: number) {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: async (data: PlaceOrderRequest) => {
      const order = await placeOrder(data)
      const finalOrder = await pollOrderStatus(order.id)
      return finalOrder
    },
    onSuccess: (order) => {
      const messages: Record<string, string> = {
        Filled: 'Order filled!',
        Partial: 'Order partially filled.',
        Cancelled: 'Order was cancelled.',
        Open: 'Order is open.',
      }
      showToast(messages[order.status] || 'Order placed.', 'success')
      queryClient.invalidateQueries({ queryKey: queryKeys.market(marketId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.orderbook(marketId) })
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
