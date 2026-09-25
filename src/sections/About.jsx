import { motion } from 'framer-motion'
import { MapPin, Briefcase, Target, Coffee, ArrowRight } from 'lucide-react'
import SectionHeading from '../components/SectionHeading'
import { usePortfolio } from '../context/PortfolioContext'
import { staggerContainer, staggerItem, fadeInLeft, fadeInRight } from '../animations/variants'

const JOURNEY_STEPS = [
  { icon: '📚', label: 'LEARNING',   color: 'from-navy-600 to-navy-500',   desc: 'DSA, algorithms, foundations' },
  { icon: '🔨', label: 'BUILDING',   color: 'from-orange-600 to-orange-500', desc: 'Projects, experiments, prototypes' },
  { icon: '🚀', label: 'SHIPPING',   color: 'from-gold-600 to-gold-500',    desc: 'Real products, real users' },
  { icon: '⚡', label: 'MASTERING',  color: 'from-orange-500 to-gold-400',  desc: 'AI, systems, scale' },
]

export default function About() {
  const { profile } = usePortfolio()

  const bio         = profile?.aboutText || profile?.bio || "I'm a passionate software engineer who believes in building things that matter. My journey started with curiosity about how software works and evolved into a mission to build AI-powered systems and real-world products."
  const location    = profile?.location  || 'Your City, Country'
  const available   = profile?.available ?? true

  const stats = [
    { value: profile?.yearsOfExperience || '3+',  label: 'Years of Experience', icon: Briefcase },
    { value: profile?.projectsCompleted  || '20+', label: 'Projects Completed',  icon: Target    },
    { value: profile?.technologiesUsed   || '15+', label: 'Technologies Used',   icon: Coffee    },
  ]

  return (
    <section id="about" className="section-padding relative">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 40% at 80% 50%, rgba(92,110,242,0.05) 0%, transparent 60%)' }} aria-hidden="true" />

      <div className="section-container">
        <SectionHeading eyebrow="About Me" title="My Journey" subtitle="From curious learner to relentless builder — here's how I got here." />

        {/* Journey Steps */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20"
        >
          {JOURNEY_STEPS.map((step, i) => (
            <motion.div key={step.label} variants={staggerItem} className="relative">
              <div className="card card-hover p-6 text-center h-full">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-4 text-xl`}>
                  {step.icon}
                </div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-orange-400 mb-2">{step.label}</h3>
                <p className="text-xs text-slate-500">{step.desc}</p>
              </div>
              {i < JOURNEY_STEPS.length - 1 && (
                <div className="hidden md:flex absolute top-1/2 -right-2 -translate-y-1/2 z-10 text-orange-500/40">
                  <ArrowRight size={16} />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Bio + Stats */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div variants={fadeInLeft} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold text-white">
              A bit more <span className="text-gradient-orange">about me</span>
            </h3>
            <p className="text-slate-400 leading-relaxed text-lg">{bio}</p>
            <p className="text-slate-400 leading-relaxed">
              I don't just learn technology — I build things with it. Whether it's a full-stack web app, an AI-powered tool, or an open-source contribution, I'm always working on something.
            </p>
            <div className="flex flex-col gap-3 pt-2">
              <div className="flex items-center gap-3 text-slate-400 text-sm">
                <MapPin size={15} className="text-orange-500 flex-shrink-0" />
                <span>{location}</span>
              </div>
              {available && (
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
                  <span className="text-green-400 text-sm font-medium">Open to new opportunities</span>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div variants={fadeInRight} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} className="grid grid-cols-1 gap-4">
            {stats.map((s) => {
              const Icon = s.icon
              return (
                <div key={s.label} className="card p-6 flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={22} className="text-orange-400" />
                  </div>
                  <div>
                    <div className="text-4xl font-black text-gradient-orange leading-none">{s.value}</div>
                    <div className="text-sm text-slate-500 mt-1">{s.label}</div>
                  </div>
                </div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
