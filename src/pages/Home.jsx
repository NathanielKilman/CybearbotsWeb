import { Link } from 'react-router-dom'
import { Heart, Trophy, Newspaper, Users, ArrowRight } from 'lucide-react'
import { useSiteContent, useSiteImages, useTable } from '../lib/data'
import ImageUpload from '../components/ImageUpload'
import EditableText from '../components/EditableText'

const QUICK_LINKS = [
  { to: '/sponsors', label: 'Sponsors', icon: Heart, color: '#3ba271' },
  { to: '/competitions', label: 'Competitions', icon: Trophy, color: '#0066b3' },
  { to: '/news', label: 'News', icon: Newspaper, color: '#ed1c24' },
  { to: '/contact', label: 'Contact', icon: Users, color: '#3ba271' },
]

export default function Home() {
  const { content, setValue } = useSiteContent()
  const { images, setImage } = useSiteImages()
  
  // Safely fetch latest news items
  const { data: newsData } = useTable('news_posts', { order: 'post_date', ascending: false })
  const news = Array.isArray(newsData) ? newsData : []

  const mission =
    content.mission_statement ||
    'The mission of CyBearBots is to move past the traditional classroom to include more students, encourage community collaboration with mentors, and immerse ourselves in STEM through our involvement with FIRST.'

  return (
    <div>
      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b hex-pattern" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 lg:px-6 pt-12 pb-16 lg:pt-20 lg:pb-28">
          
          {/* BRANDING LOGO ROW */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8 mb-8">
            <div className="fade-up">
              <ImageUpload
                src={images.team_logo}
                onUpload={(url) => setImage('team_logo', url)}
                label="TEAM LOGO"
                folder="branding"
                aspect="aspect-square"
                className="w-24 shadow-md rounded-xl"
              />
            </div>
            <div className="text-left sm:text-right label-mono text-xs leading-relaxed text-[var(--text-muted)]">
              <p className="font-bold text-[var(--text)]">FIRST FRC</p>
              <p>BUILD VER: {new Date().getFullYear()}.1</p>
            </div>
          </div>

          <p className="label-mono mb-3 text-xs font-semibold tracking-widest text-[var(--accent)] fade-up">
            FRC TEAM #7504 · BREWSTER, NY
          </p>
          
          {/* FIXED: Added leading-tight and adjusted margins so the "Y" doesn't overlap text below */}
          <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-tight mb-6">
            CYBEARBOTS <span style={{ color: 'var(--accent)' }}>#7504</span>
          </h1>

          <div className="max-w-3xl fade-up-2">
            <EditableText
              value={mission}
              onSave={(v) => setValue('mission_statement', v)}
              as="textarea"
              tag="p"
              className="text-lg lg:text-xl text-[var(--text-muted)] leading-relaxed"
            />
          </div>
        </div>
      </section>

      {/* QUICK LINKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_LINKS.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.to}
                to={link.to}
                className="card p-6 flex flex-col items-center gap-3 text-center transition-all hover:scale-[1.02] hover:border-[var(--accent)]"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[var(--bg-elevated)]">
                  <Icon size={22} style={{ color: link.color }} />
                </div>
                <span className="label-mono text-[var(--text)] font-semibold text-xs mt-1">{link.label.toUpperCase()}</span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* LATEST NEWS SECTION */}
      {news.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 lg:px-6 py-12 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-2xl tracking-tight">Latest News</h2>
            <Link to="/news" className="text-sm font-semibold flex items-center gap-1 hover:underline" style={{ color: 'var(--accent)' }}>
              All Posts <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.slice(0, 3).map((post) => (
              <div key={post.id} className="card overflow-hidden flex flex-col h-full bg-[var(--bg-elevated)] border" style={{ borderColor: 'var(--border)' }}>
                {post.image_url && (
                  <img src={post.image_url} alt={post.title} className="w-full aspect-[16/9] object-cover border-b" style={{ borderColor: 'var(--border)' }} />
                )}
                <div className="p-5 flex flex-col flex-1">
                  <p className="label-mono text-xs text-[var(--text-faint)] mb-2">
                    {new Date(post.post_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  <h3 className="font-display font-bold text-lg mb-2 text-[var(--text)]">{post.title}</h3>
                  <p className="text-sm text-[var(--text-muted)] line-clamp-3 leading-relaxed">{post.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PHOTO GALLERY SECTION */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-16 border-b" style={{ borderColor: 'var(--border)' }}>
        <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl leading-none tracking-tight mb-12">
          Engineering Tomorrow,<br />
          <span style={{ color: 'var(--accent)' }}>Today.</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <ImageUpload
            src={images.home_team_photo}
            onUpload={(url) => setImage('home_team_photo', url)}
            label="UPLOAD TEAM PHOTO"
            folder="home"
            aspect="aspect-[4/3]"
            className="shadow-lg border"
          />
          <ImageUpload
            src={images.home_robot_photo}
            onUpload={(url) => setImage('home_robot_photo', url)}
            label="UPLOAD ROBOT PHOTO"
            folder="home"
            aspect="aspect-[4/3]"
            className="shadow-lg border"
          />
          <ImageUpload
            src={images.home_workshop_photo}
            onUpload={(url) => setImage('home_workshop_photo', url)}
            label="UPLOAD WORKSHOP PHOTO"
            folder="home"
            aspect="aspect-[4/3]"
            className="shadow-lg border"
          />
        </div>
      </section>

      {/* SUPPORT BANNER */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
        <div
          className="rounded-2xl p-10 lg:p-16 text-center hex-pattern shadow-xl"
          style={{ background: 'var(--accent-strong)' }}
        >
          <p className="label-mono mb-3 text-xs font-semibold tracking-wider text-white/80">
            BREWSTER HIGH SCHOOL · SINCE 2018
          </p>
          <h2 className="font-display font-black text-4xl sm:text-5xl text-white mb-5 tracking-tight">
            Support Our Mission
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8 leading-relaxed text-base sm:text-lg">
            CyBearBots runs on the generosity of local businesses and community members. Every
            contribution directly funds our season, travel, and student development.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            
            {/* FIXED: Button background is white, and text color is locked to your dark green variable */}
            <Link
              to="/sponsors"
              className="px-6 py-3 rounded-lg font-semibold bg-white flex items-center gap-2 transition-transform hover:scale-105 shadow-md"
              style={{ color: 'var(--accent-strong)' }}
            >
              Become a Sponsor <ArrowRight size={16} />
            </Link>
            
            <Link
              to="/contact"
              className="px-6 py-3 rounded-lg font-semibold text-white border border-white/30 hover:bg-white/10 flex items-center gap-2 transition-transform hover:scale-105"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
