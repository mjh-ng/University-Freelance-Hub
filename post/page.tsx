'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import supabase from '@/lib/supabaseBrowserClient'
import { motion } from 'framer-motion'
import ThemeToggle from '@/components/themeToggle'

export default function PostPage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [editingJob, setEditingJob] = useState<any | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isPaid, setIsPaid] = useState(false)
  const [hovered, setHovered] = useState(false)
  const router = useRouter()

  const loadJobs = async () => {
    const { data: userData } = await supabase.auth.getUser()
    const email = userData.user?.email

    const { data, error } = await supabase
      .from('jobs')
      .select(`*, claims ( id, claimer_email, created_at )`)
      .eq('poster_email', email)
      .order('created_at', { ascending: false })

    if (!error && data) setJobs(data)
  }

  useEffect(() => {
    loadJobs()
  }, [router])

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setIsPaid(false)
    setEditingJob(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()

    if (editingJob?.id) {
      await supabase
        .from('jobs')
        .update({ title, description, is_paid: isPaid })
        .eq('id', editingJob.id)
    } else {
      const { error } = await supabase.from('jobs').insert({
        title,
        description,
        is_paid: isPaid,
        poster_email: user?.email,
      })
      if (error) console.error('Insert failed:', error)
    }

    resetForm()
    loadJobs()
  }

  const handleEdit = (job: any) => {
    setEditingJob(job)
    setTitle(job?.title || '')
    setDescription(job?.description || '')
    setIsPaid(job?.is_paid || false)
  }

  const handleDelete = async (id: number) => {
    await supabase.from('jobs').delete().eq('id', id)
    loadJobs()
  }

  const handleChooseClaimer = async (jobId: string, claimerEmail: string) => {
    const { error } = await supabase
      .from('jobs')
      .update({ selected_claimer_email: claimerEmail })
      .eq('id', jobId)

    if (!error) {
      const { data: userData } = await supabase.auth.getUser()
      const email = userData.user?.email
      if (email) {
        const { data: jobData } = await supabase
          .from('jobs')
          .select('*, claims(id, claimer_email)')
          .eq('poster_email', email)
          .order('created_at', { ascending: false })
        setJobs(jobData || [])
      }
    }
  }

  const assignedJobs = jobs.filter((job) => job.selected_claimer_email)
  const unassignedJobs = jobs.filter((job) => !job.selected_claimer_email)

  return (
    <>
      <div className="fixed inset-0 z-0" style={{ background: 'var(--primary)' }} />
  
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.6 }}
        style={{ position: 'absolute', width: '100vw', height: '100vh', overflow: 'auto', background: 'var(--background)' }}
        className="z-10"
      >
        <div className="w-full flex flex-col items-center pt-4">
          <div className="fixed top-4 left-4 z-50">
            <ThemeToggle />
          </div>
  
          <div
            onClick={() => {
              if (!editingJob) {
                setEditingJob({})
              }
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={`transition-all duration-300 cursor-pointer bg-var(--foreground) rounded shadow px-4 ${
              editingJob ? 'py-6 w-[60%]' : 'py-2 w-72 hover:scale-[1.01]'
            } flex flex-col items-center text-center`}
          >
            {editingJob ? (
              <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()} className="w-full">
                <input
                  type="text"
                  className="border px-3 py-2 rounded w-full mb-2"
                  placeholder="Job title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <textarea
                  className="border px-3 py-2 rounded w-full mb-2"
                  placeholder="Job description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
                <label className="flex items-center space-x-2 mb-4">
                  <input
                    type="checkbox"
                    checked={isPaid}
                    onChange={(e) => setIsPaid(e.target.checked)}
                  />
                  <span>Paid job</span>
                </label>
                <div className="flex justify-center gap-4">
                  <button type="submit" className="bg-black text-var(--foreground) px-4 py-1 rounded">
                    {editingJob?.id ? 'Update Job' : 'Create Job'}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      resetForm()
                    }}
                    className="text-sm text-gray-500 underline"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <span className="text-gray-600 font-medium">New Job</span>
            )}
          </div>
  
          <div className="w-full flex flex-col md:flex-row justify-center gap-6 px-6 mt-6">
            <div className="w-full md:w-[35%]">
              <div className="text-center mb-4">
                <h2 className="text-xl font-semibold text-var(--foreground) ">Jobs Being Worked On</h2>
              </div>
              {assignedJobs.map((job) => (
                <div key={job.id} className="border p-4 rounded bg-var(--foreground) mb-4">
                  <h3 className="text-lg font-semibold text-center">{job.title}</h3>
                  <p className="text-gray-600 text-center">{job.description}</p>
                  <p className="text-sm text-gray-400 mt-1 text-center">
                    {job.is_paid ? '💰 Paid' : '🚫 Unpaid'}
                  </p>
                  <p className="text-sm mt-2 text-green-600 font-semibold text-center">
                    Assigned to: {job.selected_claimer_email?.split('@')[0]}
                  </p>
                </div>
              ))}
            </div>
  
            <div className="w-full md:w-[35%]">
              <div className="text-center mb-4">
                <h2 className="text-xl font-semibold text-var(--foreground) ">Unassigned Jobs</h2>
              </div>
              {unassignedJobs.map((job) => (
                <div key={job.id} className="border p-4 rounded bg-var(--foreground) mb-4">
                  <h3 className="text-lg font-semibold text-center">{job.title}</h3>
                  <p className="text-gray-600 text-center">{job.description}</p>
                  <p className="text-sm text-gray-400 mt-1 text-center">
                    {job.is_paid ? '💰 Paid' : '🚫 Unpaid'}
                  </p>
  
                  {job.claims && job.claims.length > 0 ? (
                    <div className="mt-4">
                      <p className="text-sm font-semibold">Claimed by:</p>
                      <ul className="text-sm space-y-1 mt-1">
                        {job.claims.map((claim: any) => (
                          <li key={claim.id} className="flex items-center justify-between">
                            <span>{claim.claimer_email}</span>
                            <button
                              onClick={() => handleChooseClaimer(job.id, claim.claimer_email)}
                              className="text-blue-600 text-xs underline"
                            >
                              Choose
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-gray-400 italic text-center">
                      No one has claimed this job yet.
                    </p>
                  )}
  
                  <div className="flex justify-center gap-2 mt-4">
                    <button
                      onClick={() => handleEdit(job)}
                      className="text-sm text-blue-600 underline"
                    >
                      ✎ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(job.id)}
                      className="text-sm text-red-600 underline"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
  
          <div
            onClick={() => router.push('/find')}
            className="fixed top-0 right-0 h-screen w-6 bg-[var(--primary)] hover:w-48 transition-all duration-300 flex items-center justify-center cursor-pointer z-50 group"
          >
            <span className="text-sm text-black opacity-0 group-hover:opacity-100 transition duration-300 rotate-90 whitespace-nowrap">
              ← Find
            </span>
          </div>
        </div>
      </motion.div>
    </>
  )
}  