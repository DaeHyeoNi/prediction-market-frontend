'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Position, OrderType } from '@/lib/types/api'
import { usePlaceOrder } from '@/lib/hooks/usePlaceOrder'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { cn } from '@/lib/utils/cn'

const schema = z.object({
  order_type: z.enum(['Bid', 'Ask']),
  price: z.number().min(1).max(99),
  quantity: z.number().min(1).int(),
})

type FormValues = z.infer<typeof schema>

interface OrderFormProps {
  marketId: number
  disabled?: boolean
  selectedPosition: Position
  onPositionChange: (p: Position) => void
  heldQuantity: number
}

export default function OrderForm({
  marketId,
  disabled,
  selectedPosition,
  onPositionChange,
  heldQuantity,
}: OrderFormProps) {
  const { mutate: placeOrder, isPending } = usePlaceOrder(marketId)
  const [pendingOrder, setPendingOrder] = useState<FormValues | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      order_type: 'Bid',
      price: 50,
      quantity: 1,
    },
  })

  const orderType = watch('order_type')
  const price = watch('price')
  const quantity = watch('quantity')
  const companionPrice = price ? 100 - Number(price) : 50
  const estimatedCost = Number(price) * Number(quantity)

  const onSubmit = (data: FormValues) => {
    setPendingOrder(data)
  }

  const confirmOrder = () => {
    if (!pendingOrder) return
    placeOrder({
      market_id: marketId,
      position: selectedPosition,
      order_type: pendingOrder.order_type as OrderType,
      price: pendingOrder.price,
      quantity: pendingOrder.quantity,
    })
    setPendingOrder(null)
  }

  const handlePositionChange = (pos: Position) => {
    onPositionChange(pos)
    setValue('order_type', 'Bid')
  }

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Place Order</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

        {/* Position toggle */}
        <div>
          <p className="mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">Position</p>
          <div className="flex gap-2">
            {(['YES', 'NO'] as Position[]).map((pos) => (
              <button
                key={pos}
                type="button"
                onClick={() => handlePositionChange(pos)}
                className={cn(
                  'flex-1 rounded py-2 text-sm font-semibold transition',
                  selectedPosition === pos
                    ? pos === 'YES'
                      ? 'bg-green-600 dark:bg-green-700 text-white'
                      : 'bg-red-600 dark:bg-red-700 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                )}
              >
                {pos}
              </button>
            ))}
          </div>
        </div>

        {/* Order type */}
        <div>
          <p className="mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">Order Type</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setValue('order_type', 'Bid')}
              className={cn(
                'flex-1 rounded py-2 text-sm font-semibold transition',
                orderType === 'Bid'
                  ? 'bg-blue-600 dark:bg-blue-700 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              )}
            >
              Buy
            </button>
            {heldQuantity > 0 && (
              <button
                type="button"
                onClick={() => setValue('order_type', 'Ask')}
                className={cn(
                  'flex-1 rounded py-2 text-sm font-semibold transition',
                  orderType === 'Ask'
                    ? 'bg-orange-500 dark:bg-orange-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                )}
              >
                Sell
                <span className="ml-1 text-xs opacity-75">({heldQuantity})</span>
              </button>
            )}
          </div>
        </div>

        {/* Price */}
        <div>
          <Input
            label={`${selectedPosition} Price`}
            type="number"
            min={1}
            max={99}
            {...register('price', { valueAsNumber: true })}
            error={errors.price?.message}
          />
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            {selectedPosition === 'YES' ? 'NO' : 'YES'} price: {companionPrice}
          </p>
        </div>

        {/* Quantity */}
        <Input
          label="Quantity"
          type="number"
          min={1}
          max={orderType === 'Ask' ? heldQuantity : undefined}
          {...register('quantity', { valueAsNumber: true })}
          error={errors.quantity?.message}
        />

        {/* Cost estimate */}
        {!isNaN(estimatedCost) && estimatedCost > 0 && (
          <div className="rounded bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs text-gray-500 dark:text-gray-400 flex justify-between">
            <span>Est. {orderType === 'Bid' ? 'cost' : 'proceeds'}</span>
            <span className="font-mono font-medium text-gray-700 dark:text-gray-300">
              {estimatedCost.toLocaleString()} pts
            </span>
          </div>
        )}

        <Button type="submit" isLoading={isPending} disabled={disabled} className="w-full">
          {isPending
            ? 'Processing...'
            : `${orderType === 'Bid' ? 'Buy' : 'Sell'} ${selectedPosition}`}
        </Button>

        {disabled && (
          <p className="text-center text-xs text-gray-500 dark:text-gray-500">Market is not open</p>
        )}
      </form>

      {/* Confirmation dialog */}
      {pendingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-80 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-2xl">
            <h4 className="mb-4 text-base font-semibold dark:text-gray-100">Confirm Order</h4>
            <div className="mb-4 space-y-2 rounded-lg bg-gray-50 dark:bg-gray-800 p-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Action</span>
                <span className={`font-semibold ${pendingOrder.order_type === 'Bid' ? 'text-blue-600 dark:text-blue-400' : 'text-orange-500 dark:text-orange-400'}`}>
                  {pendingOrder.order_type === 'Bid' ? 'Buy' : 'Sell'} {selectedPosition}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Price</span>
                <span className="font-mono font-medium dark:text-gray-200">{pendingOrder.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Quantity</span>
                <span className="font-mono font-medium dark:text-gray-200">{pendingOrder.quantity}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2">
                <span className="text-gray-600 dark:text-gray-300 font-medium">Total</span>
                <span className="font-mono font-bold dark:text-gray-100">
                  {(pendingOrder.price * pendingOrder.quantity).toLocaleString()} pts
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPendingOrder(null)}
                className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmOrder}
                className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
