import { Users, Star, Heart, Wrench } from 'lucide-react'
import PageHero from '../components/PageHero'
import SectionLabel from '../components/SectionLabel'
import ImageUpload from '../components/ImageUpload'
import EditableText from '../components/EditableText'
import { useSiteContent, useSiteImages } from '../lib/data'

const FOUNDERS = ['Brenden Fox', 'Edward Kaufman', 'Anthony Ayala', 'Akshay Gupta', 'Lauren Knorr']

const VALUES = [
  {
    icon: Users,
    title: 'Teamwork',
    body: 'We believe that the best solutions come from diverse teams working together with trust, respect, and shared purpose.',
  },
  {
    icon: Star,
    title: 'Gracious Professionalism',
    body: 'A core FIRST value — we compete fiercely and assist our fellow teams with equal enthusiasm. Excellence and integrity are not opposites.',
  },
  {
    icon: Heart,
    title: 'Community',
    body: 'Robotics does not happen in a vacuum. We are rooted in Brewster, NY, and committed to giving back through outreach, mentorship, and collaboration.',
  },
  {
    icon: Wrench,
    title: 'Hands-On STEM',
    body: 'Real engineering, real code, real business decisions — every member learns by doing, not by watching.',
  },
]

export default function OurStory() {
  const { content, setValue } = useSiteContent()
  const { images, setImage } = useSiteImages()

  const foundingBody =
    content.our_story_founding_body ||
    `Our team was founded in September of 2018. None of us knew about FIRST, and with our limited background in robotics, it was a bit of a struggle. This team was the first of its kind at our school. It allowed for different opportunities in engineering, publicity, finance, and competition. People from all different backgrounds came together and built a working robot and competed. This would not have been possible without our mentors, volunteers, members, and sponsors who have helped us along the way. Since then, as a team, we have grown to learn leadership and teamwork. Without the help of our crucial founding members, Brenden Fox, Edward Kaufman, Anthony Ayala, Akshay Gupta, and Lauren Knorr, we wouldn't have known where to begin. They paved the way for the following years to continue robotics and improve the team and ourselves.
`

  const whatWeDoBody =
    content.our_story_what_we_do_body ||
    `Every fall, we begin a new season. In January, FIRST reveals the game challenge — and the clock starts. Our team has just weeks to design, build, wire, and program a robot capable of competing on the FRC field.

Subteams cover every discipline: Mechanical engineers design and fabricate. Coders build autonomous and teleoperated control systems. Business manages our budget, outreach, and sponsorships. Drivers master the controls. Analysts track data and strategy.

Beyond the robot, we run community outreach programs, visit local schools, and demonstrate what young engineers can accomplish.`

  return (
    <div>
      <PageHero kicker="TEAM #7504 · THE ORIGIN" title="Our Story" corner={'FOUNDED: 2018.09\nBREWSTER, NY'} variant="green" />

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

      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-16">
        <ImageUpload
          src={images.our_story_culture_photo}
          onUpload={(url) => setImage('our_story_culture_photo', url)}
          label="UPLOAD TEAM CULTURE PHOTO"
          folder="our-story"
          aspect="aspect-[21/9]"
        />
      </section>
    </div>
  )
}
