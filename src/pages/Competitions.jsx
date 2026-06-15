import { useState } from 'react'
import { Trophy, Plus, Trash2 } from 'lucide-react'
import PageHero from '../components/PageHero'
import SectionLabel from '../components/SectionLabel'
import ImageUpload from '../components/ImageUpload'
import EditableText from '../components/EditableText'
import { useTable } from '../lib/data'
import { useTeamAuth } from '../context/TeamAuthContext'
import { supabase } from '../lib/supabase'
import { Check, X } from 'lucide-react'

function AddSeasonModal({ onClose, onSaved }) {
  const [form, setForm] = useState({ year: new Date().getFullYear() + 1, season_name: '', description: '' })
  const [saving, setSaving] = useState(false)

  const save = async () => {
    if (!form.season_name.trim()) return
    setSaving(true)
    const { data: existing } = await supabase.from('competitions').select('sort_order').order('sort_order', { ascending: false }).limit(1)
    const nextOrder = (existing?.[0]?.sort_order || 0) + 1
    await supabase.from('competitions').insert({ ...form, sort_order: nextOrder })
    setSaving(false)
    onSaved()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
      <div className="card w-full max-w-md p-6" style={{ background: 'var(--bg-elevated)' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-lg">Add Season</h3>
          <button onClick={onClose}><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="label-mono block mb-1">Year</label>
            <input
              type="number"
              className="w-full bg-transparent border rounded-lg p-2 outline-none"
              style={{ borderColor: 'var(--border)' }}
              value={form.year}
              onChange={(e) => setForm((f) => ({ ...f, year: parseInt(e.target.value) || f.year }))}
            />
          </div>
          <div>
            <label className="label-mono block mb-1">Season Name *</label>
            <input
              className="w-full bg-transparent border rounded-lg p-2 outline-none"
              style={{ borderColor: 'var(--border)' }}
              placeholder="e.g. REBUILT presented by Haas"
              value={form.season_name}
              onChange={(e) => setForm((f) => ({ ...f, season_name: e.target.value }))}
            />
          </div>
          <div>
            <label className="label-mono block mb-1">Description</label>
            <textarea
              className="w-full bg-transparent border rounded-lg p-2 outline-none"
              style={{ borderColor: 'var(--border)' }}
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
          <button
            onClick={save}
            disabled={saving || !form.season_name.trim()}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-white disabled:opacity-50"
            style={{ background: 'var(--accent-strong)' }}
          >
            <Check size={16} /> {saving ? 'Saving...' : 'Add Season'}
          </button>
        </div>
      </div>
    </div>
  )
}

function SeasonRow({ season, flip, isUnlocked, onDelete, refetch }) {
  const saveField = async (field, value) => {
    await supabase.from('competitions').update({ [field]: value }).eq('id', season.id)
    refetch()
  }

  const card = (
    <div className="card p-6 lg:p-8 relative group">
      {isUnlocked && (
        <button
          onClick={() => onDelete(season.id)}
          className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center border bg-[var(--bg)] opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ borderColor: '#ed1c24' }}
        >
          <Trash2 size={12} style={{ color: '#ed1c24' }} />
        </button>
      )}
      <div className="flex items-center gap-3 mb-3">
        <span
          className="px-3 py-1 rounded-md text-sm font-bold text-white"
          style={{ background: 'var(--accent-strong)' }}
        >
          {season.year}
        </span>
        <Trophy size={18} className="text-[var(--text-faint)]" />
      </div>
      <EditableText
        value={season.season_name}
        onSave={(v) => saveField('season_name', v)}
        tag="h3"
        className="font-display font-bold text-2xl lg:text-3xl mb-3"
      />
      <EditableText
        value={season.description}
        onSave={(v) => saveField('description', v)}
        as="textarea"
        tag="p"
        className="text-[var(--text-muted)] leading-relaxed"
      />
    </div>
  )

  const photo = (
    <ImageUpload
      src={season.photo_url}
      onUpload={(url) => saveField('photo_url', url)}
      label={`UPLOAD ${season.year} SEASON PHOTO`}
      folder="competitions"
      aspect="aspect-[4/3]"
    />
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center relative">
      <div
        className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full items-center justify-center z-10"
        style={{ background: 'var(--accent)' }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-white" />
      </div>
      {flip ? (
        <>
          <div className="order-2 lg:order-1">{photo}</div>
          <div className="order-1 lg:order-2">{card}</div>
        </>
      ) : (
        <>
          <div>{card}</div>
          <div>{photo}</div>
        </>
      )}
    </div>
  )
}

export default function Competitions() {
  const { isUnlocked } = useTeamAuth()
  const { data, refetch } = useTable('competitions', { order: 'sort_order', ascending: false })
  const [showAdd, setShowAdd] = useState(false)

  const minYear = data.length ? Math.min(...data.map((c) => c.year)) : new Date().getFullYear()
  const maxYear = data.length ? Math.max(...data.map((c) => c.year)) : new Date().getFullYear()

  const handleDelete = async (id) => {
    if (!confirm('Delete this season entry?')) return
    await supabase.from('competitions').delete().eq('id', id)
    refetch()
  }

  return (
    <div>
      <PageHero
        kicker="TEAM #7504 · SEASON HISTORY"
        title="Competitions"
        corner={`${minYear} → ${maxYear}\nSEASONS`}
        variant="blue"
      />

      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <SectionLabel>SEASON ARCHIVE</SectionLabel>
            <h2 className="font-display font-extrabold text-4xl lg:text-5xl mt-3">
              {data.length} {data.length === 1 ? 'Season' : 'Seasons'} of Competition
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <p className="label-mono">{minYear} — PRESENT</p>
            {isUnlocked && (
              <button
                onClick={() => setShowAdd(true)}
                className="flex items-center gap-2 label-mono px-3 py-2 rounded-lg border"
                style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
              >
                <Plus size={14} /> ADD SEASON
              </button>
            )}
          </div>
        </div>

        <div className="relative">
          <div
            className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
            style={{ background: 'var(--border)' }}
          />
          <div className="space-y-12">
            {data.map((season, idx) => (
              <SeasonRow
                key={season.id}
                season={season}
                flip={idx % 2 === 1}
                isUnlocked={isUnlocked}
                onDelete={handleDelete}
                refetch={refetch}
              />
            ))}
          </div>
        </div>
      </section>

      {showAdd && <AddSeasonModal onClose={() => setShowAdd(false)} onSaved={refetch} />}
    </div>
  )
}
