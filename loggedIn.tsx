'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import supabase from '@/lib/supabaseBrowserClient'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession()
      const isLoggedIn = !!data.session
      const isLoginPage = pathname.startsWith('/login')

      if (!isLoggedIn && !isLoginPage) {
        router.replace('/login')
      } else {
        setLoading(false)
      }
    }

    checkAuth()
  }, [pathname, router])

  if (loading) {
    return <div className="p-6 text-center">Checking authentication...</div>
  }

  return <>{children}</>
}
