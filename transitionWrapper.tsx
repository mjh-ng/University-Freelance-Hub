'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function TransitionWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [prevPath, setPrevPath] = useState(pathname)
  const [direction, setDirection] = useState(0)

  useEffect(() => {
    // only change direction if path is different
    if (pathname !== prevPath) {
      if (prevPath === '/post' && pathname === '/find') {
        setDirection(-1) // post → find → slide left
      } else if (prevPath === '/find' && pathname === '/post') {
        setDirection(1) // find → post → slide right
      } else {
        setDirection(0)
      }
      setPrevPath(pathname) // update the prevPath AFTER checking
    }
  }, [pathname, prevPath])

  const bg =
    pathname === '/post'
      ? 'var(--background)' // apricot
      : pathname === '/find'
      ? 'var(--primary)' // cadet gray
      : 'white'

  return (
    <div className="overflow-hidden min-h-screen w-screen" style={{ background: bg }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial={{ x: `${100 * direction}%`, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: `${-100 * direction}%`, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="min-h-screen w-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
