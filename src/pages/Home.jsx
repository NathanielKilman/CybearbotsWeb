import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Trophy, Newspaper, Users, ArrowRight, FileText, Plus, Trash2, ExternalLink } from 'lucide-react'
import { useSiteContent, useSiteImages, useTable } from '../lib/data'
import { useTeamAuth } from '../context/TeamAuthContext'
import { supabase } from '../lib/supabase'
import ImageUpload from '../components/ImageUpload'
import EditableText from '../components/EditableText'
import ScrollReveal from '../components/ScrollReveal'

const QUICK_LINKS = [
  { to: '/sponsors', label: 'Sponsors', icon: Heart, color: '#3ba271' },
  { to: '/competitions', label: 'Competitions', icon: Trophy, color: '#0066b3' },
  { to: '/news', label: 'News', icon: Newspaper, color: 'var(--accent)' },
  { to: '/contact', label: 'Contact', icon: Users, color: '#3ba271' },
]

export default function Home() {
  const { content, setValue } = useSiteContent()
  const { images, setImage } = useSiteImages()
  const { user } = useTeamAuth() 
  
  const { data: newsData } = useTable('news_posts', { order: 'post_date', ascending: false })
  const news = Array.isArray(newsData) ? newsData : []

  // --- Public Resources State ---
  const [resources, setResources] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newUrl, setNewUrl] = useState('')

  // Fetch from your existing 'public_resources' table
  useEffect(() => {
    async function fetchResources() {
      const { data, error } = await supabase
        .from('public_resources')
        .select('*')
        .order('id', { ascending: true }) 
      
      if (!error && data) setResources(data)
    }
    fetchResources()
  }, [])

  // Handle adding a new resource link
  const handleAddResource = async (e) => {
    e.preventDefault()
    if (!newTitle || !newUrl) return

    const formattedUrl = newUrl.startsWith('http') ? newUrl : `https://${newUrl}`

    const { data, error } = await supabase
      .from('public_resources')
      .insert([{ title: newTitle, url: formattedUrl }])
      .select()

    if (!error && data) {
      setResources([...resources, data[0]])
      setNewTitle('')
      setNewUrl('')
    }
  }

  // Handle deleting a resource link
  const handleDeleteResource = async (id) => {
    const { error } = await supabase
      .from('public_resources')
      .delete()
      .eq('id', id)

    if (!error) {
      setResources(resources.filter(item => item.id !== id))
    }
  }

  const mission =
    content.mission_statement ||
    'The mission of CyBearBots is to move past the traditional classroom to include more students, encourage community collaboration with mentors, and immerse ourselves in STEM through our involvement with FIRST.'

  return (
    <div>
      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b hex-pattern" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 lg:px-6 pt-12 pb-16 lg:pt-20 lg:pb-28">
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
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" 
                    style={{ background: link.color + '15' }}
                  >
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

      {/* TEAM RESOURCES SECTION */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-12 border-t" style={{ borderColor: 'var(--border)' }}>
        <ScrollReveal>
          <div className="mb-6">
            <h2 className="font-display font-bold text-2xl lg:text-3xl mb-2 text-left">Team Resources</h2>
            <p className="text-sm text-[var(--text-muted)] text-left">Useful document templates, drives, and tools for internal team operations.</p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {resources.map((item) => (
              <div 
                key={item.id} 
                className="card p-4 flex items-center justify-between gap-4 group hover:border-[var(--accent)] transition-colors"
              >
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center gap-3 font-semibold text-sm hover:text-[var(--accent)] transition-colors grow text-left"
                >
                  <div className="w-8 h-8 rounded bg-[var(--border)] flex items-center justify-center shrink-0">
                    <FileText size={16} className="text-[var(--text-muted)]" />
                  </div>
                  <span className="truncate">{item.title}</span>
                  <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--text-faint)]" />
                </a>

                {user && (
                  <button 
                    onClick={() => handleDeleteResource(item.id)}
                    className="p-1.5 rounded text-[var(--text-faint)] hover:text-red-500 hover:bg-red-500/10 transition-colors"
                    title="Delete link"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}

            {resources.length === 0 && !user && (
              <p className="text-sm text-[var(--text-faint)] italic col-span-full py-4 text-left">No resources shared yet.</p>
            )}
          </div>

          {user && (
            <form onSubmit={handleAddResource} className="card p-4 bg-[var(--nav-bg)] border-dashed max-w-xl flex flex-col sm:flex-row gap-3 items-end">
              <div className="w-full text-left">
                <label className="block label-mono text-[10px] text-[var(--text-muted)] mb-1">RESOURCE NAME</label>
                <input 
                  type="text"
                  placeholder="e.g., Coding Standards"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-sm p-2 rounded border bg-[var(--bg)]"
                  style={{ borderColor: 'var(--border)' }}
                />
              </div>
              <div className="w-full text-left">
                <label className="block label-mono text-[10px] text-[var(--text-muted)] mb-1">TARGET URL</label>
                <input 
                  type="text"
                  placeholder="drive.google.com/..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full text-sm p-2 rounded border bg-[var(--bg)]"
                  style={{ borderColor: 'var(--border)' }}
                />
              </div>
              <button 
                type="submit"
                className="w-full sm:w-auto px-4 py-2 bg-[var(--accent)] text-white rounded text-sm font-semibold flex items-center justify-center gap-1 shrink-0 h-[38px]"
              >
                <Plus size={16} /> Add
              </button>
            </form>
          )}
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
                <Link to={`/news/${post.id}`} className="text-sm font-semibold flex items-center gap-1 hover:underline" style={{ color: 'var(--accent)' }}>
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
