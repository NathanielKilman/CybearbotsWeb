import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Trophy, Newspaper, Users, ArrowRight, ExternalLink } from 'lucide-react'
import { useSiteContent, useSiteImages, useTable } from '../lib/data'
import { useTeamAuth } from '../context/TeamAuthContext'
import { supabase } from '../lib/supabase'
import ImageUpload from '../components/ImageUpload'
import EditableText from '../components/EditableText'
import ScrollReveal from '../components/ScrollReveal'
import Countdown from '../components/Countdown'

const QUICK_LINKS = [
  { to: '/sponsors', label: 'Sponsors', icon: Heart, color: '#3ba271' },
  { to: '/competitions', label: 'Competitions', icon: Trophy, color: '#0066b3' },
  { to: '/news', label: 'News', icon: Newspaper, color: 'var(--accent)' },
  { to: '/contact', label: 'Contact', icon: Users, color: '#3ba271' },
]

export default function Home() {
  const { content, setValue } = useSiteContent()
  const { images, setImage } = useSiteImages()

const { isUnlocked } = useTeamAuth()
  
  const { data: newsData } = useTable('news_posts', { order: 'post_date', ascending: false })
  const news = Array.isArray(newsData) ? newsData : []

  const mission =
    content.mission_statement ||
    'The mission of CyBearBots is to move past the traditional classroom to include more students, encourage community collaboration with mentors, and immerse ourselves in STEM through our involvement with FIRST.'

  // Countdown settings (stored in site_content)
  const countdownVisible = content.countdown_visible !== false && content.countdown_visible !== 'false'
  const countdownDate = content.countdown_target_date || ''
  const countdownLabel = content.countdown_label || ''
  const countdownEndMessage = content.countdown_end_message || ''
  const countdownEndLinkText = content.countdown_end_link_text || ''
  const countdownEndLinkUrl = content.countdown_end_link_url || ''

  return (
    <div>
      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b hex-pattern" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 lg:px-6 pt-12 pb-16 lg:pt-20 lg:pb-28">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8 mb-8">
            <div className="fade-up flex items-end gap-4">
            {/* Main/hero logos — always shown (upload only visible when unlocked via ImageUpload gating) */}
<div className="flex gap-4">
  {/* Dark Mode Logo */}
  <div className={isUnlocked ? 'block' : 'hidden dark:block'}>
    {isUnlocked && <p className="label-mono text-[10px] mb-1 text-[var(--text-faint)]">HERO (DARK)</p>}
    <ImageUpload
      src={images.team_logo}
      onUpload={(url) => setImage('team_logo', url)}
      label="HERO DARK"
      folder="branding"
      aspect="aspect-square"
      className="w-24 shadow-md rounded-xl"
    />
  </div>

  {/* Light Mode Logo */}
  <div className={isUnlocked ? 'block' : 'block dark:hidden'}>
    {isUnlocked && <p className="label-mono text-[10px] mb-1 text-[var(--text-faint)]">HERO (LIGHT)</p>}
    <ImageUpload
      src={images.team_logo_light} 
      onUpload={(url) => setImage('team_logo_light', url)}
      label="HERO LIGHT"
      folder="branding"
      aspect="aspect-square"
      className="w-24 shadow-md rounded-xl"
    />
  </div>
</div>
              {/* Nav logos — only shown to team members */}
              {isUnlocked && (
                <>
                  <div>
                    <p className="label-mono text-[10px] mb-1 text-[var(--text-faint)]">NAV (DARK)</p>
                    <ImageUpload
                      src={images.nav_logo}
                      onUpload={(url) => setImage('nav_logo', url)}
                      label="NAV DARK"
                      folder="branding"
                      aspect="aspect-square"
                      className="w-16 shadow-md rounded-xl"
                    />
                  </div>
                  <div>
                    <p className="label-mono text-[10px] mb-1 text-[var(--text-faint)]">NAV (LIGHT)</p>
                    <ImageUpload
                      src={images.nav_logo_light}
                      onUpload={(url) => setImage('nav_logo_light', url)}
                      label="NAV LIGHT"
                      folder="branding"
                      aspect="aspect-square"
                      className="w-16 shadow-md rounded-xl"
                    />
                  </div>
                </>
              )}
            </div>
            <div className="text-left sm:text-right label-mono text-xs leading-relaxed text-[var(--text-muted)]">
              <p className="font-bold text-[var(--text)]">FIRST FRC</p>
              <p>BUILD VER: {new Date().getFullYear()}.1</p>
            </div>
          </div>

          <p className="label-mono mb-3 text-xs font-semibold tracking-widest text-[var(--accent)] fade-up">
            FRC TEAM #7504 · BREWSTER, NY
          </p>
          
          <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-tight mb-6">
            CYBEARBOTS <span style={{ color: 'var(--accent)' }}>#7504</span>
          </h1>

          <div className="max-w-3xl fade-up-2">
            <EditableText
              value={mission}
              onSave={(v) => setValue('mission_statement', v)}
            />
          </div>
        </div>
      </section>

      {/* COUNTDOWN */}
      <Countdown
        targetDate={countdownDate}
        label={countdownLabel}
        endMessage={countdownEndMessage}
        endLinkText={countdownEndLinkText}
        endLinkUrl={countdownEndLinkUrl}
        onSave={setValue}
        visible={countdownVisible}
      />

      {/* QUICK LINKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
        <ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {QUICK_LINKS.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className="card p-6 flex flex-col justify-between hover:border-[var(--accent)] transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ background: `${link.color}15` }}>
                    <Icon size={20} style={{ color: link.color }} />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold tracking-tight">{link.label}</span>
                    <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform text-[var(--text-muted)]" />
                  </div>
                </Link>
              )
            })}
          </div>
        </ScrollReveal>
      </section>

      {/* RECENT NEWS / UPDATES */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-12 border-t" style={{ borderColor: 'var(--border)' }}>
        <ScrollReveal>
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display font-bold text-2xl lg:text-3xl">Latest Team Updates</h2>
            <Link to="/news" className="label-mono text-sm flex items-center gap-1 hover:underline" style={{ color: 'var(--accent)' }}>
              VIEW ALL <ExternalLink size={14} />
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.slice(0, 3).map((post) => (
            <ScrollReveal key={post.id}>
              <div className="card p-6 flex flex-col justify-between h-full">
                <div>
                  <p className="label-mono text-xs text-[var(--text-faint)] mb-2">
                    {new Date(post.post_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  <h3 className="font-bold text-xl mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-[var(--text-muted)] text-sm line-clamp-3 mb-4">{post.summary || post.body}</p>
                </div>
                <Link to="/news" className="text-sm font-semibold flex items-center gap-1 hover:underline" style={{ color: 'var(--accent)' }}>
                  Read story <ArrowRight size={14} />
                </Link>
              </div>
            </ScrollReveal>
          ))}
          {news.length === 0 && (
            <div className="col-span-full card p-8 text-center border-dashed" style={{ borderColor: 'var(--border-strong)' }}>
              <p className="text-[var(--text-muted)]">No recent news posts found. Check back soon!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
