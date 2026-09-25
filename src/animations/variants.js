// Framer Motion animation variants — Goku Portfolio

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const none = { opacity: 1, x: 0, y: 0, scale: 1 }

// ── Basic fades ───────────────────────────────────────
export const fadeIn = {
  hidden:  prefersReducedMotion ? none : { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
}

export const fadeInUp = {
  hidden:  prefersReducedMotion ? none : { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export const fadeInDown = {
  hidden:  prefersReducedMotion ? none : { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export const fadeInLeft = {
  hidden:  prefersReducedMotion ? none : { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export const fadeInRight = {
  hidden:  prefersReducedMotion ? none : { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export const scaleIn = {
  hidden:  prefersReducedMotion ? none : { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

// ── Containers ────────────────────────────────────────
export const staggerContainer = {
  hidden:  {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

export const staggerFast = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.05 } },
}

export const staggerItem = {
  hidden:  prefersReducedMotion ? none : { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

// ── Page transitions ──────────────────────────────────
export const pageTransition = {
  initial: prefersReducedMotion ? {} : { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit:    prefersReducedMotion ? {} : { opacity: 0, y: -10 },
  transition: { duration: 0.35, ease: 'easeInOut' },
}

// ── Interactive ───────────────────────────────────────
export const cardHover = {
  rest:  { y: 0, scale: 1,    transition: { duration: 0.3, type: 'spring', stiffness: 300 } },
  hover: { y: -8, scale: 1.02, transition: { duration: 0.3, type: 'spring', stiffness: 300 } },
}

export const buttonHover = {
  rest:  { scale: 1 },
  hover: { scale: 1.04 },
  tap:   { scale: 0.97 },
}

export const energyPulse = {
  animate: {
    scale: [1, 1.06, 1],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  },
}

// ── Slide in variants ──────────────────────────────────
export const slideIn = (direction = 'up', delay = 0) => ({
  hidden:  prefersReducedMotion ? none : {
    opacity: 0,
    y: direction === 'up' ? 50 : direction === 'down' ? -50 : 0,
    x: direction === 'left' ? 50 : direction === 'right' ? -50 : 0,
  },
  visible: {
    opacity: 1, y: 0, x: 0,
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
  },
})

// ── Text reveal ───────────────────────────────────────
export const textReveal = {
  hidden:  prefersReducedMotion ? none : { opacity: 0, y: 20, skewY: 3 },
  visible: {
    opacity: 1, y: 0, skewY: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

// ── Number counter ────────────────────────────────────
export const counterVariant = () => ({
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 },
    // Note: actual number animation handled by component
  },
})
