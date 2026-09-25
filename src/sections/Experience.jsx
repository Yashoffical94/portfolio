import { motion } from 'framer-motion'
import { Briefcase, ExternalLink, Calendar, MapPin } from 'lucide-react'
import SectionHeading from '../components/SectionHeading'
import { usePortfolio } from '../context/PortfolioContext'
import { staggerContainer, staggerItem } from '../animations/variants'
import { formatDateShort } from '../utils/helpers'

const FALLBACK_EXP = [
  { _id:'1', organization:'Tech Company', role:'Software Engineering Intern', type:'internship', startDate:'2024-06-01', endDate:'2024-08-31', current:false, description:'Worked on full-stack features for the main product. Improved API performance by 40% and built a real-time notification system.', technologies:['React','Node.js','PostgreSQL','Redis'], url:'' },
  { _id:'2', organization:'Open Source Project', role:'Contributor', type:'opensource', startDate:'2023-01-01', current:true, description:'Active contributor to a popular open-source developer tool with 5k+ GitHub stars. Implemented key features and fixed critical bugs.', technologies:['TypeScript','Jest','GitHub Actions'], url:'https://github.com' },
  { _id:'3', organization:'Freelance', role:'Full-Stack Developer', type:'freelance', startDate:'2023-06-01', endDate:'2024-01-01', current:false, description:'Built custom web applications for small businesses. Delivered 5+ projects on time and within budget.', technologies:['React','Next.js','MongoDB','Stripe'], url:'' },
]

const TYPE_BADGE = {
  job:          { label: 'Full-time',    color: 'bg-green-500/10 text-green-400 border-green-500/20'  },
  internship:   { label: 'Internship',   color: 'bg-blue-500/10 text-blue-400 border-blue-500/20'    },
  freelance:    { label: 'Freelance',    color: 'bg-gold-500/10 text-gold-400 border-gold-500/20'     },
  opensource:   { label: 'Open Source', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20'},
  competition:  { label: 'Competition', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20'},
  achievement:  { label: 'Achievement', color: 'bg-teal-500/10 text-teal-400 border-teal-500/20'     },
}

export default function Experience() {
  const { experience: apiExp, loading } = usePortfolio()
  const experience = apiExp.length > 0 ? apiExp : FALLBACK_EXP

  return (
    <section id="experience" className="section-padding relative">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 50% 40% at 80% 50%, rgba(92,110,242,0.05) 0%, transparent 60%)' }} aria-hidden="true" />
      <div className="section-container">
        <SectionHeading eyebrow="Experience" title="Work & Contributions" subtitle="My professional journey, freelance work and open-source contributions." />

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="relative max-w-3xl mx-auto"
          >
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-orange-500/50 via-orange-500/20 to-transparent" aria-hidden="true" />

            {experience.map((exp, i) => {
              const badge = TYPE_BADGE[exp.type] || TYPE_BADGE.job
              const startFmt = exp.startDate ? formatDateShort(exp.startDate) : ''
              const endFmt   = exp.current ? 'Present' : (exp.endDate ? formatDateShort(exp.endDate) : '')

              return (
                <motion.div key={exp._id} variants={staggerItem} className="relative flex gap-6 mb-10">
                  {/* Timeline dot */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-space-700 border border-orange-500/30 flex items-center justify-center z-10">
                    {exp.logo
                      ? <img src={exp.logo} alt={exp.organization} className="w-7 h-7 object-contain rounded-full" />
                      : <Briefcase size={18} className="text-orange-400" />
                    }
                  </div>

                  <div className="card p-5 flex-1 hover:border-orange-500/20 transition-all duration-300">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-white leading-tight">{exp.role}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          {exp.url
                            ? <a href={exp.url} target="_blank" rel="noreferrer" className="text-orange-400 hover:text-orange-300 font-medium text-sm flex items-center gap-1">{exp.organization} <ExternalLink size={11}/></a>
                            : <span className="text-orange-400 font-medium text-sm">{exp.organization}</span>
                          }
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${badge.color}`}>{badge.label}</span>
                    </div>

                    {(startFmt || endFmt) && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                        <Calendar size={12} />
                        <span>{startFmt}{endFmt ? ` — ${endFmt}` : ''}</span>
                        {exp.current && <span className="ml-1 w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />}
                      </div>
                    )}

                    <p className="text-slate-400 text-sm leading-relaxed mb-4">{exp.description}</p>

                    {exp.technologies?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {exp.technologies.map(t => (
                          <span key={t} className="px-2 py-0.5 rounded-md text-xs font-mono bg-white/5 border border-white/8 text-slate-500">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>
    </section>
  )
}
