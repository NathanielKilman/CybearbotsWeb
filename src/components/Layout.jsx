import { useEffect } from 'react'
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

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <Navbar robotGalleryVisible={robotGalleryVisible} />
      
      <AnimatePresence mode="wait">
        <motion.main 
          key={location.pathname} 
          className="flex-1"
          // We reduce the movement from 15px to 6px so it doesn't "jump" heavily
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          // Switching to spring physics for ultra-smooth rendering
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 26,
            mass: 0.5
          }}
        >
          {children}
        </motion.main>
      </AnimatePresence>

      <Footer />
    </div>
  )
}
