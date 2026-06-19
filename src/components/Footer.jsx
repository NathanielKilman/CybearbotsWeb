import { Link } from 'react-router-dom'
import { MapPin, Mail, ExternalLink, Zap } from 'lucide-react'
import { useSiteImages, useSiteContent } from '../lib/data'

const NAV_COL_1 = [
  { to: '/', label: 'Home' },
  { to: '/what-is-first', label: 'What is FIRST' },
  { to: '/competitions', label: 'Competitions' },
  { to: '/outreach', label: 'Outreach' },
  { to: '/contact', label: 'Contact' },
]

const NAV_COL_2 = [
  { to: '/our-story', label: 'Our Story' },
  { to: '/meet-the-team', label: 'Meet the Team' },
  { to: '/news', label: 'News' },
  { to: '/sponsors', label: 'Sponsors' },
]

export default function Footer() {
  const { images } = useSiteImages()
  const { content } = useSiteContent()
  const email = content.contact_email || 'bkozlenko@brewsterschools.org, dschneider@brewsterschools.org, jzhinin@brewsterschools.org'  const year = new Date().getFullYear()

  return (
    <footer className="border-t mt-auto" style={{ borderColor: 'var(--border)', background: 'var(--nav-bg)' }}>
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
        <div>
          <Link to="/" className="flex items-center gap-3 mb-4">
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
            <span className="leading-tight">
              <span className="block font-display font-bold text-base">CYBEARBOTS</span>
              <span className="block label-mono text-[10px]">Team #7504</span>
            </span>
          </Link>
          <div className="flex items-start gap-2 text-sm text-[var(--text-muted)] mb-2">
            <MapPin size={16} className="mt-0.5 shrink-0" />
            <span>
              Brewster High School
              <br />
              50 Foggintown Road
              <br />
              Brewster, NY 10509
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
            <Mail size={16} className="shrink-0" />
            <a href={`mailto:${email}`} className="hover:text-[var(--accent)] transition-colors">
              {email}
            </a>
          </div>
        </div>

        <div>
          <h3 className="label-mono text-[var(--text)] mb-4">Navigate</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div className="flex flex-col gap-2">
              {NAV_COL_1.map((l) => (
                <Link key={l.to} to={l.to} className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              {NAV_COL_2.map((l) => (
                <Link key={l.to} to={l.to} className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 className="label-mono text-[var(--text)] mb-4">Affiliated With</h3>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4">
            CyBearBots is a member of FIRST (For Inspiration and Recognition of Science and
            Technology), competing in the FIRST Robotics Competition. As well as part of Brewster
            High School After School Activities.
          </p>
          <a
            href="https://www.firstinspires.org"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--accent)] hover:underline mb-4"
          >
            firstinspires.org <ExternalLink size={13} />
          </a>
          <div>
            <Link
              to="/sponsors"
              className="inline-block px-4 py-2.5 rounded-lg font-semibold text-sm text-white transition-transform hover:scale-[1.02]"
              style={{ background: 'var(--accent-strong)' }}
            >
              Support Our Team
            </Link>
          </div>
        </div>
      </div>

      <div
        className="border-t py-4 px-4 lg:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs label-mono"
        style={{ borderColor: 'var(--border)' }}
      >
        <span>&copy; {year} CYBEARBOTS #7504 — BREWSTER HIGH SCHOOL</span>
        <span className="text-[var(--text-faint)]">EST. 2018 · LOC: 41.3973° N · FIRST FRC</span>
      </div>
    </footer>
  )
}
