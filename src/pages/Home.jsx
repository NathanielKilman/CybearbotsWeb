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
        // Using 'id' as an alternative sorting fallback if 'created_at' isn't explicitly defined
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
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb
