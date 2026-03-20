import { format, formatDistanceToNow } from 'date-fns'
import { MarketStatus } from '@/lib/types/api'

export function formatDate(dateStr: string): string {
  return format(new Date(dateStr), 'yyyy-MM-dd HH:mm')
}

export function formatRelativeDate(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true })
}

/** 간결한 상대 시간: "2m ago", "3h ago", "5d ago" */
export function formatCompactRelative(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const s = Math.floor(diff / 1000)
  if (s < 60) return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  return `${d}d ago`
}

export function marketStatusLabel(status: MarketStatus): string {
  return status
}
