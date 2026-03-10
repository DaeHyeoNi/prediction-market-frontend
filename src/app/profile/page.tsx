'use client'

import { useAuth } from '@/context/AuthContext'
import { useOrders } from '@/lib/hooks/useOrders'
import { usePositions } from '@/lib/hooks/usePositions'
import OrderList from '@/components/orders/OrderList'
import PositionList from '@/components/positions/PositionList'
import Spinner from '@/components/ui/Spinner'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProfilePage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { data: orders, isLoading: ordersLoading } = useOrders()
  const { data: positions, isLoading: positionsLoading } = usePositions()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [authLoading, user, router])

  if (authLoading || !user) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Profile</h1>
        <div className="text-sm text-gray-600">
          <span className="font-medium">{user.username}</span>
          <span className="ml-3 text-gray-400">{user.email}</span>
          <span className="ml-3 font-mono text-blue-600">Balance: {user.balance}</span>
        </div>
      </div>

      <div className="mb-6 rounded-lg border bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold text-gray-600 uppercase tracking-wide">My Positions</h2>
        {positionsLoading ? <Spinner /> : <PositionList positions={positions || []} />}
      </div>

      <div className="rounded-lg border bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold text-gray-600 uppercase tracking-wide">Order History</h2>
        {ordersLoading ? <Spinner /> : <OrderList orders={orders || []} />}
      </div>
    </div>
  )
}
