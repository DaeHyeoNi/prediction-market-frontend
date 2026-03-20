'use client'

import { useState } from 'react'
import { Market } from '@/lib/types/api'
import MarketStatusBadge from '@/components/markets/MarketStatusBadge'
import Button from '@/components/ui/Button'
import SettleMarketModal from './SettleMarketModal'
import { formatDate } from '@/lib/utils/format'

export default function MarketAdminRow({ market }: { market: Market }) {
  const [settleOpen, setSettleOpen] = useState(false)

  return (
    <>
      <tr className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
        <td className="py-3 pr-4 dark:text-gray-300">{market.id}</td>
        <td className="py-3 pr-4 dark:text-gray-200">{market.title}</td>
        <td className="py-3 pr-4">
          <MarketStatusBadge status={market.status} />
        </td>
        <td className="py-3 pr-4 text-xs text-gray-500 dark:text-gray-400">{formatDate(market.closes_at)}</td>
        <td className="py-3">
          <div className="flex gap-2">
            {market.status !== 'Resolved' && (
              <Button size="sm" onClick={() => setSettleOpen(true)}>
                Resolve
              </Button>
            )}
            {market.status === 'Resolved' && (
              <span className="text-xs text-gray-400 dark:text-gray-500">Result: {market.result}</span>
            )}
          </div>
        </td>
      </tr>
      <SettleMarketModal
        marketId={market.id}
        marketTitle={market.title}
        isOpen={settleOpen}
        onClose={() => setSettleOpen(false)}
      />
    </>
  )
}
