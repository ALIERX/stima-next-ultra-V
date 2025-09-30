'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function CoverFlow3D({ items }:{ items: {id:string,image:string,title:string,subtitle:string}[] }){
  const [active, setActive] = useState(2)
  return (
    <div className="card overflow-hidden">
      <div className="text-sm font-medium mb-2">Featured Vault</div>
      <div className="relative h-64 perspective-[1200px]">
        <div className="absolute inset-0 flex items-center justify-center gap-6">
          {items.map((it, i) => {
            const offset = i - active
            const rotateY = Math.max(-45, Math.min(45, -offset * 15))
            const z = -Math.abs(offset) * 80
            const scale = offset===0 ? 1 : 0.92
            const opacity = offset===0 ? 1 : 0.65
            return (
              <motion.div key={it.id}
                onMouseEnter={()=>setActive(i)}
                className="rounded-2xl overflow-hidden border border-white/10"
                style={{ transformStyle: 'preserve-3d' }}
                animate={{ rotateY, translateZ: z, scale, opacity }}
                transition={{ type: 'spring', stiffness: 90, damping: 14 }}>
                <Link href={`/assets/${it.id}`}>
                  <img src={it.image} alt="" className="w-56 h-36 object-cover" />
                  <div className="px-3 py-2 text-xs">
                    <div className="font-medium">{it.title}</div>
                    <div className="text-slate-400">{it.subtitle}</div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-center gap-2">
        {items.map((_,i)=> (
          <button key={i} onClick={()=>setActive(i)}
            className={`h-1.5 w-6 rounded-full ${i===active?'bg-crypto':'bg-white/10'}`} />
        ))}
      </div>
    </div>
  )
}
