'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import supabase from '@/lib/supabaseBrowserClient'

interface ProfileData {
  id: string
  name: string | null
  description: string | null
  tags: string[] | null
}

export default function AnimatedProfilePanel({ userId }: { userId: string }) {
  const [expanded, setExpanded] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [editing, setEditing] = useState(false)
  const panelRef = useRef<HTMLDivElement | null>(null)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState<string>('')

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (data) {
        setProfile(data)
        setName(data.name || '')
        setDescription(data.description || '')
        setTags((data.tags || []).join(', '))
      }
    }

    if (userId) fetchProfile()
  }, [userId])

  useEffect(() => {
    if (!expanded) return

    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setExpanded(false)
        setEditing(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [expanded])

  const handleClick = () => {
    setExpanded(!expanded)
    setEditing(false)
  }

  const handleSave = async () => {
    const { error } = await supabase.from('profiles').upsert({
      id: userId,
      name,
      description,
      tags: tags.split(',').map((t) => t.trim()),
    })

    if (!error) {
      setProfile({ id: userId, name, description, tags: tags.split(',').map(t => t.trim()) })
      setEditing(false)
    }
  }

  const showContent = hovering || expanded

  return (
    <>
      {expanded && (
        <div className="fixed top-0 left-0 h-screen w-2 bg-orange-400 z-40" />
      )}

      <motion.div
        ref={panelRef}
        layout
        initial={false}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onClick={() => {
          if (!expanded) handleClick()
        }}
        className={`fixed top-0 right-0 z-50 shadow-lg overflow-hidden bg-[var(--background)] text-[var(--foreground)] p-4 transition-all ${
          expanded ? 'h-screen w-[20vw]' : hovering ? 'w-36 h-screen cursor-pointer' : 'w-4 h-screen cursor-pointer'
        }`}
      >
        {showContent && (
          <div className="flex flex-col justify-between h-full">
            {editing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full border rounded p-1"
                />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description"
                  className="w-full border rounded p-1 h-24"
                />
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Tags (comma separated)"
                  className="w-full border rounded p-1"
                />
                <button
                  onClick={handleSave}
                  className="bg-black text-[var(--background)] px-3 py-1 rounded hover:bg-gray-800"
                >
                  Save
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold truncate">
                    {profile?.name || (expanded ? '[edit]' : '')}
                  </h2>
                  {expanded && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditing(true)
                      }}
                      className="text-sm text-blue-600 underline"
                    >
                      Edit
                    </button>
                  )}
                </div>

                <div className="text-sm mt-2 whitespace-pre-wrap">
                  {(expanded ? profile?.description : profile?.description?.slice(0, 60)) || ''}
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {profile?.tags?.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-gray-200 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </motion.div>
    </>
  )
}