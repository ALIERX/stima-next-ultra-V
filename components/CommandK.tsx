'use client'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import data from '@/app/data/assets.json'

type Item = { label: string, href?: string, action?: ()=>void }

export default function CommandK(){
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const router = useRouter()

  useEffect(()=>{
    const onKey = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC')
      if((isMac && e.metaKey && e.key.toLowerCase()==='k') || (!isMac && e.ctrlKey && e.key.toLowerCase()==='k')){
        e.preventDefault(); setOpen(v=>!v)
      }
      if(e.key==='Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return ()=> window.removeEventListener('keydown', onKey)
  },[])

  const base: Item[] = useMemo(()=>[
    { label: 'Go to Home', href: '/' },
    { label: 'Browse Assets', href: '/assets' },
    { label: 'Open Mint Flow', href: '/mint' },
  ], [])

  const assets: Item[] = useMemo(()=> (data as any[]).map(a=>({
    label: `Asset: ${a.brand} — ${a.name}`,
    href: `/assets/${a.id}`
  })), [])

  const items = useMemo(()=>{
    const all = [...base, ...assets]
    if(!q.trim()) return all.slice(0, 8)
    const s = q.toLowerCase()
    return all.filter(i=>i.label.toLowerCase().includes(s)).slice(0, 12)
  }, [q, base, assets])

  function run(it: Item){
    setOpen(false)
    if(it.action) it.action()
    if(it.href) router.push(it.href)
  }

  return (
    <>
      <button onClick={()=>setOpen(true)} className="pill">⌘K</button>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center p-4">
          <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-ink p-3 shadow-[0_20px_120px_rgba(0,0,0,.6)]">
            <input
              autoFocus
              value={q}
              onChange={e=>setQ(e.target.value)}
              placeholder="Search actions or assets…"
              className="w-full bg-transparent outline-none text-sm px-3 py-2 border border-white/10 rounded-xl mb-2"
            />
            <div className="max-h-80 overflow-auto space-y-1">
              {items.map((it,idx)=>(
                <button
                  key={idx}
                  onClick={()=>run(it)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5"
                >
                  {it.label}
                </button>
              ))}
              {items.length===0 && (
                <div className="text-xs text-slate-500 px-3 py-6 text-center">No results</div>
              )}
            </div>
            <div className="text-[10px] text-slate-500 mt-2 px-1">Press Esc to close</div>
          </div>
        </div>
      )}
    </>
  )
}
