'use client'
import React, { useMemo, useRef, useState, useEffect } from 'react'
import { useAnimationFrame } from 'framer-motion'
import STIMALogo from './STIMA logo 120x120.svg'

type Item = { name: string; value: number }

type Props = {
  data: Item[]
  /** velocità auto-rotate (rad/s) */
  autorotateSpeed?: number
}

const TAU = Math.PI * 2

export default function InteractiveNavWheel({ data, autorotateSpeed = 0.12 }: Props){
  const svgRef = useRef<SVGSVGElement>(null)
  const [angle, setAngle] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [selected, setSelected] = useState<string | null>(data[0]?.name ?? null)
  const lastPt = useRef<{x:number,y:number}|null>(null)
  const lastTick = useRef<number>(-1)

  const slices = useMemo(()=>{
    const tot = data.reduce((a,b)=>a+b.value,0) || 1
    return data.map(d=>({ name:d.name, pct: d.value / tot }))
  },[data])

  const colorA: Record<string,string> = {
    Art:'#B48C58', Watch:'#5D6B78', Wine:'#6C3B3B', Car:'#3A557A', Gem:'#00EBD1', Sneaker:'#D0D6DE'
  }
  const colorB: Record<string,string> = {
    Art:'#8E6B3C', Watch:'#2C3440', Wine:'#3A1F21', Car:'#17324F', Gem:'#5CFFF2', Sneaker:'#8FA1B2'
  }

  useAnimationFrame((t, delta)=>{
    if(!dragging) setAngle(a => a + (autorotateSpeed * (delta/1000)))
  })

  function vibrate(ms=8){ try { navigator.vibrate?.(ms) } catch {} }

  const ring = { R: 155, w: 22, cx: 200, cy: 200 }
  const rOuter = ring.R
  const rInner = ring.R - ring.w

  const arcs = useMemo(()=>{
    let a0 = -Math.PI/2
    return slices.map((s)=>{
      const a1 = a0 + s.pct * TAU
      const obj = { name:s.name, a0, a1, mid:(a0+a1)/2, pct:s.pct }
      a0 = a1
      return obj
    })
  },[slices])

  const pinAngle = -Math.PI/2
  const activeName = useMemo(()=>{
    const pin = pinAngle - angle
    let norm = pin % TAU; if(norm<0) norm += TAU
    for(const s of arcs){
      let a0 = s.a0 % TAU; if(a0<0) a0 += TAU
      let a1 = s.a1 % TAU; if(a1<0) a1 += TAU
      if(a1 < a0) a1 += TAU
      if(norm < a0) norm += TAU
      if(norm >= a0 && norm < a1) return s.name
    }
    return arcs[0]?.name ?? null
  },[arcs, angle])

  useEffect(()=>{
    if(!activeName) return
    const now = Date.now()
    if(activeName !== selected && now - lastTick.current > 80){
      setSelected(activeName)
      vibrate(12)
      lastTick.current = now
    }
  },[activeName]) // eslint-disable-line

  function onPointerDown(e: React.PointerEvent){
    if(!svgRef.current) return
    setDragging(true)
    const rect = svgRef.current.getBoundingClientRect()
    lastPt.current = { x: e.clientX - rect.left - rect.width/2, y: e.clientY - rect.top - rect.height/2 }
    ;(e.target as Element).setPointerCapture(e.pointerId)
  }
  function onPointerMove(e: React.PointerEvent){
    if(!dragging || !svgRef.current) return
    const rect = svgRef.current.getBoundingClientRect()
    const p = { x: e.clientX - rect.left - rect.width/2, y: e.clientY - rect.top - rect.height/2 }
    if(!lastPt.current){ lastPt.current = p; return }
    const a1 = Math.atan2(p.y, p.x)
    const a0 = Math.atan2(lastPt.current.y, lastPt.current.x)
    setAngle(a => a + (a1 - a0))
    lastPt.current = p
  }
  function onPointerUp(){
    setDragging(false)
    lastPt.current = null
  }

  function ringPath(cx:number, cy:number, r1:number, r2:number, a0:number, a1:number){
    const sweep = 1
    const da = (a1 - a0)
    const large = (Math.abs(da) % TAU) > Math.PI ? 1 : 0
    const x0 = cx + r1 * Math.cos(a0), y0 = cy + r1 * Math.sin(a0)
    const x1 = cx + r1 * Math.cos(a1), y1 = cy + r1 * Math.sin(a1)
    const x2 = cx + r2 * Math.cos(a1), y2 = cy + r2 * Math.sin(a1)
    const x3 = cx + r2 * Math.cos(a0), y3 = cy + r2 * Math.sin(a0)
    return [
      `M ${x0} ${y0}`,
      `A ${r1} ${r1} 0 ${large} ${sweep} ${x1} ${y1}`,
      `L ${x2} ${y2}`,
      `A ${r2} ${r2} 0 ${large} ${1-sweep} ${x3} ${y3}`,
      'Z'
    ].join(' ')
  }

  const width = ring.cx*2, height = ring.cy*2

  const active = useMemo(()=>{
    const name = activeName ?? arcs[0]?.name
    const arc = arcs.find(a => a.name===name)
    const pct = Math.round((data.find(d=>d.name===name)?.value ?? arc?.pct ?? 0))
    return { name, pct }
  },[activeName, arcs, data])

  return (
    <div className="relative w-full overflow-hidden">
      <div className="absolute left-1/2 -translate-x-1/2 -top-1 text-center">
        <div className="mx-auto w-2 h-2 rounded-full bg-white/80 shadow-[0_0_12px_2px_rgba(255,255,255,.35)] mb-1" />
        <div className="text-xs text-slate-300">
          {active.name} • {active.pct}%
        </div>
        <div className="text-[10px] text-slate-500">Drag to rotate • Auto-rotate {dragging ? 'off' : 'on'}</div>
      </div>

      <svg
        ref={svgRef}
        width="100%" height={Math.min(420, height)} viewBox={`0 0 ${width} ${height}`}
        onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}
        className="touch-none select-none mx-auto block"
      >
        <defs>
          {arcs.map((a, i)=>{
            const cA = colorA[a.name] ?? '#8C8E8F'
            const cB = colorB[a.name] ?? '#343739'
            const rotDeg = ( (a.mid + angle) * 180 / Math.PI ) % 360
            return (
              <linearGradient key={`g-${i}`} id={`grad-${i}`} x1="0%" y1="0%" x2="100%" y2="0%"
                gradientTransform={`rotate(${rotDeg}, ${ring.cx}, ${ring.cy})`}
              >
                <stop offset="0%" stopColor={cB} stopOpacity="0.8"/>
                <stop offset="55%" stopColor={cA} stopOpacity="0.95"/>
                <stop offset="100%" stopColor={cB} stopOpacity="0.8"/>
              </linearGradient>
            )
          })}
        </defs>

        <circle cx={ring.cx} cy={ring.cy} r={rOuter+1}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />

        <g transform={`rotate(${angle*180/Math.PI}, ${ring.cx}, ${ring.cy})`}>
          {arcs.map((a, i) => {
            const path = ringPath(ring.cx, ring.cy, rOuter, rInner, a.a0, a.a1)
            return (
              <path
                key={i}
                d={path}
                fill={`url(#grad-${i})`}
                opacity={a.name === active.name ? 1 : 0.6}
              />
            )
          })}
        </g>

        {/* Logo STIMA centrato */}
        <g transform={`translate(${ring.cx-60}, ${ring.cy-60})`}>
          <STIMALogo width={120} height={120} className="opacity-90 drop-shadow-[0_0_10px_rgba(255,255,255,0.25)]" />
        </g>
      </svg>

      <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-[58%]">
        <div className="rounded-xl bg-[#121315]/95 border border-white/10 px-4 py-3 shadow-xl backdrop-blur-sm">
          <div className="text-[10px] tracking-wide text-slate-400">SELECTED</div>
          <div className="text-sm font-medium">{active.name}</div>
          <div className="text-xs text-slate-400">{active.pct}% of NAV • TWAP-7d</div>
        </div>
      </div>
    </div>
  )
}
