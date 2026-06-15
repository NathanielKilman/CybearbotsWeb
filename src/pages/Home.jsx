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


      
      import { useState } from 'react'
import { FileText, Plus, Trash2, ExternalLink } from 'lucide-react'
import { useTable } from '../lib/data'
import { useTeamAuth } from '../context/TeamAuthContext'
import { supabase } from '../lib/supabase'

export default function HomeResources() {
  const { isUnlocked } = useTeamAuth()
  const { data: resources, refetch } = useTable('team_resources')
  const [isSaving, setIsSaving] = useState(false)

  // Add a brand new resource link row
  const handleAddResource = async () => {
    const label = prompt("Enter a label for this resource (e.g., 2026 Team Dossier):")
    const url = prompt("Enter the destination link/URL:")
    if (!label || !url) return

    await supabase.from('team_resources').insert({ label, url })
    refetch()
  }

  // Update an existing resource inline
  const handleUpdateResource = async (id, field, currentValue) => {
    const newValue = prompt(`Update ${field}:`, currentValue)
    if (newValue === null || newValue === currentValue) return

    await supabase.from('team_resources').update({ [field]: newValue }).eq('id', id)
    refetch()
  }

  // Remove a resource link completely
  const handleDeleteResource = async (id) => {
    if (!confirm("Are you sure you want to remove this link resource?")) return
    await supabase.from('team_resources').delete().eq('id', id)
    refetch()
  }

  const resourceList = Array.isArray(resources) ? resources : []

  return (
    <section className="max-w-7xl mx-auto px-4 lg:px-6 py-12 border-t" style={{ borderColor: 'var(--border)' }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <span className="label-mono text-xs text-[var(--accent)] font-bold tracking-wider block uppercase">
            Team Documentation
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight mt-1">
            Dossiers & Public Resources
          </h2>
        </div>

        {/* ADMIN MACRO CONTROLLER BUTTON */}
        {isUnlocked && (
          <button
            onClick={handleAddResource}
            className="flex items-center gap-2 label-mono text-xs font-bold px-4 py-2 rounded-lg border transition-all hover:bg-[var(--bg-elevated)]"
            style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
          >
            <Plus size={14} /> ADD NEW FILE/LINK
          </button>
        )}
      </div>

      {resourceList.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center text-sm text-[var(--text-faint)]" style={{ borderColor: 'var(--border)' }}>
          No public resources listed yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resourceList.map((item) => (
            <div 
              key={item.id} 
              className="card p-5 border relative group flex flex-col justify-between items-start min-h-[120px] bg-[var(--bg-elevated)]"
              style={{ borderColor: 'var(--border)' }}
            >
              {/* DELETE BUTTON BLOCK FOR ADMINS */}
              {isUnlocked && (
                <button
                  onClick={() => handleDeleteResource(item.id)}
                  className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center border bg-[var(--bg)] opacity-0 group-hover:opacity-100 transition-all z-10"
                  style={{ borderColor: '#ed1c24' }}
                >
                  <Trash2 size={12} style={{ color: '#ed1c24' }} />
                </button>
              )}

              <div className="space-y-1 w-full pr-6">
                <div className="flex items-center gap-2 text-[var(--accent)] mb-1">
                  <FileText size={18} />
                  <span className="label-mono text-[10px] font-bold uppercase tracking-wider text-[var(--text-faint)]">
                    Official Document
                  </span>
                </div>

                {/* THE DISPLAY LABEL FIELD */}
                <h3 className="font-display font-bold text-base text-[var(--text)] tracking-tight">
                  {item.label}
                </h3>
                
                {/* ADMIN ONLY EDITS */}
                {isUnlocked && (
                  <div className="flex gap-2 mt-2 pt-2 border-t border-dashed" style={{ borderColor: 'var(--border)' }}>
                    <button 
                      onClick={() => handleUpdateResource(item.id, 'label', item.label)}
                      className="text-[10px] font-mono font-bold text-[var(--text-muted)] hover:text-[var(--accent)]"
                    >
                      ✏️ Edit Label
                    </button>
                    <button 
                      onClick={() => handleUpdateResource(item.id, 'url', item.url)}
                      className="text-[10px] font-mono font-bold text-[var(--text-muted)] hover:text-[var(--accent)]"
                    >
                      🔗 Edit Link URL
                    </button>
                  </div>
                )}
              </div>

              {/* ACTION LINK CLICK TERMINAL */}
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="mt-4 text-xs font-bold flex items-center gap-1.5 transition-colors text-[var(--accent)] hover:underline"
              >
                Access Document <ExternalLink size={12} />
              </a>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
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
