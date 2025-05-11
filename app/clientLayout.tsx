'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import supabase from '@/lib/supabaseBrowserClient'

const publicRoutes = ['/', '/login', '/login/set-password']

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      const isPublic = publicRoutes.includes(pathname)

      if (!data.session && !isPublic) {
        router.replace('/login')
      } else {
        setLoading(false)
      }
    }

    checkSession()
  }, [pathname, router])

  if (loading) {
    return <div className="p-6 text-center">Checking authentication...</div>
  }

  return <>{children}</>
}