import { useState, useEffect } from 'react'
import { Save, AlertCircle, CheckCircle } from 'lucide-react'
import { getProfile, updateProfile } from '../../services/api'

const FIELDS = [
  { name: 'name',              label: 'Full Name',          type: 'text'     },
  { name: 'title',             label: 'Developer Title',    type: 'text'     },
  { name: 'email',             label: 'Contact Email',      type: 'email'    },
  { name: 'location',          label: 'Location',           type: 'text'     },
  { name: 'avatar',            label: 'Avatar URL',         type: 'text'     },
  { name: 'resume',            label: 'Resume URL',         type: 'text'     },
  { name: 'heroTagline',       label: 'Hero Tagline',       type: 'text'     },
  { name: 'yearsOfExperience', label: 'Years of Experience',type: 'text'     },
  { name: 'projectsCompleted', label: 'Projects Completed', type: 'text'     },
  { name: 'technologiesUsed',  label: 'Technologies Used',  type: 'text'     },
]

export default function AdminProfile() {
  const [form,   setForm]   = useState({})
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [status,  setStatus]  = useState(null)
  const [err,     setErr]     = useState('')

  useEffect(() => {
    getProfile()
      .then(({ data }) => setForm(data.profile || {}))
      .catch(() => setErr('Could not load profile'))
      .finally(() => setLoading(false))
  }, [])

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  const handleToggle = e => setForm(f => ({ ...f, [e.target.name]: e.target.checked }))

  const handleSave = async () => {
    setSaving(true); setStatus(null)
    try {
      await updateProfile(form)
      setStatus('success')
      setTimeout(() => setStatus(null), 3000)
    } catch {
      setStatus('error')
      setErr('Failed to save profile')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" /></div>

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">Profile</h2>
          <p className="text-slate-500 text-sm">Update your public portfolio information.</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary text-sm px-4 py-2 disabled:opacity-60">
          {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={15} />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {status === 'success' && <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm"><CheckCircle size={15}/>Profile saved successfully!</div>}
      {status === 'error'   && <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"><AlertCircle size={15}/>{err}</div>}

      <div className="card p-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          {FIELDS.map(({ name, label, type }) => (
            <div key={name} className={name === 'heroTagline' ? 'sm:col-span-2' : ''}>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
              <input name={name} type={type} value={form[name] || ''} onChange={handleChange} className="field-input" />
            </div>
          ))}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Hero Subtitle</label>
          <textarea name="heroSubtitle" rows={2} value={form.heroSubtitle || ''} onChange={handleChange} className="field-input resize-none" />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Bio (short)</label>
          <textarea name="bio" rows={3} value={form.bio || ''} onChange={handleChange} className="field-input resize-none" />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">About Section Text</label>
          <textarea name="aboutText" rows={5} value={form.aboutText || ''} onChange={handleChange} className="field-input resize-none" />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" name="available" checked={!!form.available} onChange={handleToggle} className="sr-only peer" />
            <div className="w-10 h-5 bg-slate-700 peer-checked:bg-orange-500 rounded-full transition-colors peer-focus:ring-2 peer-focus:ring-orange-500/30" />
            <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
          </label>
          <span className="text-sm text-slate-300">Available for opportunities</span>
        </div>
      </div>
    </div>
  )
}
