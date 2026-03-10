import { useMutation, useQueryClient } from '@tanstack/react-query'
import { placeOrder, getMyOrders } from '@/lib/api/orders'
import { PlaceOrderRequest, Order, OrderStatus } from '@/lib/types/api'
import { queryKeys } from './queryKeys'
import { useToast } from '@/context/ToastContext'

const MAX_POLL_MS = 10000
const POLL_INTERVALS = [200, 200, 300, 500, 1000]
const TERMINAL_STATUSES: OrderStatus[] = ['Filled', 'Cancelled', 'Partial']

async function pollUntilTerminal(
  orderId: number,
  onDone: (order: Order) => void
): Promise<void> {
  const start = Date.now()
  let attempt = 0

  while (Date.now() - start < MAX_POLL_MS) {
    const interval = POLL_INTERVALS[Math.min(attempt, POLL_INTERVALS.length - 1)]
    await new Promise((resolve) => setTimeout(resolve, interval))

    const orders = await getMyOrders()
    const order = orders.find((o) => o.id === orderId)
    if (order && TERMINAL_STATUSES.includes(order.status)) {
      onDone(order)
      return
    }
    attempt++
  }
}

export function usePlaceOrder(marketId: number) {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    // 202 받는 순간 완료 — 폴링은 백그라운드에서
    mutationFn: (data: PlaceOrderRequest) => placeOrder(data),
    onSuccess: (order) => {
      showToast('Order submitted!', 'info')

      // 백그라운드 폴링: 체결되면 쿼리 갱신 + 토스트
      pollUntilTerminal(order.id, (finalOrder) => {
        const messages: Record<string, string> = {
          Filled: 'Order filled!',
          Partial: 'Order partially filled.',
          Cancelled: 'Order was cancelled.',
        }
        showToast(messages[finalOrder.status] ?? 'Order updated.', 'success')
        queryClient.invalidateQueries({ queryKey: queryKeys.orderbook(marketId) })
        queryClient.invalidateQueries({ queryKey: queryKeys.orders })
        queryClient.invalidateQueries({ queryKey: queryKeys.positions })
      })
    },
    onError: (error: unknown) => {
      const msg =
        (error as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        'Failed to place order.'
      showToast(msg, 'error')
    },
  })
}
