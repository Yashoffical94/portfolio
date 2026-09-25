import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FolderKanban, Wrench, Briefcase, Trophy, MessageSquare, Link2, ArrowRight } from 'lucide-react'
import { getProjects, getSkills, getExperience, getAchievements, getMessages, getAllSocials } from '../../services/api'

function StatCard({ icon: Icon, label, value, to, color }) {
  return (
    <Link to={to} className="card p-5 flex items-center gap-4 hover:border-orange-500/20 transition-all duration-300 group">
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
        <Icon size={20} className="text-white" />
      </div>
      <div className="flex-1">
        <div className="text-2xl font-black text-white">{value ?? '—'}</div>
        <div className="text-xs text-slate-500">{label}</div>
      </div>
      <ArrowRight size={15} className="text-slate-700 group-hover:text-orange-400 transition-colors" />
    </Link>
  )
}

export default function AdminOverview() {
  const [counts, setCounts] = useState({})
  const [unread, setUnread] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([
      getProjects(), getSkills(), getExperience(),
      getAchievements(), getMessages(), getAllSocials()
    ]).then(([pr, sk, ex, ac, mg, so]) => {
      setCounts({
        projects:     pr.status === 'fulfilled' ? pr.value.data.count : '?',
        skills:       sk.status === 'fulfilled' ? sk.value.data.skills?.length : '?',
        experience:   ex.status === 'fulfilled' ? ex.value.data.experience?.length : '?',
        achievements: ac.status === 'fulfilled' ? ac.value.data.achievements?.length : '?',
        socials:      so.status === 'fulfilled' ? so.value.data.socials?.length : '?',
      })
      if (mg.status === 'fulfilled') {
        setUnread(mg.value.data.messages?.filter(m => !m.read).length || 0)
        setCounts(c => ({ ...c, messages: mg.value.data.count }))
      }
    }).finally(() => setLoading(false))
  }, [])

  const STATS = [
    { icon: FolderKanban,  label: 'Projects',     value: counts.projects,     to: '/admin/dashboard/projects',     color: 'bg-orange-500/20' },
    { icon: Wrench,         label: 'Skills',       value: counts.skills,       to: '/admin/dashboard/skills',       color: 'bg-navy-600/20'   },
    { icon: Briefcase,      label: 'Experience',   value: counts.experience,   to: '/admin/dashboard/experience',   color: 'bg-gold-500/20'   },
    { icon: Trophy,         label: 'Achievements', value: counts.achievements, to: '/admin/dashboard/achievements', color: 'bg-purple-500/20' },
    { icon: MessageSquare,  label: `Messages${unread > 0 ? ` (${unread} new)` : ''}`, value: counts.messages, to: '/admin/dashboard/messages', color: 'bg-green-500/20' },
    { icon: Link2,          label: 'Social Links', value: counts.socials,      to: '/admin/dashboard/socials',      color: 'bg-teal-500/20'   },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white mb-1">Dashboard</h2>
        <p className="text-slate-500 text-sm">Overview of your portfolio content.</p>
      </div>
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {STATS.map(s => <StatCard key={s.label} {...s} />)}
        </div>
      )}

      <div className="card p-5 border border-orange-500/10">
        <h3 className="text-sm font-semibold text-orange-400 mb-2">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          <Link to="/admin/dashboard/projects" className="btn-secondary text-xs px-3 py-1.5">+ Add Project</Link>
          <Link to="/admin/dashboard/skills"   className="btn-secondary text-xs px-3 py-1.5">+ Add Skill</Link>
          <Link to="/admin/dashboard/messages" className="btn-secondary text-xs px-3 py-1.5">View Messages</Link>
          <a href="/" target="_blank" rel="noreferrer" className="btn-ghost text-xs px-3 py-1.5">Preview Portfolio ↗</a>
        </div>
      </div>
    </div>
  )
}
