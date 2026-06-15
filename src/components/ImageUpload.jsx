import { useRef, useState } from 'react'
import { Upload, Image as ImageIcon, Pencil } from 'lucide-react'
import { uploadImage } from '../lib/supabase'
import { useTeamAuth } from '../context/TeamAuthContext'

/**
 * An editable image slot.
 * - If `src` is set, shows the image. Team members (unlocked) see a
 *   "replace" overlay on hover; everyone else just sees the image.
 * - If `src` is empty: team members see an upload placeholder; everyone
 *   else sees nothing (the slot collapses).
 *
 * @param {string} src - current image URL (or falsy)
 * @param {(url: string) => void} onUpload - called with new public URL
 * @param {string} label - placeholder label, e.g. "UPLOAD TEAM PHOTO"
 * @param {string} folder - storage folder name
 * @param {string} className - additional classes for sizing
 * @param {string} aspect - tailwind aspect-ratio class, default aspect-[4/3]
 */
export default function ImageUpload({
  src,
  onUpload,
  label = 'UPLOAD PHOTO',
  folder = 'misc',
  className = '',
  aspect = 'aspect-[4/3]',
  rounded = 'rounded-xl',
}) {
  const { isUnlocked } = useTeamAuth()
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const canEdit = isUnlocked && !!onUpload

  const handleFile = async (file) => {
    if (!file || !canEdit) return
    setUploading(true)
    try {
      const url = await uploadImage(file, folder)
      onUpload(url)
    } catch (err) {
      console.error('Upload failed', err)
      alert('Image upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    handleFile(file)
  }

  if (src) {
    return (
      <div
        className={`relative group overflow-hidden ${aspect} ${rounded} ${className}`}
      >
        <img src={src} alt={label} className="w-full h-full object-cover" />
        {canEdit && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
          >
            <span className="flex items-center gap-2 text-white label-mono text-xs bg-black/60 px-3 py-2 rounded-lg">
              <Pencil size={14} /> Replace image
            </span>
          </button>
        )}
        {canEdit && (
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        )}
      </div>
    )
  }

  // No image set
  if (!canEdit) {
    // Public visitors: don't show an upload prompt for an empty slot.
    // Render nothing so the layout doesn't show placeholder boxes to the public.
    return null
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault()
        setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={`upload-zone flex flex-col items-center justify-center gap-2 cursor-pointer text-center px-4 ${aspect} ${rounded} ${className} ${
        dragOver ? 'border-[var(--accent)] bg-[var(--accent-soft)]' : ''
      }`}
    >
      {uploading ? (
        <span className="label-mono">Uploading...</span>
      ) : (
        <>
          {label.includes('UPLOAD') ? (
            <Upload size={20} className="text-[var(--accent)]" />
          ) : (
            <ImageIcon size={20} className="text-[var(--text-faint)]" />
          )}
          <span className="label-mono">{label}</span>
          <span className="text-xs text-[var(--text-faint)]">Click or drag to upload</span>
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  )
}
