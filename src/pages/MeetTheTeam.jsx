import { useState } from 'react'
import { User, Plus, Trash2, Pencil, X, Check, Award, Wrench, Briefcase, Gamepad2, GraduationCap } from 'lucide-react'
import PageHero from '../components/PageHero'
import ImageUpload from '../components/ImageUpload'
import ScrollReveal from '../components/ScrollReveal'
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
  // Safely parse the subteam data to remove raw JSON brackets/quotes from Supabase
  let parsedSubteams = [];
  if (Array.isArray(member.subteam)) {
    parsedSubteams = member.subteam;
  } else if (typeof member.subteam === 'string' && member.subteam.trim() !== '') {
    try {
      parsedSubteams = JSON.parse(member.subteam);
    } catch (e) {
      parsedSubteams = [member.subteam];
    }
  }

  const subteamDisplay = parsedSubteams.join(' | ');

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
  const [form, setForm] = useState(() => {
    let initialSubteams = [];
    if (initial && initial.subteam) {
      if (Array.isArray(initial.subteam)) {
        initialSubteams = initial.subteam;
      } else if (typeof initial.subteam === 'string') {
        try {
          initialSubteams = JSON.parse(initial.subteam);
        } catch (e) {
          initialSubteams = [initial.subteam];
        }
      }
    }

    if (initial) {
      return {
        ...initial,
        subteam: initialSubteams
      }
    }
    return { name: '', role: '', subteam: [], bio: '', photo_url: '', category }
  })
  
  const [saving, setSaving] = useState(false)

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }))

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
    
    // Strip ID from the body payload to guarantee PostgreSQL compatibility on updates
    const { id, ...payload } = form;

    if (id) {
      await supabase.from('team_members').update(payload).eq('id', id)
    } else {
      await supabase.from('team_members').insert({ ...payload, category })
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
          <button onClick={onClose} disabled={saving}><X size={18} /></button>
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
              disabled={saving}
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
              disabled={saving}
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
                        disabled={saving}
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
              disabled={saving}
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

function TeamRolesSection() {
  return (
    <ScrollReveal>
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-16 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="mb-12 text-center">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl mb-4">Team Structure &amp; Roles</h2>
          <p className="text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
            CyBearBots operates like a real-world engineering firm. Every member has a vital role to play, from hands-on fabrication to business management and on-field strategy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* EXPERIENCE LEVELS */}
          <div className="card p-6 flex flex-col h-full bg-[var(--bg-elevated)] border" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-3 mb-4 text-[var(--accent)]">
              <Award size={24} />
              <h3 className="font-display font-bold text-xl text-[var(--text)]">Experience Levels</h3>
            </div>
            <ul className="space-y-4 flex-1">
              <li>
                <strong className="block text-sm text-[var(--text)]">Team Member (Less than 1 Year)</strong>
                <span className="text-sm text-[var(--text-muted)]">Rookies bringing fresh energy and eagerness to learn the ropes of FIRST Robotics.</span>
              </li>
              <li>
                <strong className="block text-sm text-[var(--text)]">Junior Member (2 Years)</strong>
                <span className="text-sm text-[var(--text-muted)]">Experienced students who have found their footing and take on complex projects.</span>
              </li>
              <li>
                <strong className="block text-sm text-[var(--text)]">Senior Member (3+ Years)</strong>
                <span className="text-sm text-[var(--text-muted)]">Core veterans who act as role models, leading subteams and guiding newer members.</span>
              </li>
            </ul>
          </div>

          {/* TECHNICAL LEADERSHIP */}
          <div className="card p-6 flex flex-col h-full bg-[var(--bg-elevated)] border" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-3 mb-4 text-[var(--accent)]">
              <Wrench size={24} />
              <h3 className="font-display font-bold text-xl text-[var(--text)]">Technical Leadership</h3>
            </div>
            <ul className="space-y-4 flex-1">
              <li>
                <strong className="block text-sm text-[var(--text)]">Mechanical Captain</strong>
                <span className="text-sm text-[var(--text-muted)]">The mastermind overseeing all physical robot fabrication, electrical wiring, and hardware integration.</span>
              </li>
              <li>
                <strong className="block text-sm text-[var(--text)]">Lead CAD Designer</strong>
                <span className="text-sm text-[var(--text-muted)]">The digital architect responsible for all 3D modeling and prototyping before physical building begins.</span>
              </li>
              <li>
                <strong className="block text-sm text-[var(--text)]">Coding Captain</strong>
                <span className="text-sm text-[var(--text-muted)]">Leads the software team to program autonomous routines, vision systems, and tele-operated controls.</span>
              </li>
            </ul>
          </div>

          {/* BUSINESS LEADERSHIP */}
          <div className="card p-6 flex flex-col h-full bg-[var(--bg-elevated)] border" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-3 mb-4 text-[var(--accent)]">
              <Briefcase size={24} />
              <h3 className="font-display font-bold text-xl text-[var(--text)]">Business Leadership</h3>
            </div>
            <ul className="space-y-4 flex-1">
              <li>
                <strong className="block text-sm text-[var(--text)]">Business Marketing Lead</strong>
                <span className="text-sm text-[var(--text-muted)]">Co-leader of the Business team. Tackles overall business operations but specializes in team branding, marketing strategy, and public image.</span>
              </li>
              <li>
                <strong className="block text-sm text-[var(--text)]">Business Relation Lead</strong>
                <span className="text-sm text-[var(--text-muted)]">Co-leader of the Business team. Focuses heavily on community outreach, securing essential sponsorships, and fostering relationships with other teams.</span>
              </li>
              <li>
                <strong className="block text-sm text-[var(--text)]">Safety Captain</strong>
                <span className="text-sm text-[var(--text-muted)]">The ultimate protector of the workspace, ensuring strict safety protocols are followed in the shop and at events.</span>
              </li>
            </ul>
          </div>

          {/* DRIVE TEAM */}
          <div className="card p-6 flex flex-col h-full bg-[var(--bg-elevated)] border lg:col-span-2" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-3 mb-4 text-[var(--accent)]">
              <Gamepad2 size={24} />
              <h3 className="font-display font-bold text-xl text-[var(--text)]">The Drive Team</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
              <div>
                <strong className="block text-sm text-[var(--text)]">Drive Coach</strong>
                <span className="text-sm text-[var(--text-muted)]">A dual-threat leader. Off the field, they head the Strategy &amp; Scouting teams. On the field, they act as the match captain, directing real-time strategy behind the glass.</span>
              </div>
              <div>
                <strong className="block text-sm text-[var(--text)]">Lead Driver</strong>
                <span className="text-sm text-[var(--text-muted)]">The pilot controlling the robot's movement and chassis during the chaos of competition.</span>
              </div>
              <div>
                <strong className="block text-sm text-[var(--text)]">Lead Operator</strong>
                <span className="text-sm text-[var(--text-muted)]">The systems expert managing all non-driving mechanisms (shooters, intakes, climbers) based on the season's game rules.</span>
              </div>
              <div>
                <strong className="block text-sm text-[var(--text)]">Human Player</strong>
                <span className="text-sm text-[var(--text-muted)]">The crucial human element who physically interacts with game pieces from behind the alliance wall to assist the robot.</span>
              </div>
            </div>
          </div>

          {/* ADULT LEADERSHIP */}
          <div className="card p-6 flex flex-col h-full bg-[var(--bg-elevated)] border" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-3 mb-4 text-[var(--accent)]">
              <GraduationCap size={24} />
              <h3 className="font-display font-bold text-xl text-[var(--text)]">Adult Leadership</h3>
            </div>
            <ul className="space-y-4 flex-1">
              <li>
                <strong className="block text-sm text-[var(--text)]">Advisors</strong>
                <span className="text-sm text-[var(--text-muted)]">Dedicated teachers from our school district who oversee the entire club. They are the foundational pillars of our team—without them, CyBearBots simply would not exist.</span>
              </li>
              <li>
                <strong className="block text-sm text-[var(--text)]">Mentors</strong>
                <span className="text-sm text-[var(--text-muted)]">Generous industry professionals and community volunteers who donate their time and expertise to guide our students through complex challenges.</span>
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
  const { data: membersData, refetch } = useTable('team_members', { order: 'sort_order', secondaryOrder: 'created_at' })
  
  // Strict empty array fallback protection during database loading phases
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
