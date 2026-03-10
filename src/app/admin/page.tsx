'use client'

import { useAuth } from '@/context/AuthContext'
import { useMarkets } from '@/lib/hooks/useMarkets'
import CreateMarketForm from '@/components/admin/CreateMarketForm'
import MarketAdminRow from '@/components/admin/MarketAdminRow'
import Spinner from '@/components/ui/Spinner'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { data: markets, isLoading: marketsLoading } = useMarkets()

  const isAdmin = user?.username === process.env.NEXT_PUBLIC_ADMIN_USERNAME

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/')
    }
  }, [authLoading, user, isAdmin, router])

  if (authLoading || !user) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!isAdmin) return null

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Admin</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Create Market */}
        <div className="rounded-lg border bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-gray-600 uppercase tracking-wide">Create Market</h2>
          <CreateMarketForm />
        </div>

        {/* Markets table */}
        <div className="rounded-lg border bg-white p-5 lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold text-gray-600 uppercase tracking-wide">Manage Markets</h2>
          {marketsLoading ? (
            <Spinner />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-gray-500">
                    <th className="pb-2 pr-4">ID</th>
                    <th className="pb-2 pr-4">Title</th>
                    <th className="pb-2 pr-4">Status</th>
                    <th className="pb-2 pr-4">Closes At</th>
                    <th className="pb-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(markets || []).map((market) => (
                    <MarketAdminRow key={market.id} market={market} />
                  ))}
                </tbody>
              </table>
              {markets?.length === 0 && (
                <p className="py-4 text-center text-sm text-gray-500">No markets yet.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
