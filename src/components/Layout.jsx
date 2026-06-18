import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import { useSiteContent } from '../lib/data'

// 1. Import Framer Motion
import { motion, AnimatePresence } from 'framer-motion'

export default function Layout({ children }) {
  const location = useLocation()
  const { content } = useSiteContent()
  const robotGalleryVisible = content.robot_gallery_visible !== false

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar robotGalleryVisible={robotGalleryVisible} />
      
      {/* 2. AnimatePresence acts as the traffic cop */}
      <AnimatePresence mode="wait">
        
        {/* 3. motion.main handles the actual sliding/fading */}
        <motion.main 
          key={location.pathname} 
          className="flex-1"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {children}
        </motion.main>

      </AnimatePresence>

      <Footer />
    </div>
  )
}
