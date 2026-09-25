import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, X, Save, AlertCircle } from 'lucide-react'
import { getExperience, createExperience, updateExperience, deleteExperience } from '../../services/api'

const TYPES = ['job','internship','freelance','opensource','competition','achievement']
const EMPTY = { organization:'', role:'', type:'job', startDate:'', endDate:'', current:false, description:'', technologies:'', url:'', logo:'', order:0 }

function ExpModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState({ ...initial, technologies: Array.isArray(initial.technologies)?initial.technologies.join(', '):initial.technologies||'' })
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')
  const ch = e => setForm(f=>({...f,[e.target.name]:e.target.value}))
  const handleSave = async () => {
    if (!form.organization.trim()||!form.role.trim()) { setErr('Organization and role required'); return }
    setSaving(true); setErr('')
    try {
      const p = {...form, technologies: typeof form.technologies==='string'?form.technologies.split(',').map(t=>t.trim()).filter(Boolean):form.technologies}
      await onSave(p)
    } catch(e) { setErr(e.response?.data?.message||'Save failed') }
    finally { setSaving(false) }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"/>
      <div className="relative card border border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto z-10" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h3 className="font-bold text-white">{initial.organization?'Edit Experience':'Add Experience'}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"><X size={16}/></button>
        </div>
        <div className="p-5 space-y-4">
          {err && <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs"><AlertCircle size={13}/>{err}</div>}
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="block text-xs font-medium text-slate-400 mb-1.5">Organization *</label><input name="organization" value={form.organization} onChange={ch} className="field-input"/></div>
            <div><label className="block text-xs font-medium text-slate-400 mb-1.5">Role *</label><input name="role" value={form.role} onChange={ch} className="field-input"/></div>
            <div><label className="block text-xs font-medium text-slate-400 mb-1.5">Type</label>
              <select name="type" value={form.type} onChange={ch} className="field-input">
                {TYPES.map(t=><option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
              </select>
            </div>
            <div><label className="block text-xs font-medium text-slate-400 mb-1.5">Website URL</label><input name="url" value={form.url} onChange={ch} className="field-input"/></div>
            <div><label className="block text-xs font-medium text-slate-400 mb-1.5">Start Date</label><input name="startDate" type="date" value={form.startDate?.slice(0,10)||''} onChange={ch} className="field-input"/></div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">End Date</label>
              <input name="endDate" type="date" value={form.endDate?.slice(0,10)||''} onChange={ch} className="field-input" disabled={!!form.current}/>
              <label className="flex items-center gap-2 mt-2 cursor-pointer">
                <input type="checkbox" name="current" checked={!!form.current} onChange={e=>setForm(f=>({...f,current:e.target.checked}))} className="w-4 h-4 accent-orange-500"/>
                <span className="text-xs text-slate-400">Currently working here</span>
              </label>
            </div>
          </div>
          <div><label className="block text-xs font-medium text-slate-400 mb-1.5">Description</label><textarea name="description" rows={4} value={form.description} onChange={ch} className="field-input resize-none"/></div>
          <div><label className="block text-xs font-medium text-slate-400 mb-1.5">Technologies (comma-separated)</label><input name="technologies" value={form.technologies} onChange={ch} className="field-input"/></div>
          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="btn-ghost flex-1 justify-center text-sm border border-white/10">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center text-sm disabled:opacity-60">
              {saving?<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>:<Save size={14}/>}{saving?'Saving...':'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminExperience() {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(null)
  const [deleting, setDeleting] = useState(null)
  const load = useCallback(()=>{ setLoading(true); getExperience().then(({data})=>setItems(data.experience||[])).finally(()=>setLoading(false)) },[])
  useEffect(()=>{ load() },[load])
  const handleSave = async(p)=>{ if(modal?._id) await updateExperience(modal._id,p); else await createExperience(p); setModal(null); load() }
  const handleDelete = async(id)=>{ setDeleting(id); await deleteExperience(id); setDeleting(null); load() }
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-black text-white">Experience</h2><p className="text-slate-500 text-sm">{items.length} entries</p></div>
        <button onClick={()=>setModal(EMPTY)} className="btn-primary text-sm px-4 py-2"><Plus size={15}/>Add Entry</button>
      </div>
      {loading?<div className="flex justify-center py-16"><div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin"/></div>:(
        <div className="space-y-3">
          {items.length===0&&<div className="card p-10 text-center text-slate-600">No experience entries yet.</div>}
          {items.map(e=>(
            <div key={e._id} className="card p-4 flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white">{e.role}</div>
                <div className="text-sm text-orange-400">{e.organization}</div>
                <div className="text-xs text-slate-500 mt-1 capitalize">{e.type} · {e.current?'Current':(e.startDate?.slice(0,7)||'')}</div>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2">{e.description}</p>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={()=>setModal(e)} className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-orange-400 transition-colors"><Pencil size={14}/></button>
                <button onClick={()=>handleDelete(e._id)} disabled={deleting===e._id} className="p-2 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors disabled:opacity-40">{deleting===e._id?<div className="w-3.5 h-3.5 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin"/>:<Trash2 size={14}/>}</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {modal&&<ExpModal initial={modal} onSave={handleSave} onClose={()=>setModal(null)}/>}
    </div>
  )
}
