import { useState } from 'react'
import { motion } from 'framer-motion'
import SectionHeading from '../components/SectionHeading'
import { usePortfolio } from '../context/usePortfolio'
import { staggerContainer, staggerItem } from '../animations/variants'
import { groupBy } from '../utils/helpers'

const CATEGORY_ORDER = ['Languages', 'Frontend', 'Backend', 'AI-ML', 'Tools', 'Other']
const CATEGORY_COLORS = {
  Languages: { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400', dot: 'bg-orange-500' },
  Frontend:  { bg: 'bg-navy-600/10',   border: 'border-navy-400/20',   text: 'text-navy-300',   dot: 'bg-navy-400'  },
  Backend:   { bg: 'bg-gold-500/10',   border: 'border-gold-500/20',   text: 'text-gold-400',   dot: 'bg-gold-500'  },
  'AI-ML':   { bg: 'bg-purple-500/10', border: 'border-purple-400/20', text: 'text-purple-400', dot: 'bg-purple-500' },
  Tools:     { bg: 'bg-slate-500/10',  border: 'border-slate-500/20',  text: 'text-slate-400',  dot: 'bg-slate-500' },
  Other:     { bg: 'bg-teal-500/10',   border: 'border-teal-400/20',   text: 'text-teal-400',   dot: 'bg-teal-500'  },
}

// Fallback skill data when backend is offline
const FALLBACK_SKILLS = [
  { _id:'1', name:'C++',           category:'Languages', proficiency:85 },
  { _id:'2', name:'Python',        category:'Languages', proficiency:90 },
  { _id:'3', name:'JavaScript',    category:'Languages', proficiency:92 },
  { _id:'4', name:'TypeScript',    category:'Languages', proficiency:80 },
  { _id:'5', name:'SQL',           category:'Languages', proficiency:75 },
  { _id:'6', name:'React',         category:'Frontend',  proficiency:90 },
  { _id:'7', name:'HTML / CSS',    category:'Frontend',  proficiency:95 },
  { _id:'8', name:'Tailwind CSS',  category:'Frontend',  proficiency:90 },
  { _id:'9', name:'Next.js',       category:'Frontend',  proficiency:75 },
  { _id:'10',name:'Node.js',       category:'Backend',   proficiency:85 },
  { _id:'11',name:'Express',       category:'Backend',   proficiency:85 },
  { _id:'12',name:'MongoDB',       category:'Backend',   proficiency:80 },
  { _id:'13',name:'REST APIs',     category:'Backend',   proficiency:90 },
  { _id:'14',name:'Machine Learning', category:'AI-ML',  proficiency:70 },
  { _id:'15',name:'Data Analysis', category:'AI-ML',     proficiency:72 },
  { _id:'16',name:'Git / GitHub',  category:'Tools',     proficiency:90 },
  { _id:'17',name:'VS Code',       category:'Tools',     proficiency:95 },
  { _id:'18',name:'Docker',        category:'Tools',     proficiency:65 },
  { _id:'19',name:'Linux',         category:'Tools',     proficiency:70 },
]

function SkillCard({ skill, colors }) {
  return (
    <motion.div
      variants={staggerItem}
      className={`card p-4 flex items-center gap-3 border ${colors.border} hover:border-opacity-60 transition-all duration-300 group cursor-default`}
    >
      <div className={`w-2 h-2 rounded-full ${colors.dot} flex-shrink-0 group-hover:scale-150 transition-transform duration-300`} />
      <span className="text-sm font-medium text-slate-300 flex-1">{skill.name}</span>
      {skill.proficiency && (
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${colors.dot}`}
              initial={{ width: 0 }}
              whileInView={{ width: `${skill.proficiency}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
            />
          </div>
          <span className={`text-xs ${colors.text} font-mono w-8 text-right`}>{skill.proficiency}%</span>
        </div>
      )}
    </motion.div>
  )
}

export default function Skills() {
  const { skills: apiSkills, loading } = usePortfolio()
  const skills = apiSkills.length > 0 ? apiSkills : FALLBACK_SKILLS
  const [activeTab, setActiveTab] = useState('All')

  const grouped = groupBy(skills, 'category')
  const categories = ['All', ...CATEGORY_ORDER.filter(c => grouped[c]?.length > 0)]

  const displaySkills = activeTab === 'All' ? skills : (grouped[activeTab] || [])
  const displayGrouped = activeTab === 'All' ? grouped : { [activeTab]: displaySkills }

  return (
    <section id="skills" className="section-padding relative">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 50% 40% at 20% 50%, rgba(249,115,22,0.04) 0%, transparent 60%)' }} aria-hidden="true" />
      <div className="section-container">
        <SectionHeading eyebrow="Tech Stack" title="Skills & Technologies" subtitle="Tools and technologies I work with regularly — grouped by domain." />

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === cat
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                  : 'text-slate-500 hover:text-slate-300 border border-white/5 hover:border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
          </div>
        ) : (
          <div className="space-y-10">
            {CATEGORY_ORDER.filter(cat => displayGrouped[cat]?.length > 0).map((cat) => {
              const catSkills = displayGrouped[cat]
              const colors    = CATEGORY_COLORS[cat] || CATEGORY_COLORS.Other
              return (
                <div key={cat}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${colors.bg} ${colors.text} border ${colors.border}`}>
                      {cat}
                    </span>
                    <div className="flex-1 h-px bg-white/5" />
                    <span className="text-xs text-slate-600">{catSkills.length} skills</span>
                  </div>
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-60px' }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
                  >
                    {catSkills.map((skill) => (
                      <SkillCard key={skill._id} skill={skill} colors={colors} />
                    ))}
                  </motion.div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
