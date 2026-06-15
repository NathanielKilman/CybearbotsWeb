import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Sun, Moon, Menu, X, Zap } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
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
  const [open, setOpen] = useState(false)

  const links = robotGalleryVisible
    ? NAV_LINKS
    : NAV_LINKS.filter((l) => l.to !== '/robot-gallery')

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{ background: 'var(--nav-bg)', borderColor: 'var(--border)' }}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo + team name */}
          <NavLink to="/" className="flex items-center gap-3 shrink-0">
            <span
              className="w-9 h-9 rounded-lg flex items-center justify-center overflow-hidden"
              style={{ background: 'var(--accent)' }}
            >
              {images.team_logo ? (
                <img src={images.team_logo} alt="CyBearBots logo" className="w-full h-full object-cover" />
              ) : (
                <Zap size={18} className="text-white" />
              )}
            </span>
            <span className="leading-tight text-left">
              <span className="block font-display font-bold text-sm tracking-tight">CYBEARBOTS</span>
              <span className="block label-mono text-[10px]">#7504</span>
            </span>
          </NavLink>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-end">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg label-mono text-[11px] transition-colors whitespace-nowrap ${
                    isActive
                      ? 'text-[var(--accent)] bg-[var(--accent-soft)] border border-[var(--accent)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)] border border-transparent'
                  }`
                }
              >
                {link.label.toUpperCase()}
              </NavLink>
            ))}
          </nav>

          {/* Theme toggle + mobile menu button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-9 h-9 rounded-lg flex items-center justify-center border transition-colors hover:bg-[var(--bg-card)]"
              style={{ borderColor: 'var(--border)' }}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
              className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center border transition-colors hover:bg-[var(--bg-card)]"
              style={{ borderColor: 'var(--border)' }}
            >
              {open ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {open && (
          <nav className="lg:hidden pb-4 flex flex-col gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2.5 rounded-lg label-mono text-[11px] transition-colors ${
                    isActive
                      ? 'text-[var(--accent)] bg-[var(--accent-soft)] border border-[var(--accent)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)] border border-transparent'
                  }`
                }
              >
                {link.label.toUpperCase()}
              </NavLink>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
