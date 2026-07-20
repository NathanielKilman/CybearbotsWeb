import { useState } from 'react'
import { Lock, Plus, Trash2, X, Check, GripVertical, Settings, Mail } from 'lucide-react'
import PageHero from '../components/PageHero'
import ScrollReveal from '../components/ScrollReveal' // Added import
import { useTable, useSiteContent } from '../lib/data'
import { useTeamAuth } from '../context/TeamAuthContext'
import { supabase } from '../lib/supabase'

const STATUS_OPTIONS = [
  { key: 'todo', label: 'To Do', color: '#9aa3a0' },
  { key: 'in_progress', label: 'In Progress', color: '#0066b3' },
  { key: 'done', label: 'Done', color: 'var(--accent)' },
]

function PasswordGate() {
  const { unlock } = useTeamAuth()
  const { content, loading } = useSiteContent()
  const [pw, setPw] = useState('')
  const [error, setError] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    const correct = content.team_access_password || 'cybearbots7504'
    if (pw === correct) {
      unlock()
    } else {
      setError(true)
    }
  }

  if (loading) return null

  return (
    <section className="max-w-md mx-auto px-4 py-24 text-center">
      <ScrollReveal>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: 'var(--accent-soft)' }}>
          <Lock size={28} style={{ color: 'var(--accent)' }} />
        </div>
        <h1 className="font-display font-extrabold text-3xl mb-2">Team Access</h1>
        <p className="text-[var(--text-muted)] mb-8">
          Enter the shared team password to access the build season task board and admin tools.
        </p>
        <form onSubmit={submit} className="space-y-4">
          <input
            type="password"
            autoFocus
            className="w-full bg-transparent border rounded-lg p-3 text-center outline-none"
            style={{ borderColor: error ? '#ed1c24' : 'var(--border)' }}
            placeholder="Team password"
            value={pw}
            onChange={(e) => {
              setPw(e.target.value)
              setError(false)
            }}
          />
          {error && <p className="text-sm" style={{ color: '#ed1c24' }}>Incorrect password. Try again.</p>}
          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold text-white"
            style={{ background: 'var(--accent-strong)' }}
          >
            Unlock
          </button>
        </form>
      </ScrollReveal>
    </section>
  )
}

function AddTaskModal({ sections, onClose, onSaved, defaultSectionId }) {
  const [form, setForm] = useState({
    section_id: defaultSectionId || sections[0]?.id || '',
    title: '',
    status: 'todo',
    assignee: '',
    due_date: '',
  })
  const [saving, setSaving] = useState(false)

  const save = async () => {
    if (!form.title.trim() || !form.section_id) return
    setSaving(true)
    await supabase.from('tasks').insert({ ...form, due_date: form.due_date || null })
    setSaving(false)
    onSaved()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
      <div className="card w-full max-w-md p-6" style={{ background: 'var(--bg-elevated)' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-lg">Add Task</h3>
          <button onClick={onClose}><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="label-mono block mb-1">Task *</label>
            <input
              className="w-full bg-transparent border rounded-lg p-2 outline-none"
              style={{ borderColor: 'var(--border)' }}
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              autoFocus
            />
          </div>
          <div>
            <label className="label-mono block mb-1">Section</label>
            <select
              className="w-full bg-transparent border rounded-lg p-2 outline-none"
              style={{ borderColor: 'var(--border)' }}
              value={form.section_id}
              onChange={(e) => setForm((f) => ({ ...f, section_id: e.target.value }))}
            >
              {sections.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-mono block mb-1">Status</label>
              <select
                className="w-full bg-transparent border rounded-lg p-2 outline-none"
                style={{ borderColor: 'var(--border)' }}
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.key} value={s.key}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-mono block mb-1">Due Date</label>
              <input
                type="date"
                className="w-full bg-transparent border rounded-lg p-2 outline-none"
                style={{ borderColor: 'var(--border)' }}
                value={form.due_date}
                onChange={(e) => setForm((f) => ({ ...f, due_date: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <label className="label-mono block mb-1">Assignee</label>
            <input
              className="w-full bg-transparent border rounded-lg p-2 outline-none"
              style={{ borderColor: 'var(--border)' }}
              value={form.assignee}
              onChange={(e) => setForm((f) => ({ ...f, assignee: e.target.value }))}
            />
          </div>
          <button
            onClick={save}
            disabled={saving || !form.title.trim()}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-white disabled:opacity-50"
            style={{ background: 'var(--accent-strong)' }}
          >
            <Check size={16} /> {saving ? 'Adding...' : 'Add Task'}
          </button>
        </div>
      </div>
    </div>
  )
}

function TaskCard({ task, onDelete, refetch }) {
  const status = STATUS_OPTIONS.find((s) => s.key === task.status) || STATUS_OPTIONS[0]

  const cycleStatus = async () => {
    const idx = STATUS_OPTIONS.findIndex((s) => s.key === task.status)
    const next = STATUS_OPTIONS[(idx + 1) % STATUS_OPTIONS.length]
    await supabase.from('tasks').update({ status: next.key }).eq('id', task.id)
    refetch()
  }

  return (
    <div className="card p-4 group relative">
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="font-medium leading-snug">{task.title}</p>
        <button
          onClick={() => onDelete(task.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
          style={{ color: '#ed1c24' }}
        >
          <Trash2 size={14} />
        </button>
      </div>
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={cycleStatus}
          className="label-mono px-2 py-1 rounded-md"
          style={{ background: `${status.color}22`, color: status.color }}
        >
          {status.label.toUpperCase()}
        </button>
        <div className="text-right">
          {task.assignee && <p className="text-xs text-[var(--text-muted)]">{task.assignee}</p>}
          {task.due_date && (
            <p className="text-xs text-[var(--text-faint)]">
              {new Date(task.due_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function AddSectionInline({ onSaved }) {
  const [name, setName] = useState('')
  const [adding, setAdding] = useState(false)

  const save = async () => {
    if (!name.trim()) return
    const { data: existing } = await supabase.from('task_sections').select('sort_order').order('sort_order', { ascending: false }).limit(1)
    const nextOrder = (existing?.[0]?.sort_order || 0) + 1
    await supabase.from('task_sections').insert({ name, sort_order: nextOrder })
    setName('')
    setAdding(false)
    onSaved()
  }

  if (!adding) {
    return (
      <button
        onClick={() => setAdding(true)}
        className="card p-4 flex items-center justify-center gap-2 label-mono border-dashed min-h-[120px]"
        style={{ borderColor: 'var(--border-strong)', color: 'var(--text-faint)' }}
      >
        <Plus size={16} /> ADD SECTION
      </button>
    )
  }

  return (
    <div className="card p-4 min-h-[120px] flex flex-col gap-2">
      <input
        autoFocus
        className="w-full bg-transparent border rounded-lg p-2 outline-none"
        style={{ borderColor: 'var(--accent)' }}
        placeholder="Section name..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && save()}
      />
      <div className="flex gap-2">
        <button onClick={save} className="flex-1 py-1.5 rounded-md text-white text-sm" style={{ background: 'var(--accent-strong)' }}>
          Add
        </button>
        <button onClick={() => setAdding(false)} className="flex-1 py-1.5 rounded-md border text-sm" style={{ borderColor: 'var(--border)' }}>
          Cancel
        </button>
      </div>
    </div>
  )
}

function TaskBoard() {
  const { lock } = useTeamAuth()
  const { data: sections, refetch: refetchSections } = useTable('task_sections', { order: 'sort_order' })
  const { data: tasks, refetch: refetchTasks } = useTable('tasks', { order: 'sort_order', secondaryOrder: 'created_at' })
  const [addingTo, setAddingTo] = useState(null)

  const handleDeleteTask = async (id) => {
    await supabase.from('tasks').delete().eq('id', id)
    refetchTasks()
  }

  const handleDeleteSection = async (id) => {
    if (!confirm('Delete this section and all its tasks?')) return
    await supabase.from('task_sections').delete().eq('id', id)
    refetchSections()
    refetchTasks()
  }

  const refetchAll = () => {
    refetchSections()
    refetchTasks()
  }

  return (
    <section className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
      <ScrollReveal>
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="label-mono mb-1" style={{ color: 'var(--accent)' }}>BUILD SEASON</p>
            <h1 className="font-display font-extrabold text-3xl lg:text-4xl">Task Board</h1>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://cbmail.cybearbots.org"
              target="_blank"
              rel="noopener"
              className="label-mono px-4 py-2 rounded-lg border flex items-center gap-2"
              style={{ borderColor: 'var(--border)' }}
            >
              <Mail size={14} /> TEAM MAIL
            </a>
            <button
              onClick={lock}
              className="label-mono px-4 py-2 rounded-lg border flex items-center gap-2"
              style={{ borderColor: 'var(--border)' }}
            >
              <Lock size={14} /> LOCK
            </button>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {sections.map((section) => {
            const sectionTasks = tasks.filter((t) => t.section_id === section.id)
            return (
              <div key={section.id} className="flex flex-col gap-3">
                <div className="flex items-center justify-between group">
                  <h3 className="font-display font-bold flex items-center gap-2">
                    <GripVertical size={14} className="text-[var(--text-faint)]" />
                    {section.name}
                    <span className="label-mono">{sectionTasks.length}</span>
                  </h3>
                  <button
                    onClick={() => handleDeleteSection(section.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: '#ed1c24' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {sectionTasks.map((task) => (
                    <TaskCard key={task.id} task={task} onDelete={handleDeleteTask} refetch={refetchTasks} />
                  ))}
                </div>
                <button
                  onClick={() => setAddingTo(section.id)}
                  className="label-mono flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed justify-center"
                  style={{ borderColor: 'var(--border-strong)', color: 'var(--text-faint)' }}
                >
                  <Plus size={14} /> ADD TASK
                </button>
              </div>
            )
          })}
          <AddSectionInline onSaved={refetchSections} />
        </div>
      </ScrollReveal>

      {addingTo && (
        <AddTaskModal
          sections={sections}
          defaultSectionId={addingTo}
          onClose={() => setAddingTo(null)}
          onSaved={refetchAll}
        />
      )}
    </section>
  )
}

function AdminSettings() {
  const { content, setValue } = useSiteContent()
  const [pw, setPw] = useState(content.team_access_password || '')
  const [saved, setSaved] = useState(false)

  const robotGalleryVisible = content.robot_gallery_visible !== false

  const savePassword = async () => {
    await setValue('team_access_password', pw)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <section className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
      <ScrollReveal>
        <div className="card p-6">
          <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
            <Settings size={18} /> Site Settings
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="label-mono block mb-1">Team Access Password</label>
              <div className="flex gap-2">
                <input
                  className="flex-1 bg-transparent border rounded-lg p-2 outline-none"
                  style={{ borderColor: 'var(--border)' }}
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                />
                <button
                  onClick={savePassword}
                  className="px-4 py-2 rounded-lg text-white text-sm font-semibold"
                  style={{ background: 'var(--accent-strong)' }}
                >
                  {saved ? 'Saved!' : 'Save'}
                </button>
              </div>
            </div>
            <div>
              <label className="label-mono block mb-1">Robot Gallery Page</label>
              <button
                onClick={() => setValue('robot_gallery_visible', !robotGalleryVisible)}
                className="w-full px-4 py-2 rounded-lg border text-sm font-semibold"
                style={{ borderColor: 'var(--border)' }}
              >
                {robotGalleryVisible ? 'Visible in navigation (click to hide)' : 'Hidden from navigation (click to show)'}
              </button>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  )
}

export default function TeamAccess() {
  const { isUnlocked } = useTeamAuth()

  if (!isUnlocked) {
    return (
      <div>
        <PageHero kicker="MEMBERS ONLY" title="Team Access" variant="green" />
        <PasswordGate />
      </div>
    )
  }

  return (
    <div>
      <PageHero kicker="MEMBERS ONLY · UNLOCKED" title="Team Access" variant="green" />
      <AdminSettings />
      <TaskBoard />
    </div>
  )
}
