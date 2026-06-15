import { useState } from 'react'
import { User, Plus, Trash2, Pencil, X, Check } from 'lucide-react'
import PageHero from '../components/PageHero'
import ImageUpload from '../components/ImageUpload'
import { useTable } from '../lib/data'
import { useTeamAuth } from '../context/TeamAuthContext'
import { supabase } from '../lib/supabase'

const CATEGORIES = [
  { key: 'student', label: 'Students' },
  { key: 'mentor', label: 'Mentors' },
  { key: 'advisor', label: 'Advisors' },
]

const SUBTEAMS = ['Mechanical', 'Coding', 'Business', 'Driving', 'Analytics', 'Other']

function MemberCard({ member, onEdit, onDelete, isUnlocked }) {
  // If subteam is an array, join with commas; otherwise fallback to string or empty
  const subteamDisplay = Array.isArray(member.subteam) 
    ? member.subteam.join(', ') 
    : member.subteam;

  return (
    <div className="card p-5 text-center relative group">
      {isUnlocked && (
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(member)}
            className="w-7 h-7 rounded-full flex items-center justify-center border bg-[var(--bg)]"
            style={{ borderColor: 'var(--accent)' }}
          >
            <Pencil size={12} style={{ color: 'var(--accent)' }} />
          </button>
          <button
            onClick={() => onDelete(member.id)}
            className="w-7 h-7 rounded-full flex items-center justify-center border bg-[var(--bg)]"
            style={{ borderColor: '#ed1c24' }}
          >
            <Trash2 size={12} style={{ color: '#ed1c24' }} />
          </button>
        </div>
      )}
      <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-3" style={{ background: 'var(--bg-elevated)' }}>
        {member.photo_url ? (
          <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User size={28} className="text-[var(--text-faint)]" />
          </div>
        )}
      </div>
      <h3 className="font-display font-bold text-lg">{member.name}</h3>
      {subteamDisplay && (
        <p className="label-mono mt-1 text-sm" style={{ color: 'var(--accent)' }}>
          {subteamDisplay}
        </p>
      )}
      {member.role && <p className="text-sm text-[var(--text-muted)] mt-1">{member.role}</p>}
      {member.bio && <p className="text-sm text-[var(--text-muted)] mt-3 leading-relaxed">{member.bio}</p>}
    </div>
  )
}

function MemberFormModal({ initial, category, onClose, onSaved }) {
  // Ensure subteam initializes as an array
  const [form, setForm] = useState(() => {
    if (initial) {
      return {
        ...initial,
        subteam: Array.isArray(initial.subteam) ? initial.subteam : (initial.subteam ? [initial.subteam] : [])
      }
    }
    return { name: '', role: '', subteam: [], bio: '', photo_url: '', category }
  })
  
  const [saving, setSaving] = useState(false)

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  // Handle checking and unchecking subteam boxes
  const handleSubteamChange = (subteamName) => {
    const currentSubteams = form.subteam || []
    if (currentSubteams.includes(subteamName)) {
      update('subteam', currentSubteams.filter(s => s !== subteamName))
    } else {
      update('subteam', [...currentSubteams, subteamName])
    }
  }

  const save = async () => {
    if (!form.name.trim()) return
    setSaving(true)
    if (form.id) {
      await supabase.from('team_members').update(form).eq('id', form.id)
    } else {
      await supabase.from('team_members').insert({ ...form, category })
    }
    setSaving(false)
    onSaved()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
      <div className="card w-full max-w-md p-6 max-h-[90vh] overflow-y-auto" style={{ background: 'var(--bg-elevated)' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-lg">{form.id ? 'Edit Member' : 'Add Member'}</h3>
          <button onClick={onClose}><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <ImageUpload
            src={form.photo_url}
            onUpload={(url) => update('photo_url', url)}
            label="UPLOAD PHOTO"
            folder="team"
            aspect="aspect-square"
            className="w-24 mx-auto"
            rounded="rounded-full"
          />
          <div>
            <label className="label-mono block mb-1">Name *</label>
            <input
              className="w-full bg-transparent border rounded-lg p-2 outline-none"
              style={{ borderColor: 'var(--border)' }}
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
            />
          </div>
          <div>
            <label className="label-mono block mb-1">Role / Title</label>
            <input
              className="w-full bg-transparent border rounded-lg p-2 outline-none"
              style={{ borderColor: 'var(--border)' }}
              placeholder="e.g. Team Captain, Lead Mentor"
              value={form.role || ''}
              onChange={(e) => update('role', e.target.value)}
            />
          </div>
          
          {category === 'student' && (
            <div>
              <label className="label-mono block mb-2">Subteams (Select all that apply)</label>
              <div className="grid grid-cols-2 gap-2 p-2 border rounded-lg" style={{ borderColor: 'var(--border)' }}>
                {SUBTEAMS.map((s) => {
                  const isChecked = (form.subteam || []).includes(s);
                  return (
                    <label key={s} className="flex items-center gap-2 text-sm cursor-pointer py-1">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleSubteamChange(s)}
                        className="rounded accent-[var(--accent-strong)]"
                      />
                      <span>{s}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <label className="label-mono block mb-1">Bio (optional)</label>
            <textarea
              className="w-full bg-transparent border rounded-lg p-2 outline-none"
              style={{ borderColor: 'var(--border)' }}
              rows={3}
              value={form.bio || ''}
              onChange={(e) => update('bio', e.target.value)}
            />
          </div>
          <button
            onClick={save}
            disabled={saving || !form.name.trim()}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-white disabled:opacity-50"
            style={{ background: 'var(--accent-strong)' }}
          >
            <Check size={16} /> {saving ? 'Saving...' : 'Save Member'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function MeetTheTeam() {
  const { isUnlocked } = useTeamAuth()
  const { data: members, refetch } = useTable('team_members', { order: 'sort_order', secondaryOrder: 'created_at' })
  const [modal, setModal] = useState(null)

  const handleDelete = async (id) => {
    if (!confirm('Remove this team member?')) return
    await supabase.from('team_members').delete().eq('id', id)
    refetch()
  }

  return (
    <div>
      <PageHero kicker="TEAM #7504 · THE PEOPLE" title="Meet the Team" corner={'STUDENTS · MENTORS\nADVISORS'} variant="green" />

      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-16 space-y-16">
        {CATEGORIES.map(({ key, label }) => {
          const list = members.filter((m) => m.category === key)
          return (
            <section key={key}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-extrabold text-3xl">{label}</h2>
                {isUnlocked && (
                  <button
                    onClick={() => setModal({ category: key, initial: null })}
                    className="flex items-center gap-2 label-mono px-3 py-2 rounded-lg border"
                    style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
                  >
                    <Plus size={14} /> ADD {label.toUpperCase()}
                  </button>
                )}
              </div>
              {list.length === 0 ? (
                <div className="card p-12 text-center">
                  <User size={36} className="mx-auto mb-4 text-[var(--text-faint)]" />
                  <p className="label-mono mb-1">NO {label.toUpperCase()} ADDED YET</p>
                  {isUnlocked ? (
                    <p className="text-sm text-[var(--text-muted)]">Click "Add {label.slice(0, -1)}" above to add one.</p>
                  ) : (
                    <p className="text-sm text-[var(--text-muted)]">
                      Add members through{' '}
                      <a href="/team-access" className="underline" style={{ color: 'var(--accent)' }}>
                        Team Access
                      </a>
                    </p>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {list.map((m) => (
                    <MemberCard
                      key={m.id}
                      member={m}
                      isUnlocked={isUnlocked}
                      onEdit={(member) => setModal({ category: key, initial: member })}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </section>
          )
        })}
      </div>

      {modal && (
        <MemberFormModal
          initial={modal.initial}
          category={modal.category}
          onClose={() => setModal(null)}
          onSaved={refetch}
        />
      )}
    </div>
  )
}
