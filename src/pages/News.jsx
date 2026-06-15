import { useState } from 'react'
import { Newspaper, Plus, Trash2, X, Check } from 'lucide-react'
import PageHero from '../components/PageHero'
import ImageUpload from '../components/ImageUpload'
import EditableText from '../components/EditableText'
import { useTable } from '../lib/data'
import { useTeamAuth } from '../context/TeamAuthContext'
import { supabase } from '../lib/supabase'

function AddPostModal({ onClose, onSaved }) {
  const [form, setForm] = useState({ title: '', body: '', post_date: new Date().toISOString().slice(0, 10) })
  const [saving, setSaving] = useState(false)

  const save = async () => {
    if (!form.title.trim() || !form.body.trim()) return
    setSaving(true)
    await supabase.from('news_posts').insert(form)
    setSaving(false)
    onSaved()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
      <div className="card w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" style={{ background: 'var(--bg-elevated)' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-lg">New Post</h3>
          <button onClick={onClose}><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="label-mono block mb-1">Title *</label>
            <input
              className="w-full bg-transparent border rounded-lg p-2 outline-none"
              style={{ borderColor: 'var(--border)' }}
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </div>
          <div>
            <label className="label-mono block mb-1">Date</label>
            <input
              type="date"
              className="w-full bg-transparent border rounded-lg p-2 outline-none"
              style={{ borderColor: 'var(--border)' }}
              value={form.post_date}
              onChange={(e) => setForm((f) => ({ ...f, post_date: e.target.value }))}
            />
          </div>
          <div>
            <label className="label-mono block mb-1">Body *</label>
            <textarea
              className="w-full bg-transparent border rounded-lg p-2 outline-none"
              style={{ borderColor: 'var(--border)' }}
              rows={6}
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
            />
          </div>
          <button
            onClick={save}
            disabled={saving || !form.title.trim() || !form.body.trim()}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-white disabled:opacity-50"
            style={{ background: 'var(--accent-strong)' }}
          >
            <Check size={16} /> {saving ? 'Publishing...' : 'Publish Post'}
          </button>
        </div>
      </div>
    </div>
  )
}

function PostCard({ post, isUnlocked, onDelete, refetch }) {
  const saveField = async (field, value) => {
    await supabase.from('news_posts').update({ [field]: value }).eq('id', post.id)
    refetch()
  }

  return (
    <article className="card overflow-hidden relative group">
      {isUnlocked && (
        <button
          onClick={() => onDelete(post.id)}
          className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full flex items-center justify-center border bg-[var(--bg)] opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ borderColor: '#ed1c24' }}
        >
          <Trash2 size={12} style={{ color: '#ed1c24' }} />
        </button>
      )}
      <ImageUpload
        src={post.image_url}
        onUpload={(url) => saveField('image_url', url)}
        label="UPLOAD COVER PHOTO (OPTIONAL)"
        folder="news"
        aspect="aspect-[16/9]"
        rounded="rounded-none"
      />
      <div className="p-6">
        <p className="label-mono mb-2">
          {new Date(post.post_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
        <EditableText
          value={post.title}
          onSave={(v) => saveField('title', v)}
          tag="h2"
          className="font-display font-bold text-2xl mb-3"
        />
        <EditableText
          value={post.body}
          onSave={(v) => saveField('body', v)}
          as="textarea"
          tag="p"
          className="text-[var(--text-muted)] leading-relaxed whitespace-pre-line"
        />
      </div>
    </article>
  )
}

export default function News() {
  const { isUnlocked } = useTeamAuth()
  const { data, refetch } = useTable('news_posts', { order: 'post_date', ascending: false })
  const [showAdd, setShowAdd] = useState(false)

  const handleDelete = async (id) => {
    if (!confirm('Delete this post?')) return
    await supabase.from('news_posts').delete().eq('id', id)
    refetch()
  }

  return (
    <div>
      <PageHero kicker="TEAM #7504 · SEASON UPDATES" title="News & Recaps" variant="green" />

      <section className="max-w-4xl mx-auto px-4 lg:px-6 py-16">
        {isUnlocked && (
          <div className="flex justify-end mb-8">
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 label-mono px-3 py-2 rounded-lg border"
              style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
            >
              <Plus size={14} /> NEW POST
            </button>
          </div>
        )}

        {data.length === 0 ? (
          <div className="card p-16 text-center">
            <Newspaper size={40} className="mx-auto mb-4 text-[var(--text-faint)]" />
            <p className="label-mono">NO POSTS YET — CHECK BACK SOON</p>
          </div>
        ) : (
          <div className="space-y-6">
            {data.map((post) => (
              <PostCard key={post.id} post={post} isUnlocked={isUnlocked} onDelete={handleDelete} refetch={refetch} />
            ))}
          </div>
        )}
      </section>

      {showAdd && <AddPostModal onClose={() => setShowAdd(false)} onSaved={refetch} />}
    </div>
  )
}
