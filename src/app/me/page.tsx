'use client'

import { useAuth } from '@/context/AuthContext'
import { useMe } from '@/lib/hooks/useMe'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Spinner from '@/components/ui/Spinner'

export default function MePage() {
  const { user: authUser, isLoading: authLoading } = useAuth()
  const router = useRouter()

  // 5초 폴링으로 최신 포트폴리오 데이터 유지
  const { data: user } = useMe()

  useEffect(() => {
    if (!authLoading && !authUser) router.push('/auth/login')
  }, [authLoading, authUser, router])

  if (authLoading || !authUser) {
    return <div className="flex justify-center py-12"><Spinner size="lg" /></div>
  }

  // 폴링 데이터 우선, 없으면 auth 캐시 사용
  const me = user ?? authUser

  const locked = me.locked_points ?? (me.total_points - me.available_points)
  const portfolioValue = me.portfolio_value ?? 0
  const totalWealth = me.total_wealth ?? (me.total_points + portfolioValue)

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-6 text-2xl font-bold">My Account</h1>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
        {/* 헤더: 유저명 + 총 자산 */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 dark:from-blue-900 dark:to-blue-800 px-6 py-5 text-white">
          <p className="mb-1 text-sm opacity-80">{me.username}</p>
          <p className="text-xs opacity-70 mb-3">Total Wealth</p>
          <p className="text-3xl font-bold font-mono">{totalWealth.toLocaleString()}</p>
          <p className="text-xs opacity-60 mt-1">pts</p>
        </div>

        {/* 내역 */}
        <div className="divide-y dark:divide-gray-700">
          {/* 보유 현금 */}
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">보유 현금</span>
              <span className="font-mono font-semibold text-gray-900 dark:text-gray-100">
                {me.total_points.toLocaleString()}
              </span>
            </div>

            <div className="mt-2 ml-4 space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <span className="text-gray-400 dark:text-gray-500">├</span> 사용 가능
                </span>
                <span className="font-mono text-gray-700 dark:text-gray-300">
                  {me.available_points.toLocaleString()}
                </span>
              </div>
              {locked > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400 dark:text-gray-500 flex items-center gap-1">
                    <span className="text-gray-300 dark:text-gray-600">└</span> 주문 잠김
                  </span>
                  <span className="font-mono text-gray-400 dark:text-gray-500">
                    {locked.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 포지션 평가액 */}
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-blue-700 dark:text-blue-400">포지션 평가액</span>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">OPEN 마켓 기준 시장가</p>
              </div>
              <span className="font-mono font-semibold text-blue-700 dark:text-blue-400">
                {portfolioValue.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
