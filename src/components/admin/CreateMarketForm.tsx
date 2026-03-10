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
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  return (
    <form onSubmit={handleSubmit((d) => mutate(d))} className="flex flex-col gap-4">
      <Input label="Title" {...register('title')} error={errors.title?.message} />
      <Input
        label="Description (optional)"
        {...register('description')}
      />
      <Input
        label="Closes At"
        type="datetime-local"
        {...register('closes_at')}
        error={errors.closes_at?.message}
      />
      <Button type="submit" isLoading={isPending}>
        Create Market
      </Button>
    </form>
  )
}
