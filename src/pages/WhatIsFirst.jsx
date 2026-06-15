import { ExternalLink } from 'lucide-react'
import PageHero from '../components/PageHero'
import SectionLabel from '../components/SectionLabel'
import ImageUpload from '../components/ImageUpload'
import { useSiteImages } from '../lib/data'

const PROGRAMS = [
  {
    tag: 'FLL JR.',
    tagColor: '#ed1c24',
    ages: 'AGES 6-9',
    name: 'FIRST LEGO League Explore',
    body: 'Young students explore real-world STEM concepts through hands-on building and teamwork with LEGO® elements.',
  },
  {
    tag: 'FLL',
    tagColor: '#ed1c24',
    ages: 'AGES 9-16',
    name: 'FIRST LEGO League Challenge',
    body: 'Teams research and solve real-world problems, build and program LEGO® robots, and present their solutions at competitions.',
  },
  {
    tag: 'FTC',
    tagColor: '#0066b3',
    ages: 'AGES 12-18',
    name: 'FIRST Tech Challenge',
    body: 'Students design, build, and program robots to compete in an alliance format against other teams using professional engineering tools.',
  },
  {
    tag: 'FRC',
    tagColor: 'var(--accent)',
    ages: 'AGES 14-18',
    name: 'FIRST Robotics Competition',
    body: 'The "Big Leagues" of robotics. Teams receive a game challenge and build competition-ready robots in a limited time window. This is where CyBearBots competes.',
    highlight: true,
  },
]

const HOW_FRC_WORKS = [
  {
    num: '01',
    title: 'Kickoff',
    body: 'In early January, FIRST reveals the new season game challenge simultaneously worldwide. Teams receive a game manual, field drawings, and a kit of parts.',
  },
  {
    num: '02',
    title: 'Build Season',
    body: 'Teams have approximately 6 weeks to design, build, wire, and program a full-size competition robot. Strategy, innovation, and teamwork are tested daily.',
  },
  {
    num: '03',
    title: 'Competition',
    body: 'Robots compete on a 27×54-foot field in three-team alliances. Events span regional and district competitions, leading to the FIRST Championship.',
  },
]

export default function WhatIsFirst() {
  const { images, setImage } = useSiteImages()

  return (
    <div>
      <PageHero
        kicker="FOR INSPIRATION AND RECOGNITION OF SCIENCE AND TECHNOLOGY"
        title={<>What is<br />FIRST?</>}
        corner={'EST: 1989\nDEAN KAMEN'}
        variant="blue"
      />

      {/* THE MISSION */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div>
            <SectionLabel>THE MISSION</SectionLabel>
            <h2 className="font-display font-extrabold text-4xl lg:text-5xl mt-3 mb-6 leading-tight">
              A Global Movement for STEM
            </h2>
            <div className="text-[var(--text-muted)] leading-relaxed space-y-4">
              <p>
               FIRST (For Inspiration and Recognition of Science and Technology) is a nonprofit organization
                founded in 1989 by inventor and entrepreneur Dean Kamen. Its mission is to inspire young people to
                be science and technology leaders and innovators, by engaging them in exciting mentor-based
                programs.
              </p>
              <p>
                Unlike a typical science fair or classroom project, FIRST programs are structured like real engineering
                challenges, complete with deadlines, budgets, sponsors, and live competition. Students don't just
                learn about STEM; they practice it.
              </p>
              <p>
                Today, FIRST operates in more than 110 countries, reaching over 680,000 students with programs
                spanning kindergarten through 12th grade.
              </p>
              <a
                href="https://www.firstinspires.org"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:underline"
                style={{ color: 'var(--accent)' }}
              >
                Learn more at firstinspires.org <ExternalLink size={14} />
              </a>
            </div>
          </div>
          <ImageUpload
            src={images.first_logo_graphic}
            onUpload={(url) => setImage('first_logo_graphic', url)}
            label="UPLOAD FIRST LOGO / PROGRAM GRAPHIC"
            folder="first"
            aspect="aspect-[4/5]"
          />
        </div>
      </section>

      {/* FOUR PROGRAMS */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-16">
        <div className="text-center mb-12">
          <SectionLabel center>THE PATHWAYS</SectionLabel>
          <h2 className="font-display font-extrabold text-4xl lg:text-5xl mt-3 mb-4">Four Programs, One Pipeline</h2>
          <p className="text-[var(--text-muted)] max-w-2xl mx-auto">
            FIRST offers a continuous K-12 progression of programs, each building on the last to
            develop increasingly sophisticated STEM skills.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PROGRAMS.map((p) => (
            <div
              key={p.tag}
              className="card p-6"
              style={p.highlight ? { borderColor: 'var(--accent)' } : undefined}
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className="px-3 py-1 rounded-md text-xs font-bold text-white"
                  style={{ background: p.tagColor }}
                >
                  {p.tag}
                </span>
                <span className="label-mono px-2 py-1 rounded-md" style={{ background: 'var(--bg-elevated)' }}>
                  {p.ages}
                </span>
              </div>
              <h3 className="font-display font-bold text-xl mb-2">{p.name}</h3>
              <p className="text-[var(--text-muted)] leading-relaxed">{p.body}</p>
              {p.highlight && (
                <p className="label-mono mt-4 pt-4 border-t" style={{ color: 'var(--accent)', borderColor: 'var(--border)' }}>
                  ← CYBEARBOTS COMPETES HERE
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* HOW FRC WORKS */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-16">
        <div className="text-center mb-12">
          <SectionLabel center>THE COMPETITION</SectionLabel>
          <h2 className="font-display font-extrabold text-4xl lg:text-5xl mt-3">How FRC Works</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {HOW_FRC_WORKS.map((step) => (
            <div key={step.num} className="card p-8">
              <p className="font-display font-black text-4xl mb-4" style={{ color: 'var(--text-faint)' }}>
                {step.num}
              </p>
              <h3 className="font-display font-bold text-xl mb-2">{step.title}</h3>
              <p className="text-[var(--text-muted)] leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
