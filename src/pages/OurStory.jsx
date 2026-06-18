import { Users, Star, Heart, Wrench } from 'lucide-react'
import PageHero from '../components/PageHero'
import SectionLabel from '../components/SectionLabel'
import ImageUpload from '../components/ImageUpload'
import EditableText from '../components/EditableText'
import ScrollReveal from '../components/ScrollReveal' // Added import
import { useSiteContent, useSiteImages } from '../lib/data'

// ... (FOUNDERS and VALUES constants remain unchanged) ...

export default function OurStory() {
  const { content, setValue } = useSiteContent()
  const { images, setImage } = useSiteImages()

  // ... (foundingBody and whatWeDoBody variables remain unchanged) ...

  return (
    <div>
      <PageHero kicker="TEAM #7504 · THE ORIGIN" title="Our Story" corner={'FOUNDED: 2018.09\nBREWSTER, NY'} variant="green" />

      <ScrollReveal>
        <section className="max-w-7xl mx-auto px-4 lg:px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <SectionLabel>THE BEGINNING</SectionLabel>
              <h2 className="font-display font-extrabold text-4xl lg:text-5xl mt-3 mb-6 leading-tight">
                Brewster's First Robotics Team
              </h2>
              <EditableText
                value={foundingBody}
                onSave={(v) => setValue('our_story_founding_body', v)}
                as="textarea"
                tag="div"
                className="text-[var(--text-muted)] leading-relaxed whitespace-pre-line space-y-4 mb-6"
              />
              <p className="label-mono mb-3">FOUNDED BY</p>
              <div className="flex flex-wrap gap-2">
                {FOUNDERS.map((name) => (
                  <span
                    key={name}
                    className="px-4 py-2 rounded-lg border text-sm font-medium"
                    style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
            <ImageUpload
              src={images.our_story_founding_photo}
              onUpload={(url) => setImage('our_story_founding_photo', url)}
              label="UPLOAD FOUNDING PHOTO"
              folder="our-story"
              aspect="aspect-[4/5]"
            />
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="max-w-7xl mx-auto px-4 lg:px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <ImageUpload
              src={images.our_story_action_photo}
              onUpload={(url) => setImage('our_story_action_photo', url)}
              label="UPLOAD TEAM IN ACTION PHOTO"
              folder="our-story"
              aspect="aspect-[4/5]"
              className="order-2 lg:order-1"
            />
            <div className="order-1 lg:order-2">
              <SectionLabel>WHAT WE DO</SectionLabel>
              <h2 className="font-display font-extrabold text-4xl lg:text-5xl mt-3 mb-6 leading-tight">
                Engineering, Code, and Competition
              </h2>
              <EditableText
                value={whatWeDoBody}
                onSave={(v) => setValue('our_story_what_we_do_body', v)}
                as="textarea"
                tag="div"
                className="text-[var(--text-muted)] leading-relaxed whitespace-pre-line space-y-4"
              />
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="max-w-7xl mx-auto px-4 lg:px-6 py-16">
          <div className="text-center mb-12">
            <SectionLabel center>OUR VALUES</SectionLabel>
            <h2 className="font-display font-extrabold text-4xl lg:text-5xl mt-3">What We Believe</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {VALUES.map((v) => {
              const Icon = v.icon
              return (
                <div key={v.title} className="card p-8">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-5"
                    style={{ background: 'var(--accent-soft)' }}
                  >
                    <Icon size={22} style={{ color: 'var(--accent)' }} />
                  </div>
                  <h3 className="font-display font-bold text-xl mb-2">{v.title}</h3>
                  <p className="text-[var(--text-muted)] leading-relaxed">{v.body}</p>
                </div>
              )
            })}
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="max-w-7xl mx-auto px-4 lg:px-6 py-16">
          <ImageUpload
            src={images.our_story_culture_photo}
            onUpload={(url) => setImage('our_story_culture_photo', url)}
            label="UPLOAD TEAM CULTURE PHOTO"
            folder="our-story"
            aspect="aspect-[21/9]"
          />
        </section>
      </ScrollReveal>
    </div>
  )
}
