import { useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import { useSiteContent } from '../lib/data'
import { motion, AnimatePresence } from 'framer-motion'

export default function Layout({ children }) {
  const location = useLocation()
  const { content } = useSiteContent()
  const robotGalleryVisible = content.robot_gallery_visible !== false

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  // Performance Lock: Prevent children from re-rendering or running 
  // data hooks multiple times mid-animation.
  const memoizedChildren = useMemo(() => children, [location.pathname])

  return (
    <div className="min-h-screen flex flex-col isolation-isolate">
      <Navbar robotGalleryVisible={robotGalleryVisible} />
      
      <AnimatePresence mode="wait" initial={false}>
        <motion.div 
          key={location.pathname} 
          className="flex-1 flex flex-col"
          // Pure GPU-accelerated opacity fade
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 0.15, // Blazing fast transition
            ease: "easeInOut"
          }}
          // This tells the browser to use the graphics card (GPU) instead of the CPU
          style={{ willChange: "opacity" }}
        >
          <main className="flex-1">
            {memoizedChildren}
          </main>
        </motion.div>
      </AnimatePresence>

      <Footer />
    </div>
  )
}
