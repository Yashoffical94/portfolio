import { motion } from 'framer-motion'
import { fadeInUp } from '../animations/variants'

export default function SectionHeading({ eyebrow, title, subtitle, align = 'center' }) {
  const alignClass = align === 'center' ? 'text-center items-center' : 'text-left items-start'
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className={`flex flex-col ${alignClass} mb-16`}
    >
      {eyebrow && (
        <span className="section-eyebrow mb-3">{eyebrow}</span>
      )}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
      {align === 'center' && (
        <div className="mt-6 h-1 w-16 rounded-full bg-gradient-to-r from-orange-500 to-gold-500" />
      )}
    </motion.div>
  )
}
