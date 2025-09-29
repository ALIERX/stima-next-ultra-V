'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useFX } from '@/components/SoundFXProvider'
const steps = [
  {k:'verify', label:'Verify', icon:'🔍'},
  {k:'oracle', label:'Oracle Sign', icon:'✅'},
  {k:'nav', label:'NAV Calc', icon:'🧮'},
  {k:'mint', label:'Mint', icon:'🪙'}
]
export default function MintPage(){
  const [i,setI] = useState(0)
  const { click, success } = useFX()
  function next(){ if (i<steps.length-1){ setI(i+1); click() } else success() }
  return (
    <section className="card">
      <div className="text-lg font-semibold mb-4">Mint Flow (demo)</div>
      <div className="flex items-center gap-4">
        {steps.map((s,idx)=> (
          <motion.div key={s.k} className={`rounded-xl px-3 py-2 border ${idx<=i?'border-crypto/60 bg-white/5':'border-white/10 bg-white/0'}`} animate={{scale: idx===i?1.05:1}}>
            <div className="text-2xl">{s.icon}</div>
            <div className="text-xs text-slate-300">{s.label}</div>
          </motion.div>
        ))}
      </div>
      <button onClick={next} className="mt-6 pill">Advance</button>
      <div className="text-xs text-slate-400 mt-2">Connect Sepolia later via ENV.</div>
    </section>
  )
}
