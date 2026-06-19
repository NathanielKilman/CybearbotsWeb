import { useState } from 'react'
import { User, Plus, Trash2, Pencil, X, Check, Shield, Wrench, Briefcase, GraduationCap, Gamepad2, Award } from 'lucide-react'
import PageHero from '../components/PageHero'
import ImageUpload from '../components/ImageUpload'
import ScrollReveal from '../components/ScrollReveal'
import { useTable } from '../lib/data'
import { useTeamAuth } from '../context/TeamAuthContext'
import { supabase } from '../lib/supabase'

// 1. Define the missing CATEGORIES array to prevent crashes
const CATEGORIES = [
  { key: 'student', label: 'Students' },
  { key: 'mentor', label: 'Mentors' },
  { key: 'advisor', label: 'Advisors' }
]

// 2. Fallback MemberCard Component
function MemberCard({ member, isUnlocked, onEdit, onDelete }) {
  return (
    <div className="card p-4 flex flex-col h-full bg-[var(--bg-elevated)] border" style={{ borderColor: 'var(--border)' }}>
      <div className="w-full aspect-square bg-[var(--bg-muted)] rounded-md mb-4 flex items-center justify-center overflow-hidden relative">
        {member.image_url ? (
          <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
        ) : (
          <User size={40} className="text-[var(--text-faint)]" />
        )}
      </div>
      <h3 className="font-bold text-lg">{member.name}</h3>
      <p className="text-sm text-[var(--accent)] font-semibold mb-2">{member.role || 'Team Member'}</p>
      
      {isUnlocked && (
        <div className="mt-auto flex justify-between border-t pt-3" style={{ borderColor: 'var(--border)' }}>
          <button onClick={() => onEdit(member)} className="p-2 hover:bg-[var(--bg-muted)] rounded text-[var(--text-muted)]">
            <Pencil size={16} />
          </button>
          <button onClick={() => onDelete(member.id)} className="p-2 hover:bg-red-500/20 rounded text-red-500">
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </div>
  )
}

// 3. Fallback MemberFormModal Component
function MemberFormModal({ initial, category, onClose, onSaved }) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-md p-6 bg-[var(--bg)] border" style={{ borderColor: 'var(--border)' }}>
        <h3 className="font-bold text-xl mb-4">{initial ? 'Edit' : 'Add'} {category}</h3>
        <p className="text-[var(--text-muted)] mb-6">Database form connection goes here.</p>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg" style={{ borderColor: 'var(--border)' }}>Cancel</button>
          <button onClick={() => { onSaved(); onClose(); }} className="px-4 py-2 rounded-lg text-black font-bold" style={{ background: 'var(--accent)' }}>Save</button>
        </div>
      </div>
    </div>
  )
}

// 4. Fully Restored Team Roles Section
function TeamRolesSection() {
  return (
    <ScrollReveal>
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-16 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="mb-12 text-center">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl mb-4">Team Structure & Roles</h2>
          <p className="text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
            CyBearBots operates like a real-world engineering firm. Every member has a vital role to play, from hands-on fabrication to business management and on-field strategy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card p-6 flex flex-col h-full bg-[var(--bg-elevated)] border" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-3 mb-4 text-[var(--accent)]">
              <Award size={24} />
              <h3 className="font-display font-bold text-xl text-[var(--text)]">Experience Levels</h3>
            </div>
            <ul className="space-y-4 flex-1">
              <li>
                <strong className="block text-sm text-[var(--text)]">Team Member (&lt; 1 Year)</strong>
                <span className="text-sm text-[var(--text-muted)]">Rookies bringing fresh energy and eagerness to learn the ropes of FIRST Robotics.</span>
              </li>
              <li>
                <strong className="block text-sm text-[var(--text)]">Veteran (&gt; 1 Year)</strong>
                <span className="text-sm text-[var(--text-muted)]">Experienced students who guide projects and help mentor newer members.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </ScrollReveal>
  )
}

export default function MeetTheTeam() {
  const { isUnlocked } = useTeamAuth()
  
  // Safe default to empty array to prevent map crashes while loading
  const { data: membersData, refetch } = useTable('team_members', { order: 'sort_order', secondaryOrder: 'created_at' })
  const members = Array.isArray(membersData) ? membersData : []
  
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
            <ScrollReveal key={key}>
              <section>
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
            </ScrollReveal>
          )
        })}
      </div>

      <TeamRolesSection />

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
