import type { Metadata } from 'next'
import './globals.css'
import QueryProvider from '@/context/QueryProvider'
import { AuthProvider } from '@/context/AuthContext'
import { ToastProvider } from '@/context/ToastContext'
import Navbar from '@/components/layout/Navbar'

export const metadata: Metadata = {
  title: 'Prediction Market',
  description: 'Trade on predictions',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-50 text-gray-900 antialiased" suppressHydrationWarning>
        <QueryProvider>
          <AuthProvider>
            <ToastProvider>
              <Navbar />
              <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
            </ToastProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
