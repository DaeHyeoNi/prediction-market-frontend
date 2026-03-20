'use client'

import { useAuth } from '@/context/AuthContext'
import { useMe } from '@/lib/hooks/useMe'
import { usePositions } from '@/lib/hooks/usePositions'
import { useMarkets } from '@/lib/hooks/useMarkets'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import Spinner from '@/components/ui/Spinner'

export default function MePage() {
  const { user: authUser, isLoading: authLoading } = useAuth()
  const router = useRouter()

  // 5초 폴링으로 최신 포트폴리오 데이터 유지
  const { data: user } = useMe()
  const { data: positions } = usePositions()
  const { data: markets } = useMarkets()

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

      {/* 포지션 목록 */}
      {positions && positions.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">보유 포지션</h2>
            <Link href="/positions" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
              전체 보기 →
            </Link>
          </div>
          <div className="space-y-2">
            {positions.map((pos) => {
              const market = markets?.find((m) => m.id === pos.market_id)
              const isResolved = market?.status === 'Resolved'
              const won = isResolved && market?.result === pos.position
              const lost = isResolved && market?.result !== pos.position
              const estimatedValue = isResolved
                ? won ? Math.round((100 - pos.avg_price) * pos.quantity) : 0
                : Math.round(pos.avg_price * pos.quantity)

              return (
                <div
                  key={pos.id}
                  className={`rounded-lg border px-4 py-3 flex items-center justify-between gap-3 ${
                    won
                      ? 'border-green-200 dark:border-green-800/50 bg-green-50 dark:bg-green-900/10'
                      : lost
                      ? 'border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-900/10'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    {market ? (
                      <Link
                        href={`/markets/${pos.market_id}`}
                        className="text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 line-clamp-1"
                      >
                        {market.title}
                      </Link>
                    ) : (
                      <span className="text-sm text-gray-500">Market #{pos.market_id}</span>
                    )}
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      Avg {pos.avg_price}¢ × {pos.quantity}주
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`inline-block text-xs font-bold px-2 py-0.5 rounded mb-1 ${
                        pos.position === 'YES'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}
                    >
                      {pos.position}
                    </span>
                    <p className={`text-xs font-mono font-semibold ${
                      won ? 'text-green-600 dark:text-green-400' :
                      lost ? 'text-red-500 dark:text-red-400' :
                      'text-gray-600 dark:text-gray-400'
                    }`}>
                      {isResolved ? (won ? `+${estimatedValue}` : '−') : estimatedValue} pts
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
