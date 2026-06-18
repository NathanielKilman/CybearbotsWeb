import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Layout from './components/Layout'
import Home from './pages/Home'
import Story from './pages/Story'
// Note: If you have other pages (like Contact, Gallery, etc.), import them here too!

export default function App() {
  const location = useLocation()

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 0.25, 
            ease: "easeInOut" 
          }}
          style={{ transform: "translateZ(0)" }}
        >
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/story" element={<Story />} />
            {/* Add your other <Route> paths here if you have more pages */}
          </Routes>
        </motion.div>
      </AnimatePresence>
    </Layout>
  )
}
