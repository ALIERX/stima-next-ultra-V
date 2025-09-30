'use client'
import { motion } from 'framer-motion'

export default function OracleSatellite({ status='Online' }:{ status?: 'Online'|'Syncing'|'Offline' }){
  const color = status==='Online' ? '#00FFD1' : status==='Syncing' ? '#B48C58' : '#FF3B3B'
  const glow = status==='Online' ? 'glow-teal' : status==='Syncing' ? 'glow-gold' : ''
  return (
    <div className={`card relative overflow-hidden ${glow}`}>
      <div className="text-sm font-medium mb-1">Oracle Status</div>
      <div className="text-xs text-slate-400 mb-3">NAV Publisher</div>
      <div className="relative h-44">
        <motion.div
          className="absolute inset-0 flex items-center justify-center orbit-dim"
          animate={{ rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}>
          <Ring color={color} size={180} />
        </motion.div>
        <motion.div
          className="absolute inset-0 flex items-center justify-center orbit-dim"
          animate={{ rotate: -360 }} transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}>
          <Ring color={color} size={140} opacity={0.5}/>
        </motion.div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-semibold" style={{color}}>{status}</div>
            <div className="text-xs text-slate-400">Last: 00:00 UTC</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Ring({ color='#00FFD1', size=160, opacity=0.8 }:{color?:string,size?:number,opacity?:number}){
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" className="opacity-90">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={opacity}/>
          <stop offset="100%" stopColor={color} stopOpacity={0.15}/>
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="78" fill="none" stroke="url(#g)" strokeWidth="2"/>
      <circle cx="170" cy="100" r="4" fill={color} />
    </svg>
  )
}
