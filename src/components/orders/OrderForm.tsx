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
  position: z.enum(['YES', 'NO']),
  order_type: z.enum(['BID', 'ASK']),
  price: z.number().min(1).max(99),
  quantity: z.number().min(1).int(),
})

type FormValues = z.infer<typeof schema>

interface OrderFormProps {
  marketId: number
  disabled?: boolean
}

export default function OrderForm({ marketId, disabled }: OrderFormProps) {
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
      position: 'YES',
      order_type: 'BID',
      price: 50,
      quantity: 1,
    },
  })

  const position = watch('position')
  const price = watch('price')
  const companionPrice = price ? 100 - Number(price) : 50

  const onSubmit = (data: FormValues) => {
    placeOrder({
      market_id: marketId,
      position: data.position as Position,
      order_type: data.order_type as OrderType,
      price: data.price,
      quantity: data.quantity,
    })
  }

  return (
    <div className="rounded-lg border bg-white p-4">
      <h3 className="mb-4 text-sm font-semibold text-gray-600 uppercase tracking-wide">Place Order</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Position toggle */}
        <div>
          <p className="mb-1.5 text-sm font-medium text-gray-700">Position</p>
          <div className="flex gap-2">
            {(['YES', 'NO'] as Position[]).map((pos) => (
              <button
                key={pos}
                type="button"
                onClick={() => setValue('position', pos)}
                className={cn(
                  'flex-1 rounded py-2 text-sm font-semibold transition',
                  position === pos
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
            {(['BID', 'ASK'] as OrderType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setValue('order_type', type)}
                className={cn(
                  'flex-1 rounded py-2 text-sm font-semibold transition',
                  watch('order_type') === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                {type === 'BID' ? 'Buy' : 'Sell'}
              </button>
            ))}
          </div>
        </div>

        {/* Price */}
        <div>
          <Input
            label={`${position} Price`}
            type="number"
            min={1}
            max={99}
            {...register('price', { valueAsNumber: true })}
            error={errors.price?.message}
          />
          <p className="mt-1 text-xs text-gray-400">
            Companion ({position === 'YES' ? 'NO' : 'YES'}) price: {companionPrice}
          </p>
        </div>

        {/* Quantity */}
        <Input
          label="Quantity"
          type="number"
          min={1}
          {...register('quantity', { valueAsNumber: true })}
          error={errors.quantity?.message}
        />

        <Button type="submit" isLoading={isPending} disabled={disabled} className="w-full">
          {isPending ? 'Processing...' : 'Place Order'}
        </Button>

        {disabled && (
          <p className="text-center text-xs text-gray-500">Market is not open</p>
        )}
      </form>
    </div>
  )
}
