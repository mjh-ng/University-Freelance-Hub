// app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import AuthGuard from './loggedIn'
import { ThemeProvider } from './themeProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Your App',
  description: 'test',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <ThemeProvider>
        <body className={inter.className}>
          <AuthGuard>{children}</AuthGuard>
        </body>
      </ThemeProvider>
    </html>
  )
}
