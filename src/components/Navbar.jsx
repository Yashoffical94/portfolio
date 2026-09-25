import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Code2, Zap } from 'lucide-react'
import { useScrollSpy } from '../hooks/useScrollSpy'
import { cn } from '../utils/helpers'

const NAV_LINKS = [
  { label: 'Home',         href: '/#hero'         },
  { label: 'About',        href: '/#about'         },
  { label: 'Skills',       href: '/#skills'        },
  { label: 'Projects',     href: '/#projects'      },
  { label: 'Experience',   href: '/#experience'    },
  { label: 'Achievements', href: '/#achievements'  },
  { label: 'Contact',      href: '/#contact'       },
]

export default function Navbar() {
  const [isOpen,    setIsOpen]    = useState(false)
  const [scrolled,  setScrolled]  = useState(false)
  const location = useLocation()
  const isHome   = location.pathname === '/'

  const activeId = useScrollSpy(
    ['hero','about','skills','projects','experience','achievements','contact'],
    80
  )

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavClick = (href) => {
    setIsOpen(false)
    if (!isHome && href.startsWith('/#')) {
      return // react-router Link handles navigation
    }
    if (href.startsWith('/#')) {
      const id = href.replace('/#', '')
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const isActive = (href) => {
    const id = href.replace('/#', '')
    return activeId === id
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-space-900/90 backdrop-blur-md border-b border-white/5 shadow-lg'
          : 'bg-transparent'
      )}
    >
      <div className="section-container">
        <nav className="flex items-center justify-between h-16 md:h-18">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center shadow-orange-sm group-hover:shadow-orange-md transition-all duration-300">
                <Code2 size={16} className="text-white" />
              </div>
              <div className="absolute inset-0 rounded-lg bg-orange-500/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">
              Portfolio<span className="text-orange-500">.</span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <ul className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={cn(
                    'nav-link px-4 py-2 rounded-lg text-sm',
                    isActive(link.href) && 'active'
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-3">
            <Link
              to="/#contact"
              onClick={() => handleNavClick('/#contact')}
              className="hidden md:flex btn-primary text-sm px-4 py-2 gap-1.5"
            >
              <Zap size={14} />
              Hire Me
            </Link>
            <button
              onClick={() => setIsOpen((o) => !o)}
              aria-label="Toggle menu"
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden border-t border-white/5 bg-space-900/95 backdrop-blur-md"
          >
            <ul className="section-container py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className={cn(
                      'block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                      isActive(link.href)
                        ? 'text-orange-400 bg-orange-500/10'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link
                  to="/#contact"
                  onClick={() => handleNavClick('/#contact')}
                  className="btn-primary w-full justify-center"
                >
                  <Zap size={15} />
                  Hire Me
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
