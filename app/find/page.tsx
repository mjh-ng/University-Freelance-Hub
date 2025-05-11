'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import supabase from '@/lib/supabaseBrowserClient'
import { motion } from 'framer-motion'
import AnimatedProfilePanel from '@/components/animatedProfilePanel'

export default function FindPage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const load = async () => {
      const { data: userData } = await supabase.auth.getUser()
      const user = userData.user
      if (user) {
        setUserId(user.id)
        setUserEmail(user.email ?? null)
        loadOtherJobs(user.email ?? '')
      }
    }
    load()
  }, [])

  const loadOtherJobs = async (email: string) => {
    const { data, error } = await supabase
      .from('jobs')
      .select(`*, claims ( id, claimer_email )`)
      .neq('poster_email', email)
      .order('created_at', { ascending: false })

    if (!error && data) {
      const jobsWithClaimStatus = data.map((job) => ({
        ...job,
        claimedByUser: job.claims?.some(
          (claim: { claimer_email: string }) => claim.claimer_email === email
        ),
      }))
      setJobs(jobsWithClaimStatus)
    }
  }

  const handleClaim = async (jobId: string) => {
    const { data: userData } = await supabase.auth.getUser()
    const email = userData.user?.email
    if (!email) return

    const { error } = await supabase.from('claims').insert({
      job_id: jobId,
      claimer_email: email,
    })

    if (!error) {
      loadOtherJobs(email)
    }
  }

  const availableJobs = jobs.filter(
    (job) => !job.selected_claimer_email
  )
  const selectedJobs = jobs.filter(
    (job) => job.selected_claimer_email === userEmail
  )

  return (
    <div className="relative min-h-screen bg-orange-100">
      <div className="fixed inset-0 z-0" style={{ background: 'var(--background)' }} />
  
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ duration: 0.6 }}
        style={{ position: 'absolute', width: '100vw', height: '100vh', overflow: 'auto', background: 'var(--primary)' }}
        className="z-10"
      >
        {userId && <AnimatedProfilePanel userId={userId} />}
  
        <div className="w-full flex flex-col md:flex-row justify-center gap-6 px-6 pt-6">
          {/* Selected Jobs Column */}
          <div className="w-full md:w-[35%]">
            <h1 className="text-2xl font-bold text-var(--foreground)  mb-4 text-center">Jobs Selected For You</h1>
            <div className="space-y-6">
              {selectedJobs.map((job) => (
                <div key={job.id} className="border p-4 rounded bg-var(--foreground) ">
                  <h3 className="text-lg font-semibold">{job.title}</h3>
                  <p className="text-gray-600">{job.description}</p>
                  <p className="text-sm text-green-600 mt-2">✅ You’ve been selected to complete this job</p>
                </div>
              ))}
            </div>
          </div>
  
          {/* Available Jobs Column */}
          <div className="w-full md:w-[35%]">
            <h1 className="text-2xl font-bold text-var(--foreground)  mb-4 text-center">Available Jobs</h1>
            <div className="space-y-6">
              {availableJobs.map((job) => (
                <div key={job.id} className="border p-4 rounded bg-var(--foreground) ">
                  <h3 className="text-lg font-semibold">{job.title}</h3>
                  <p className="text-gray-600">{job.description}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {job.is_paid ? '💰 Paid' : '🚫 Unpaid'}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Posted by: {job.poster_email?.split('@')[0] || 'unknown'}
                  </p>
  
                  {job.claimedByUser ? (
                    <button disabled className="mt-4 bg-gray-400 text-var(--foreground)  px-4 py-2 rounded cursor-not-allowed">
                      ✅ Claimed
                    </button>
                  ) : (
                    <button
                      onClick={() => handleClaim(job.id)}
                      className="mt-4 bg-black text-var(--foreground)  px-4 py-2 rounded hover:bg-gray-800 transition"
                    >
                      Claim Job
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
  
        <div
          onClick={() => router.push('/post')}
          className="fixed top-0 left-0 h-screen w-6 bg-[var(--background)] hover:w-48 transition-all duration-300 flex items-center justify-center cursor-pointer z-50 group"
        >
          <span className="text-sm text-black opacity-0 group-hover:opacity-100 transition duration-300 -rotate-90 whitespace-nowrap">
            Post →
          </span>
        </div>
      </motion.div>
    </div>
  )
}  