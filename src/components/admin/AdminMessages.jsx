import { useState, useEffect, useCallback } from 'react'
import { Mail, Trash2, Eye, CheckCircle, Archive, X, Clock } from 'lucide-react'
import { getMessages, getMessage, updateMessageStatus, deleteMessage } from '../../services/api'
import { formatDate } from '../../utils/helpers'

const STATUS_BADGE = {
  new:     'bg-orange-500/15 text-orange-400 border-orange-500/20',
  read:    'bg-slate-500/15 text-slate-400 border-slate-500/20',
  replied: 'bg-green-500/15 text-green-400 border-green-500/20',
  archived:'bg-slate-700/30 text-slate-600 border-slate-700/20',
}

function MessageDetail({ msg, onClose, onStatusChange, onDelete }) {
  const [status, setStatus] = useState(msg.status)
  const [deleting, setDeleting] = useState(false)

  const changeStatus = async (s) => {
    await updateMessageStatus(msg._id, { status: s, read: true })
    setStatus(s)
    onStatusChange(msg._id, s)
  }
  const handleDelete = async () => {
    setDeleting(true)
    await deleteMessage(msg._id)
    onDelete(msg._id)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"/>
      <div className="relative card border border-white/10 w-full max-w-xl max-h-[85vh] overflow-y-auto z-10" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h3 className="font-bold text-white truncate pr-4">{msg.subject||'No subject'}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white flex-shrink-0"><X size={16}/></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-semibold text-white">{msg.name}</div>
              <a href={`mailto:${msg.email}`} className="text-sm text-orange-400 hover:text-orange-300 transition-colors">{msg.email}</a>
              {msg.company && <div className="text-xs text-slate-500 mt-0.5">{msg.company}</div>}
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${STATUS_BADGE[status]||STATUS_BADGE.read}`}>{status}</span>
              <span className="text-xs text-slate-600">{formatDate(msg.createdAt,{month:'short',day:'numeric',year:'numeric'})}</span>
            </div>
          </div>
          <div className="divider"/>
          <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
          <div className="divider"/>
          <div className="flex flex-wrap gap-2">
            <a href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject||'')}`}
              onClick={()=>changeStatus('replied')}
              className="btn-primary text-xs px-3 py-2"><Mail size={13}/>Reply</a>
            {status !== 'archived' && <button onClick={()=>changeStatus('archived')} className="btn-secondary text-xs px-3 py-2"><Archive size={13}/>Archive</button>}
            {status !== 'read' && <button onClick={()=>changeStatus('read')} className="btn-ghost text-xs px-3 py-2 border border-white/10"><Eye size={13}/>Mark Read</button>}
            <button onClick={handleDelete} disabled={deleting} className="btn-ghost text-xs px-3 py-2 text-red-400 hover:bg-red-500/10 border border-red-500/10 disabled:opacity-40 ml-auto"><Trash2 size={13}/>{deleting?'...':'Delete'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading]   = useState(true)
  const [selected, setSelected] = useState(null)
  const [filter, setFilter]     = useState('all')

  const load = useCallback(()=>{
    setLoading(true)
    getMessages().then(({data})=>setMessages(data.messages||[])).finally(()=>setLoading(false))
  },[])
  useEffect(()=>{load()},[load])

  const open = async(msg) => {
    setSelected(msg)
    if (!msg.read) {
      await updateMessageStatus(msg._id, { read: true, status: msg.status === 'new' ? 'read' : msg.status })
      setMessages(ms=>ms.map(m=>m._id===msg._id?{...m,read:true,status:m.status==='new'?'read':m.status}:m))
    }
  }
  const onStatusChange = (id, status) => setMessages(ms=>ms.map(m=>m._id===id?{...m,status,read:true}:m))
  const onDelete       = (id)         => setMessages(ms=>ms.filter(m=>m._id!==id))

  const TABS = ['all','new','read','replied','archived']
  const displayed = filter === 'all' ? messages : messages.filter(m=>m.status===filter)
  const unread = messages.filter(m=>!m.read).length

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            Messages
            {unread > 0 && <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-orange-500 text-white">{unread} new</span>}
          </h2>
          <p className="text-slate-500 text-sm">{messages.length} total messages</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map(t=>(
          <button key={t} onClick={()=>setFilter(t)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 capitalize ${filter===t?'bg-orange-500/20 text-orange-400 border border-orange-500/30':'text-slate-500 hover:text-slate-300 border border-white/5'}`}>
            {t} {t==='all'?`(${messages.length})`:`(${messages.filter(m=>m.status===t).length})`}
          </button>
        ))}
      </div>

      {loading?<div className="flex justify-center py-16"><div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin"/></div>:(
        <div className="space-y-2">
          {displayed.length===0&&<div className="card p-10 text-center text-slate-600">No messages here.</div>}
          {displayed.map(m=>(
            <button key={m._id} onClick={()=>open(m)} className={`w-full card p-4 flex items-start gap-4 text-left hover:border-orange-500/20 transition-all duration-200 ${!m.read?'border-orange-500/10':''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${!m.read?'bg-orange-500/20':'bg-white/5'}`}>
                <Mail size={14} className={!m.read?'text-orange-400':'text-slate-600'}/>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`font-semibold text-sm ${!m.read?'text-white':'text-slate-400'}`}>{m.name}</span>
                  {!m.read&&<span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0"/>}
                  <span className={`ml-auto px-2 py-0.5 rounded-full text-xs border capitalize ${STATUS_BADGE[m.status]||STATUS_BADGE.read}`}>{m.status}</span>
                </div>
                <div className="text-xs text-slate-500 mb-1">{m.email}</div>
                <p className="text-xs text-slate-600 truncate">{m.subject||'No subject'} — {m.message}</p>
              </div>
              <div className="text-xs text-slate-700 flex-shrink-0"><Clock size={11} className="inline mr-1"/>{formatDate(m.createdAt,{month:'short',day:'numeric'})}</div>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <MessageDetail
          msg={selected}
          onClose={()=>setSelected(null)}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
        />
      )}
    </div>
  )
}
