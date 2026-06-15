import { useState } from 'react'
import { Check, ExternalLink, Plus, Trash2, X, Send, Image as ImageIcon } from 'lucide-react'
import PageHero from '../components/PageHero'
import SectionLabel from '../components/SectionLabel'
import ImageUpload from '../components/ImageUpload'
import { useTable, useSiteContent } from '../lib/data'
import { useTeamAuth } from '../context/TeamAuthContext'
import { supabase } from '../lib/supabase'

// ==========================================
// CONFIGURABLE LINKS PREFERENCE
// Change this to 'http://' or another protocol if needed
// ==========================================
const DEFAULT_URL_PROTOCOL = 'https://'

// Helper function to safely parse and prepare external sponsor links
const formatExternalUrl = (url) => {
  if (!url) return '#'
  const trimmed = url.trim()
  
  // If it already explicitly begins with http:// or https://, return it untouched
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }
  
  // Otherwise, use our configurable prefix variable
  return `${DEFAULT_URL_PROTOCOL}${trimmed}`
}

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
]

function AddSponsorModal({ onClose, onSaved }) {
  const [form, setForm] = useState({ name: '', tier: 'bronze', website_url: '', logo_url: '', description: '' })
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
          <h3 className="font-display font-bold text-xl">Add New Sponsor</h3>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text)]">
            <X size={20} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="label-mono block mb-1 text-xs">Sponsor Name *</label>
            <input
              type="text"
              className="w-full bg-transparent border rounded-lg p-2 outline-none"
              style={{ borderColor: 'var(--border)' }}
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="label-mono block mb-1 text-xs">Sponsorship Tier</label>
            <select
              className="w-full bg-[var(--bg-elevated)] border rounded-lg p-2 outline-none"
              style={{ borderColor: 'var(--border)' }}
              value={form.tier}
              onChange={(e) => setForm((f) => ({ ...f, tier: e.target.value }))}
            >
              {TIERS.map((t) => (
                <option key={t.key} value={t.key}>
                  {t.name} ({t.range})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-mono block mb-1 text-xs">Short Description / Subtitle</label>
            <input
              type="text"
              className="w-full bg-transparent border rounded-lg p-2 outline-none"
              style={{ borderColor: 'var(--border)' }}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="e.g. Precision Manufacturing Specialists"
            />
          </div>
          <div>
            <label className="label-mono block mb-1 text-xs">Website URL</label>
            <input
              type="text"
              className="w-full bg-transparent border rounded-lg p-2 outline-none"
              style={{ borderColor: 'var(--border)' }}
              value={form.website_url}
              onChange={(e) => setForm((f) => ({ ...f, website_url: e.target.value }))}
              placeholder="e.g. www.company.com"
            />
          </div>
          <div>
            <label className="label-mono block mb-1 text-xs">Sponsor Logo</label>
            <ImageUpload
              src={form.logo_url}
              onUpload={(url) => setForm((f) => ({ ...f, logo_url: url }))}
              label="UPLOAD LOGO"
              folder="sponsors"
              aspect="aspect-[3/1]"
            />
          </div>
          <button
            onClick={save}
            className="w-full py-3 rounded-lg font-semibold text-white mt-2 flex items-center justify-center gap-2"
            style={{ background: 'var(--accent-strong)' }}
            disabled={saving}
          >
            <Check size={16} /> {saving ? 'Saving Sponsor...' : 'Save Sponsor'}
          </button>
        </div>
      </div>
    </div>
  )
}

function SponsorCard({ sponsor, isUnlocked, onDelete }) {
  // Use the isolated formatter rule logic for links
  const targetLink = formatExternalUrl(sponsor.website_url)

  return (
    <div className="card p-6 flex flex-col items-center justify-between text-center relative group min-h-[170px]">
      {isUnlocked && (
        <button
          onClick={() => onDelete(sponsor.id)}
          className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center border bg-[var(--bg)] opacity-0 group-hover:opacity-100 transition-all z-10 shadow"
          style={{ borderColor: '#ed1c24' }}
        >
          <Trash2 size={12} style={{ color: '#ed1c24' }} />
        </button>
      )}

      <a
        href={targetLink}
        target="_blank"
        rel="noreferrer"
        className="flex flex-col items-center justify-center gap-4 w-full h-full transition-opacity hover:opacity-90"
      >
        {/* LOGO AREA CONTAINER */}
        {sponsor.logo_url ? (
          <img
            src={sponsor.logo_url}
            alt={sponsor.name}
            className="max-h-16 max-w-[85%] object-contain mb-1 filter dark:brightness-95"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center mb-1">
            <ImageIcon className="text-[var(--text-faint)]" size={20} />
          </div>
        )}

        {/* FIXED: Sponsor descriptive text block is now placed down here, rendering consistently under logos */}
        <div>
          <h4 className="font-display font-bold text-base text-[var(--text)] tracking-tight">{sponsor.name}</h4>
          {sponsor.description && (
            <p className="text-xs text-[var(--text-muted)] mt-1 max-w-[220px] line-clamp-2 leading-relaxed">
              {sponsor.description}
            </p>
          )}
        </div>
      </a>
    </div>
  )
}

export default function Sponsors() {
  const { isUnlocked } = useTeamAuth()
  const { content } = useSiteContent()
  const { data: sponsors, refetch } = useTable('sponsors')
  const [showAdd, setShowAdd] = useState(false)
  const [formStatus, setFormStatus] = useState('idle')
  const [inquiry, setInquiry] = useState({ name: '', company: '', email: '', message: '' })

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to remove this sponsor?')) return
    await supabase.from('sponsors').delete().eq('id', id)
    refetch()
  }

  const handleInquirySubmit = async (e) => {
    e.preventDefault()
    if (!inquiry.name.trim() || !inquiry.email.trim()) return
    setFormStatus('sending')
    const { error } = await supabase.from('sponsor_inquiries').insert(inquiry)
    if (error) {
      setFormStatus('error')
    } else {
      setFormStatus('sent')
      setInquiry({ name: '', company: '', email: '', message: '' })
    }
  }

  const paymentFormUrl = content.sponsor_payment_form_url

  return (
    <div>
      <PageHero kicker="OUR PARTNERS" title="Sponsors" variant="green" />

      {/* RECOGNITION BY TIERS */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-16 space-y-20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b pb-6" style={{ borderColor: 'var(--border)' }}>
          <div>
            <SectionLabel>TEAM PATRONS</SectionLabel>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl mt-2 tracking-tight">
              Fueling Innovation
            </h2>
          </div>
          {isUnlocked && (
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 label-mono px-4 py-2.5 rounded-lg border whitespace-nowrap text-xs font-bold transition-all hover:bg-[var(--bg-elevated)]"
              style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
            >
              <Plus size={14} /> ADD SPONSOR
            </button>
          )}
        </div>

        {TIERS.map((tier) => {
          const matching = sponsors.filter((s) => s.tier === tier.key)
          return (
            <div key={tier.key} className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-6 rounded-sm" style={{ background: tier.color }} />
                <h3 className="font-display font-black text-2xl tracking-tight">{tier.name}</h3>
                <span className="text-xs label-mono text-[var(--text-muted)] bg-[var(--bg-elevated)] px-2.5 py-1 rounded-md ml-2 border" style={{ borderColor: 'var(--border)' }}>
                  {tier.range}
                </span>
              </div>

              {matching.length === 0 ? (
                <div className="rounded-xl border border-dashed p-10 text-center text-sm text-[var(--text-faint)]" style={{ borderColor: 'var(--border)' }}>
                  No sponsors listed in {tier.name} yet.
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {matching.map((s) => (
                    <SponsorCard key={s.id} sponsor={s} isUnlocked={isUnlocked} onDelete={handleDelete} />
                  ))}
                </div>
              );
            </div>
          )
        })}
      </section>

      {/* HOW TO SUPPORT */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-16 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="text-center max-w-3xl mx-auto mb-12">
          <SectionLabel center>INVEST IN TOMORROW</SectionLabel>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl mt-3 tracking-tight">How to Sponsor CyBearBots</h2>
          <p className="text-[var(--text-muted)] mt-4 leading-relaxed">
            We accept support through institutional avenues, material donations, or check payments. 
            All financial gifts go directly toward tournament admission fees, fabrication hardware, and tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6 flex flex-col">
            <p className="label-mono mb-2 text-xs text-[var(--text-faint)]">OPTION 1 · BOOSTERS</p>
            <h3 className="font-display font-bold text-xl mb-3">Check / Invoice</h3>
            <p className="text-[var(--text-muted)] text-sm mb-4 leading-relaxed">
              Checks can be made payable directly to our school booster accounting department. We will supply full W-9 forms and receipts.
            </p>
            <div className="rounded-xl p-4 font-mono text-xs mt-auto bg-[var(--bg-elevated)] border" style={{ borderColor: 'var(--border)' }}>
              Brewster High School<br />
              Attn: CyBearBots Robotics #7504<br />
              50 Foggintown Rd<br />
              Brewster, NY 10509
            </div>
          </div>

          <div className="card p-6 flex flex-col">
            <p className="label-mono mb-2 text-xs text-[var(--text-faint)]">OPTION 2 · EQUIPMENT</p>
            <h3 className="font-display font-bold text-xl mb-3">Material Donations</h3>
            <p className="text-[var(--text-muted)] text-sm mb-4 leading-relaxed">
              We highly welcome industrial materials, machining tools, safety inventory, or electronics
