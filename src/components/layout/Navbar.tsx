'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { useMe } from '@/lib/hooks/useMe'
import Button from '@/components/ui/Button'

export default function Navbar() {
  const { user, isLoading, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const isAdmin = user?.username === process.env.NEXT_PUBLIC_ADMIN_USERNAME
  const [mobileOpen, setMobileOpen] = useState(false)
  const { data: meData } = useMe()
  const availablePoints = meData?.available_points ?? user?.available_points

  return (
    <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 tracking-tight">
          PredictMarket
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
            Markets
          </Link>

          {!isLoading && (
            <>
              {user ? (
                <>
                  <Link href="/positions" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
                    Positions
                  </Link>
                  <Link href="/orders" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
                    Orders
                  </Link>
                  <Link href="/me" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
                    Portfolio
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
                      Admin
                    </Link>
                  )}
                  {availablePoints !== undefined && (
                    <Link href="/me" className="flex items-center gap-1.5 rounded-md px-2 py-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <svg className="w-3.5 h-3.5 text-yellow-500 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 1.5a6.5 6.5 0 110 13 6.5 6.5 0 010-13zm.75 3.5h-1.5v4.25l3.25 1.95.75-1.25-2.5-1.5V7z" />
                      </svg>
                      <span className="text-xs font-mono font-semibold text-gray-700 dark:text-gray-200">{availablePoints.toLocaleString()}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">pts</span>
                    </Link>
                  )}
                  <span className="text-sm text-gray-400 dark:text-gray-500">{user.username}</span>
                  <Button variant="ghost" size="sm" onClick={logout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
                    Login
                  </Link>
                  <Link href="/auth/register">
                    <Button size="sm">Register</Button>
                  </Link>
                </>
              )}
            </>
          )}

          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            className="rounded-md p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 6a6 6 0 000 12A6 6 0 0012 6z" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile right side */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className="rounded-md p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {theme === 'dark' ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 6a6 6 0 000 12A6 6 0 0012 6z" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-md p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Menu"
          >
            {mobileOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 space-y-2">
          <Link href="/" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
            Markets
          </Link>
          {!isLoading && user ? (
            <>
              <Link href="/positions" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                Positions
              </Link>
              <Link href="/orders" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                Orders
              </Link>
              <Link href="/me" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                Portfolio
              </Link>
              {isAdmin && (
                <Link href="/admin" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  Admin
                </Link>
              )}
              <div className="pt-2 flex items-center justify-between border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{user.username}</span>
                  {availablePoints !== undefined && (
                    <span className="text-xs font-mono font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                      {availablePoints.toLocaleString()} pts
                    </span>
                  )}
                </div>
                <button onClick={() => { logout(); setMobileOpen(false) }} className="text-sm text-red-500 dark:text-red-400 hover:text-red-700">
                  Logout
                </button>
              </div>
            </>
          ) : !isLoading ? (
            <div className="flex gap-3 pt-1">
              <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                Login
              </Link>
              <Link href="/auth/register" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-blue-600 dark:text-blue-400">
                Register
              </Link>
            </div>
          ) : null}
        </div>
      )}
    </nav>
  )
}
