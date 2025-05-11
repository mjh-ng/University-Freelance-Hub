'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import supabase from '@/lib/supabaseBrowserClient'

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<'email' | 'login' | 'done'>('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        router.replace('/')
      }
    }
    checkSession()
  }, [router])

  const emailIsValid = (email: string) => {
    return email.trim().toLowerCase().endsWith('@wustl.edu')
  }

  const handleLoginIntent = () => {
    if (!emailIsValid(email)) {
      setMessage('❌ Only @wustl.edu emails are allowed.')
      return
    }
    setStep('login')
    setMessage('🔒 Enter your password to log in.')
  }

  const handleSignupIntent = async () => {
    if (!emailIsValid(email)) {
      setMessage('❌ Only @wustl.edu emails are allowed.')
      return
    }

    setLoading(true)
    setMessage('Creating account...')

    const { error } = await supabase.auth.signUp({
      email,
      password: 'temporary-password',
      options: {
        emailRedirectTo: 'http://localhost:3000/login/set-password',
      },
    })

    if (error?.message.includes('User already registered')) {
      setMessage('⚠️ Account already exists. Try logging in.')
      setStep('login')
    } else if (!error) {
      setMessage("Check your email to confirm and set your password. If you didn't get a link, you may already have an account.")
      setStep('done')
    } else {
      setMessage('❌ Signup failed: ' + error.message)
    }

    setLoading(false)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!emailIsValid(email)) {
      setMessage('❌ Only @wustl.edu emails are allowed.')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setMessage('❌ Login failed: ' + error.message)
    } else {
      setMessage('✅ Logged in! Redirecting...')
      router.replace('/')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] text-[var(--foreground)]">
      <div className="p-6 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-6">Log In or Sign Up</h1>

        {step === 'email' && (
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Enter your WashU email"
              className="border px-3 py-2 rounded w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="flex justify-center gap-4">
              <button
                className="bg-black text-white px-4 py-2 rounded"
                onClick={handleLoginIntent}
                disabled={!email}
              >
                Log In
              </button>
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={handleSignupIntent}
                disabled={!email || loading}
              >
                Create Account
              </button>
            </div>
          </div>
        )}

        {step === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4 mt-4">
            <input
              type="password"
              placeholder="Enter your password"
              className="border px-3 py-2 rounded w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded w-full"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>
        )}

        {step === 'done' ? (
          <div className="mt-6 space-y-2 text-sm text-center text-gray-700">
            <p>{message}</p>
            <button
              onClick={() => setStep('login')}
              className="underline text-blue-600 hover:text-blue-800"
            >
              Already have an account? Log in
            </button>
          </div>
        ) : (
          message && <p className="mt-6 text-sm text-gray-700">{message}</p>
        )}
      </div>
    </div>
  )
}