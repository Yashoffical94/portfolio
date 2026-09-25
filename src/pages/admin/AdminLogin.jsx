import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Mail, Eye, EyeOff, Zap, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function AdminLogin() {
  const { login, isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()

  const [form,    setForm]    = useState({ email: '', password: '' })
  const [show,    setShow]    = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error,   setError]   = useState('')

  useEffect(() => {
    if (!loading && isAuthenticated) navigate('/admin/dashboard', { replace: true })
  }, [isAuthenticated, loading, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) { setError('Both fields are required'); return }
    setSubmitting(true)
    setError('')
    try {
      await login(form.email, form.password)
      navigate('/admin/dashboard', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check credentials.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-space-900 flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-space-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(249,115,22,0.06) 0%, transparent 70%)' }} />
      {/* Rings */}
      {[200, 340, 500].map((s, i) => (
        <div key={s} className="absolute rounded-full border border-orange-500/5" style={{ width: s, height: s, animation: `auraPulse ${4 + i}s ease-in-out infinite`, animationDelay: `${i * 0.7}s` }} />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="card p-8 md:p-10 border border-white/8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center mb-4 shadow-orange-md">
              <Zap size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-black text-white">Admin Access</h1>
            <p className="text-slate-500 text-sm mt-1">Portfolio control panel</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-slate-400 mb-2">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="email" name="email" type="email" autoComplete="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="admin@portfolio.com"
                  className="field-input pl-10"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-slate-400 mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="password" name="password" type={show ? 'text' : 'password'} autoComplete="current-password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  className="field-input pl-10 pr-10"
                />
                <button type="button" onClick={() => setShow(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <AlertCircle size={15} className="flex-shrink-0" />{error}
              </div>
            )}

            <button type="submit" disabled={submitting}
              className="btn-primary w-full justify-center py-3.5 disabled:opacity-60 disabled:cursor-not-allowed">
              {submitting
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
                : <><Lock size={16} /> Sign In</>
              }
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
