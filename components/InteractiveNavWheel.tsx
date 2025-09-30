'use client'
import React, { useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useFX } from './SoundFXProvider'

type Slice = { name: string; value: number; color: string }

function polarAngle(x:number,y:number,cx:number,cy:number){
  return Math.atan2(y-cy, x-cx) // rad
}

const COLORS = ['#B48C58','#6E7F8A','#722F37','#0F4C81','#00FFD1','#E2E8F0']

export default function InteractiveNavWheel({ data }:{ data:{name:string,value:number}[] }){
  const { click, vibrate } = useFX()
  const sum = data.reduce((a,b)=> a + b.value, 0) || 1
  const slices: Slice[] = useMemo(()=> data.map((d,i)=>({
    name: d.name,
    value: d.value/sum,
    color: COLORS[i % COLORS.length]
  })), [data, sum])

  // rotazione accumulata + drag
  const [rot, setRot] = useState(0)
  const dragging = useRef<{start:number, origin:number}|null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  function onPointerDown(e:React.PointerEvent){
    const el = svgRef.current; if(!el) return
    const r = el.getBoundingClientRect()
    const cx = r.left + r.width/2, cy = r.top + r.height/2
    dragging.current = { start: polarAngle(e.clientX, e.clientY, cx, cy), origin: rot }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }
  function onPointerMove(e:React.PointerEvent){
    if(!dragging.current || !svgRef.current) return
    const r = svgRef.current.getBoundingClientRect()
    const cx = r.left + r.width/2, cy = r.top + r.height/2
    const cur = polarAngle(e.clientX, e.clientY, cx, cy)
    const delta = (cur - dragging.current.start) * (180/Math.PI)
    setRot(dragging.current.origin + delta)
    // feedback “tic” leggero se superiamo 10° step
    if (Math.abs(delta) > 10) { vibrate(8); click(); dragging.current.start = cur; dragging.current.origin = rot }
  }
  function onPointerUp(e:React.PointerEvent){
    dragging.current = null
    vibrate(12)
  }

  // path arcs
  const R = 120, r = 78
  let a0 = 0
  const arcs = slices.map((s, i) => {
    const a1 = a0 + s.value * Math.PI * 2
    const large = a1 - a0 > Math.PI ? 1 : 0
    const x0o = 100 + Math.cos(a0) * R, y0o = 100 + Math.sin(a0) * R
    const x1o = 100 + Math.cos(a1) * R, y1o = 100 + Math.sin(a1) * R
    const x0i = 100 + Math.cos(a1) * r, y0i = 100 + Math.sin(a1) * r
    const x1i = 100 + Math.cos(a0) * r, y1i = 100 + Math.sin(a0) * r
    const d = [
      `M ${x0o} ${y0o}`,
      `A ${R} ${R} 0 ${large} 1 ${x1o} ${y1o}`,
      `L ${x0i} ${y0i}`,
      `A ${r} ${r} 0 ${large} 0 ${x1i} ${y1i}`,
      'Z'
    ].join(' ')
    a0 = a1
    return { d, color: s.color, label: s.name }
  })

  return (
    <div className="relative card overflow-hidden">
      <div className="text-sm font-medium mb-2">NAV Wheel</div>

      {/* particelle soffici */}
      <motion.div
        className="pointer-events-none absolute -inset-20"
        initial={{ opacity: 0.7 }}
        animate={{ opacity: [0.7, 0.9, 0.7], rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        style={{ background: 'radial-gradient(600px 300px at 20% 30%, rgba(180,140,88,.12), transparent), radial-gradient(500px 300px at 80% 70%, rgba(0,255,209,.10), transparent)' }}
      />

      <div className="relative">
        <svg
          ref={svgRef}
          viewBox="0 0 200 200"
          className="w-full h-[320px] origin-center"
          style={{ transform: `rotate(${rot}deg)` }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <defs>
            <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          {arcs.map((a, idx)=> (
            <path key={idx} d={a.d} fill={a.color} opacity={0.85} filter="url(#soft)">
              <title>{a.label}</title>
            </path>
          ))}
          {/* foro centrale */}
          <circle cx="100" cy="100" r={70} fill="#0A0A0B" stroke="rgba(255,255,255,0.1)" />
          {/* piccolo “nub” per far percepire la rotazione */}
          <circle cx="170" cy="100" r={3} fill="white" opacity={0.7}/>
        </svg>

        {/* centro info */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-xs text-slate-400">Vault NAV</div>
            <div className="text-lg font-semibold">Category Mix</div>
          </div>
        </div>
      </div>
      <div className="text-xs text-slate-500 mt-2">Drag to rotate • Haptic & “tick” enabled</div>
    </div>
  )
}
