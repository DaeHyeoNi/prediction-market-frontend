'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { register as apiRegister } from '@/lib/api/auth'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import ErrorMessage from '@/components/ui/ErrorMessage'
import { useState } from 'react'

const schema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
})

type FormValues = z.infer<typeof schema>

export default function RegisterPage() {
  const [error, setError] = useState('')
  const { login } = useAuth()
  const { showToast } = useToast()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormValues) => {
    setError('')
    try {
      await apiRegister(data)
      await login(data.username, data.password)
      showToast('Registered and logged in!', 'success')
      router.push('/')
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        'Registration failed.'
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg))
    }
  }

  return (
    <div className="mx-auto mt-16 max-w-sm">
      <h1 className="mb-6 text-center text-2xl font-bold">Register</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 rounded-lg border bg-white p-6 shadow-sm">
        <Input label="Username" {...register('username')} error={errors.username?.message} />
        <Input label="Password" type="password" {...register('password')} error={errors.password?.message} />
        <ErrorMessage message={error} />
        <Button type="submit" isLoading={isSubmitting} className="w-full">
          Register
        </Button>
        <p className="text-center text-sm text-gray-500">
          Have an account?{' '}
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  )
}
