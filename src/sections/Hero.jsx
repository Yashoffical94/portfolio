import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, Github, Linkedin, Instagram, Mail, Zap, Code, Volume2, VolumeX } from 'lucide-react'
import { usePortfolio } from '../context/usePortfolio'

// Lightweight canvas particle system — no external deps
function ParticleCanvas() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas  = canvasRef.current
    if (!canvas) return
    const ctx     = canvas.getContext('2d')
    let animId

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const PARTICLES = Array.from({ length: 60 }, () => ({
      x:    Math.random() * canvas.width,
      y:    Math.random() * canvas.height,
      r:    Math.random() * 1.5 + 0.3,
      vx:   (Math.random() - 0.5) * 0.3,
      vy:   (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.1,
      hue:  Math.random() > 0.6 ? 28 : 210, // orange or blue
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      PARTICLES.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width)  p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 90%, 60%, ${p.alpha})`
        ctx.fill()
      })
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  )
}

// Rotating aura rings
function AuraRings() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
      {[300, 450, 620, 800].map((size, i) => (
        <div
          key={size}
          className="absolute rounded-full border border-orange-500/10"
          style={{
            width: size, height: size,
            animation: `auraPulse ${3 + i * 0.8}s ease-in-out infinite`,
            animationDelay: `${i * 0.5}s`,
          }}
        />
      ))}
      {/* Core energy orb */}
      <div
        className="absolute w-64 h-64 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, rgba(249,115,22,0.04) 50%, transparent 70%)',
          animation: 'auraPulse 4s ease-in-out infinite',
        }}
      />
    </div>
  )
}

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
        className="absolute bottom-10 right-6 md:right-10 z-20 p-3 rounded-full glass border border-white/10 text-slate-300 hover:text-orange-400 hover:border-orange-500/40 transition-all duration-300"
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
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video background */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/assets/hero-bg-balanced.web.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />

      {/* Dark overlay for text readability (keeps the space theme) */}
      <div className="absolute inset-0 bg-space-900/75" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, rgba(5,8,22,0.85) 0%, rgba(5,8,22,0.55) 45%, rgba(5,8,22,0.9) 100%)' }}
        aria-hidden="true"
      />

      {/* Radial hero glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 60%, rgba(249,115,22,0.08) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* Particles */}
      <ParticleCanvas />

      {/* Aura rings */}
      <AuraRings />

      {/* Content */}
      <div className="section-container relative z-10 py-32 flex flex-col items-center text-center">

        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          {available && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-green-500/20 text-green-400 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Available for building
            </div>
          )}
        </motion.div>

        {/* Name */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-slate-400 text-lg mb-3 font-mono"
        >
          Hi, I am <span className="text-orange-400 font-semibold">{name}</span>
        </motion.p>

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
          className="text-slate-400 text-lg md:text-xl max-w-2xl leading-relaxed mb-12"
        >
          {subtitle}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.75 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-16"
        >
          <a href="#projects" className="btn-primary text-base px-8 py-3.5">
            <Code size={18} />
            View My Work
          </a>
          <a href="#contact" className="btn-secondary text-base px-8 py-3.5">
            <Zap size={18} />
            Get In Touch
          </a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="flex items-center gap-8 mb-16 flex-wrap justify-center"
        >
          {stats.map((s) => (
            <div key={s.label} className="text-center">
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
                    className="p-3 rounded-xl glass border border-white/5 text-slate-400 hover:text-orange-400 hover:border-orange-500/30 hover:shadow-orange-sm transition-all duration-300"
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
                  className="p-3 rounded-xl glass border border-white/5 text-slate-600 hover:text-orange-400 transition-all duration-300"
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
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-slate-600 uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="text-slate-600"
        >
          <ArrowDown size={18} />
        </motion.div>
      </motion.div>

      {/* Background audio + sound toggle */}
      <HeroAudio />
    </section>
  )
}
