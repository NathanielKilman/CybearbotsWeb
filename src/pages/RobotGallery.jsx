import { useState } from 'react'
import { Cpu, Plus, Trash2, X, Check } from 'lucide-react'
import PageHero from '../components/PageHero'
import SectionLabel from '../components/SectionLabel'
import ImageUpload from '../components/ImageUpload'
import EditableText from '../components/EditableText'
import ScrollReveal from '../components/ScrollReveal' // Added import
import { useTable } from '../lib/data'
import { useTeamAuth } from '../context/TeamAuthContext'
import { supabase } from '../lib/supabase'

// ... (AddRobotModal component remains unchanged) ...

function RobotCard({ robot, isUnlocked, onDelete, refetch }) {
  const saveField = async (field, value) => {
    await supabase.from('robots').update({ [field]: value }).eq('id', robot.id)
    refetch()
  }

  return (
    // Wrapped in ScrollReveal for a smooth entrance
    <ScrollReveal>
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
    </ScrollReveal>
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
        <ScrollReveal>
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
        </ScrollReveal>

        {data.length === 0 ? (
          <ScrollReveal>
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
          </ScrollReveal>
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
