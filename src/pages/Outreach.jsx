import { Heart, Users, Star } from 'lucide-react'
import PageHero from '../components/PageHero'
import SectionLabel from '../components/SectionLabel'
import ImageUpload from '../components/ImageUpload'
import EditableText from '../components/EditableText'
import ScrollReveal from '../components/ScrollReveal'
import { useSiteContent, useSiteImages } from '../lib/data'

// Defined the missing ACTIVITIES array so the map function doesn't crash the page!
const ACTIVITIES = [
  {
    title: 'Workshops',
    icon: Star,
    key: 'outreach_stem_mentorship',
    fallback: 'At our local middle school, Henry H. Wells Middle Schools, we volunteer to mentor their robotics club by helping them build LEGO Mindstorms with a battle of bots esque competion at the end of the year.'
  },
  {
    title: 'Community Demos',
    icon: Users,
    key: 'outreach_community_demos',
    fallback: "Currently we do demos every year at our local intermediate school, which is grades 3 to 5, at their Annual STEAM Fair."
  },
  {
    title: ' Team Mentorship',
    icon: Heart,
    key: 'outreach_giving_back',
    fallback: 'Experienced members and mentors share their knowledge, guiding new members through every aspect of robot design and competition.'
  }
]

export default function Outreach() {
  const { content, setValue } = useSiteContent()
  const { images, setImage } = useSiteImages()

  return (
    <div>
      <PageHero kicker="TEAM #7504 · GIVING BACK" title="Outreach" variant="green" />

      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-16">
        <ScrollReveal>
          <div className="text-center mb-12">
            <SectionLabel center>WHAT WE DO</SectionLabel>
            <h2 className="font-display font-extrabold text-4xl lg:text-5xl mt-3">Community Activities</h2>
          </div>
        </ScrollReveal>
        
        <ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            {ACTIVITIES.map((a) => {
              const Icon = a.icon
              return (
                <div key={a.title} className="card p-6">
                  <div
                    className="w-11 h-11 rounded-lg flex items-center justify-center mb-4"
                    style={{ background: 'rgba(237,28,36,0.12)' }}
                  >
                    <Icon size={20} style={{ color: '#ed1c24' }} />
                  </div>
                  <h3 className="font-display font-bold text-xl mb-2">{a.title}</h3>
                  <EditableText
                    value={content[a.key] || a.fallback}
                    onSave={(v) => setValue(a.key, v)}
                    as="textarea"
                    tag="p"
                    className="text-[var(--text-muted)] leading-relaxed"
                  />
                </div>
              )
            })}
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ImageUpload
              src={images.outreach_event_photo}
              onUpload={(url) => setImage('outreach_event_photo', url)}
              label="UPLOAD COMMUNITY EVENT PHOTO"
              folder="outreach"
              aspect="aspect-[4/3]"
            />
            <ImageUpload
              src={images.outreach_workshop_photo}
              onUpload={(url) => setImage('outreach_workshop_photo', url)}
              label="UPLOAD WORKSHOP PHOTO"
              folder="outreach"
              aspect="aspect-[4/3]"
            />
          </div>
        </ScrollReveal>
      </section>
    </div>
  )
}
