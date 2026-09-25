import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, X, Save, AlertCircle } from 'lucide-react'
import { getSkills, createSkill, updateSkill, deleteSkill } from '../../services/api'

const CATS = ['Languages','Frontend','Backend','AI-ML','Tools','Other']
const EMPTY = { name:'', category:'Languages', proficiency:80, order:0, visible:true, icon:'' }

function SkillModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  const handleSave = async () => {
    if (!form.name.trim()) { setErr('Name required'); return }
    setSaving(true); setErr('')
    try { await onSave(form) } catch(e) { setErr(e.response?.data?.message||'Save failed') }
    finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"/>
      <div className="relative card border border-white/10 w-full max-w-md z-10" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h3 className="font-bold text-white">{initial.name?'Edit Skill':'Add Skill'}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"><X size={16}/></button>
        </div>
        <div className="p-5 space-y-4">
          {err && <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs"><AlertCircle size={13}/>{err}</div>}
          <div><label className="block text-xs font-medium text-slate-400 mb-1.5">Name *</label><input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} className="field-input" placeholder="React"/></div>
          <div><label className="block text-xs font-medium text-slate-400 mb-1.5">Category</label>
            <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} className="field-input">
              {CATS.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div><label className="block text-xs font-medium text-slate-400 mb-1.5">Proficiency ({form.proficiency}%)</label>
            <input type="range" min={1} max={100} value={form.proficiency} onChange={e=>setForm(f=>({...f,proficiency:+e.target.value}))} className="w-full accent-orange-500"/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-medium text-slate-400 mb-1.5">Order</label><input type="number" value={form.order} onChange={e=>setForm(f=>({...f,order:+e.target.value}))} className="field-input"/></div>
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
              {saving?<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>:<Save size={14}/>}
              {saving?'Saving...':'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminSkills() {
  const [skills, setSkills]   = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(null)
  const [deleting, setDeleting] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    getSkills().then(({data})=>setSkills(data.skills||[])).finally(()=>setLoading(false))
  },[])
  useEffect(()=>{ load() },[load])

  const handleSave = async (payload) => {
    if (modal?._id) await updateSkill(modal._id, payload)
    else             await createSkill(payload)
    setModal(null); load()
  }
  const handleDelete = async (id) => {
    setDeleting(id); await deleteSkill(id); setDeleting(null); load()
  }

  const grouped = skills.reduce((acc,s)=>{ if(!acc[s.category])acc[s.category]=[]; acc[s.category].push(s); return acc },{})

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-black text-white">Skills</h2><p className="text-slate-500 text-sm">{skills.length} total</p></div>
        <button onClick={()=>setModal(EMPTY)} className="btn-primary text-sm px-4 py-2"><Plus size={15}/>Add Skill</button>
      </div>
      {loading ? <div className="flex justify-center py-16"><div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin"/></div> : (
        skills.length === 0
          ? <div className="card p-10 text-center text-slate-600">No skills yet.</div>
          : <div className="space-y-6">
              {CATS.filter(c=>grouped[c]?.length>0).map(cat=>(
                <div key={cat}>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-orange-400 mb-3">{cat}</h4>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {grouped[cat].map(s=>(
                      <div key={s._id} className={`card p-3 flex items-center gap-3 ${!s.visible?'opacity-50':''}`}>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-white">{s.name}</div>
                          <div className="flex items-center gap-2 mt-1.5">
                            <div className="flex-1 h-1 rounded-full bg-white/5"><div className="h-full rounded-full bg-orange-500" style={{width:`${s.proficiency}%`}}/></div>
                            <span className="text-xs text-slate-500 font-mono w-8 text-right">{s.proficiency}%</span>
                          </div>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <button onClick={()=>setModal(s)} className="p-1.5 rounded hover:bg-white/5 text-slate-600 hover:text-orange-400 transition-colors"><Pencil size={13}/></button>
                          <button onClick={()=>handleDelete(s._id)} disabled={deleting===s._id} className="p-1.5 rounded hover:bg-red-500/10 text-slate-600 hover:text-red-400 transition-colors disabled:opacity-40">{deleting===s._id?<div className="w-3 h-3 border border-red-400/30 border-t-red-400 rounded-full animate-spin"/>:<Trash2 size={13}/>}</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
      )}
      {modal && <SkillModal initial={modal} onSave={handleSave} onClose={()=>setModal(null)}/>}
    </div>
  )
}
