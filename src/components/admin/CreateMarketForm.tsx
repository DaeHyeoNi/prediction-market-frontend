'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createMarket } from '@/lib/api/admin'
import { queryKeys } from '@/lib/hooks/queryKeys'
import { useToast } from '@/context/ToastContext'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

const schema = z.object({
  title: z.string().min(3),
  closes_at: z.string().min(1),
})

type FormValues = z.infer<typeof schema>

export default function CreateMarketForm() {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormValues) => createMarket(data),
    onSuccess: () => {
      showToast('Market created!', 'success')
      queryClient.invalidateQueries({ queryKey: queryKeys.markets })
      reset()
    },
    onError: () => showToast('Failed to create market.', 'error'),
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
