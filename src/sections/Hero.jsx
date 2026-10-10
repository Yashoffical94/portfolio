import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, Github, Linkedin, Instagram, Mail, Zap, Code, Volume2, VolumeX } from 'lucide-react'
import { usePortfolio } from '../context/usePortfolio'

const SOCIAL_ICONS = { github: Github, linkedin: Linkedin, instagram: Instagram, email: Mail }

/**
 * Hero background audio — starts on the user's first interaction
 * (browsers block autoplay with sound). Toggle button bottom-right.
 * Audio file: /assets/hero-audio.mp3 (drop the file in public/assets/).
 */
function HeroAudio() {
  const audioRef  = useRef(null)
  const [on, setOn] = useState(false)
  const [supported] = useState(() => true) // flip to false if no file yet

  const tryPlay = () => {
    const a = audioRef.current
    if (!a) return
    a.volume = 0.45
    a.play()
      .then(() => setOn(true))
      .catch(() => {}) // still blocked — user can use the toggle
  }

  useEffect(() => {
    // first click/keypress anywhere unlocks audio playback
    window.addEventListener('pointerdown', tryPlay, { once: true })
    window.addEventListener('keydown', tryPlay, { once: true })
    return () => {
      window.removeEventListener('pointerdown', tryPlay)
      window.removeEventListener('keydown', tryPlay)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggle = () => {
    const a = audioRef.current
    if (!a) return
    if (on) {
      a.pause()
      setOn(false)
    } else {
      a.volume = 0.45
      a.play().then(() => setOn(true)).catch(() => {})
    }
  }

  if (!supported) return null

  return (
    <>
      <audio ref={audioRef}        src="/assets/hero-audio.m4a" loop preload="none" />
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        onClick={toggle}
        aria-label={on ? 'Mute background music' : 'Play background music'}
        className="absolute bottom-10 right-6 md:right-10 z-20 glass-chip w-12 h-12 text-slate-300 border border-white/10"
      >
        {on ? <Volume2 size={18} /> : <VolumeX size={18} />}
      </motion.button>
    </>
  )
}

export default function Hero() {
  const { profile, socials } = usePortfolio()

  const name      = profile?.name        || 'Your Name'
  const tagline   = profile?.heroTagline || 'I BUILD DIGITAL POWER.'
  const subtitle  = profile?.heroSubtitle || "I'm a developer focused on building software, AI-powered systems and real-world products."
  const available = profile?.available   ?? true
  const stats = [
    { label: 'Years Exp.',  value: profile?.yearsOfExperience  || '3+'  },
    { label: 'Projects',    value: profile?.projectsCompleted   || '20+' },
    { label: 'Technologies',value: profile?.technologiesUsed    || '15+' },
  ]

  // Split tagline into words for stagger animation
  const words = tagline.split(' ')

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Video background (180° from previous CW rotation — content flipped) */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/assets/hero-bg-landscape-180.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />

      {/* Left-heavy scrim — text lives on the left, character art breathes on the right */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.55) 38%, rgba(0,0,0,0.25) 62%, rgba(0,0,0,0.15) 100%)' }}
        aria-hidden="true"
 />

      {/* Content — left-anchored so the eye lands here first */}
      <div className="section-container relative z-10 w-full py-32 md:py-40 flex flex-col items-start text-left">

        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-14 md:mt-20 mb-6"
        >
          {available && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-green-500/20 text-green-400 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Available for building
            </div>
          )}
        </motion.div>

        {/* Name — accent bar gives the copy a strong left rail */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-3 mb-3"
        >
          <span className="h-px w-10 bg-orange-400" aria-hidden="true" />
          <p className="text-slate-400 text-lg font-mono">
            Hi, I am <span className="text-orange-400 font-semibold">{name}</span>
          </p>
        </motion.div>

        {/* Headline — word by word */}
        <motion.h1
          className="text-5xl sm:text-7xl lg:text-8xl font-black leading-[1.05] tracking-tight mb-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
          }}
        >
          {words.map((word, i) => (
            <motion.span
              key={i}
              className={`inline-block mr-4 ${i === words.length - 1 ? 'text-gradient-orange' : 'text-white'}`}
              variants={{
                hidden:  { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22,1,0.36,1] } },
              }}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-slate-300/90 text-lg md:text-xl max-w-xl leading-relaxed mb-10"
        >
          {subtitle}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.75 }}
          className="flex flex-wrap items-center gap-4 mb-14"
        >
          <a href="#projects" className="btn-primary glass-sheen text-base px-8 py-3.5">
            <Code size={18} />
            View My Work
          </a>
          <a href="#contact" className="btn-secondary glass-sheen text-base px-8 py-3.5">
            <Zap size={18} />
            Get In Touch
          </a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="flex items-center gap-8 md:gap-10 mb-14 flex-wrap"
        >
          {stats.map((s) => (
            <div key={s.label} className="text-left">
              <div className="text-3xl font-black text-gradient-orange">{s.value}</div>
              <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.05 }}
          className="flex items-center gap-3"
        >
          {socials.length > 0
            ? socials.map((s) => {
                const key = s.platform?.toLowerCase()
                const Icon = SOCIAL_ICONS[key]
                if (!Icon) return null
                return (
                  <a
                    key={s._id}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label || s.platform}
                    className="glass-chip w-11 h-11 border border-white/10"
                  >
                    <Icon size={20} />
                  </a>
                )
              })
            : /* Fallback placeholders */
              [Github, Linkedin, Instagram, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="glass-chip w-11 h-11 border border-white/10 opacity-60"
                >
                  <Icon size={20} />
                </a>
              ))
          }
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 right-6 md:right-10 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-slate-500 uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="text-slate-500"
        >
          <ArrowDown size={18} />
        </motion.div>
      </motion.div>

      {/* Background audio + sound toggle */}
      <HeroAudio />
    </section>
  )
}
