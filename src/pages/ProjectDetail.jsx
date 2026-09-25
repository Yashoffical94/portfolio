import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Github, ExternalLink, Calendar, Tag, ChevronRight } from 'lucide-react'
import MainLayout from '../layouts/MainLayout'
import { getProject } from '../services/api'
import { formatDate } from '../utils/helpers'

export default function ProjectDetail() {
  const { id }        = useParams()
  const navigate      = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    setLoading(true)
    getProject(id)
      .then(({ data }) => setProject(data.project))
      .catch(() => setError('Project not found'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
      </div>
    </MainLayout>
  )

  if (error || !project) return (
    <MainLayout>
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-white">Project Not Found</h2>
        <Link to="/#projects" className="btn-primary">Back to Projects</Link>
      </div>
    </MainLayout>
  )

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen pt-24 pb-20"
      >
        <div className="section-container max-w-4xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-8">
            <Link to="/" className="hover:text-orange-400 transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link to="/#projects" className="hover:text-orange-400 transition-colors">Projects</Link>
            <ChevronRight size={14} />
            <span className="text-slate-300">{project.title}</span>
          </div>

          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-orange-400 transition-colors mb-8 group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back
          </button>

          {/* Hero image */}
          {project.image && (
            <div className="rounded-2xl overflow-hidden mb-10 border border-white/8">
              <img src={project.image} alt={project.title} className="w-full max-h-96 object-cover" />
            </div>
          )}

          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-2">{project.title}</h1>
              {project.category && <span className="tag">{project.category}</span>}
            </div>
            <div className="flex gap-3 flex-wrap">
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noreferrer" className="btn-secondary text-sm px-4 py-2.5">
                  <Github size={16} /> GitHub
                </a>
              )}
              {project.demoUrl && (
                <a href={project.demoUrl} target="_blank" rel="noreferrer" className="btn-primary text-sm px-4 py-2.5">
                  <ExternalLink size={16} /> Live Demo
                </a>
              )}
            </div>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap gap-6 text-sm text-slate-500 mb-10 pb-10 border-b border-white/5">
            {project.date && (
              <div className="flex items-center gap-2"><Calendar size={14} />{formatDate(project.date)}</div>
            )}
            {project.status && (
              <div className="flex items-center gap-2"><Tag size={14} /><span className="capitalize">{project.status}</span></div>
            )}
          </div>

          {/* Description */}
          <div className="prose prose-invert max-w-none mb-10">
            <p className="text-slate-300 text-lg leading-relaxed">{project.description || project.shortDescription}</p>
          </div>

          {/* Technologies */}
          {project.technologies?.length > 0 && (
            <div className="mb-10">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-orange-400 mb-3">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
          )}

          {/* Problem / Solution */}
          {(project.problem || project.solution) && (
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              {project.problem && (
                <div className="card p-5">
                  <h3 className="text-sm font-semibold text-orange-400 uppercase tracking-widest mb-3">The Problem</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{project.problem}</p>
                </div>
              )}
              {project.solution && (
                <div className="card p-5 border-orange-500/20">
                  <h3 className="text-sm font-semibold text-orange-400 uppercase tracking-widest mb-3">The Solution</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{project.solution}</p>
                </div>
              )}
            </div>
          )}

          {/* Features */}
          {project.features?.length > 0 && (
            <div className="mb-10">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-orange-400 mb-4">Key Features</h3>
              <ul className="grid sm:grid-cols-2 gap-2">
                {project.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                    <span className="text-orange-500 mt-0.5 flex-shrink-0">▸</span>{f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Challenges + Learnings */}
          {(project.challenges || project.learnings) && (
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              {project.challenges && (
                <div className="card p-5">
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-3">Challenges</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{project.challenges}</p>
                </div>
              )}
              {project.learnings && (
                <div className="card p-5">
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-3">What I Learned</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{project.learnings}</p>
                </div>
              )}
            </div>
          )}

          {/* Gallery */}
          {project.gallery?.length > 0 && (
            <div className="mb-10">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-orange-400 mb-4">Screenshots</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {project.gallery.map((img, i) => (
                  <div key={i} className="rounded-xl overflow-hidden border border-white/8">
                    <img src={img} alt={`${project.title} screenshot ${i + 1}`} className="w-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="pt-10 border-t border-white/5 flex flex-wrap gap-4">
            <Link to="/#projects" className="btn-secondary text-sm"><ArrowLeft size={15}/> All Projects</Link>
            <Link to="/#contact"  className="btn-primary text-sm">Discuss This Project</Link>
          </div>
        </div>
      </motion.div>
    </MainLayout>
  )
}
