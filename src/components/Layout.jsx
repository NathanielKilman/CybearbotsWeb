import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import { useSiteContent } from '../lib/data'

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
      <main key={location.pathname} className="flex-1 page-fade">
        {children}
      </main>
      <Footer />
    </div>
  )
}
