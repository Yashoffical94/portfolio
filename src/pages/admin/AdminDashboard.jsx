import { useState } from 'react'
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, User, FolderKanban, Wrench, Briefcase,
  Trophy, Link2, MessageSquare, LogOut, Menu, X, Zap, ExternalLink, Bell
} from 'lucide-react'
import { useAuth } from '../../context/useAuth'

// Lazy sub-sections of admin
import AdminOverview     from '../../components/admin/AdminOverview'
import AdminProfile      from '../../components/admin/AdminProfile'
import AdminProjects     from '../../components/admin/AdminProjects'
import AdminSkills       from '../../components/admin/AdminSkills'
import AdminExperience   from '../../components/admin/AdminExperience'
import AdminAchievements from '../../components/admin/AdminAchievements'
import AdminSocials      from '../../components/admin/AdminSocials'
import AdminMessages     from '../../components/admin/AdminMessages'

const NAV = [
  { icon: LayoutDashboard, label: 'Overview',     path: ''            },
  { icon: User,            label: 'Profile',      path: 'profile'     },
  { icon: FolderKanban,   label: 'Projects',     path: 'projects'    },
  { icon: Wrench,          label: 'Skills',       path: 'skills'      },
  { icon: Briefcase,       label: 'Experience',   path: 'experience'  },
  { icon: Trophy,          label: 'Achievements', path: 'achievements'},
  { icon: Link2,           label: 'Social Links', path: 'socials'     },
  { icon: MessageSquare,   label: 'Messages',     path: 'messages'    },
]

function Sidebar({ collapsed, setCollapsed }) {
  const location  = useLocation()
  const navigate  = useNavigate()
  const { admin, logout } = useAuth()
  const base = '/admin/dashboard'

  const isActive = (path) => {
    const full = path ? `${base}/${path}` : base
    return location.pathname === full || (path === '' && location.pathname === base)
  }

  const handleLogout = () => { logout(); navigate('/admin') }

  return (
    <aside className={`flex flex-col h-full bg-space-800 border-r border-white/5 transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/5">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center">
              <Zap size={14} className="text-white" />
            </div>
            <span className="font-bold text-white text-sm">Admin</span>
          </div>
        )}
        <button onClick={() => setCollapsed(c => !c)} className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors ml-auto">
          {collapsed ? <Menu size={16} /> : <X size={16} />}
        </button>
      </div>

      {/* Admin info */}
      {!collapsed && admin && (
        <div className="px-4 py-3 border-b border-white/5">
          <div className="text-xs text-slate-500 truncate">{admin.email}</div>
          <div className="text-sm font-medium text-slate-300 truncate">{admin.name || 'Admin'}</div>
        </div>
      )}

      {/* Nav links */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {NAV.map(({ icon: Icon, label, path }) => {
          const active = isActive(path)
          return (
            <Link
              key={path}
              to={path ? `${base}/${path}` : base}
              title={collapsed ? label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                  : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={17} className="flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-2 py-3 border-t border-white/5 space-y-1">
        <a href="/" target="_blank" rel="noreferrer" title="View site"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:text-white hover:bg-white/5 transition-all duration-200">
          <ExternalLink size={16} className="flex-shrink-0" />
          {!collapsed && <span>View Site</span>}
        </a>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200">
          <LogOut size={16} className="flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}

export default function AdminDashboard() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen bg-space-900 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-shrink-0">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setMobileOpen(false)} />
            <motion.div initial={{ x:-280 }} animate={{ x:0 }} exit={{ x:-280 }} transition={{ type:'spring', damping:25 }}
              className="md:hidden fixed left-0 top-0 bottom-0 z-50 flex w-60">
              <Sidebar collapsed={false} setCollapsed={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex-shrink-0 h-14 flex items-center px-4 md:px-6 border-b border-white/5 bg-space-800/50 backdrop-blur-sm gap-4">
          <button onClick={() => setMobileOpen(true)} className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
            <Menu size={18} />
          </button>
          <h1 className="text-sm font-semibold text-slate-300">Portfolio Admin</h1>
          <div className="ml-auto flex items-center gap-2">
            <a href="/" target="_blank" rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 hover:text-orange-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-orange-500/5">
              <ExternalLink size={13} /> View Portfolio
            </a>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Routes>
            <Route index              element={<AdminOverview />} />
            <Route path="profile"     element={<AdminProfile />} />
            <Route path="projects"    element={<AdminProjects />} />
            <Route path="skills"      element={<AdminSkills />} />
            <Route path="experience"  element={<AdminExperience />} />
            <Route path="achievements"element={<AdminAchievements />} />
            <Route path="socials"     element={<AdminSocials />} />
            <Route path="messages"    element={<AdminMessages />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
