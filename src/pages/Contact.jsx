import { useState } from 'react'
import { Mail, MapPin, Send, Check, MessageSquare, Plus, Trash2, ExternalLink } from 'lucide-react'
import PageHero from '../components/PageHero'
import SectionLabel from '../components/SectionLabel'
import { supabase } from '../lib/supabase'
import { useTable, useSiteContent } from '../lib/data'

export default function Contact() {
  const { content } = useSiteContent()
  const isUnlocked = content?.isUnlocked || false

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('idle')

  const { data: dbResources, refetch } = useTable('team_resources')
  const resources = Array.isArray(dbResources) ? dbResources : []

  const handleAddLink = async () => {
    const label = prompt("Enter a label for this link:")
    const url = prompt("Enter the destination URL:")
    if (!label || !url) return

    await supabase.from('team_resources').insert({ label, url })
    refetch()
  }

  const handleDeleteLink = async (e, id) => {
    e.preventDefault()
    if (!confirm("Are you sure you want to remove this link?")) return
    await supabase.from('team_resources').delete().eq('id', id)
    refetch()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return

    setStatus('sending')
    const { error } = await supabase.from('contact_inquiries').insert(form)
    
    if (error) {
      setStatus('error')
    } else {
      setStatus('sent')
      setForm({ name: '', email: '', subject: '', message: '' })
    }
  }

  return (
    <div>
      <PageHero kicker="GET IN TOUCH" title="Contact Us" variant="green" />

      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5 space-y-10">
          <div>
            <SectionLabel>CONNECT WITH US</SectionLabel>
            <div className="flex items-center justify-between mt-2">
              <h2 className="font-display font-extrabold text-3xl tracking-tight">Team Channels</h2>
              {isUnlocked && (
                <button
                  onClick={handleAddLink}
                  className="flex items-center gap-1 text-[10px] font-mono font-bold border border-[var(--accent)] text-[var(--accent)] px-2.5 py-1 rounded-md hover:bg-[var(--bg-elevated)] transition-colors"
                >
                  <Plus size={12} /> ADD LINK
                </button>
              )}
            </div>
            <p className="text-[var(--text-muted)] text-sm mt-3 leading-relaxed">
              Have questions about joining the team, sponsorship packages, or community outreach events? Reach out directly.
            </p>
          </div>

          <div className="space-y-4">
            <div className="card p-4 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--bg-elevated)] flex items-center justify-center text-[var(--accent)] border border-[var(--border)] shrink-0">
                <Mail size={18} />
              </div>
              <div>
                <p className="label-mono text-[var(--text-faint)] text-[10px] uppercase font-bold tracking-wider">Email Address</p>
                <a href="mailto:mentors@cybearbots.com" className="text-sm font-semibold text-[var(--text)] hover:underline">
                  mentors@cybearbots.com
                </a>
              </div>
            </div>

            <div className="card p-4 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--bg-elevated)] flex items-center justify-center text-[var(--accent)] border border-[var(--border)] shrink-0">
                <MapPin size={18} />
              </div>
              <div>
                <p className="label-mono text-[var(--text-faint)] text-[10px] uppercase font-bold tracking-wider">Lab Location</p>
                <p className="text-sm font-semibold text-[var(--text)] leading-relaxed">
                  Brewster High School — Room 104<br />
                  50 Foggintown Rd, Brewster, NY 10509
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-[var(--border)]">
            <h3 className="label-mono text-xs font-bold text-[var(--text-muted)] tracking-wider uppercase">
              Documents & Social Media
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {resources.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="card p-4 flex items-center justify-between transition-all hover:scale-[1.01] group border"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border bg-[var(--bg-elevated)]" style={{ borderColor: 'var(--border)' }}>
                      <ExternalLink size={16} className="text-[var(--accent)]" />
                    </div>
                    <h4 className="text-sm font-bold text-[var(--text)] group-hover:underline">
                      {item.label}
                    </h4>
                  </div>
                  {isUnlocked && (
                    <button
                      onClick={(e) => handleDeleteLink(e, item.id)}
                      className="p-2 rounded-lg text-[var(--text-faint)] hover:text-[#ed1c24] hover:bg-[var(--bg-elevated)] transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </a>
              ))}
            </div>
