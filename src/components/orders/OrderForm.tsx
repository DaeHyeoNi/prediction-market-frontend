'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Position, OrderType, Orderbook } from '@/lib/types/api'
import { usePlaceOrder } from '@/lib/hooks/usePlaceOrder'
import { useMe } from '@/lib/hooks/useMe'
import { useAuth } from '@/context/AuthContext'
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
  orderbook?: Orderbook
  externalPrice?: number
  onExternalPriceConsumed?: () => void
}

export default function OrderForm({
  marketId,
  disabled,
  selectedPosition,
  onPositionChange,
  heldQuantity,
  orderbook,
  externalPrice,
  onExternalPriceConsumed,
}: OrderFormProps) {
  const { mutate: placeOrder, isPending } = usePlaceOrder(marketId)
  const [pendingOrder, setPendingOrder] = useState<FormValues | null>(null)
  const { user: authUser } = useAuth()
  const { data: meData } = useMe()
  const availablePoints = meData?.available_points ?? authUser?.available_points ?? 0

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
  const exceedsSellable = orderType === 'Ask' && Number(quantity) > heldQuantity

  // Best bid/ask from orderbook for quick price buttons
  const yesBook = orderbook
  const yesBestBid = yesBook?.yes_bids?.length ? Math.max(...yesBook.yes_bids.map(e => e.price)) : null
  const yesBestAsk = yesBook?.yes_asks?.length ? Math.min(...yesBook.yes_asks.map(e => e.price)) : null
  const noBestBid = yesBestAsk !== null ? 100 - yesBestAsk : null
  const noBestAsk = yesBestBid !== null ? 100 - yesBestBid : null
  const bestBid = selectedPosition === 'YES' ? yesBestBid : noBestBid
  const bestAsk = selectedPosition === 'YES' ? yesBestAsk : noBestAsk
  const midPrice = bestBid !== null && bestAsk !== null
    ? Math.round((bestBid + bestAsk) / 2)
    : bestBid !== null ? bestBid
    : bestAsk !== null ? bestAsk
    : 50

  // 오더북 가격 클릭 → 가격 자동 입력
  useEffect(() => {
    if (externalPrice !== undefined) {
      setValue('price', externalPrice, { shouldValidate: true })
      onExternalPriceConsumed?.()
    }
  }, [externalPrice, setValue, onExternalPriceConsumed])

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
          <p className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">{selectedPosition} Price</p>
          <div className="flex items-stretch gap-1">
            <button
              type="button"
              onClick={() => { const v = Number(price); if (v > 1) setValue('price', v - 1, { shouldValidate: true }) }}
              className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 font-bold text-sm transition-colors select-none"
            >−</button>
            <input
              type="number"
              min={1}
              max={99}
              {...register('price', { valueAsNumber: true })}
              className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-center text-sm font-mono font-medium outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            <button
              type="button"
              onClick={() => { const v = Number(price); if (v < 99) setValue('price', v + 1, { shouldValidate: true }) }}
              className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 font-bold text-sm transition-colors select-none"
            >+</button>
          </div>
          {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price.message}</p>}
          {/* Quick price buttons */}
          {(bestBid !== null || bestAsk !== null) && (
            <div className="mt-1.5 flex gap-1.5 flex-wrap">
              {bestBid !== null && (
                <button
                  type="button"
                  onClick={() => setValue('price', bestBid, { shouldValidate: true })}
                  className="rounded px-2 py-0.5 text-xs font-medium bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
                >
                  Bid {bestBid}
                </button>
              )}
              {bestAsk !== null && (
                <button
                  type="button"
                  onClick={() => setValue('price', bestAsk, { shouldValidate: true })}
                  className="rounded px-2 py-0.5 text-xs font-medium bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                >
                  Ask {bestAsk}
                </button>
              )}
              <button
                type="button"
                onClick={() => setValue('price', midPrice, { shouldValidate: true })}
                className="rounded px-2 py-0.5 text-xs font-medium bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Mid {midPrice}
              </button>
            </div>
          )}
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            {selectedPosition === 'YES' ? 'NO' : 'YES'} price: {companionPrice}
          </p>
        </div>

        {/* Quantity */}
        <div>
          <p className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</p>
          <div className="flex items-stretch gap-1">
            <button
              type="button"
              onClick={() => { const v = Number(quantity); if (v > 1) setValue('quantity', v - 1, { shouldValidate: true }) }}
              className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 font-bold text-sm transition-colors select-none"
            >−</button>
            <input
              type="number"
              min={1}
              max={orderType === 'Ask' ? heldQuantity : undefined}
              {...register('quantity', { valueAsNumber: true })}
              className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-center text-sm font-mono font-medium outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            <button
              type="button"
              onClick={() => {
                const v = Number(quantity)
                const max = orderType === 'Ask' ? heldQuantity : 9999
                if (v < max) setValue('quantity', v + 1, { shouldValidate: true })
              }}
              className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 font-bold text-sm transition-colors select-none"
            >+</button>
          </div>
          {errors.quantity && <p className="mt-1 text-xs text-red-500">{errors.quantity.message}</p>}
          {/* Quick quantity fill */}
          {orderType === 'Bid' && availablePoints > 0 && Number(price) > 0 && (
            <div className="mt-1.5 flex gap-1.5">
              {[['25%', 0.25], ['50%', 0.5], ['Max', 1]] .map(([label, pct]) => {
                const qty = Math.max(1, Math.floor((availablePoints * Number(pct)) / Number(price)))
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setValue('quantity', qty, { shouldValidate: true })}
                    className="flex-1 rounded px-1.5 py-0.5 text-xs font-medium bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          )}
          {orderType === 'Ask' && heldQuantity > 0 && (
            <div className="mt-1.5 flex gap-1.5">
              {[['25%', 0.25], ['50%', 0.5], ['Max', 1]] .map(([label, pct]) => {
                const qty = Math.max(1, Math.floor(heldQuantity * Number(pct)))
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setValue('quantity', qty, { shouldValidate: true })}
                    className="flex-1 rounded px-1.5 py-0.5 text-xs font-medium bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors"
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Balance + Cost summary */}
        <div className="rounded bg-gray-50 dark:bg-gray-800 px-3 py-2 space-y-1.5 text-xs">
          <div className="flex justify-between text-gray-500 dark:text-gray-400">
            <span>Available balance</span>
            <span className="font-mono font-medium text-gray-700 dark:text-gray-300">
              {availablePoints.toLocaleString()} pts
            </span>
          </div>
          {!isNaN(estimatedCost) && estimatedCost > 0 && (
            <div className="flex justify-between text-gray-500 dark:text-gray-400">
              <span>Est. {orderType === 'Bid' ? 'cost' : 'proceeds'}</span>
              <span className={`font-mono font-medium ${orderType === 'Bid' && estimatedCost > availablePoints ? 'text-red-500 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}>
                {estimatedCost.toLocaleString()} pts
              </span>
            </div>
          )}
          {orderType === 'Bid' && !isNaN(estimatedCost) && estimatedCost > availablePoints && (
            <p className="text-red-500 dark:text-red-400 font-medium">Insufficient balance</p>
          )}
          {exceedsSellable && (
            <p className="text-red-500 dark:text-red-400 font-medium">
              매도 가능 수량 초과 ({heldQuantity}주)
            </p>
          )}
        </div>

        <Button
          type="submit"
          isLoading={isPending}
          disabled={disabled || exceedsSellable || (orderType === 'Bid' && !isNaN(estimatedCost) && estimatedCost > availablePoints)}
          className="w-full">
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
