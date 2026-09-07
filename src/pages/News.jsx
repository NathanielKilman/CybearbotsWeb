import { useState, useEffect, useCallback } from 'react'
import { Newspaper, Plus, Trash2, X, Check, Paperclip, ChevronLeft, ChevronRight, CheckSquare, Square } from 'lucide-react'
import PageHero from '../components/PageHero'
import ImageUpload from '../components/ImageUpload'
import EditableText from '../components/EditableText'
import ScrollReveal from '../components/ScrollReveal'
import { useTeamAuth } from '../context/TeamAuthContext'
import { supabase, uploadImage } from '../lib/supabase'

const POSTS_PER_PAGE = 10

// ─── Add Post Modal ───────────────────────────────────────────────────────────
function AddPostModal({ onClose, onSaved }) {
  const [form, setForm] = useState({
    title: '',
    body: '',
    post_date: new Date().toISOString().slice(0, 10),
    image_url: '',
  })
  const [attachment, setAttachment] = useState(null)
  const [uploadingFile, setUploadingFile] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleFileAttach = async (file) => {
    if (!file) return
    setUploadingFile(true)
    try {
      const url = await uploadImage(file, 'news-attachments')
      setAttachment({ name: file.name, url })
    } catch (err) {
      console.error('Attachment upload failed', err)
      alert('File upload failed. Please try again.')
    } finally {
      setUploadingFile(false)
    }
  }

  const save = async () => {
    if (!form.title.trim() || !form.body.trim()) return
    setSaving(true)
    let body = form.body
    if (attachment) {
      body += `\n\nAttachment: ${attachment.name}\n${attachment.url}`
    }
    await supabase.from('news_posts').insert({ ...form, body })
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
            <label className="label-mono block mb-1">Cover Photo (optional)</label>
            <ImageUpload
              src={form.image_url}
              onUpload={(url) => setForm((f) => ({ ...f, image_url: url }))}
              label="UPLOAD COVER PHOTO"
              folder="news"
              aspect="aspect-[16/9]"
            />
          </div>
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
          <div>
            <label className="label-mono block mb-1">Attach a File (optional)</label>
            {attachment ? (
              <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg border" style={{ borderColor: 'var(--border)' }}>
                <span className="flex items-center gap-2 text-sm truncate">
                  <Paperclip size={14} className="shrink-0" style={{ color: 'var(--accent)' }} />
                  <span className="truncate">{attachment.name}</span>
                </span>
                <button onClick={() => setAttachment(null)} style={{ color: '#ed1c24' }}>
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label
                className="flex items-center justify-center gap-2 p-2.5 rounded-lg border cursor-pointer label-mono"
                style={{ borderColor: 'var(--border-strong)', borderStyle: 'dashed' }}
              >
                <Paperclip size={14} />
                {uploadingFile ? 'Uploading...' : 'CHOOSE FILE'}
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFileAttach(e.target.files?.[0])}
                  disabled={uploadingFile}
                />
              </label>
            )}
            <p className="text-xs text-[var(--text-faint)] mt-1">
              A link to the file will be added to the end of the post body.
            </p>
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

// ─── Post Card ────────────────────────────────────────────────────────────────
function PostCard({ post, isUnlocked, onDelete, refetch, selected, onToggleSelect, selectMode }) {
  const saveField = async (field, value) => {
    await supabase.from('news_posts').update({ [field]: value }).eq('id', post.id)
    refetch()
  }

  return (
    <ScrollReveal>
      <article
        className="card overflow-hidden relative group"
        style={selected ? { borderColor: 'var(--accent)', borderWidth: '2px' } : {}}
      >
        {/* Select checkbox — shown in select mode or on hover when unlocked */}
        {isUnlocked && (
          <button
            onClick={() => onToggleSelect(post.id)}
            className={`absolute top-3 left-3 z-10 transition-opacity ${
              selectMode ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
            style={{ color: selected ? 'var(--accent)' : 'var(--text-muted)' }}
            aria-label={selected ? 'Deselect post' : 'Select post'}
          >
            {selected ? <CheckSquare size={20} /> : <Square size={20} />}
          </button>
        )}

        {/* Single delete button */}
        {isUnlocked && !selectMode && (
          <button
            onClick={() => onDelete([post.id])}
            className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full flex items-center justify-center border bg-[var(--bg)] opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ borderColor: '#ed1c24' }}
            aria-label="Delete post"
          >
            <Trash2 size={12} style={{ color: '#ed1c24' }} />
          </button>
        )}

        <ImageUpload
          src={post.image_url}
          onUpload={(url) => saveField('image_url', url)}
          label="UPLOAD COVER PHOTO"
          folder="news"
          aspect="aspect-[16/9]"
          rounded="rounded-none"
        />
        <div className="p-6">
          <p className="label-mono mb-2">
            {new Date(post.post_date).toLocaleDateString('en-US', {
              month: 'long', day: 'numeric', year: 'numeric',
            })}
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
    </ScrollReveal>
  )
}

// ─── Main News Page ───────────────────────────────────────────────────────────
export default function News() {
  const { isUnlocked } = useTeamAuth()

  const [posts, setPosts] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [yearFilter, setYearFilter] = useState('all')
  const [availableYears, setAvailableYears] = useState([])

  const [showAdd, setShowAdd] = useState(false)
  const [selected, setSelected] = useState(new Set())
  const [selectMode, setSelectMode] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const totalPages = Math.ceil(total / POSTS_PER_PAGE)

  // Fetch available years for the filter dropdown (once on mount)
  useEffect(() => {
    supabase
      .from('news_posts')
      .select('post_date')
      .order('post_date', { ascending: false })
      .then(({ data }) => {
        if (!data) return
        const years = [...new Set(data.map((p) => new Date(p.post_date).getFullYear()))]
        setAvailableYears(years)
      })
  }, [])

  const fetchPosts = useCallback(async () => {
    setLoading(true)

    let countQuery = supabase.from('news_posts').select('*', { count: 'exact', head: true })
    let dataQuery = supabase
      .from('news_posts')
      .select('*')
      .order('post_date', { ascending: false })
      .range((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE - 1)

    if (yearFilter !== 'all') {
      const start = `${yearFilter}-01-01`
      const end = `${yearFilter}-12-31`
      countQuery = countQuery.gte('post_date', start).lte('post_date', end)
      dataQuery = dataQuery.gte('post_date', start).lte('post_date', end)
    }

    const [{ count }, { data }] = await Promise.all([countQuery, dataQuery])
    setPosts(data || [])
    setTotal(count || 0)
    setLoading(false)
    setSelected(new Set())
  }, [page, yearFilter])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  // Reset to page 1 when filter changes
  useEffect(() => {
    setPage(1)
  }, [yearFilter])

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const selectAll = () => {
    if (selected.size === posts.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(posts.map((p) => p.id)))
    }
  }

  const handleDelete = async (ids) => {
    const count = ids.length
    if (!confirm(`Delete ${count} post${count > 1 ? 's' : ''}? This cannot be undone.`)) return
    setDeleting(true)
    await supabase.from('news_posts').delete().in('id', ids)
    setDeleting(false)
    setSelected(new Set())
    setSelectMode(false)
    fetchPosts()
    // Also refresh available years in case we deleted the only post in a year
    const { data } = await supabase.from('news_posts').select('post_date')
    if (data) {
      const years = [...new Set(data.map((p) => new Date(p.post_date).getFullYear()))]
      setAvailableYears(years)
    }
  }

  const exitSelectMode = () => {
    setSelectMode(false)
    setSelected(new Set())
  }

  return (
    <div>
      <PageHero kicker="TEAM #7504 · SEASON UPDATES" title="News & Recaps" variant="green" />

      <section className="max-w-4xl mx-auto px-4 lg:px-6 py-16">

        {/* ── Toolbar ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">

          {/* Year filter */}
          <div className="flex items-center gap-2">
            <label className="label-mono text-xs">SEASON</label>
            <select
              className="bg-transparent border rounded-lg px-3 py-1.5 text-sm outline-none"
              style={{ borderColor: 'var(--border)' }}
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
            >
              <option value="all">All Years</option>
              {availableYears.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            {total > 0 && (
              <span className="label-mono text-xs text-[var(--text-faint)]">
                {total} post{total !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Team-only controls */}
          {isUnlocked && (
            <div className="flex items-center gap-2">
              {selectMode ? (
                <>
                  <button
                    onClick={selectAll}
                    className="label-mono text-xs px-3 py-1.5 rounded-lg border"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    {selected.size === posts.length ? 'DESELECT ALL' : 'SELECT ALL'}
                  </button>
                  {selected.size > 0 && (
                    <button
                      onClick={() => handleDelete([...selected])}
                      disabled={deleting}
                      className="flex items-center gap-1.5 label-mono text-xs px-3 py-1.5 rounded-lg text-white disabled:opacity-50"
                      style={{ background: '#ed1c24' }}
                    >
                      <Trash2 size={12} />
                      DELETE {selected.size}
                    </button>
                  )}
                  <button
                    onClick={exitSelectMode}
                    className="label-mono text-xs px-3 py-1.5 rounded-lg border"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    CANCEL
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setSelectMode(true)}
                    className="flex items-center gap-1.5 label-mono text-xs px-3 py-1.5 rounded-lg border"
                    style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
                  >
                    <CheckSquare size={13} /> SELECT
                  </button>
                  <button
                    onClick={() => setShowAdd(true)}
                    className="flex items-center gap-2 label-mono text-xs px-3 py-1.5 rounded-lg border"
                    style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
                  >
                    <Plus size={13} /> NEW POST
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* ── Posts ── */}
        {loading ? (
          <div className="card p-16 text-center">
            <p className="label-mono text-[var(--text-faint)]">Loading...</p>
          </div>
        ) : posts.length === 0 ? (
          <ScrollReveal>
            <div className="card p-16 text-center">
              <Newspaper size={40} className="mx-auto mb-4 text-[var(--text-faint)]" />
              <p className="label-mono">
                {yearFilter !== 'all' ? `NO POSTS FROM ${yearFilter}` : 'NO POSTS YET — CHECK BACK SOON'}
              </p>
            </div>
          </ScrollReveal>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                isUnlocked={isUnlocked}
                onDelete={handleDelete}
                refetch={fetchPosts}
                selected={selected.has(post.id)}
                onToggleSelect={toggleSelect}
                selectMode={selectMode}
              />
            ))}
          </div>
        )}

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-9 h-9 rounded-lg flex items-center justify-center border disabled:opacity-40"
              style={{ borderColor: 'var(--border)' }}
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className="w-9 h-9 rounded-lg flex items-center justify-center border label-mono text-xs transition-colors"
                style={{
                  borderColor: p === page ? 'var(--accent)' : 'var(--border)',
                  background: p === page ? 'var(--accent-soft)' : 'transparent',
                  color: p === page ? 'var(--accent)' : 'var(--text-muted)',
                }}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-9 h-9 rounded-lg flex items-center justify-center border disabled:opacity-40"
              style={{ borderColor: 'var(--border)' }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* ── Archive note ── */}
        {totalPages > 1 && (
          <p className="text-center label-mono text-xs text-[var(--text-faint)] mt-4">
            PAGE {page} OF {totalPages} · {total} TOTAL POSTS
          </p>
        )}
      </section>

      {showAdd && <AddPostModal onClose={() => setShowAdd(false)} onSaved={fetchPosts} />}
    </div>
  )
}
