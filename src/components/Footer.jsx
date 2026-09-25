import { Link } from 'react-router-dom'
import { Github, Linkedin, Twitter, Instagram, Mail, Code2, Heart, Youtube } from 'lucide-react'
import { usePortfolio } from '../context/usePortfolio'

const ICON_MAP = {
  github:    { icon: Github,    label: 'GitHub'    },
  linkedin:  { icon: Linkedin,  label: 'LinkedIn'  },
  twitter:   { icon: Twitter,   label: 'Twitter/X' },
  instagram: { icon: Instagram, label: 'Instagram' },
  email:     { icon: Mail,      label: 'Email'     },
  youtube:   { icon: Youtube,   label: 'YouTube'   },
}

const NAV = [
  { label: 'About',    href: '/#about'        },
  { label: 'Skills',   href: '/#skills'       },
  { label: 'Projects', href: '/#projects'     },
  { label: 'Contact',  href: '/#contact'      },
]

export default function Footer() {
  const { profile, socials } = usePortfolio()
  const year = new Date().getFullYear()
  const name = profile?.name || 'Developer'

  return (
    <footer className="relative border-t border-white/5 bg-space-800">
      {/* Top glow line */}
      <div className="divider" />

      <div className="section-container py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center">
                <Code2 size={16} className="text-white" />
              </div>
              <span className="font-bold text-white text-lg">{name}<span className="text-orange-500">.</span></span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              {profile?.heroSubtitle || 'Building software, AI-powered systems and real-world products.'}
            </p>
            {/* Social icons from DB */}
            <div className="flex items-center gap-3 pt-2">
              {socials.length > 0
                ? socials.map((s) => {
                    const key = s.platform?.toLowerCase()
                    const IconData = ICON_MAP[key]
                    if (!IconData) return null
                    const { icon: Icon } = IconData
                    return (
                      <a
                        key={s._id}
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={s.label || s.platform}
                        className="p-2 rounded-lg text-slate-500 hover:text-orange-400 hover:bg-orange-500/10 transition-all duration-200"
                      >
                        <Icon size={18} />
                      </a>
                    )
                  })
                : /* fallback placeholders */
                  [Github, Linkedin, Twitter, Instagram].map((Icon, i) => (
                    <span key={i} className="p-2 rounded-lg text-slate-700">
                      <Icon size={18} />
                    </span>
                  ))
              }
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-widest mb-4">
              Navigation
            </h4>
            <ul className="space-y-2">
              {NAV.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-slate-400 hover:text-orange-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-widest mb-4">
              Get In Touch
            </h4>
            <div className="space-y-2">
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-orange-400 transition-colors duration-200"
                >
                  <Mail size={14} />
                  {profile.email}
                </a>
              )}
              {profile?.available && (
                <div className="flex items-center gap-2 mt-4">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-sm text-green-400 font-medium">Available for work</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="divider mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>
            &copy; {year} {name}. Crafted with{' '}
            <Heart size={12} className="inline text-orange-500 fill-orange-500" />{' '}
            and a lot of energy.
          </p>
          <p className="text-xs">
            Built with React + Vite + Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  )
}
