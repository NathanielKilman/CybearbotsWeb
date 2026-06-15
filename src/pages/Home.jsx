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
  const { data: news } = useTable('news_posts', { order: 'post_date', ascending: false })

  const mission =
    content.mission_statement ||
    'The mission of CyBearBots is to move past the traditional classroom to include more students, encourage community collaboration with mentors, and immerse ourselves in STEM through our involvement with FIRST.'

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden border-b hex-pattern" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 lg:px-6 pt-12 pb-16 lg:pt-20 lg:pb-24">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-6">
            <div className="fade-up">
              <ImageUpload
                src={images.team_logo}
                onUpload={(url) => setImage('team_logo', url)}
                label="TEAM LOGO"
                folder="branding"
                aspect="aspect-square"
                className="w-28"
              />
            </div>
            <div className="text-right label-mono leading-relaxed">
              <p>FIRST FRC</p>
              <p>VER: {new Date().getFullYear()}.1</p>
            </div>
          </div>

          <p className="label-mono mb-4 fade-up fade-up-1" style={{ color: 'var(--accent)' }}>
            FRC TEAM #7504 · BREWSTER, NY
          </p>
          <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-tight mb-6">
            CyBearBots
          </h1>
          <div className="max-w-3xl fade-up fade-up-3">
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

      {/* QUICK LINKS */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_LINKS.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.to}
                to={link.to}
                className="card p-6 flex flex-col items-center gap-3 text-center transition-transform hover:scale-[1.03] hover:border-[var(--accent)]"
              >
                <Icon size={28} style={{ color: link.color }} />
                <span className="label-mono text-[var(--text)] text-xs">{link.label.toUpperCase()}</span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* LATEST NEWS PREVIEW */}
      {news.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-2xl">Latest News</h2>
            <Link to="/news" className="text-sm flex items-center gap-1 hover:underline" style={{ color: 'var(--accent)' }}>
              All Posts <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {news.slice(0, 3).map((post) => (
              <div key={post.id} className="card overflow-hidden">
                {post.image_url && (
                  <img src={post.image_url} alt={post.title} className="w-full aspect-[16/9] object-cover" />
                )}
                <div className="p-5">
                  <p className="label-mono mb-2">{new Date(post.post_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  <h3 className="font-display font-bold text-lg mb-2">{post.title}</h3>
                  <p className="text-sm text-[var(--text-muted)] line-clamp-3">{post.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* MISSION STATEMENT TAGLINE */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
        <h2 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-tight mb-10">
          Engineering Tomorrow,
          <br />
          Today.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ImageUpload
            src={images.home_team_photo}
            onUpload={(url) => setImage('home_team_photo', url)}
            label="UPLOAD TEAM PHOTO"
            folder="home"
            aspect="aspect-[4/3]"
          />
          <ImageUpload
            src={images.home_robot_photo}
            onUpload={(url) => setImage('home_robot_photo', url)}
            label="UPLOAD ROBOT PHOTO"
            folder="home"
            aspect="aspect-[4/3]"
          />
          <ImageUpload
            src={images.home_workshop_photo}
            onUpload={(url) => setImage('home_workshop_photo', url)}
            label="UPLOAD WORKSHOP PHOTO"
            folder="home"
            aspect="aspect-[4/3]"
          />
        </div>
      </section>

      {/* SUPPORT BANNER */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
        <div
          className="rounded-2xl p-10 lg:p-16 text-center hex-pattern"
          style={{ background: 'var(--accent-strong)' }}
        >
          <p className="label-mono mb-3 text-xs font-semibold tracking-wider" style={{ color: 'rgba(255, 255, 255, 0.75)' }}>
  BREWSTER HIGH SCHOOL · SINCE 2018
</p>
<h2 className="font-display font-black text-4xl sm:text-5xl text-white mb-5 tracking-tight">
  Support Our Mission
</h2>
<p className="text-white/90 max-w-2xl mx-auto mb-8 leading-relaxed text-base sm:text-lg">
            CyBearBots runs on the generosity of local businesses and community members. Every
            contribution directly funds our season, travel, and student development.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/sponsors"
              className="px-6 py-3 rounded-lg font-semibold bg-white text-[var(--accent-strong)] flex items-center gap-2 transition-transform hover:scale-105"
            >
              Become a Sponsor <ArrowRight size={16} />
           <Link
  to="/sponsors"
  className="px-6 py-3 rounded-lg font-semibold text-white border border-white/30 hover:bg-white/10 flex items-center gap-2 transition-transform hover:scale-105"
>
  Become a Sponsor <ArrowRight size={16} />
</Link>
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
