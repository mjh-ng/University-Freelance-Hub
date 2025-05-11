'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import supabase from '@/lib/supabaseBrowserClient'

export default function SetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('Verifying link...')
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    const trySetSession = async () => {
      const hash = window.location.hash
      const params = new URLSearchParams(hash.replace('#', '?'))

      const access_token = params.get('access_token')
      const refresh_token = params.get('refresh_token')

      if (access_token && refresh_token) {
        const { error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        })

        if (error) {
          setMessage('❌ Could not validate link. Try logging in again.')
        } else {
          setMessage('')
          setVerified(true)
        }
      } else {
        // fallback in case it's already restored
        const { data } = await supabase.auth.getSession()
        if (data.session) {
          setMessage('')
          setVerified(true)
        } else {
          setMessage('❌ Link is invalid or expired.')
        }
      }
    }

    trySetSession()
  }, [])

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('Setting password...')

    if (!password || !confirmPassword) {
      setMessage('❌ Please fill in both fields.')
      return
    }

    if (password !== confirmPassword) {
      setMessage('❌ Passwords do not match.')
      return
    }

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setMessage('❌ Failed to set password: ' + error.message)
    } else {
      setMessage('✅ Password set! Redirecting...')
      setTimeout(() => router.replace('/'), 1200)
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Set Your Password</h1>

      {message && <p className="mb-4 text-sm text-gray-700">{message}</p>}

      {verified && (
        <form onSubmit={handleSetPassword} className="space-y-4">
          <input
            type="password"
            placeholder="Create password"
            className="border px-3 py-2 w-full rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm password"
            className="border px-3 py-2 w-full rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded w-full"
          >
            Set Password
          </button>
        </form>
      )}
    </div>
  )
}
