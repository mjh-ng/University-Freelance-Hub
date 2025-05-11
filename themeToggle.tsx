'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initial = stored === 'dark' || (!stored && prefersDark)
    setIsDark(initial)
    document.documentElement.classList.toggle('dark', initial)
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    document.documentElement.classList.toggle('dark', newTheme)
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
  }

  return (
    <div
      onClick={toggleTheme}
      className="w-16 h-16 bg-[var(--toggle-bg)] text-[var(--toggle-fg)] shadow flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
    >
      {isDark ? '🌙' : '☀️'}
    </div>
  )
}