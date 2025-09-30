'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useFX } from './SoundFXProvider'

type Slice = { name: string; value: number; color: string }

const COLORS = ['#B48C58','#6E7F8A','#722F37','#0F4C81','#00FFD1','#E2E8F0']

function clamp(v:number,min:number,max:number){ return Math.min(max, Math.max(min, v)) }
function polarAngle(x:number,y:number,cx:number,cy:number){ return Math.atan2(y-cy, x-cx) } // rad

export default function InteractiveNavWheel({ data }:{ data:{name:string,value:number}[] }){
  const { click, vibrate } = useFX()
  const sum = data.reduce((a,b)=> a + (b.value||0), 0) || 1
  const slices: Slice[] = useMemo(()=> data.map((d,i)=>({
    name: d.name,
    value: (d.value||0)/sum,
    color: COLORS[i % COLORS.length]
  })), [data, sum])

  // Rotazione (deg) + auto-rotation (anim controller)
  const [rot, setRot] = useState(0)
  const controls = useAnimation()
  const svgRef = useRef<SVGSVGElement>(null)

  // Calcolo categoria attiva in base all’angolo
  const active = useMemo(()=>{
    let angle = ((-rot % 360) + 360) % 360 // 0..360
    // zero in orizzontale (a destra)
    const frac = angle / 360
    let acc = 0
    for (const s of slices){
      acc += s.value
      if (frac <= acc) return s
    }
    return slices[slices.length-1]
  }, [rot, slices])

  // Auto-rotate dolce
  useEffect(()=> {
    controls.start({ rotate: 360 }, { duration: 60, ease: 'linear', repeat: Infinity })
  }, [controls])

  // Sync manual rotation + auto
  function onUpdate(latest:any){
    if (typeof latest.rotate === 'number') setRot(latest.rotate)
  }

  // Drag + inerzia
  const dragState = useRef<{start:number, origin:number, last:number} | null>(null)

  function onPointerDown(e:React.PointerEvent){
    const el = svgRef.current; if(!el) return
    const r = el.getBoundingClientRect()
    const cx = r.left + r.width/2, cy = r.top + r.height/2
    const a = polarAngle(e.clientX, e.clientY, cx, cy)
    dragState.current = { start: a, origin: rot, last: a }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    vibrate(6)
  }
  function onPointerMove(e:React.PointerEvent){
    if (!dragState.current || !svgRef.current) return
    const r = svgRef.current.getBoundingClientRect()
    const cx = r.left + r.width/2, cy = r.top + r.height/2
    const cur = polarAngle(e.clientX, e.clientY, cx, cy)
    const deltaRad = cur - dragState.current.start
    const deg = (deltaRad * 180/Math.PI)
    setRot(dragState.current.origin + deg)
    // ogni 12° un “tick” lieve
    const moved = (cur - dragState.current.last) * 180/Math.PI
    if (Math.abs(moved) > 12){ click(); vibrate(8); dragState.current.last = cur }
  }
  function onPointerUp(){
    if (!dragState.current) return
    // inerzia: usa spostamento finale per dare un piccolo spin
    const extra = clamp((rot - dragState.current.origin) * 0.15, -80, 80)
    setRot(r => r + extra)
    dragState.current = null
    vibrate(10)
  }

  // Prepara archi
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
    return { d, s }
  })

  return (
    <div className="card relative overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium">NAV Wheel</div>
        <div className="text-xs text-slate-400">Drag to rotate • Auto-rotate on</div>
      </div>

      {/* bagliori soft */}
      <motion.div
        className="pointer-events-none absolute -inset-24"
        initial={{ opacity: 0.55 }}
        animate={{ opacity: [0.45, 0.7, 0.45] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        style={{ background:
          'radial-gradient(700px 300px at 25% 20%, rgba(180,140,88,.14), transparent 60%),'+
          'radial-gradient(600px 280px at 80% 70%, rgba(0,255,209,.12), transparent 55%)'
        }}
      />

      <div className="relative">
        <motion.svg
          ref={svgRef}
          viewBox="0 0 200 200"
          className="w-full h-[340px] origin-center"
          animate={controls}
          onUpdate={onUpdate}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{ rotate: rot }}
        >
          <defs>
            <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="0.7" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <radialGradient id="ring" cx="50%" cy="50%" r="50%">
              <stop offset="55%" stopColor="#0A0A0B" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.08)" />
            </radialGradient>
          </defs>

          {/* slices */}
          {arcs.map((a, idx)=> (
            <path
              key={idx}
              d={a.d}
              fill={a.s.color}
              opacity={0.88}
              filter="url(#soft)"
            >
              <title>{`${a.s.name} — ${(a.s.value*100).toFixed(1)}%`}</title>
            </path>
          ))}

          {/* bordo esterno/ interno molto discreto */}
          <circle cx="100" cy="100" r={R+1.5} fill="none" stroke="rgba(255,255,255,0.08)" />
          <circle cx="100" cy="100" r={r-1.5} fill="none" stroke="rgba(255,255,255,0.08)" />

          {/* “nub” luminoso per percezione rotazione */}
          <circle cx={100+R} cy="100" r="3" fill="#fff" opacity="0.8" />
        </motion.svg>

        {/* Centro informativo */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-xs text-slate-400">Selected Category</div>
            <div className="text-lg font-semibold" style={{ color: active?.color || '#fff' }}>
              {active?.name || '—'} • {(active?.value ? active.value*100 : 0).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
