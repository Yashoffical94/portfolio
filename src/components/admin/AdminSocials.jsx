import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, X, Save, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { getAllSocials, createSocial, updateSocial, deleteSocial } from '../../services/api'

const PLATFORMS = ['github','linkedin','twitter','instagram','youtube','email','website']
const EMPTY_SOC = { platform:'github', url:'', label:'', order:0, visible:true }

function SocModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')
  const ch = e => setForm(f=>({...f,[e.target.name]:e.target.value}))
  const handleSave = async()=>{
    if(!form.url.trim()){setErr('URL required');return}
    setSaving(true);setErr('')
    try{await onSave(form)}catch(e){setErr(e.response?.data?.message||'Save failed')}
    finally{setSaving(false)}
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"/>
      <div className="relative card border border-white/10 w-full max-w-md z-10" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h3 className="font-bold text-white">{initial.url?'Edit Link':'Add Social Link'}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white"><X size={16}/></button>
        </div>
        <div className="p-5 space-y-4">
          {err&&<div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs"><AlertCircle size={13}/>{err}</div>}
          <div><label className="block text-xs font-medium text-slate-400 mb-1.5">Platform</label>
            <select name="platform" value={form.platform} onChange={ch} className="field-input">
              {PLATFORMS.map(p=><option key={p} value={p}>{p.charAt(0).toUpperCase()+p.slice(1)}</option>)}
            </select>
          </div>
          <div><label className="block text-xs font-medium text-slate-400 mb-1.5">URL *</label><input name="url" value={form.url} onChange={ch} className="field-input" placeholder="https://"/></div>
          <div><label className="block text-xs font-medium text-slate-400 mb-1.5">Label (optional)</label><input name="label" value={form.label} onChange={ch} className="field-input" placeholder="My GitHub"/></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-medium text-slate-400 mb-1.5">Order</label><input name="order" type="number" value={form.order} onChange={ch} className="field-input"/></div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={!!form.visible} onChange={e=>setForm(f=>({...f,visible:e.target.checked}))} className="w-4 h-4 accent-orange-500"/>
                <span className="text-sm text-slate-300">Visible</span>
              </label>
            </div>
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

export default function AdminSocials() {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(null)
  const [deleting, setDeleting] = useState(null)
  const load = useCallback(()=>{setLoading(true);getAllSocials().then(({data})=>setItems(data.socials||[])).finally(()=>setLoading(false))},[])
  useEffect(()=>{load()},[load])
  const handleSave = async(p)=>{if(modal?._id)await updateSocial(modal._id,p);else await createSocial(p);setModal(null);load()}
  const handleDelete = async(id)=>{setDeleting(id);await deleteSocial(id);setDeleting(null);load()}
  const toggleVisible = async(s)=>{await updateSocial(s._id,{visible:!s.visible});load()}

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-black text-white">Social Links</h2><p className="text-slate-500 text-sm">{items.length} links</p></div>
        <button onClick={()=>setModal(EMPTY_SOC)} className="btn-primary text-sm px-4 py-2"><Plus size={15}/>Add Link</button>
      </div>
      {loading?<div className="flex justify-center py-16"><div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin"/></div>:(
        <div className="space-y-2">
          {items.length===0&&<div className="card p-10 text-center text-slate-600">No social links yet.</div>}
          {items.map(s=>(
            <div key={s._id} className={`card p-4 flex items-center gap-4 transition-opacity ${!s.visible?'opacity-50':''}`}>
              <div className="w-9 h-9 rounded-xl bg-orange-500/10 flex items-center justify-center text-sm font-bold text-orange-400 flex-shrink-0 uppercase">{s.platform?.slice(0,2)}</div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white text-sm capitalize">{s.platform}</div>
                <a href={s.url} target="_blank" rel="noreferrer" className="text-xs text-slate-500 hover:text-orange-400 transition-colors truncate block">{s.url}</a>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={()=>toggleVisible(s)} title={s.visible?'Hide':'Show'} className="p-1.5 rounded hover:bg-white/5 text-slate-600 hover:text-slate-300 transition-colors">{s.visible?<Eye size={14}/>:<EyeOff size={14}/>}</button>
                <button onClick={()=>setModal(s)} className="p-1.5 rounded hover:bg-white/5 text-slate-600 hover:text-orange-400 transition-colors"><Pencil size={14}/></button>
                <button onClick={()=>handleDelete(s._id)} disabled={deleting===s._id} className="p-1.5 rounded hover:bg-red-500/10 text-slate-600 hover:text-red-400 transition-colors disabled:opacity-40">{deleting===s._id?<div className="w-3 h-3 border border-red-400/30 border-t-red-400 rounded-full animate-spin"/>:<Trash2 size={14}/>}</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {modal&&<SocModal initial={modal} onSave={handleSave} onClose={()=>setModal(null)}/>}
    </div>
  )
}
