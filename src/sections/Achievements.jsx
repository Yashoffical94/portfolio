import { motion } from 'framer-motion'
import { Trophy, ExternalLink, Star } from 'lucide-react'
import SectionHeading from '../components/SectionHeading'
import { usePortfolio } from '../context/usePortfolio'
import { staggerContainer, staggerItem } from '../animations/variants'
import { formatDateShort } from '../utils/helpers'

const FALLBACK_ACH = [
  { _id:'1', title:'Hackathon Winner', description:'First place at a national-level 36-hour hackathon with 200+ participants. Built an AI-powered accessibility tool.', category:'hackathon', date:'2024-03-01', featured:true },
  { _id:'2', title:'AWS Cloud Practitioner', description:'Certified AWS Cloud Practitioner — demonstrated understanding of AWS Cloud concepts, services and terminology.', category:'certification', date:'2024-01-01', featured:true },
  { _id:'3', title:'Codeforces Rating 1600+', description:'Achieved Expert rating on Codeforces through consistent competitive programming practice.', category:'competitive', date:'2023-12-01', featured:false },
  { _id:'4', title:'Open Source: 100+ Contributions', description:'Crossed 100 open source contributions across multiple repositories in a single year.', category:'milestone', date:'2024-06-01', featured:false },
]

const CAT_STYLE = {
  hackathon:    { emoji: '🏆', color: 'from-gold-600 to-gold-500',    label: 'Hackathon'    },
  certification:{ emoji: '🎓', color: 'from-blue-600 to-blue-500',    label: 'Certification' },
  competitive:  { emoji: '⚔️', color: 'from-orange-600 to-orange-500',label: 'Competitive'  },
  academic:     { emoji: '📚', color: 'from-green-600 to-green-500',   label: 'Academic'     },
  project:      { emoji: '🚀', color: 'from-purple-600 to-purple-500', label: 'Project'      },
  award:        { emoji: '🏅', color: 'from-teal-600 to-teal-500',     label: 'Award'        },
  milestone:    { emoji: '⚡', color: 'from-navy-600 to-navy-500',     label: 'Milestone'    },
}

export default function Achievements() {
  const { achievements: apiAch, loading } = usePortfolio()
  const achievements = apiAch.length > 0 ? apiAch : FALLBACK_ACH

  const featured = achievements.filter(a => a.featured)
  const rest     = achievements.filter(a => !a.featured)

  return (
    <section id="achievements" className="section-padding relative">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 50% 40% at 30% 50%, rgba(245,158,11,0.04) 0%, transparent 60%)' }} aria-hidden="true" />
      <div className="section-container">
        <SectionHeading eyebrow="Power Level" title="Achievements" subtitle="Milestones, wins and certifications from the journey so far." />

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Featured achievements */}
            {featured.length > 0 && (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                className="grid md:grid-cols-2 gap-5"
              >
                {featured.map((ach) => {
                  const style = CAT_STYLE[ach.category] || CAT_STYLE.milestone
                  return (
                    <motion.div key={ach._id} variants={staggerItem}
                      className="card p-6 flex gap-4 border border-gold-500/20 hover:border-gold-500/40 transition-all duration-300 group"
                    >
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${style.color} flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                        {style.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-bold text-white text-lg leading-tight">{ach.title}</h3>
                          <Star size={14} className="text-gold-400 fill-gold-400 flex-shrink-0 mt-1" />
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed mb-2">{ach.description}</p>
                        <div className="flex items-center gap-3">
                          <span className="tag text-xs">{style.label}</span>
                          {ach.date && <span className="text-xs text-slate-600">{formatDateShort(ach.date)}</span>}
                          {ach.url && <a href={ach.url} target="_blank" rel="noreferrer" className="ml-auto text-slate-500 hover:text-orange-400 transition-colors"><ExternalLink size={13}/></a>}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            )}

            {/* Regular achievements */}
            {rest.length > 0 && (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {rest.map((ach) => {
                  const style = CAT_STYLE[ach.category] || CAT_STYLE.milestone
                  return (
                    <motion.div key={ach._id} variants={staggerItem}
                      className="card p-4 flex items-start gap-3 hover:border-orange-500/20 transition-all duration-300 group"
                    >
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${style.color} flex items-center justify-center text-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                        {style.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white text-sm leading-tight mb-1">{ach.title}</h4>
                        <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{ach.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="tag text-xs">{style.label}</span>
                          {ach.url && <a href={ach.url} target="_blank" rel="noreferrer" className="ml-auto text-slate-600 hover:text-orange-400 transition-colors"><ExternalLink size={12}/></a>}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
