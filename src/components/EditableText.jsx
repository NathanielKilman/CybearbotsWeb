import { useState } from 'react'
import { Pencil, Check, X } from 'lucide-react'
import { useTeamAuth } from '../context/TeamAuthContext'

/**
 * Renders text content. If the visitor is unlocked (team access), shows
 * a small edit icon on hover that lets them edit the text inline and
 * save it via the provided onSave callback.
 */
export default function EditableText({
  value,
  onSave,
  as = 'text',
  className = '',
  tag = 'p',
  placeholder = 'Click to add text...',
}) {
  const { isUnlocked } = useTeamAuth()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value || '')
  const [saving, setSaving] = useState(false)

  const Tag = tag

  const startEdit = () => {
    setDraft(value || '')
    setEditing(true)
  }

  const save = async () => {
    setSaving(true)
    await onSave(draft)
    setSaving(false)
    setEditing(false)
  }

  const cancel = () => {
    setDraft(value || '')
    setEditing(false)
  }

  if (!isUnlocked) {
    return <Tag className={className}>{value || ''}</Tag>
  }

  if (editing) {
    return (
      <div className="relative">
        {as === 'textarea' ? (
          <textarea
            className={`${className} w-full bg-transparent border rounded-lg p-2 outline-none`}
            style={{ borderColor: 'var(--accent)' }}
            rows={4}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            autoFocus
          />
        ) : (
          <input
            className={`${className} w-full bg-transparent border rounded-lg p-2 outline-none`}
            style={{ borderColor: 'var(--accent)' }}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            autoFocus
          />
        )}
        <div className="flex gap-2 mt-2">
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-1 text-xs label-mono px-2 py-1 rounded-md text-white"
            style={{ background: 'var(--accent-strong)' }}
          >
            <Check size={12} /> Save
          </button>
          <button
            onClick={cancel}
            className="flex items-center gap-1 text-xs label-mono px-2 py-1 rounded-md border"
            style={{ borderColor: 'var(--border)' }}
          >
            <X size={12} /> Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="group relative inline-block w-full">
      <Tag className={className}>
        {value || <span className="text-[var(--text-faint)] italic">{placeholder}</span>}
      </Tag>
      <button
        onClick={startEdit}
        className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded-full flex items-center justify-center border bg-[var(--bg)]"
        style={{ borderColor: 'var(--accent)' }}
        aria-label="Edit text"
      >
        <Pencil size={11} style={{ color: 'var(--accent)' }} />
      </button>
    </div>
  )
}
