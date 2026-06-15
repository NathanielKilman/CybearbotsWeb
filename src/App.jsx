import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { TeamAuthProvider } from './context/TeamAuthContext'
import Layout from './components/Layout'

import Home from './pages/Home'
import OurStory from './pages/OurStory'
import WhatIsFirst from './pages/WhatIsFirst'
import MeetTheTeam from './pages/MeetTheTeam'
import Competitions from './pages/Competitions'
import RobotGallery from './pages/RobotGallery'
import News from './pages/News'
import Outreach from './pages/Outreach'
import Sponsors from './pages/Sponsors'
import Contact from './pages/Contact'
import TeamAccess from './pages/TeamAccess'

function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-32 text-center">
      <h1 className="font-display font-extrabold text-5xl mb-4">404</h1>
      <p className="text-[var(--text-muted)]">Page not found.</p>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <TeamAuthProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/our-story" element={<OurStory />} />
              <Route path="/what-is-first" element={<WhatIsFirst />} />
              <Route path="/meet-the-team" element={<MeetTheTeam />} />
              <Route path="/competitions" element={<Competitions />} />
              <Route path="/robot-gallery" element={<RobotGallery />} />
              <Route path="/news" element={<News />} />
              <Route path="/outreach" element={<Outreach />} />
              <Route path="/sponsors" element={<Sponsors />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/team-access" element={<TeamAccess />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TeamAuthProvider>
    </ThemeProvider>
  )
}

export default App
