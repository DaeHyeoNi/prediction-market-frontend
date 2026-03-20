'use client'

import { useAuth } from '@/context/AuthContext'
import { useOrderFillNotifier } from '@/lib/hooks/useOrderFillNotifier'

function FillWatcher() {
  useOrderFillNotifier()
  return null
}

export default function OrderNotifier() {
  const { user } = useAuth()
  if (!user) return null
  return <FillWatcher />
}
