import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Github, X, ArrowRight, Star } from 'lucide-react'
import SectionHeading from '../components/SectionHeading'
import { usePortfolio } from '../context/PortfolioContext'
import { staggerContainer, staggerItem } from '../animations/variants'

const FALLBACK_PROJECTS = [
  { _id:'1', title:'AI-Powered App', shortDescription:'A machine learning application that solves real-world problems using NLP and computer vision.', technologies:['Python','React','FastAPI','MongoDB'], category:'AI/ML', featured:true, githubUrl:'#', demoUrl:'#', image:'' },
  { _id:'2', title:'Full-Stack Platform', shortDescription:'End-to-end web platform with authentication, real-time updates and scalable backend.', technologies:['React','Node.js','Express','PostgreSQL'], category:'Web', featured:true, githubUrl:'#', demoUrl:'#', image:'' },
  { _id:'3', title:'Dev CLI Tool', shortDescription:'Command-line tool that automates repetitive developer workflows and boosts productivity.', technologies:['TypeScript','Node.js','Commander'], category:'Tools', featured:false, githubUrl:'#', demoUrl:'', image:'' },
]

const PLACEHOLDER_GRADIENT = [
  'from-orange-900/40 to-space-800',
  'from-navy-900/40 to-space-800',
  'from-gold-900/40 to-space-800',
]

function ProjectCard({ project, index, onOpen }) {
  const [hovered, setHovered] = useState(false)
  const grad = PLACEHOLDER_GRADIENT[index % PLACEHOLDER_GRADIENT.length]

  return (
    <motion.article
      variants={staggerItem}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="card group cursor-pointer flex flex-col overflow-hidden hover:border-orange-500/30 transition-all duration-400"
      style={{ boxShadow: hovered ? '0 16px 48px rgba(249,115,22,0.12)' : undefined }}
      onClick={() => onOpen(project)}
    >
      {/* Image / Placeholder */}
      <div className={`relative h-48 bg-gradient-to-br ${grad} overflow-hidden flex-shrink-0`}>
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Github size={28} className="text-slate-600" />
            </div>
          </div>
        )}
        {project.featured && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-medium backdrop-blur-sm">
            <Star size={10} className="fill-orange-400" /> Featured
          </div>
        )}
        {/* Hover overlay */}
        <div className={`absolute inset-0 bg-space-900/60 flex items-center justify-center gap-3 transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
          <a href={project.githubUrl} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="p-2.5 rounded-xl glass border border-white/10 text-white hover:text-orange-400 transition-colors">
            <Github size={18} />
          </a>
          {project.demoUrl && (
            <a href={project.demoUrl} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="p-2.5 rounded-xl glass border border-white/10 text-white hover:text-orange-400 transition-colors">
              <ExternalLink size={18} />
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors duration-200 leading-tight">{project.title}</h3>
          {project.category && <span className="tag text-xs flex-shrink-0">{project.category}</span>}
        </div>
        <p className="text-slate-400 text-sm leading-relaxed flex-1">{project.shortDescription}</p>
        <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
          {project.technologies?.slice(0, 4).map(t => (
            <span key={t} className="px-2 py-0.5 rounded-md text-xs font-mono bg-white/5 border border-white/8 text-slate-400">{t}</span>
          ))}
          {project.technologies?.length > 4 && (
            <span className="px-2 py-0.5 rounded-md text-xs font-mono bg-white/5 border border-white/8 text-slate-500">+{project.technologies.length - 4}</span>
          )}
        </div>
        <button className="flex items-center gap-1.5 text-orange-400 text-xs font-medium mt-1 hover:gap-2.5 transition-all duration-200">
          View Details <ArrowRight size={13} />
        </button>
      </div>
    </motion.article>
  )
}

function ProjectModal({ project, onClose }) {
  if (!project) return null
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-space-900/80 backdrop-blur-md" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative card border border-white/10 max-w-2xl w-full max-h-[85vh] overflow-y-auto z-10"
          onClick={e => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors z-10">
            <X size={18} />
          </button>

          {project.image && (
            <img src={project.image} alt={project.title} className="w-full h-56 object-cover rounded-t-2xl" />
          )}

          <div className="p-6 space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">{project.title}</h2>
              {project.category && <span className="tag">{project.category}</span>}
            </div>
            <p className="text-slate-400 leading-relaxed">{project.description || project.shortDescription}</p>

            {project.technologies?.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-widest text-orange-400 mb-2">Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map(t => <span key={t} className="tag">{t}</span>)}
                </div>
              </div>
            )}

            {project.features?.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-widest text-orange-400 mb-2">Key Features</h4>
                <ul className="space-y-1.5">
                  {project.features.map((f, i) => <li key={i} className="flex items-start gap-2 text-sm text-slate-400"><span className="text-orange-500 mt-0.5">▸</span>{f}</li>)}
                </ul>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noreferrer" className="btn-secondary flex-1 justify-center text-sm py-2.5">
                  <Github size={16} /> GitHub
                </a>
              )}
              {project.demoUrl && (
                <a href={project.demoUrl} target="_blank" rel="noreferrer" className="btn-primary flex-1 justify-center text-sm py-2.5">
                  <ExternalLink size={16} /> Live Demo
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function Projects() {
  const { projects: apiProjects, loading } = usePortfolio()
  const [selected, setSelected] = useState(null)
  const [filter, setFilter]     = useState('All')

  const projects = apiProjects.length > 0 ? apiProjects : FALLBACK_PROJECTS
  const categories = ['All', ...new Set(projects.map(p => p.category).filter(Boolean))]
  const displayed  = filter === 'All' ? projects : projects.filter(p => p.category === filter)

  return (
    <section id="projects" className="section-padding relative">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(249,115,22,0.04) 0%, transparent 70%)' }} aria-hidden="true" />
      <div className="section-container">
        <SectionHeading eyebrow="My Work" title="Featured Projects" subtitle="A curated collection of things I've built — each one taught me something new." />

        {/* Filter tabs */}
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${filter === cat ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' : 'text-slate-500 hover:text-slate-300 border border-white/5 hover:border-white/10'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

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
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {displayed.map((p, i) => (
              <ProjectCard key={p._id} project={p} index={i} onOpen={setSelected} />
            ))}
          </motion.div>
        )}

        {displayed.length === 0 && !loading && (
          <div className="text-center py-20 text-slate-600">No projects in this category yet.</div>
        )}
      </div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  )
}
