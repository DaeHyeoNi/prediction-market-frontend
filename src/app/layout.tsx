import type { Metadata } from 'next'
import './globals.css'
import QueryProvider from '@/context/QueryProvider'
import { AuthProvider } from '@/context/AuthContext'
import { ToastProvider } from '@/context/ToastContext'
import { ThemeProvider } from '@/context/ThemeContext'
import Navbar from '@/components/layout/Navbar'
import OrderNotifier from '@/components/layout/OrderNotifier'

export const metadata: Metadata = {
  title: 'PredictMarket',
  description: 'Trade on predictions',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 antialiased" suppressHydrationWarning>
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider>
              <ToastProvider>
                <Navbar />
                <OrderNotifier />
                <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
              </ToastProvider>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
