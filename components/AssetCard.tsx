'use client'
import React, { useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import AssetRadar from './AssetRadar'
import { useFX } from './SoundFXProvider'

export default function AssetCard({ a }:{a:any}){
  const ref = useRef<HTMLDivElement>(null)
  const { click } = useFX()
  function move(e: React.MouseEvent){
    const el = ref.current; if(!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    el.style.transform = `rotateX(${(y-.5)*6}deg) rotateY(${(x-.5)*-6}deg)`
  }
  return (
    <Link href={`/assets/${a.id}`} onClick={click}>
      <motion.div ref={ref} className="glass p-3 tilt" onMouseMove={move} onMouseLeave={()=>{ if(ref.current) ref.current.style.transform='rotateX(0) rotateY(0)' }} whileHover={{ scale: 1.02 }}>
        <div className="aspect-[4/3] rounded-xl overflow-hidden bg-black/40">
          <img src={a.image} alt="" className="w-full h-full object-cover"/>
        </div>
        <div className="mt-2">
          <div className="text-[10px] uppercase tracking-wide text-slate-400">{a.category}</div>
          <div className="text-sm font-semibold">{a.brand} — {a.name}</div>
          <div className="text-xs text-slate-400">{a.year || 'N/A'}</div>
        </div>
        <div className="mt-2"><AssetRadar asset={a} height={150}/></div>
      </motion.div>
    </Link>
  )
}
