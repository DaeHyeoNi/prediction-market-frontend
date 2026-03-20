'use client'

import { useEffect, useRef } from 'react'
import { useOrders } from './useOrders'
import { useToast } from '@/context/ToastContext'
import { Order } from '@/lib/types/api'

/**
 * 주문 체결(Filled) 시 토스트 알림을 표시하는 훅.
 * useOrders 폴링 결과를 감시해 Open/Partial → Filled 전환을 감지.
 */
export function useOrderFillNotifier() {
  const { data: orders } = useOrders()
  const { showToast } = useToast()
  const prevStatusMap = useRef<Map<number, Order['status']>>(new Map())
  const initialized = useRef(false)

  useEffect(() => {
    if (!orders) return

    if (!initialized.current) {
      // 초기 로드 시 현재 상태만 기록 (알림 없음)
      orders.forEach((o) => prevStatusMap.current.set(o.id, o.status))
      initialized.current = true
      return
    }

    orders.forEach((o) => {
      const prev = prevStatusMap.current.get(o.id)
      if (prev && prev !== 'Filled' && o.status === 'Filled') {
        showToast(
          `${o.position} ${o.order_type === 'Bid' ? 'Buy' : 'Sell'} @${o.price} — Filled!`,
          'success'
        )
      }
      prevStatusMap.current.set(o.id, o.status)
    })
  }, [orders, showToast])
}
