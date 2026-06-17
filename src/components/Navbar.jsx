import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Sun, Moon, Menu, X, Lock, Unlock, Cpu, Zap, Terminal } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useTeamAuth } from '../context/TeamAuthContext'
import { useSiteImages } from '../lib/data'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/our-story', label: 'Our Story' },
  { to: '/what-is-first', label: 'What is FIRST' },
  { to: '/meet-the-team', label: 'Meet the Team' },
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

  // Filter links if Robot Gallery is hidden via settings
  const links = robotGalleryVisible
    ? NAV_LINKS
    : NAV_LINKS.filter((l) => l.to !== '/robot-gallery')

  return (
    <header className="sticky top-0 z-50 border-b w-full bg-[var(--nav-bg)]" style={{ borderColor: 'var(--border)' }}>
      <div className="max-w-7xl mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          {images?.nav_logo ? (
            <img src={images.nav_logo} alt="Logo" className="h-8 w-auto" />
          ) : (
            <span className="font-display font-black tracking-tight text-lg text-[var(--text)]">CYBEARBOTS</span>
          )}
        </Link>

        {/* DESKTOP NAVIGATION (Hidden on screens smaller than xl to prevent side-scrolling) */}
        <nav className="hidden xl:flex items-center gap-1 font-mono text-xs font-bold">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-2.5 py-1.5 rounded-md transition-colors ${
                  isActive
                    ? 'text-[var(--accent)] bg-[var(--accent-soft)]'
                    : 'text-[var(--text)] hover:text-[var(--accent)]' // High contrast update here
                }`
              }
            >
              {link.label.toUpperCase()}
            </NavLink>
          ))}
          
          {/* Desktop Theme Toggle */}
          <button 
            onClick={toggleTheme} 
            className="p-2 ml-2 rounded-lg text-[var(--text)] hover:text-[var(--accent)] transition-colors cursor-pointer"
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* Desktop Team Access */}
          <Link
            to="/team-access"
            className={`flex items-center gap-1.5 ml-2 px-3 py-1.5 rounded-md border text-xs transition-colors ${
              isUnlocked 
                ? 'text-[var(--accent)] border-[var(--accent)] bg-[var(--accent-soft)]' 
                : 'text-[var(--text)] border-[var(--border-strong)] hover:text-[var(--accent)] hover:border-[var(--accent)]'
            }`}
          >
            {isUnlocked ? <Unlock size={13} /> : <Lock size={13} />}
            <span>TEAM</span>
          </Link>
        </nav>

        {/* HAMBURGER TRIGGER BUTTON (Visible on laptop, tablet, mobile) */}
        <button 
          onClick={() => setOpen(!open)} 
          className="xl:hidden p-2 rounded-lg text-[var(--text)] hover:text-[var(--accent)] transition-colors cursor-pointer border border-[var(--border-strong)]"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* MOBILE / TABLET SLIDE-DOWN DRAWER */}
      {open && (
        <div className="xl:hidden border-t bg-[var(--bg-elevated)] px-4 py-5 flex flex-col gap-6 max-h-[calc(100vh-4rem)] overflow-y-auto" style={{ borderColor: 'var(--border)' }}>
          
          {/* 1. Main Navigation Links */}
          <nav className="flex flex-col gap-1">
            <span className="text-[10px] font-mono tracking-widest text-[var(--text-muted)] font-black mb-2 px-3 block">NAVIGATION</span>
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2.5 rounded-lg font-mono text-xs font-bold transition-colors ${
                    isActive
                      ? 'text-[var(--accent)] bg-[var(--accent-soft)] border'
                      : 'text-[var(--text)] hover:bg-[var(--bg-card)]'
                  }`
                }
                style={({ isActive }) => isActive ? { borderColor: 'var(--accent)' } : {}}
              >
                {link.label.toUpperCase()}
              </NavLink>
            ))}
          </nav>

          <div className="h-px w-full" style={{ background: 'var(--border)' }} />

          {/* 2. Hardcoded Robotics Features */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[10px] font-mono tracking-widest text-[var(--text-muted)] font-black px-3 block">ROBOTICS RESOURCES</span>
            
            <a href="https://www.onshape.com" target="_blank" rel="noreferrer" className="flex items-center justify-between px-4 py-3 rounded-lg font-mono font-bold text-xs text-[var(--text)] bg-[var(--bg-card)] border hover:border-[var(--accent)] transition-colors" style={{ borderColor: 'var(--border-strong)' }}>
              <span className="flex items-center gap-2.5"><Zap size={14} className="text-amber-500" /> ROBOT_CAD (ONSHAPE)</span>
              <span className="text-[10px] text-[var(--text-faint)] font-mono">LAUNCH ↗</span>
            </a>

            <a href="https://github.com" target="_blank" rel="noreferrer" className="flex items-center justify-between px-4 py-3 rounded-lg font-mono font-bold text-xs text-[var(--text)] bg-[var(--bg-card)] border hover:border-[var(--accent)] transition-colors" style={{ borderColor: 'var(--border-strong)' }}>
              <span className="flex items-center gap-2.5"><Cpu size={14} className="text-emerald-500" /> SOURCE_CODE (GITHUB)</span>
              <span className="text-[10px] text-[var(--text-faint)] font-mono">LAUNCH ↗</span>
            </a>

            <a href="https://www.thebluealliance.com/team/7504" target="_blank" rel="noreferrer" className="flex items-center justify-between px-4 py-3 rounded-lg font-mono font-bold text-xs text-[var(--text)] bg-[var(--bg-card)] border hover:border-[var(--accent)] transition-colors" style={{ borderColor: 'var(--border-strong)' }}>
              <span className="flex items-center gap-2.5"><Terminal size={14} className="text-sky-500" /> THE BLUE ALLIANCE</span>
              <span className="text-[10px] text-sky-500 font-bold">#7504 DATA</span>
            </a>
          </div>

          <div className="h-px w-full" style={{ background: 'var(--border)' }} />

          {/* 3. System Environment (Theme & Access) */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono tracking-widest text-[var(--text-muted)] font-black px-3 block">SYSTEM ENVIRONMENT</span>
            
            <button onClick={toggleTheme} className="flex items-center justify-between w-full px-4 py-3 rounded-lg font-mono text-xs font-bold text-[var(--text)] bg-[var(--bg-card)] border cursor-pointer" style={{ borderColor: 'var(--border-strong)' }}>
              <span>THEME ENGINE</span>
              <span className="text-[var(--accent)] font-black">{theme.toUpperCase()}</span>
            </button>

            <Link to="/team-access" onClick={() => setOpen(false)} className={`flex items-center justify-between w-full px-4 py-3 rounded-lg font-mono text-xs font-bold bg-[var(--bg-card)] border transition-colors ${isUnlocked ? 'text-[var(--accent)] border-[var(--accent)]' : 'text-[var(--text)] border-[var(--border-strong)]'}`}>
              <span>{isUnlocked ? '🔓 ADMINISTRATIVE ACCESS' : '🔒 SECURITY ACCESS'}</span>
              <span className="text-[10px] uppercase font-black">{isUnlocked ? 'UNLOCKED' : 'GATEWAY'}</span>
            </Link>
          </div>

        </div>
      )}
    </header>
  )
}
