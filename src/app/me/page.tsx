'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Spinner from '@/components/ui/Spinner'

export default function MePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) router.push('/auth/login')
  }, [isLoading, user, router])

  if (isLoading || !user) {
    return <div className="flex justify-center py-12"><Spinner size="lg" /></div>
  }

  const locked = user.total_points - user.available_points

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-6 text-2xl font-bold">My Account</h1>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <p className="mb-4 text-lg font-semibold text-gray-800">{user.username}</p>

        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
            <span className="text-sm text-gray-600">Total Points</span>
            <span className="font-mono text-base font-semibold text-gray-900">
              {user.total_points.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-blue-50 px-4 py-3">
            <span className="text-sm text-blue-700">Available</span>
            <span className="font-mono text-base font-semibold text-blue-700">
              {user.available_points.toLocaleString()}
            </span>
          </div>
          {locked > 0 && (
            <div className="flex items-center justify-between rounded-lg bg-yellow-50 px-4 py-3">
              <span className="text-sm text-yellow-700">Locked in orders</span>
              <span className="font-mono text-base font-semibold text-yellow-700">
                {locked.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
