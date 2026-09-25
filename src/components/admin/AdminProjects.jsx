import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, Star, StarOff, X, Save, AlertCircle } from 'lucide-react'
import { getProjects, createProject, updateProject, deleteProject } from '../../services/api'

const EMPTY = { title:'', shortDescription:'', description:'', technologies:'', category:'', image:'', githubUrl:'', demoUrl:'', status:'completed', featured:false, order:0, problem:'', solution:'', features:'', challenges:'', learnings:'' }

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative card border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h3 className="font-bold text-white">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"><X size={16}/></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

function ProjectForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  const field = (name, label, type='text', multiline=false) => (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
      {multiline
        ? <textarea name={name} rows={3} value={form[name]||''} onChange={e=>setForm(f=>({...f,[name]:e.target.value}))} className="field-input resize-none"/>
        : <input name={name} type={type} value={form[name]||''} onChange={e=>setForm(f=>({...f,[name]:e.target.value}))} className="field-input"/>
      }
    </div>
  )

  const handleSave = async () => {
    if (!form.title.trim()) { setErr('Title is required'); return }
    setSaving(true); setErr('')
    try {
      const payload = { ...form, technologies: typeof form.technologies === 'string' ? form.technologies.split(',').map(t=>t.trim()).filter(Boolean) : form.technologies, features: typeof form.features === 'string' ? form.features.split('\n').filter(Boolean) : form.features }
      await onSave(payload)
    } catch(e) { setErr(e.response?.data?.message || 'Save failed') }
    finally { setSaving(false) }
  }

  return (
    <div className="space-y-4">
      {err && <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"><AlertCircle size={14}/>{err}</div>}
      <div className="grid sm:grid-cols-2 gap-4">
        {field('title','Title *')}
        {field('category','Category')}
        {field('image','Image URL')}
        {field('githubUrl','GitHub URL')}
        {field('demoUrl','Live Demo URL')}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Status</label>
          <select value={form.status||'completed'} onChange={e=>setForm(f=>({...f,status:e.target.value}))} className="field-input">
            <option value="completed">Completed</option><option value="active">Active</option><option value="archived">Archived</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Order</label>
          <input type="number" value={form.order||0} onChange={e=>setForm(f=>({...f,order:+e.target.value}))} className="field-input"/>
        </div>
        <div className="flex items-center gap-3 pt-5">
          <input type="checkbox" id="featured" checked={!!form.featured} onChange={e=>setForm(f=>({...f,featured:e.target.checked}))} className="w-4 h-4 accent-orange-500"/>
          <label htmlFor="featured" className="text-sm text-slate-300">Featured project</label>
        </div>
      </div>
      {field('technologies','Technologies (comma-separated)')}
      {field('shortDescription','Short Description',undefined,true)}
      {field('description','Full Description',undefined,true)}
      {field('problem','Problem',undefined,true)}
      {field('solution','Solution',undefined,true)}
      {field('features','Features (one per line)',undefined,true)}
      {field('challenges','Challenges',undefined,true)}
      {field('learnings','What I Learned',undefined,true)}
      <div className="flex gap-3 pt-2">
        <button onClick={onCancel} className="btn-ghost flex-1 justify-center text-sm border border-white/10">Cancel</button>
        <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center text-sm disabled:opacity-60">
          {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <Save size={14}/>}
          {saving ? 'Saving...' : 'Save Project'}
        </button>
      </div>
    </div>
  )
}

export default function AdminProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(null) // null | 'add' | {project}
  const [deleting, setDeleting] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    getProjects().then(({data}) => setProjects(data.projects||[])).finally(()=>setLoading(false))
  }, [])
  useEffect(()=>{ load() },[load])

  const handleCreate = async (payload) => { await createProject(payload); setModal(null); load() }
  const handleUpdate = async (payload) => { await updateProject(modal._id, payload); setModal(null); load() }
  const handleDelete = async (id) => { setDeleting(id); await deleteProject(id); setDeleting(null); load() }
  const toggleFeatured = async (p) => { await updateProject(p._id, { featured: !p.featured }); load() }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-black text-white">Projects</h2><p className="text-slate-500 text-sm">{projects.length} total</p></div>
        <button onClick={()=>setModal('add')} className="btn-primary text-sm px-4 py-2"><Plus size={15}/>Add Project</button>
      </div>
      {loading ? <div className="flex justify-center py-16"><div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin"/></div> : (
        <div className="space-y-3">
          {projects.length === 0 && <div className="card p-10 text-center text-slate-600">No projects yet. Add your first one!</div>}
          {projects.map(p => (
            <div key={p._id} className="card p-4 flex items-center gap-4 hover:border-white/10 transition-all duration-200">
              {p.image ? <img src={p.image} alt={p.title} className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-white/8"/> : <div className="w-14 h-14 rounded-xl bg-white/5 flex-shrink-0"/>}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2"><h3 className="font-semibold text-white truncate">{p.title}</h3>{p.featured && <Star size={12} className="text-gold-400 fill-gold-400 flex-shrink-0"/>}</div>
                <p className="text-xs text-slate-500 truncate mt-0.5">{p.shortDescription}</p>
                <div className="flex flex-wrap gap-1 mt-1.5">{p.technologies?.slice(0,4).map(t=><span key={t} className="px-1.5 py-0.5 rounded text-xs bg-white/5 text-slate-500 border border-white/5">{t}</span>)}</div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button onClick={()=>toggleFeatured(p)} title={p.featured?'Unfeature':'Feature'} className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-gold-400 transition-colors">{p.featured?<StarOff size={15}/>:<Star size={15}/>}</button>
                <button onClick={()=>setModal({...p, technologies: Array.isArray(p.technologies)?p.technologies.join(', '):p.technologies, features: Array.isArray(p.features)?p.features.join('\n'):p.features})} className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-orange-400 transition-colors"><Pencil size={15}/></button>
                <button onClick={()=>handleDelete(p._id)} disabled={deleting===p._id} className="p-2 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors disabled:opacity-40">{deleting===p._id?<div className="w-3.5 h-3.5 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin"/>:<Trash2 size={15}/>}</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {modal === 'add' && <Modal title="Add Project" onClose={()=>setModal(null)}><ProjectForm initial={EMPTY} onSave={handleCreate} onCancel={()=>setModal(null)}/></Modal>}
      {modal && modal._id && <Modal title="Edit Project" onClose={()=>setModal(null)}><ProjectForm initial={modal} onSave={handleUpdate} onCancel={()=>setModal(null)}/></Modal>}
    </div>
  )
}
