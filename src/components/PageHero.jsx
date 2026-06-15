/**
 * Big page-title hero band, matching the design's pattern of a colored
 * band with a small mono "kicker" line and a huge bold title.
 *
 * @param {string} kicker - small label above the title, e.g. "TEAM #7504 · THE ORIGIN"
 * @param {string} title - big title text, e.g. "Our Story"
 * @param {string} corner - optional small mono text in top-right corner
 * @param {'default'|'green'|'blue'} variant - background color variant
 */
export default function PageHero({ kicker, title, corner, variant = 'default' }) {
  const bg =
    variant === 'green'
      ? 'var(--accent-strong)'
      : variant === 'blue'
      ? 'var(--color-first-blue)'
      : 'var(--bg-elevated)'

  const isSolidColored = variant === 'green' || variant === 'blue'
const textColor = isSolidColored ? '#ffffff' : 'var(--text)'
const mutedTextColor = isSolidColored ? 'rgba(255, 255, 255, 0.8)' : 'var(--text-muted)'
const faintTextColor = isSolidColored ? 'rgba(255, 255, 255, 0.6)' : 'var(--text-faint)'

  return (
    <section
      className="relative overflow-hidden border-b hex-pattern"
      style={{ background: bg, borderColor: 'var(--border)' }}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-16 lg:py-24 relative">
        {corner && (
          <div
            className="absolute top-6 right-4 lg:right-6 label-mono text-right whitespace-pre-line"
            style={{ color: variant === 'default' ? 'var(--text-faint)' : 'rgba(255,255,255,0.5)' }}
          >
            {corner}
          </div>
        )}
        {kicker && (
          <p
            className="label-mono mb-4 fade-up"
            style={{ color: variant === 'default' ? 'var(--text-faint)' : 'rgba(255,255,255,0.7)' }}
          >
            {kicker}
          </p>
        )}
        <h1
          className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl leading-[1.05] fade-up fade-up-1"
          style={{ color: textColor }}
        >
          {title}
        </h1>
      </div>
    </section>
  )
}
