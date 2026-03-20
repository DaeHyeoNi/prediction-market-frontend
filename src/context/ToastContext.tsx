'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import { cn } from '@/lib/utils/cn'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: number
  message: string
  type: ToastType
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

let counter = 0

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = ++counter
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-xs">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              'rounded-lg px-4 py-3 text-sm text-white shadow-xl transition-all border',
              toast.type === 'success' && 'bg-green-600 border-green-500',
              toast.type === 'error' && 'bg-red-600 border-red-500',
              toast.type === 'info' && 'bg-gray-800 border-gray-600 text-gray-100'
            )}
          >
            <div className="flex items-start gap-2">
              {toast.type === 'success' && <span className="text-base leading-none mt-0.5">✓</span>}
              {toast.type === 'error' && <span className="text-base leading-none mt-0.5">✕</span>}
              {toast.type === 'info' && <span className="text-base leading-none mt-0.5">●</span>}
              <span>{toast.message}</span>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
