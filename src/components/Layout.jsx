import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Layout from './components/Layout'
import Home from './pages/Home'
import Story from './pages/Story'
// ... import your other pages here

export default function App() {
  const location = useLocation()

  return (
    <Layout>
      {/* 1. mode="wait" guarantees the old page goes completely invisible and unmounts FIRST */}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          // 2. Pure fade out for the old page
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: 0 }}
          // 3. Slide up effect ONLY when the next page appears
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 0.25, 
            ease: "easeInOut" 
          }}
          style={{ 
            // This fallback forces standard CPU rendering to look smooth on basic office PCs
            transform: "translateZ(0)" 
          }}
        >
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/story" element={<Story />} />
            {/* Add your other routes here */}
          </Routes>
        </motion.div>
      </AnimatePresence>
    </Layout>
  )
}
