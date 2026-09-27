import { useState } from 'react'
import { KeyRound, Save, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react'
import { changePassword } from '../../services/api'
import { useAuth } from '../../context/useAuth'

export default function AdminSettings() {
  const { admin } = useAuth()
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [show, setShow] = useState({ current: false, next: false })
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')
  const [ok, setOk] = useState(false)

  const ch = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const mismatch = form.confirm && form.newPassword !== form.confirm
  const canSubmit =
    form.currentPassword && form.newPassword.length >= 8 && form.newPassword === form.confirm

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    setSaving(true); setErr(''); setOk(false)
    try {
      await changePassword(form.currentPassword, form.newPassword)
      setOk(true)
      setForm({ currentPassword: '', newPassword: '', confirm: '' })
    } catch (e2) {
      setErr(e2.response?.data?.message || 'Failed to update password')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5 max-w-xl">
      <div>
        <h2 className="text-2xl font-black text-white">Settings</h2>
        <p className="text-slate-500 text-sm">Manage your admin account</p>
      </div>

      {/* Account summary */}
      <div className="card p-5">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
            <KeyRound size={18} />
          </div>
          <div>
            <div className="text-sm font-medium text-white">{admin?.name || 'Admin'}</div>
            <div className="text-xs text-slate-500">{admin?.email}</div>
          </div>
        </div>
      </div>

      {/* Change password */}
      <form onSubmit={handleSubmit} className="card p-5 space-y-4">
        <div>
          <h3 className="font-bold text-white text-sm">Change Password</h3>
          <p className="text-slate-500 text-xs mt-0.5">Minimum 8 characters</p>
        </div>

        {err && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            <AlertCircle size={13} />{err}
          </div>
        )}
        {ok && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs">
            <CheckCircle2 size={13} />Password updated successfully
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Current password</label>
          <div className="relative">
            <input
              name="currentPassword" type={show.current ? 'text' : 'password'} value={form.currentPassword}
              onChange={ch} className="field-input pr-10" autoComplete="current-password"
            />
            <button type="button" onClick={() => setShow(s => ({ ...s, current: !s.current }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
              {show.current ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">New password</label>
          <div className="relative">
            <input
              name="newPassword" type={show.next ? 'text' : 'password'} value={form.newPassword}
              onChange={ch} className="field-input pr-10" autoComplete="new-password"
            />
            <button type="button" onClick={() => setShow(s => ({ ...s, next: !s.next }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
              {show.next ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          {form.newPassword && form.newPassword.length < 8 && (
            <p className="text-xs text-amber-400/80 mt-1.5">At least 8 characters</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Confirm new password</label>
          <input
            name="confirm" type="password" value={form.confirm}
            onChange={ch} className="field-input" autoComplete="new-password"
          />
          {mismatch && <p className="text-xs text-red-400 mt-1.5">Passwords don't match</p>}
        </div>

        <button type="submit" disabled={!canSubmit || saving}
          className="btn-primary text-sm px-4 py-2 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2">
          {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
          {saving ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  )
}
