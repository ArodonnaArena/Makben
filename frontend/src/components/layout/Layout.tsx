"use client"
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdmin && <Navbar />}
      <AnimatePresence mode="wait">
        <motion.main 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="flex-grow"
        >
          {children}
        </motion.main>
      </AnimatePresence>
      {!isAdmin && <Footer />}
    </div>
  )
}
