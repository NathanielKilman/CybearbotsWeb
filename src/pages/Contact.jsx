import { useState } from 'react'
import { Mail, Phone, MapPin, Send, Check, MessageSquare, Instagram, Github, Youtube, Plus, Trash2, ExternalLink } from 'lucide-react'
import PageHero from '../components/PageHero'
import SectionLabel from '../components/SectionLabel'
import { supabase } from '../lib/supabase'
import { useTable, useSiteContent } from '../lib/data'

export default function Contact() {
  const { content } = useSiteContent()
  const isUnlocked = content?.isUnlocked || false

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('idle')

  // Fetch dynamic links from database table
  const { data: dbResources, refetch } = useTable('team_resources')
  
  // Hardcoded default fallback links so Blue Alliance and FIRST are never missing!
  const defaultLinks = [
    { id: 'tba', label: 'The Blue Alliance', url: 'https://www.thebluealliance.com/team/7504', isDefault: true },
    { id: 'first', label: 'FIRST Robotics Page', url: 'https://www.firstinspires.org/', isDefault: true }
  ]

  // Combine defaults with database resources safely
  const resources = Array.isArray(dbResources) ? [...defaultLinks, ...dbResources] : defaultLinks

  const handleAddLink = async () => {
    const label = prompt("Enter a name/label for this link:")
    const url = prompt("Enter the destination URL:")
    if (!label || !url) return

    await supabase.from('team_resources').insert({ label, url })
    refetch()
  }

  const handleDeleteLink = async (e, id) => {
    e.preventDefault() // Stop link from opening
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
        
        {/* LEFT COLUMN: DIRECT CONTACT Channels */}
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

          {/* Core Contact Info Layout Blocks */}
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

          {/* Dynamic & Fallback Public Resource Directory Links */}
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

                  {/* Show delete button only for custom admin links, not default placeholders */}
                  {isUnlocked && !item.isDefault && (
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
          </div>
        </div>

        {/* RIGHT COLUMN: MESSAGING FORM PANEL */}
        <div className="lg:col-span-7">
          {status === 'sent' ? (
            <div className="card p-10 text-center space-y-4 max-w-xl mx-auto border-2 border-[var(--accent)]">
              <div className="w-14 h-14 rounded-full bg-[var(--accent-soft)] flex items-center justify-center mx-auto text-[var(--accent)]">
                <Check size={28} />
              </div>
              <h3 className="font-display font-bold text-2xl">Message Dispatched</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                Your transmission was uploaded successfully. One of our student leaders or coach mentors will respond shortly via email.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card p-6 sm:p-10 space-y-5 bg-[var(--bg-elevated)] border border-[var(--border)]">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare size={18} className="text-[var(--accent)]" />
                <h3 className="font-display font-bold text-xl">Direct Message Terminal</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-mono block mb-1 text-xs">Your Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-transparent border rounded-lg p-3 outline-none text-sm transition-colors focus:border-[var(--accent)]"
                    style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
                    value={form.name}
                    onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="label-mono block mb-1 text-xs">Email Address *</label>
                  <input
                    type="email"
                    required
                    className="w-full bg-transparent border rounded-lg p-3 outline-none text-sm transition-colors focus:border-[var(--accent)]"
                    style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
                    value={form.email}
                    onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="label-mono block mb-1 text-xs">Subject / Purpose</label>
                <input
                  type="text"
                  className="w-full bg-transparent border rounded-lg p-3 outline-none text-sm transition-colors focus:border-[var(--accent)]"
                  style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
                  value={form.subject}
                  onChange={(e) => setForm(f => ({ ...f, subject: e.target.value }))}
                  placeholder="e.g. Robot Demonstration Request"
                />
              </div>

              <div>
                <label className="label-mono block mb-1 text-xs">Detailed Message *</label>
                <textarea
                  rows={6}
                  required
                  className="w-full bg-transparent border rounded-lg p-3 outline-none text-sm transition-colors focus:border-[var(--accent)]"
                  style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
                  value={form.message}
                  onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Type your communication transmission here..."
                />
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg font-semibold text-white text-sm shadow transition-opacity disabled:opacity-60"
                style={{ background: 'var(--accent-strong)' }}
              >
                {status === 'sending' ? 'Transmitting Data...' : 'Send Message'}
              </button>

              {status === 'error' && (
                <p className="text-xs text-center font-bold" style={{ color: '#ed1c24' }}>
                  Failed to send message. Check database connection parameters or retry.
                </p>
              )}
            </form>
          )}
        </div>
      </section>
    </div>
  )
}
