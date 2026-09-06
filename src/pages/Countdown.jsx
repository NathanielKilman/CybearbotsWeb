import { useState, useEffect } from 'react'
import { ExternalLink, Clock, Pencil, Check, X } from 'lucide-react'
import { useTeamAuth } from '../context/TeamAuthContext'

/**
 * Countdown banner component.
 * All settings are passed as props (from site_content via Home.jsx).
 * Team members can edit all fields inline.
 *
 * Props:
 *   targetDate     - ISO date string, e.g. "2026-03-14T08:00:00"
 *   label          - text shown above countdown, e.g. "Until Hudson Valley Regional"
 *   endMessage     - text shown when countdown hits zero, e.g. "Now competing at Hudson Valley Regional!"
 *   endLinkText    - optional button label, e.g. "Watch Us Live"
 *   endLinkUrl     - optional URL for the button
 *   onSave         - (field, value) => void — saves back to Supabase
 *   visible        - boolean, whether to show at all
 */
export default function Countdown({ targetDate, label, endMessage, endLinkText, endLinkUrl, onSave, visible }) {
  const { isUnlocked } = useTeamAuth()
  const [timeLeft, setTimeLeft] = useState(null)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState({
    targetDate: targetDate || '',
    label: label || '',
    endMessage: endMessage || '',
    endLinkText: endLinkText || '',
    endLinkUrl: endLinkUrl || '',
  })

  // Sync draft when props change
  useEffect(() => {
    setDraft({
      targetDate: targetDate || '',
      label: label || '',
      endMessage: endMessage || '',
      endLinkText: endLinkText || '',
      endLinkUrl: endLinkUrl || '',
    })
  }, [targetDate, label, endMessage, endLinkText, endLinkUrl])

  // Tick the countdown
  useEffect(() => {
    if (!targetDate) return
    const tick = () => {
      const diff = new Date(targetDate) - new Date()
      if (diff <= 0) {
        setTimeLeft(null)
        return
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      setTimeLeft({ days, hours, minutes, seconds })
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  const saveAll = async () => {
    await onSave('countdown_target_date', draft.targetDate)
    await onSave('countdown_label', draft.label)
    await onSave('countdown_end_message', draft.endMessage)
    await onSave('countdown_end_link_text', draft.endLinkText)
    await onSave('countdown_end_link_url', draft.endLinkUrl)
    setEditing(false)
  }

  const isOver = targetDate && new Date(targetDate) <= new Date()

  // Don't render if hidden and not unlocked (team members always see it so they can configure it)
  if (!visible && !isUnlocked) return null

  // Team member edit panel
  if (isUnlocked && editing) {
    return (
      <section className="border-b" style={{ borderColor: 'var(--accent)', background: 'var(--accent-soft)' }}>
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <p className="label-mono" style={{ color: 'var(--accent)' }}>EDIT COUNTDOWN</p>
            <div className="flex gap-2">
              <button
                onClick={saveAll}
                className="flex items-center gap-1.5 label-mono text-xs px-3 py-1.5 rounded-lg text-white"
                style={{ background: 'var(--accent-strong)' }}
              >
                <Check size={12} /> Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="flex items-center gap-1.5 label-mono text-xs px-3 py-1.5 rounded-lg border"
                style={{ borderColor: 'var(--border)' }}
              >
                <X size={12} /> Cancel
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-mono block mb-1 text-xs">Target Date & Time *</label>
              <input
                type="datetime-local"
                className="w-full bg-transparent border rounded-lg p-2 outline-none text-sm"
                style={{ borderColor: 'var(--border)' }}
                value={draft.targetDate ? draft.targetDate.slice(0, 16) : ''}
                onChange={(e) => setDraft((d) => ({ ...d, targetDate: e.target.value }))}
              />
              <p className="text-xs text-[var(--text-faint)] mt-1">Format: YYYY-MM-DDTHH:MM</p>
            </div>
            <div>
              <label className="label-mono block mb-1 text-xs">Label (shown above countdown)</label>
              <input
                className="w-full bg-transparent border rounded-lg p-2 outline-none text-sm"
                style={{ borderColor: 'var(--border)' }}
                placeholder="e.g. Until Hudson Valley Regional"
                value={draft.label}
                onChange={(e) => setDraft((d) => ({ ...d, label: e.target.value }))}
              />
            </div>
            <div>
              <label className="label-mono block mb-1 text-xs">End Message (shown when countdown ends)</label>
              <input
                className="w-full bg-transparent border rounded-lg p-2 outline-none text-sm"
                style={{ borderColor: 'var(--border)' }}
                placeholder="e.g. Now competing at Hudson Valley Regional!"
                value={draft.endMessage}
                onChange={(e) => setDraft((d) => ({ ...d, endMessage: e.target.value }))}
              />
            </div>
            <div>
              <label className="label-mono block mb-1 text-xs">End Link Button Text (optional)</label>
              <input
                className="w-full bg-transparent border rounded-lg p-2 outline-none text-sm"
                style={{ borderColor: 'var(--border)' }}
                placeholder="e.g. Watch Us Live"
                value={draft.endLinkText}
                onChange={(e) => setDraft((d) => ({ ...d, endLinkText: e.target.value }))}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label-mono block mb-1 text-xs">End Link URL (optional)</label>
              <input
                className="w-full bg-transparent border rounded-lg p-2 outline-none text-sm"
                style={{ borderColor: 'var(--border)' }}
                placeholder="https://www.thebluealliance.com/event/..."
                value={draft.endLinkUrl}
                onChange={(e) => setDraft((d) => ({ ...d, endLinkUrl: e.target.value }))}
              />
            </div>
            <div className="sm:col-span-2 flex items-center gap-3">
              <label className="label-mono text-xs">Show countdown on homepage</label>
              <button
                onClick={() => onSave('countdown_visible', !visible)}
                className="px-3 py-1 rounded-full text-xs label-mono border"
                style={{
                  borderColor: visible ? 'var(--accent)' : 'var(--border)',
                  color: visible ? 'var(--accent)' : 'var(--text-muted)',
                  background: visible ? 'var(--accent-soft)' : 'transparent',
                }}
              >
                {visible ? 'VISIBLE' : 'HIDDEN'}
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      className="border-b relative"
      style={{
        borderColor: 'var(--accent)',
        background: 'var(--bg-elevated)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        {/* Team member edit button */}
        {isUnlocked && (
          <button
            onClick={() => setEditing(true)}
            className="absolute top-3 right-4 lg:right-6 flex items-center gap-1.5 label-mono text-xs px-3 py-1.5 rounded-lg border"
            style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
          >
            <Pencil size={11} /> EDIT COUNTDOWN
          </button>
        )}

        {!targetDate && isUnlocked ? (
          // No date set yet — prompt team member to configure
          <div className="text-center py-4">
            <Clock size={24} className="mx-auto mb-2 text-[var(--text-faint)]" />
            <p className="label-mono text-sm text-[var(--text-faint)]">No countdown configured yet.</p>
            <button
              onClick={() => setEditing(true)}
              className="mt-3 label-mono text-xs px-3 py-1.5 rounded-lg border"
              style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
            >
              + SET UP COUNTDOWN
            </button>
          </div>
        ) : isOver ? (
          // Countdown ended — show end message + optional link
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏆</span>
              <p className="font-display font-bold text-xl lg:text-2xl" style={{ color: 'var(--accent)' }}>
                {endMessage || 'Event underway!'}
              </p>
            </div>
            {endLinkText && endLinkUrl && (
              <a
                href={endLinkUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm text-white shrink-0 transition-transform hover:scale-105"
                style={{ background: 'var(--accent-strong)' }}
              >
                {endLinkText} <ExternalLink size={14} />
              </a>
            )}
          </div>
        ) : timeLeft ? (
          // Countdown in progress
          <div className="text-center">
            {label && (
              <p className="label-mono text-xs mb-4" style={{ color: 'var(--accent)' }}>
                {label.toUpperCase()}
              </p>
            )}
            <div className="flex items-start justify-center gap-3 sm:gap-6">
              {[
                { value: timeLeft.days, unit: 'DAYS' },
                { value: timeLeft.hours, unit: 'HRS' },
                { value: timeLeft.minutes, unit: 'MIN' },
                { value: timeLeft.seconds, unit: 'SEC' },
              ].map(({ value, unit }, i) => (
                <div key={unit} className="flex items-start gap-3 sm:gap-6">
                  <div className="text-center">
                    <div
                      className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tabular-nums leading-none"
                      style={{ color: 'var(--text)' }}
                    >
                      {String(value).padStart(2, '0')}
                    </div>
                    <p className="label-mono text-[10px] mt-1" style={{ color: 'var(--text-faint)' }}>
                      {unit}
                    </p>
                  </div>
                  {i < 3 && (
                    <div className="font-display font-black text-3xl sm:text-4xl lg:text-5xl leading-none mt-1" style={{ color: 'var(--accent)' }}>
                      :
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
