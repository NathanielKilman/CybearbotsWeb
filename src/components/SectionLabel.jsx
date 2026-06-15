/**
 * Small mono label with a leading dash, e.g. "— THE BEGINNING"
 * Used to introduce content sections throughout the site.
 */
export default function SectionLabel({ children, center = false }) {
  return (
    <p className={`label-mono flex items-center gap-3 ${center ? 'justify-center' : ''}`} style={{ color: 'var(--accent)' }}>
      <span className="inline-block w-6 h-px" style={{ background: 'var(--accent)' }} />
      {children}
    </p>
  )
}
