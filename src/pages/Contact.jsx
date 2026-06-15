import { useState } from 'react'
import { Send, Check, Mail, MapPin, ExternalLink } from 'lucide-react'
import PageHero from '../components/PageHero'
import EditableText from '../components/EditableText'
import { useSiteContent } from '../lib/data'
import { supabase } from '../lib/supabase'

export default function Contact() {
  const { content, setValue } = useSiteContent()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('idle')

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const email = content.contact_email || 'team@cybearbots.org'
  const blueAllianceUrl = content.blue_alliance_url || 'https://www.thebluealliance.com/team/7504'
  const firstProfileUrl = content.first_profile_url || 'https://frc-events.firstinspires.org/team/7504'

  const submit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return
    setStatus('sending')
    const { error } = await supabase.from('contact_messages').insert(form)
    if (error) {
      setStatus('error')
    } else {
      setStatus('sent')
      setForm({ name: '', email: '', subject: '', message: '' })
    }
  }

  return (
    <div>
      <PageHero kicker="TEAM #7504 · GET IN TOUCH" title="Contact" variant="green" />

      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: info + social */}
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="label-mono mb-4">REACH US DIRECTLY</h3>
              <div className="flex items-start gap-3 mb-4">
                <Mail size={18} className="mt-0.5" style={{ color: 'var(--accent)' }} />
                <div className="flex-1">
                  <p className="text-sm text-[var(--text-faint)] mb-1">Email</p>
                  <a href={`mailto:${email}`} className="hover:underline" style={{ color: 'var(--accent)' }}>
                    {email}
                  </a>
                  <div className="mt-1">
                    <EditableText
                      value={email}
                      onSave={(v) => setValue('contact_email', v)}
                      tag="span"
                      className="text-xs text-[var(--text-faint)]"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5" style={{ color: 'var(--accent)' }} />
                <div>
                  <p className="text-sm text-[var(--text-faint)] mb-1">Location</p>
                  <p>Brewster High School<br />50 Foggintown Road<br />Brewster, NY 10509</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="label-mono mb-4">SOCIAL & LINKS</h3>
              <div className="flex flex-wrap gap-3">
                <a
                  href={blueAllianceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg border font-medium text-sm transition-colors hover:border-[var(--accent)]"
                  style={{ borderColor: 'var(--border)' }}
                >
                  The Blue Alliance <ExternalLink size={14} />
                </a>
                <a
                  href={firstProfileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg border font-medium text-sm transition-colors hover:border-[var(--accent)]"
                  style={{ borderColor: 'var(--border)' }}
                >
                  FIRST Profile <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>

          {/* Right: contact form */}
          <div>
            {status === 'sent' ? (
              <div className="card p-10 text-center h-full flex flex-col items-center justify-center">
                <Check size={32} className="mb-3" style={{ color: 'var(--accent)' }} />
                <h3 className="font-display font-bold text-xl mb-2">Message sent!</h3>
                <p className="text-[var(--text-muted)]">We'll get back to you as soon as we can.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="card p-6 lg:p-8 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label-mono block mb-1">Name *</label>
                    <input
                      required
                      className="w-full bg-transparent border rounded-lg p-2.5 outline-none"
                      style={{ borderColor: 'var(--border)' }}
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label-mono block mb-1">Email *</label>
                    <input
                      required
                      type="email"
                      className="w-full bg-transparent border rounded-lg p-2.5 outline-none"
                      style={{ borderColor: 'var(--border)' }}
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="label-mono block mb-1">Subject</label>
                  <input
                    className="w-full bg-transparent border rounded-lg p-2.5 outline-none"
                    style={{ borderColor: 'var(--border)' }}
                    value={form.subject}
                    onChange={(e) => update('subject', e.target.value)}
                  />
                </div>
                <div>
                  <label className="label-mono block mb-1">Message *</label>
                  <textarea
                    required
                    rows={6}
                    className="w-full bg-transparent border rounded-lg p-2.5 outline-none"
                    style={{ borderColor: 'var(--border)' }}
                    value={form.message}
                    onChange={(e) => update('message', e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-white disabled:opacity-50"
                  style={{ background: 'var(--accent-strong)' }}
                >
                  <Send size={16} /> {status === 'sending' ? 'Sending...' : 'Send Message'}
                </button>
                {status === 'error' && (
                  <p className="text-sm text-center" style={{ color: '#ed1c24' }}>
                    Something went wrong. Please try again or email us directly.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
