'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { resolveMarket } from '@/lib/api/admin'
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
    mutationFn: () => resolveMarket(marketId, { result }),
    onSuccess: () => {
      showToast('Market settlement initiated!', 'success')
      queryClient.invalidateQueries({ queryKey: queryKeys.markets })
      onClose()
    },
    onError: (e: unknown) => {
      const msg = (e as { response?: { data?: { detail?: string } } })?.response?.data?.detail || 'Failed to resolve market.'
      showToast(msg, 'error')
    },
  })

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Resolve Market">
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">{marketTitle}</p>
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
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
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
          Resolve as {result}
        </Button>
      </div>
    </Modal>
  )
}
