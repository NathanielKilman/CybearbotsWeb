import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Layout from './components/Layout'
import Home from './pages/Home'
// 1. Changed this line from "./pages/Story" to "./pages/OurStory"
import OurStory from './pages/OurStory' 

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
            {/* 2. Changed this element from <Story /> to <OurStory /> */}
            <Route path="/story" element={<OurStory />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </Layout>
  )
}
