import { format, formatDistanceToNow } from 'date-fns'
import { MarketStatus } from '@/lib/types/api'

export function formatDate(dateStr: string): string {
  return format(new Date(dateStr), 'yyyy-MM-dd HH:mm')
}

export function formatRelativeDate(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true })
}

export function marketStatusLabel(status: MarketStatus): string {
  return status
}
