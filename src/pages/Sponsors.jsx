import { useState } from 'react'
import { Check, ExternalLink, Plus, Trash2, X, Send, Image as ImageIcon } from 'lucide-react'
import PageHero from '../components/PageHero'
import SectionLabel from '../components/SectionLabel'
import ImageUpload from '../components/ImageUpload'
import { useTable, useSiteContent } from '../lib/data'
import { useTeamAuth } from '../context/TeamAuthContext'
import { supabase } from '../lib/supabase'

const TIERS = [
  {
    key: 'golden',
    name: 'Golden Gear',
    range: '$501+',
    color: '#d4a017',
    benefits: [
      'Listed on website',
      'Logo linked on website & social media',
      'Logo on brochure sponsorship list',
      'Logo on team T-shirt',
      'Sticker on robot & announced at Regionals',
    ],
  },
  {
    key: 'silver',
    name: 'Silver Gear',
    range: '$251 - $500',
    color: '#b0b3b8',
    benefits: [
      'Listed on website',
      'Logo linked on website & social media',
      'Logo on brochure sponsorship list',
      'Logo on team T-shirt',
    ],
  },
  {
    key: 'bronze',
    name: 'Bronze Gear',
    range: '$101 - $250',
    color: '#cd7f32',
    benefits: [
      'Listed on website',
      'Logo linked on website & social media',
      'Logo on brochure sponsorship list',
    ],
  },
  {
    key: 'nuts_bolts',
    name: 'Nuts & Bolts',
    range: '$10 - $100',
    color: '#9aa3a0',
    benefits: ['Listed on website'],
  },
]

function AddSponsorModal({ onClose, onSaved }) {
  const [form, setForm] = useState({ name: '', website_url: '', tier: 'bronze', logo_url: '' })
  const [saving, setSaving] = useState(false)

  const save = async () => {
    if (!form.name.trim()) return
    setSaving(true)
    await supabase.from('sponsors').insert(form)
    setSaving(false)
    onSaved()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
      <div className="card w-full max-w-md p-6" style={{ background: 'var(--bg-elevated)' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-lg">Add Sponsor</h3>
          <button onClick={onClose}><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <ImageUpload
            src={form.logo_url}
            onUpload={(url) => setForm((f) => ({ ...f, logo_url: url }))}
            label="UPLOAD LOGO"
            folder="sponsors"
            aspect="aspect-[2/1]"
          />
          <div>
            <label className="label-mono block mb-1">Business Name *</label>
            <input
              className="w-full bg-transparent border rounded-lg p-2 outline-none"
              style={{ borderColor: 'var(--border)' }}
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="label-mono block mb-1">Website URL</label>
            <input
              className="w-full bg-transparent border rounded-lg p-2 outline-none"
              style={{ borderColor: 'var(--border)' }}
              placeholder="https://"
              value={form.website_url}
              onChange={(e) => setForm((f) => ({ ...f, website_url: e.target.value }))}
            />
          </div>
          <div>
            <label className="label-mono block mb-1">Sponsorship Tier</label>
            <select
              className="w-full bg-transparent border rounded-lg p-2 outline-none"
              style={{ borderColor: 'var(--border)' }}
              value={form.tier}
              onChange={(e) => setForm((f) => ({ ...f, tier: e.target.value }))}
            >
              {TIERS.map((t) => (
                <option key={t.key} value={t.key}>{t.name} ({t.range})</option>
              ))}
            </select>
          </div>
          <button
            onClick={save}
            disabled={saving || !form.name.trim()}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-white disabled:opacity-50"
            style={{ background: 'var(--accent-strong)' }}
          >
            <Check size={16} /> {saving ? 'Saving...' : 'Add Sponsor'}
          </button>
        </div>
      </div>
    </div>
  )
}

function SponsorInquiryForm() {
  const [form, setForm] = useState({
    business_name: '', contact_name: '', contact_title: '', address: '', phone: '', email: '', message: '',
  })
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const submit = async (e) => {
    e.preventDefault()
    if (!form.business_name.trim() || !form.contact_name.trim()) return
    setStatus('sending')
    const { error } = await supabase.from('sponsor_inquiries').insert(form)
    if (error) {
      setStatus('error')
    } else {
      setStatus('sent')
      setForm({ business_name: '', contact_name: '', contact_title: '', address: '', phone: '', email: '', message: '' })
    }
  }

  if (status === 'sent') {
    return (
      <div className="card p-10 text-center">
        <Check size={32} className="mx-auto mb-3" style={{ color: 'var(--accent)' }} />
        <h3 className="font-display font-bold text-xl mb-2">Thank you!</h3>
        <p className="text-[var(--text-muted)]">
          Your sponsorship inquiry has been received. A member of our business team will reach out soon.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="card p-6 lg:p-8 space-y-5">
      <div>
        <label className="label-mono block mb-1">Business Name *</label>
        <input
          required
          className="w-full bg-transparent border rounded-lg p-2.5 outline-none"
          style={{ borderColor: 'var(--border)' }}
          value={form.business_name}
          onChange={(e) => update('business_name', e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label-mono block mb-1">Contact Name *</label>
          <input
            required
            className="w-full bg-transparent border rounded-lg p-2.5 outline-none"
            style={{ borderColor: 'var(--border)' }}
            value={form.contact_name}
            onChange={(e) => update('contact_name', e.target.value)}
          />
        </div>
        <div>
          <label className="label-mono block mb-1">Contact Title / Role</label>
          <input
            className="w-full bg-transparent border rounded-lg p-2.5 outline-none"
            style={{ borderColor: 'var(--border)' }}
            value={form.contact_title}
            onChange={(e) => update('contact_title', e.target.value)}
          />
        </div>
      </div>
      <div>
        <label className="label-mono block mb-1">Business Address</label>
        <input
          className="w-full bg-transparent border rounded-lg p-2.5 outline-none"
          style={{ borderColor: 'var(--border)' }}
          value={form.address}
          onChange={(e) => update('address', e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label-mono block mb-1">Phone Number</label>
          <input
            className="w-full bg-transparent border rounded-lg p-2.5 outline-none"
            style={{ borderColor: 'var(--border)' }}
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
          />
        </div>
        <div>
          <label className="label-mono block mb-1">Email</label>
          <input
            type="email"
            className="w-full bg-transparent border rounded-lg p-2.5 outline-none"
            style={{ borderColor: 'var(--border)' }}
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
          />
        </div>
      </div>
      <div>
        <label className="label-mono block mb-1">Message / Notes</label>
        <textarea
          rows={4}
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
        <Send size={16} /> {status === 'sending' ? 'Submitting...' : 'Submit Inquiry'}
      </button>
      {status === 'error' && (
        <p className="text-sm text-center" style={{ color: '#ed1c24' }}>
          Something went wrong. Please try again or email us directly.
        </p>
      )}
    </form>
  )
}

export default function Sponsors() {
  const { isUnlocked } = useTeamAuth()
  const { content } = useSiteContent()
  const { data: sponsors, refetch } = useTable('sponsors', { order: 'sort_order', secondaryOrder: 'created_at' })
  const [showAdd, setShowAdd] = useState(false)
  const [manageOpen, setManageOpen] = useState(false)

  const handleDelete = async (id) => {
    if (!confirm('Remove this sponsor?')) return
    await supabase.from('sponsors').delete().eq('id', id)
    refetch()
  }

  const paymentFormUrl = content.first_payment_form_url || ''

  return (
    <div>
      <PageHero kicker="TEAM #7504 · BECOME A PARTNER" title="Sponsors" variant="green" />

      {/* SPONSOR LOGO WALL */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-16">
        {isUnlocked && (
          <button
            onClick={() => setManageOpen((o) => !o)}
            className="label-mono px-4 py-2 rounded-lg border mb-8"
            style={{ borderColor: 'var(--border)' }}
          >
            {manageOpen ? '▴' : '▾'} MANAGE SPONSORS
          </button>
        )}

        {manageOpen && (
          <div className="card p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-lg">Manage Sponsors</h3>
              <button
                onClick={() => setShowAdd(true)}
                className="flex items-center gap-2 label-mono px-3 py-2 rounded-lg border"
                style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
              >
                <Plus size={14} /> ADD SPONSOR
              </button>
            </div>
            <div className="space-y-2">
              {sponsors.map((s) => (
                <div key={s.id} className="flex items-center justify-between gap-3 p-3 rounded-lg" style={{ background: 'var(--bg-card)' }}>
                  <div className="flex items-center gap-3">
                    {s.logo_url ? (
                      <img src={s.logo_url} alt={s.name} className="h-8 object-contain" />
                    ) : (
                      <ImageIcon size={20} className="text-[var(--text-faint)]" />
                    )}
                    <span className="font-medium">{s.name}</span>
                    <span className="label-mono">{TIERS.find((t) => t.key === s.tier)?.name || s.tier}</span>
                  </div>
                  <button onClick={() => handleDelete(s.id)} style={{ color: '#ed1c24' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {sponsors.length === 0 && <p className="text-sm text-[var(--text-muted)]">No sponsors added yet.</p>}
            </div>
          </div>
        )}

        {sponsors.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
            {sponsors.map((s) => (
              <a
                key={s.id}
                href={s.website_url || '#'}
                target={s.website_url ? '_blank' : undefined}
                rel="noreferrer"
                className="card p-4 flex items-center justify-center h-24 transition-transform hover:scale-[1.03]"
              >
                {s.logo_url ? (
                  <img src={s.logo_url} alt={s.name} className="max-h-12 max-w-full object-contain" />
                ) : (
                  <span className="text-sm font-medium text-center">{s.name}</span>
                )}
              </a>
            ))}
          </div>
        )}
      </section>

      {/* SPONSORSHIP TIERS */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-16">
        <div className="text-center mb-12">
          <SectionLabel center>PARTNERSHIP TIERS</SectionLabel>
          <h2 className="font-display font-extrabold text-4xl lg:text-5xl mt-3 mb-4">Sponsorship Levels</h2>
          <p className="text-[var(--text-muted)] max-w-2xl mx-auto">
            Every contribution, large or small, makes a direct impact on our students' education and competition season.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TIERS.map((tier) => (
            <div key={tier.key} className="card p-6" style={{ borderColor: tier.color, borderWidth: '1.5px' }}>
              <h3 className="font-display font-bold text-xl mb-1" style={{ color: tier.color }}>
                {tier.name}
              </h3>
              <p className="font-display font-extrabold text-2xl mb-4">{tier.range}</p>
              <div className="border-t pt-4 space-y-3" style={{ borderColor: 'var(--border)' }}>
                {tier.benefits.map((b) => (
                  <div key={b} className="flex items-start gap-2 text-sm text-[var(--text-muted)]">
                    <Check size={14} className="mt-0.5 shrink-0" style={{ color: tier.color }} />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DONATION INSTRUCTIONS */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-16">
        <div className="text-center mb-12">
          <SectionLabel center>HOW TO GIVE</SectionLabel>
          <h2 className="font-display font-extrabold text-4xl lg:text-5xl mt-3">Donation Instructions</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="card p-6">
            <p className="label-mono mb-2">OPTION 1 · CHECK</p>
            <h3 className="font-display font-bold text-xl mb-3">Mail a Check</h3>
            <p className="text-[var(--text-muted)] mb-4">Make checks payable to:</p>
            <div className="rounded-lg p-4 font-mono text-sm" style={{ background: 'var(--bg-card)' }}>
              Brewster High School<br />
              Student Activity Fund<br />
              50 Foggintown Road<br />
              Brewster, NY 10509
            </div>
          </div>
          <div className="card p-6">
            <p className="label-mono mb-2">OPTION 2 · MATERIALS</p>
            <h3 className="font-display font-bold text-xl mb-3">Material Donations</h3>
            <p className="text-[var(--text-muted)] mb-4">
              We gratefully accept in-kind material donations (polycarbonate, aluminum, hardware, etc.). Contact:
            </p>
            <a
              href="mailto:Dschneider@brewsterschools.org"
              className="block rounded-lg p-4 font-mono text-sm break-all hover:underline"
              style={{ background: 'var(--bg-card)', color: 'var(--accent)' }}
            >
              Dschneider@brewsterschools.org
            </a>
          </div>
          <div className="card p-6 flex flex-col">
            <p className="label-mono mb-2">OPTION 3 · FIRST</p>
            <h3 className="font-display font-bold text-xl mb-3">Via FIRST</h3>
            <p className="text-[var(--text-muted)] mb-4">Donations through FIRST payable to:</p>
            <div className="rounded-lg p-4 font-mono text-sm mb-4" style={{ background: 'var(--bg-card)' }}>
              FIRST<br />
              PO Box 845446<br />
              Boston, MA 02284-5446
            </div>
            <a
              href={paymentFormUrl || 'https://www.firstinspires.org'}
              target="_blank"
              rel="noreferrer"
              className="mt-auto flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-white"
              style={{ background: 'var(--accent-strong)' }}
            >
              Online Payment Form <ExternalLink size={15} />
            </a>
          </div>
        </div>
      </section>

      {/* SPONSOR INQUIRY FORM */}
      <section className="max-w-3xl mx-auto px-4 lg:px-6 py-16">
        <div className="text-center mb-10">
          <SectionLabel center>BECOME A PARTNER</SectionLabel>
          <h2 className="font-display font-extrabold text-4xl lg:text-5xl mt-3">Sponsor Inquiry</h2>
        </div>
        <SponsorInquiryForm />
      </section>

      {showAdd && <AddSponsorModal onClose={() => setShowAdd(false)} onSaved={refetch} />}
    </div>
  )
}
