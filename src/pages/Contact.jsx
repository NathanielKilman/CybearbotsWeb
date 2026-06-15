import { useState } from 'react'
import { Mail, MapPin, Check, MessageSquare, Plus, Trash2, ExternalLink } from 'lucide-react'
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
  
  const defaultLinks = [
    { id: 'tba', label: 'The Blue Alliance', url: 'https://www.thebluealliance.com/team/7504', isDefault: true },
    { id: 'first', label: 'FIRST Robotics Page', url: 'https://www.firstinspires.org/', isDefault: true }
  ]

  const resources = Array.isArray(dbResources) ? [...defaultLinks, ...dbResources] : defaultLinks

  const handleAddLink = async () => {
    const label = prompt("Enter a name/label for this link:")
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
        
        {/* LEFT COLUMN: CONTACT DETAILS & RESOURCE LINKS */}
        <div className="lg:col-span-5 space-y-10">
          <div>
            <SectionLabel>CONNECT WITH US</SectionLabel>
            <div className="flex items-center justify-between mt-2">
              <h2 className="font-display font-extrabold text-3xl tracking-tight">Team Channels</h2>
              {isUnlocked && (
                <button
                  onClick={handleAddLink}
                  type="button"
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
              <div className="w-10 h-10 rounded-xl bg-[var(--bg-elevated)] flex items-center justify-center text-
