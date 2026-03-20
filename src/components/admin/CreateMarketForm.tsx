'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createMarket } from '@/lib/api/markets'
import { queryKeys } from '@/lib/hooks/queryKeys'
import { useToast } from '@/context/ToastContext'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

const schema = z.object({
  title: z.string().min(3),
  closes_at: z.string().min(1),
  description: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

function toLocalDatetimeString(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const QUICK_DURATIONS = [
  { label: '+1h', hours: 1 },
  { label: '+1d', hours: 24 },
  { label: '+1w', hours: 24 * 7 },
  { label: '+1m', hours: 24 * 30 },
]

export default function CreateMarketForm() {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormValues) =>
      createMarket({
        title: data.title,
        closes_at: new Date(data.closes_at).toISOString(),
        description: data.description,
      }),
    onSuccess: () => {
      showToast('Market created!', 'success')
      queryClient.invalidateQueries({ queryKey: queryKeys.markets })
      reset()
    },
    onError: (e: unknown) => {
      const msg = (e as { response?: { data?: { detail?: string } } })?.response?.data?.detail || 'Failed to create market.'
      showToast(msg, 'error')
    },
  })

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  return (
    <form onSubmit={handleSubmit((d) => mutate(d))} className="flex flex-col gap-4">
      <Input label="Title" {...register('title')} error={errors.title?.message} />
      <Input
        label="Description (optional)"
        {...register('description')}
      />
      <div>
        <Input
          label="Closes At"
          type="datetime-local"
          {...register('closes_at')}
          error={errors.closes_at?.message}
        />
        <div className="mt-1.5 flex gap-1.5">
          {QUICK_DURATIONS.map(({ label, hours }) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                const d = new Date(Date.now() + hours * 3600 * 1000)
                setValue('closes_at', toLocalDatetimeString(d), { shouldValidate: true })
              }}
              className="flex-1 rounded px-1.5 py-1 text-xs font-medium bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <Button type="submit" isLoading={isPending}>
        Create Market
      </Button>
    </form>
  )
}
