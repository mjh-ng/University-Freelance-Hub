'use client'

import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="flex h-screen text-[var(--foreground)]">
      <div
        className="flex-1 bg-[var(--primary)] flex items-center justify-center hover:brightness-105 transition cursor-pointer"
        onClick={() => router.push('/post')}
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Post</h1>
          <p className="text-[var(--foreground)]/80">Need something done? Post a job.</p>
        </div>
      </div>

      <div
        className="flex-1 bg-[var(--background)] flex items-center justify-center hover:brightness-105 transition cursor-pointer"
        onClick={() => router.push('/find')}
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Find</h1>
          <p className="text-[var(--foreground)]/80">Browse jobs you can claim and complete.</p>
        </div>
      </div>
    </div>
  )
}