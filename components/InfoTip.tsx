'use client'
import { useState, useRef, useEffect } from 'react'

export default function InfoTip({ text }:{ text: string }){
  const [open,setOpen]=useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(()=>{
    function onDoc(e:MouseEvent){ if(!ref.current?.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('click', onDoc); return ()=>document.removeEventListener('click', onDoc)
  },[])
  return (
    <div ref={ref} className="relative inline-block">
      <button onClick={()=>setOpen(v=>!v)} className="ml-2 h-5 w-5 text-[10px] rounded-full border border-white/15 bg-white/10 hover:bg-white/20">?</button>
      {open && (
        <div className="absolute z-30 mt-2 w-64 p-3 text-xs rounded-xl border border-white/10 bg-card shadow-[0_10px_40px_rgba(0,0,0,.4)]">
          {text}
        </div>
      )}
    </div>
  )
}
