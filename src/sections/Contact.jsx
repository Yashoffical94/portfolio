import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MapPin, Github, Linkedin, Instagram, Send, CheckCircle, AlertCircle, Zap } from 'lucide-react'
import SectionHeading from '../components/SectionHeading'
import { usePortfolio } from '../context/PortfolioContext'
import { submitContact } from '../services/api'
import { fadeInLeft, fadeInRight } from '../animations/variants'

const EMPTY = { name:'', email:'', subject:'', message:'', company:'' }

export default function Contact() {
  const { profile, socials } = usePortfolio()
  const [form,   setForm]    = useState(EMPTY)
  const [errors, setErrors]  = useState({})
  const [status, setStatus]  = useState(null) // null | 'loading' | 'success' | 'error'
  const [errMsg, setErrMsg]  = useState('')

  const validate = () => {
    const e = {}
    if (!form.name.trim())                               e.name    = 'Name is required'
    if (!form.email.trim())                              e.email   = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email'
    if (!form.message.trim())                            e.message = 'Message is required'
    else if (form.message.trim().length < 20)            e.message = 'Message too short (20 chars min)'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!validate()) return
    setStatus('loading')
    try {
      await submitContact(form)
      setStatus('success')
      setForm(EMPTY)
    } catch (err) {
      setStatus('error')
      setErrMsg(err.response?.data?.message || 'Failed to send. Please email me directly.')
    }
  }

  const SOCIAL_ICONS = { github: Github, linkedin: Linkedin, instagram: Instagram, email: Mail }

  const fieldClass = (name) =>
    `field-input ${errors[name] ? 'border-red-500/50 focus:border-red-500' : ''}`

  return (
    <section id="contact" className="section-padding relative">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(249,115,22,0.06) 0%, transparent 60%)' }} aria-hidden="true" />
      <div className="section-container">
        <SectionHeading eyebrow="Get In Touch" title="Contact Me" subtitle="Have a project, idea, or just want to say hi? My inbox is open." />

        <div className="grid md:grid-cols-5 gap-12 max-w-5xl mx-auto">

          {/* Left — info */}
          <motion.div variants={fadeInLeft} initial="hidden" whileInView="visible" viewport={{ once: true }} className="md:col-span-2 space-y-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-3">Let's build something together</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                I'm currently open to new opportunities, freelance projects, and interesting collaborations. If you have an idea or need a developer, reach out!
              </p>
            </div>

            <div className="space-y-4">
              {profile?.email && (
                <a href={`mailto:${profile.email}`} className="flex items-center gap-3 text-slate-400 hover:text-orange-400 transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/20 transition-colors">
                    <Mail size={16} className="text-orange-400" />
                  </div>
                  <span className="text-sm">{profile.email}</span>
                </a>
              )}
              {profile?.location && (
                <div className="flex items-center gap-3 text-slate-400">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                    <MapPin size={16} className="text-slate-500" />
                  </div>
                  <span className="text-sm">{profile.location}</span>
                </div>
              )}
            </div>

            {/* Social links */}
            <div>
              <p className="text-xs text-slate-600 uppercase tracking-widest mb-3">Find me on</p>
              <div className="flex gap-2">
                {socials.filter(s => s.visible !== false).map(s => {
                  const key  = s.platform?.toLowerCase()
                  const Icon = SOCIAL_ICONS[key]
                  if (!Icon) return null
                  return (
                    <a key={s._id} href={s.url} target="_blank" rel="noreferrer"
                      className="p-2.5 rounded-xl glass border border-white/5 text-slate-500 hover:text-orange-400 hover:border-orange-500/20 transition-all duration-200">
                      <Icon size={18} />
                    </a>
                  )
                })}
              </div>
            </div>

            {profile?.available && (
              <div className="card p-4 border border-green-500/20">
                <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  Available for work
                </div>
                <p className="text-slate-500 text-xs mt-1">Open to full-time, internships and freelance.</p>
              </div>
            )}
          </motion.div>

          {/* Right — form */}
          <motion.div variants={fadeInRight} initial="hidden" whileInView="visible" viewport={{ once: true }} className="md:col-span-3">

            {status === 'success' ? (
              <div className="card p-10 text-center flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle size={32} className="text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Message Sent!</h3>
                <p className="text-slate-400 text-sm">Thanks for reaching out. I'll get back to you soon.</p>
                <button onClick={() => setStatus(null)} className="btn-secondary text-sm px-5 py-2">Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="card p-6 md:p-8 space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-xs font-medium text-slate-400 mb-1.5">Name *</label>
                    <input id="name" name="name" type="text" value={form.name} onChange={handleChange} placeholder="John Doe" className={fieldClass('name')} />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-medium text-slate-400 mb-1.5">Email *</label>
                    <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@example.com" className={fieldClass('email')} />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>
                <div>
                  <label htmlFor="company" className="block text-xs font-medium text-slate-400 mb-1.5">Company <span className="text-slate-600">(optional)</span></label>
                  <input id="company" name="company" type="text" value={form.company} onChange={handleChange} placeholder="Acme Corp" className="field-input" />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-xs font-medium text-slate-400 mb-1.5">Subject</label>
                  <input id="subject" name="subject" type="text" value={form.subject} onChange={handleChange} placeholder="Project inquiry, collaboration..." className="field-input" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-xs font-medium text-slate-400 mb-1.5">Message *</label>
                  <textarea id="message" name="message" rows={5} value={form.message} onChange={handleChange} placeholder="Tell me about your project or what you'd like to discuss..." className={`${fieldClass('message')} resize-none`} />
                  {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
                </div>

                {status === 'error' && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                    <span>{errMsg}</span>
                  </div>
                )}

                <button type="submit" disabled={status === 'loading'} className="btn-primary w-full justify-center py-3.5 disabled:opacity-60 disabled:cursor-not-allowed">
                  {status === 'loading' ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                  ) : (
                    <><Send size={17} /> Send Message</>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
