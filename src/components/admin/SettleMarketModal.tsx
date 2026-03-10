'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { settleMarket } from '@/lib/api/admin'
import { queryKeys } from '@/lib/hooks/queryKeys'
import { useToast } from '@/context/ToastContext'
import { Position } from '@/lib/types/api'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'

interface SettleMarketModalProps {
  marketId: number
  marketTitle: string
  isOpen: boolean
  onClose: () => void
}

export default function SettleMarketModal({
  marketId,
  marketTitle,
  isOpen,
  onClose,
}: SettleMarketModalProps) {
  const [result, setResult] = useState<Position>('YES')
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  const { mutate, isPending } = useMutation({
    mutationFn: () => settleMarket(marketId, { result }),
    onSuccess: () => {
      showToast('Market settled!', 'success')
      queryClient.invalidateQueries({ queryKey: queryKeys.markets })
      onClose()
    },
    onError: () => showToast('Failed to settle market.', 'error'),
  })

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settle Market">
      <p className="mb-4 text-sm text-gray-600">{marketTitle}</p>
      <div className="mb-4 flex gap-2">
        {(['YES', 'NO'] as Position[]).map((pos) => (
          <button
            key={pos}
            onClick={() => setResult(pos)}
            className={`flex-1 rounded py-2 text-sm font-semibold transition ${
              result === pos
                ? pos === 'YES'
                  ? 'bg-green-600 text-white'
                  : 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {pos}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <Button variant="secondary" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button onClick={() => mutate()} isLoading={isPending} className="flex-1">
          Settle as {result}
        </Button>
      </div>
    </Modal>
  )
}
