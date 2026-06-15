import { useState } from 'react'
import { Cpu, Plus, Trash2, X, Check } from 'lucide-react'
import PageHero from '../components/PageHero'
import SectionLabel from '../components/SectionLabel'
import ImageUpload from '../components/ImageUpload'
import EditableText from '../components/EditableText'
import { useTable } from '../lib/data'
import { useTeamAuth } from '../context/TeamAuthContext'
import { supabase } from '../lib/supabase'

function AddRobotModal({ onClose, onSaved }) {
  const [form, setForm] = useState({ year: new Date().getFullYear(), name: '', description: '', specs: '' })
  const [saving, setSaving] = useState(false)

  const save = async () => {
    if (!form.year) return
    setSaving(true)
    const { data: existing } = await supabase.from('robots').select('sort_order').order('sort_order', { ascending: false }).limit(1)
    const nextOrder = (existing?.[0]?.sort_order || 0) + 1
    await supabase.from('robots').insert({ ...form, sort_order: nextOrder })
    setSaving(false)
    onSaved()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
      <div className="card w-full max-w-md p-6" style={{ background: 'var(--bg-elevated)' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-lg">Add Robot</h3>
          <button onClick={onClose}><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="label-mono block mb-1">Season Year *</label>
            <input
              type="number"
              className="w-full bg-transparent border rounded-lg p-2 outline-none"
              style={{ borderColor: 'var(--border)' }}
              value={form.year}
              onChange={(e) => setForm((f) => ({ ...f, year: parseInt(e.target.value) || f.year }))}
            />
          </div>
          <div>
            <label className="label-mono block mb-1">Robot Name</label>
            <input
              className="w-full bg-transparent border rounded-lg p-2 outline-none"
              style={{ borderColor: 'var(--border)' }}
              placeholder="e.g. Bearclaw"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
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
          <div>
            <label className="label-mono block mb-1">Specs</label>
            <textarea
              className="w-full bg-transparent border rounded-lg p-2 outline-none"
              style={{ borderColor: 'var(--border)' }}
              rows={3}
              placeholder="Weight, drivetrain, dimensions, mechanisms..."
              value={form.specs}
              onChange={(e) => setForm((f) => ({ ...f, specs: e.target.value }))}
            />
          </div>
          <button
            onClick={save}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-white disabled:opacity-50"
            style={{ background: 'var(--accent-strong)' }}
          >
            <Check size={16} /> {saving ? 'Saving...' : 'Add Robot'}
          </button>
        </div>
      </div>
    </div>
  )
}

function RobotCard({ robot, isUnlocked, onDelete, refetch }) {
  const saveField = async (field, value) => {
    await supabase.from('robots').update({ [field]: value }).eq('id', robot.id)
    refetch()
  }

  return (
    <div className="card overflow-hidden relative group">
      {isUnlocked && (
        <button
          onClick={() => onDelete(robot.id)}
          className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full flex items-center justify-center border bg-[var(--bg)] opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ borderColor: '#ed1c24' }}
        >
          <Trash2 size={12} style={{ color: '#ed1c24' }} />
        </button>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2">
        <ImageUpload
          src={robot.photo_url}
          onUpload={(url) => saveField('photo_url', url)}
          label={`UPLOAD ${robot.year} ROBOT PHOTO`}
          folder="robots"
          aspect="aspect-[4/3]"
          rounded="rounded-none"
        />
        <ImageUpload
          src={robot.cad_url}
          onUpload={(url) => saveField('cad_url', url)}
          label={`UPLOAD ${robot.year} CAD RENDER`}
          folder="robots"
          aspect="aspect-[4/3]"
          rounded="rounded-none"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-2">
          <span
            className="px-3 py-1 rounded-md text-sm font-bold text-white"
            style={{ background: 'var(--accent-strong)' }}
          >
            {robot.year}
          </span>
          <EditableText
            value={robot.name}
            onSave={(v) => saveField('name', v)}
            tag="h3"
            className="font-display font-bold text-2xl"
            placeholder="Robot name..."
          />
        </div>
        <p className="label-mono mb-1 mt-4">DESCRIPTION</p>
        <EditableText
          value={robot.description}
          onSave={(v) => saveField('description', v)}
          as="textarea"
          tag="p"
          className="text-[var(--text-muted)] leading-relaxed mb-4"
          placeholder="Add a description of this robot..."
        />
        <p className="label-mono mb-1">SPECS</p>
        <EditableText
          value={robot.specs}
          onSave={(v) => saveField('specs', v)}
          as="textarea"
          tag="p"
          className="text-[var(--text-muted)] leading-relaxed whitespace-pre-line"
          placeholder="Add specs (weight, drivetrain, dimensions)..."
        />
      </div>
    </div>
  )
}

export default function RobotGallery() {
  const { isUnlocked } = useTeamAuth()
  const { data, refetch } = useTable('robots', { order: 'sort_order', ascending: false })
  const [showAdd, setShowAdd] = useState(false)

  const handleDelete = async (id) => {
    if (!confirm('Delete this robot entry?')) return
    await supabase.from('robots').delete().eq('id', id)
    refetch()
  }

  return (
    <div>
      <PageHero
        kicker="TEAM #7504 · TECHNICAL ARCHIVE"
        title={<>Robot<br />Gallery</>}
        corner={'ENGINEERING ARCHIVE\nROBOT · CAD · SPECS'}
        variant="green"
      />

      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-16">
        <div className="flex items-center justify-between mb-12">
          <div>
            <SectionLabel>TECHNICAL ARCHIVE</SectionLabel>
            <h2 className="font-display font-extrabold text-4xl lg:text-5xl mt-3">Our Machines, Year by Year</h2>
          </div>
          {isUnlocked && (
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 label-mono px-3 py-2 rounded-lg border whitespace-nowrap"
              style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
            >
              <Plus size={14} /> ADD ROBOT
            </button>
          )}
        </div>

        {data.length === 0 ? (
          <div className="card p-16 text-center">
            <Cpu size={40} className="mx-auto mb-4 text-[var(--text-faint)]" />
            <p className="label-mono mb-1">NO ROBOTS ADDED YET</p>
            {!isUnlocked && (
              <p className="text-sm text-[var(--text-muted)]">
                Add entries through{' '}
                <a href="/team-access" className="underline" style={{ color: 'var(--accent)' }}>
                  Team Access
                </a>
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {data.map((robot) => (
              <RobotCard key={robot.id} robot={robot} isUnlocked={isUnlocked} onDelete={handleDelete} refetch={refetch} />
            ))}
          </div>
        )}
      </section>

      {showAdd && <AddRobotModal onClose={() => setShowAdd(false)} onSaved={refetch} />}
    </div>
  )
}
