'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('App Error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h2 className="text-xl font-bold text-red-600">Something went wrong</h2>
      <pre className="max-w-xl overflow-auto rounded bg-red-50 p-4 text-sm text-red-800">
        {error.message}
        {'\n'}
        {error.stack}
      </pre>
      <button
        onClick={reset}
        className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
      >
        Try again
      </button>
    </div>
  )
}
