import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Sun, Moon, Menu, X, Lock, Unlock, Cpu, Zap, Terminal } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useTeamAuth } from '../context/TeamAuthContext'
import { useSiteImages } from '../lib/data'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/our-story', label: 'Our Story' },
  { to: '/meet-the-team', label: 'Meet the Team' },
  { to: '/what-is-first', label: 'What is FIRST' },
  { to: '/competitions', label: 'Competitions' },
  { to: '/robot-gallery', label: 'Robot Gallery' },
  { to: '/news', label: 'News' },
  { to: '/outreach', label: 'Outreach' },
  { to: '/sponsors', label: 'Sponsors' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar({ robotGalleryVisible = true }) {
  const { theme, toggleTheme } = useTheme()
  const { images } = useSiteImages()
  const { isUnlocked } = useTeamAuth()
  const [open, setOpen] = useState(false)

  const links = robotGalleryVisible
    ? NAV_LINKS
    : NAV_LINKS.filter((l) => l.to !== '/robot-gallery')

  return (
    <header className="sticky top-0 z-50 w-full bg-[var(--nav-bg)] border-b" style={{ borderColor: 'var(--border)' }}>
      <div className="max-w-7xl mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          {images?.nav_logo ? (
            <img src={images.nav_logo} alt="Logo" className="h-8 w-auto" />
          ) : (
            <span className="font-display font-black tracking-tight text-lg text-[var(--text)]">CYBEARBOTS</span>
          )}
        </Link>

        {/* DESKTOP NAV: ALWAYS VISIBLE */}
        <nav className="hidden lg:flex items-center gap-1 font-mono text-[11px] font-bold">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-md transition-colors ${
                  isActive
                    ? 'text-[var(--accent)] bg-[var(--accent-soft)]'
                    : 'text-[var(--text)] hover:text-[var(--accent)]'
                }`
              }
            >
              {link.label.toUpperCase()}
            </NavLink>
          ))}
        </nav>

        {/* HAMBURGER TRIGGER */}
        <button 
          onClick={() => setOpen(!open)} 
          className="p-2 rounded-lg text-[var(--text)] hover:bg-[var(--bg-card)] transition-colors border border-transparent hover:border-[var(--border-strong)]"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* DRAWER */}
      {open && (
        <div className="absolute top-16 right-0 w-full md:w-80 bg-[var(--bg-elevated)] border-l border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="p-6 flex flex-col gap-8">
            
            {/* MOBILE ONLY: Main Nav Links in Hamburger */}
            <nav className="flex flex-col gap-2 lg:hidden">
              <span className="text-[10px] font-mono font-black text-[var(--text-faint)]">NAVIGATION</span>
              {links.map((link) => (
                <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)} className="text-[var(--text)] font-bold py-2 border-b border-[var(--border)]">
                  {link.label.toUpperCase()}
                </NavLink>
              ))}
            </nav>

            {/* SYSTEM TOOLS (Visible on both) */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-mono font-black text-[var(--text-faint)]">SYSTEM</span>
              <button onClick={toggleTheme} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border)]">
                {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />} THEME: {theme.toUpperCase()}
              </button>
              <Link to="/team-access" onClick={() => setOpen(false)} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border)]">
                {isUnlocked ? <Unlock size={16} /> : <Lock size={16} />} {isUnlocked ? 'ADMIN UNLOCKED' : 'TEAM ACCESS'}
              </Link>
            </div>

            {/* ROBOTICS RESOURCES */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-mono font-black text-[var(--text-faint)]">RESOURCES</span>
              <a href="https://www.onshape.com" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-lg border border-[var(--border)] hover:border-[var(--accent)]">
                <Zap size={16} className="text-amber-500" /> ON_SHAPE_CAD
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-lg border border-[var(--border)] hover:border-[var(--accent)]">
                <Cpu size={16} className="text-emerald-500" /> GITHUB_REPO
              </a>
              <a href="https://www.thebluealliance.com/team/7504" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-lg border border-[var(--border)] hover:border-[var(--accent)]">
                <Terminal size={16} className="text-sky-500" /> THE_BLUE_ALLIANCE
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
