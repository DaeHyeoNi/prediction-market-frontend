'use client'

import { Trade } from '@/lib/types/api'

interface PriceSparklineProps {
  trades: Trade[]
  width?: number
  height?: number
}

export default function PriceSparkline({ trades, width = 120, height = 40 }: PriceSparklineProps) {
  if (trades.length < 2) {
    return (
      <div className="flex items-center justify-center" style={{ width, height }}>
        <span className="text-xs text-gray-400 dark:text-gray-600">—</span>
      </div>
    )
  }

  // Use last 30 trades, oldest first
  const points = [...trades].reverse().slice(-30)
  const prices = points.map(t => t.price)
  const minP = Math.min(...prices)
  const maxP = Math.max(...prices)
  const range = maxP - minP || 1

  const pad = 2
  const w = width - pad * 2
  const h = height - pad * 2

  const coords = prices.map((p, i) => ({
    x: pad + (i / (prices.length - 1)) * w,
    y: pad + (1 - (p - minP) / range) * h,
  }))

  const pathD = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(' ')

  // Area fill path
  const areaD = `${pathD} L ${coords[coords.length - 1].x.toFixed(1)} ${height} L ${coords[0].x.toFixed(1)} ${height} Z`

  const lastPrice = prices[prices.length - 1]
  const firstPrice = prices[0]
  const isUp = lastPrice >= firstPrice
  const color = isUp ? '#16a34a' : '#dc2626'
  const colorDark = isUp ? '#4ade80' : '#f87171'

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <defs>
        <linearGradient id={`sparkGrad-${isUp ? 'up' : 'dn'}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Area */}
      <path d={areaD} fill={`url(#sparkGrad-${isUp ? 'up' : 'dn'})`} className="dark:opacity-50" />
      {/* Line */}
      <path d={pathD} fill="none" stroke={color} strokeWidth="1.5" className="dark:stroke-[var(--spark-color)]" style={{ '--spark-color': colorDark } as React.CSSProperties} strokeLinecap="round" strokeLinejoin="round" />
      {/* Last dot */}
      <circle cx={coords[coords.length - 1].x} cy={coords[coords.length - 1].y} r="2" fill={color} className="dark:fill-[var(--spark-color)]" style={{ '--spark-color': colorDark } as React.CSSProperties} />
    </svg>
  )
}
