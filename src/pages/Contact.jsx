import { useState } from 'react'
import { Mail, MapPin, Send, Check, MessageSquare, FileText, ExternalLink } from 'lucide-react'
import PageHero from '../components/PageHero'
import SectionLabel from '../components/SectionLabel'
import { supabase } from '../lib/supabase'
import { useTable, useSiteContent } from '../lib/data'

export default function Contact() {
  const { content } = useSiteContent()
  const isUnlocked = content?.isUnlocked || false

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('idle')

  // Fetch your dynamic resources table data automatically
  const { data: resources } = useTable('team_resources')
  const resourceList = Array.isArray(resources) ? resources : []

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return

    setStatus('sending')
    
    // Submitting general contact inquiries directly to your table
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
        
        {/* LEFT COLUMN: DIRECT CONTACT & DYNAMIC RESOURCE DIRECTORY */}
        <div className="lg:col-span-5 space-y-10">
          <div>
            <SectionLabel>CONNECT WITH US</SectionLabel>
            <h2 className="font-display font-extrabold text-3xl mt-2 tracking-tight">Team Channels</h2>
            <p className="text-[var(--text-muted)] text-sm mt-3 leading-relaxed">
              Have questions about joining the team, corporate sponsorship packages, or community outreach events? Reach out through our official channels.
            </p>
          </div>

          {/* Core Info Boxes */}
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

          {/* DYNAMIC DOSSIER & SOCIAL LINKS LAYOUT */}
          <div className="space-y-4 pt-4 border-t border-[var(--border)]">
            <h3 className="label-mono text-xs font-bold text-[var(--text-muted)] tracking-wider uppercase">
              Team Documents & Directories
            </h3>

            {resourceList.length === 0 ? (
              <p className="text-xs text-[var(--text-faint)] italic">No documentation links published yet.</p>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {resourceList.map((item) => (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="card p-4 flex items-start justify-between gap-4 transition-all hover:scale-[1.01] bg-[var(--bg-elevated)] border hover:border-[var(--accent)] group"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border bg-[var(--bg)]" style={{ borderColor: 'var(--border)' }}>
                        <FileText size={18} className="text-[var(--accent)]" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[var(--text)] group-hover:underline">
                          {item.label}
                        </h4>
                        <p className="text-[10px] font-mono text-[var(--text-faint)] mt-0.5 truncate max-w-[220px] sm:max-w-xs">
                          {item.url}
                        </p>
                      </div>
                    </div>
                    <ExternalLink size={14} className="text-[var(--text-faint)] group-hover:text-[var(--accent)] transition-colors self-center shrink-0" />
                  </a>
                ))}
              </div>
            )}
            
            {isUnlocked && (
              <p className="text-[10px] font-mono text-[var(--text-faint)] bg-[var(--bg-elevated)] p-3 rounded-lg border border-dashed border-[var(--border)]">
                ℹ️ <strong>Admin Mode Active:</strong> To add, rename, or delete these resource links, simply scroll down to the document panel on the <strong>Home Page</strong>. Changes propagate everywhere instantly!
              </p>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: CONTACT FORM TERMINAL */}
        <div className="lg:col-span-7">
          {status === 'sent' ? (
            <div className="card p-10 text-center space-y-4 max-w-xl mx-auto border-2 border-[var(--accent)]">
              <div className="w-14 h-14 rounded-full bg-[var(--accent-soft)] flex items-center justify-center mx-auto text-[var(--accent)]">
                <Check size={28} />
              </div>
              <h3 className="font-display font-bold text-2xl">Message Dispatched</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                Your communication submission was logged successfully. One of our student leaders or coach mentors will follow up with you shortly via email.
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
                  placeholder="e.g. Corporate Sponsorship Inquiry"
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
                  placeholder="Type your message details here..."
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
                  Failed to send message. Please review data connection settings or reach out manually via email.
                </p>
              )}
            </form>
          )}
        </div>
      </section>
    </div>
  )
}
