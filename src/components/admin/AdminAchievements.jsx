import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, X, Save, AlertCircle } from 'lucide-react'
import { getAchievements, createAchievement, updateAchievement, deleteAchievement } from '../../services/api'

const CATS_ACH = ['hackathon','certification','competitive','academic','project','award','milestone']
const EMPTY_ACH = { title:'', description:'', category:'milestone', date:'', url:'', order:0, featured:false }

function AchModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')
  const ch = e => setForm(f=>({...f,[e.target.name]:e.target.value}))
  const handleSave = async() => {
    if(!form.title.trim()){setErr('Title required');return}
    setSaving(true);setErr('')
    try{await onSave(form)}catch(e){setErr(e.response?.data?.message||'Save failed')}
    finally{setSaving(false)}
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"/>
      <div className="relative card border border-white/10 w-full max-w-md max-h-[90vh] overflow-y-auto z-10" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h3 className="font-bold text-white">{initial.title?'Edit Achievement':'Add Achievement'}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white"><X size={16}/></button>
        </div>
        <div className="p-5 space-y-4">
          {err&&<div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs"><AlertCircle size={13}/>{err}</div>}
          <div><label className="block text-xs font-medium text-slate-400 mb-1.5">Title *</label><input name="title" value={form.title} onChange={ch} className="field-input"/></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-medium text-slate-400 mb-1.5">Category</label>
              <select name="category" value={form.category} onChange={ch} className="field-input">
                {CATS_ACH.map(c=><option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
              </select>
            </div>
            <div><label className="block text-xs font-medium text-slate-400 mb-1.5">Date</label><input name="date" type="date" value={form.date?.slice(0,10)||''} onChange={ch} className="field-input"/></div>
          </div>
          <div><label className="block text-xs font-medium text-slate-400 mb-1.5">Description</label><textarea name="description" rows={3} value={form.description} onChange={ch} className="field-input resize-none"/></div>
          <div><label className="block text-xs font-medium text-slate-400 mb-1.5">URL (optional)</label><input name="url" value={form.url} onChange={ch} className="field-input"/></div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="ach-feat" checked={!!form.featured} onChange={e=>setForm(f=>({...f,featured:e.target.checked}))} className="w-4 h-4 accent-orange-500"/>
            <label htmlFor="ach-feat" className="text-sm text-slate-300">Featured achievement</label>
          </div>
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

export default function AdminAchievements() {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(null)
  const [deleting, setDeleting] = useState(null)
  const load = useCallback(()=>{setLoading(true);getAchievements().then(({data})=>setItems(data.achievements||[])).finally(()=>setLoading(false))},[])
  useEffect(()=>{load()},[load])
  const handleSave = async(p)=>{if(modal?._id)await updateAchievement(modal._id,p);else await createAchievement(p);setModal(null);load()}
  const handleDelete = async(id)=>{setDeleting(id);await deleteAchievement(id);setDeleting(null);load()}
  const EMOJIS = {hackathon:'🏆',certification:'🎓',competitive:'⚔️',academic:'📚',project:'🚀',award:'🏅',milestone:'⚡'}
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-black text-white">Achievements</h2><p className="text-slate-500 text-sm">{items.length} total</p></div>
        <button onClick={()=>setModal(EMPTY_ACH)} className="btn-primary text-sm px-4 py-2"><Plus size={15}/>Add</button>
      </div>
      {loading?<div className="flex justify-center py-16"><div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin"/></div>:(
        <div className="grid sm:grid-cols-2 gap-3">
          {items.length===0&&<div className="card p-10 text-center text-slate-600 sm:col-span-2">No achievements yet.</div>}
          {items.map(a=>(
            <div key={a._id} className="card p-4 flex items-start gap-3">
              <span className="text-2xl">{EMOJIS[a.category]||'⚡'}</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white text-sm">{a.title}</div>
                <div className="text-xs text-slate-500 mt-0.5 capitalize">{a.category}</div>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">{a.description}</p>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={()=>setModal(a)} className="p-1.5 rounded hover:bg-white/5 text-slate-600 hover:text-orange-400 transition-colors"><Pencil size={13}/></button>
                <button onClick={()=>handleDelete(a._id)} disabled={deleting===a._id} className="p-1.5 rounded hover:bg-red-500/10 text-slate-600 hover:text-red-400 transition-colors disabled:opacity-40">{deleting===a._id?<div className="w-3 h-3 border border-red-400/30 border-t-red-400 rounded-full animate-spin"/>:<Trash2 size={13}/>}</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {modal&&<AchModal initial={modal} onSave={handleSave} onClose={()=>setModal(null)}/>}
    </div>
  )
}
