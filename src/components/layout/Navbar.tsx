'use client'

import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import Button from '@/components/ui/Button'

export default function Navbar() {
  const { user, isLoading, logout } = useAuth()
  const isAdmin = user?.username === process.env.NEXT_PUBLIC_ADMIN_USERNAME

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold text-blue-600 hover:text-blue-700">
          PredictMarket
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
            Markets
          </Link>

          {!isLoading && (
            <>
              {user ? (
                <>
                  <Link href="/profile" className="text-sm text-gray-600 hover:text-gray-900">
                    Profile
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" className="text-sm text-gray-600 hover:text-gray-900">
                      Admin
                    </Link>
                  )}
                  <span className="text-sm text-gray-500">{user.username}</span>
                  <Button variant="ghost" size="sm" onClick={logout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="text-sm text-gray-600 hover:text-gray-900">
                    Login
                  </Link>
                  <Link href="/auth/register">
                    <Button size="sm">Register</Button>
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
