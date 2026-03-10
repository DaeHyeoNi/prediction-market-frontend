import { format, formatDistanceToNow } from 'date-fns'
import { MarketStatus, OrderStatus } from '@/lib/types/api'

export function formatPrice(price: number): string {
  return `${price}`
}

export function formatDate(dateStr: string): string {
  return format(new Date(dateStr), 'yyyy-MM-dd HH:mm')
}

export function formatRelativeDate(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true })
}

export function formatQuantity(qty: number): string {
  return qty.toLocaleString()
}

export function marketStatusLabel(status: MarketStatus): string {
  const map: Record<MarketStatus, string> = {
    Open: 'Open',
    Closed: 'Closed',
    Resolved: 'Resolved',
  }
  return map[status]
}

export function orderStatusLabel(status: OrderStatus): string {
  const map: Record<OrderStatus, string> = {
    Pending: 'Pending',
    Filled: 'Filled',
    Cancelled: 'Cancelled',
    PartiallyFilled: 'Partial',
  }
  return map[status]
}
