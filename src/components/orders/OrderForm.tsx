'use client'

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
  const companionPrice = price ? 100 - Number(price) : 50

  const canAsk = heldQuantity > 0

  const onSubmit = (data: FormValues) => {
    placeOrder({
      market_id: marketId,
      position: selectedPosition,
      order_type: data.order_type as OrderType,
      price: data.price,
      quantity: data.quantity,
    })
  }

  return (
    <div className="rounded-lg border bg-white p-4">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-600">Place Order</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Position toggle */}
        <div>
          <p className="mb-1.5 text-sm font-medium text-gray-700">Position</p>
          <div className="flex gap-2">
            {(['YES', 'NO'] as Position[]).map((pos) => (
              <button
                key={pos}
                type="button"
                onClick={() => {
                  onPositionChange(pos)
                  // 포지션 변경 시 보유량 없으면 Bid로 리셋
                  setValue('order_type', 'Bid')
                }}
                className={cn(
                  'flex-1 rounded py-2 text-sm font-semibold transition',
                  selectedPosition === pos
                    ? pos === 'YES'
                      ? 'bg-green-600 text-white'
                      : 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                {pos}
              </button>
            ))}
          </div>
        </div>

        {/* Order type */}
        <div>
          <p className="mb-1.5 text-sm font-medium text-gray-700">Order Type</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setValue('order_type', 'Bid')}
              className={cn(
                'flex-1 rounded py-2 text-sm font-semibold transition',
                orderType === 'Bid'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              Buy
            </button>
            <button
              type="button"
              onClick={() => canAsk && setValue('order_type', 'Ask')}
              disabled={!canAsk}
              className={cn(
                'flex-1 rounded py-2 text-sm font-semibold transition',
                orderType === 'Ask'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                !canAsk && 'cursor-not-allowed opacity-40'
              )}
            >
              Sell
              {canAsk && <span className="ml-1 text-xs opacity-75">({heldQuantity})</span>}
            </button>
          </div>
          {!canAsk && (
            <p className="mt-1 text-xs text-gray-400">
              No {selectedPosition} position to sell
            </p>
          )}
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
          <p className="mt-1 text-xs text-gray-400">
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

        <Button type="submit" isLoading={isPending} disabled={disabled} className="w-full">
          {isPending ? 'Processing...' : `${orderType === 'Bid' ? 'Buy' : 'Sell'} ${selectedPosition}`}
        </Button>

        {disabled && (
          <p className="text-center text-xs text-gray-500">Market is not open</p>
        )}
      </form>
    </div>
  )
}
