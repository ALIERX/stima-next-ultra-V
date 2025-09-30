'use client'
import React, {useEffect, useMemo, useRef, useState} from 'react'
import {motion, useMotionValue, animate} from 'framer-motion'

type Slice = { name: string; value: number }
type Props = {
  data: Slice[]
  autoRotate?: boolean
}

const PALETTE: Record<string, [string,string]> = {
  Watch: ['#6E7F8A','#93A1AA'],
  Art: ['#B48C58','#E0B983'],
  Car: ['#0F4C81','#2F6CA1'],
  Gem: ['#00FFD1','#7CFFE9'],
  Wine: ['#722F37','#A54E5B'],
  Sneaker: ['#E2E8F0','#FFFFFF'],
}

const TAU = Math.PI * 2
const deg = (r:number)=>r*180/Math.PI
const rad = (d:number)=>d*Math.PI/180

function arcPath(cx:number, cy:number, r:number, start:number, end:number){
  // start/end in degrees, large-arc & sweep flags handled
  const a0 = rad(start), a1 = rad(end)
  const p0 = [cx + r*Math.cos(a0), cy + r*Math.sin(a0)]
  const p1 = [cx + r*Math.cos(a1), cy + r*Math.sin(a1)]
  const large = Math.abs(end-start) > 180 ? 1 : 0
  const sweep = end>start ? 1 : 0
  return `M ${p0[0]} ${p0[1]} A ${r} ${r} 0 ${large} ${sweep} ${p1[0]} ${p1[1]}`
}

export default function InteractiveNavWheel({data, autoRotate=true}:Props){
  const size = 520
  const cx = size/2, cy = size/2
  const R = 180                        // raggio dell’anello
  const stroke = 22                    // spessore sottile
  const gapDeg = 2.5                   // gap tra segmenti

  // normalizzo e costruisco segmenti cumulativi
  const slices = useMemo(()=>{
    const sum = data.reduce((a,b)=>a+(b.value||0),0) || 1
    let a = -90 // parte dall’alto
    return data.map(s=>{
      const span = (s.value/sum)*360
      const start = a + gapDeg/2
      const end   = a + span - gapDeg/2
      a += span
      return {...s, start, end, span: Math.max(0,end-start)}
    })
  }, [data])

  // rotazione in gradi (positiva = oraria)
  const rotation = useMotionValue(0)
  const [rot, setRot] = useState(0)
  useEffect(()=>rotation.on('change', v=>setRot(v)), [rotation])

  // selezione: chi sta sotto la spilla (sempre a 12:00)
  const [selected, setSelected] = useState(0)
  useEffect(()=>{
    const angleAtPin = ((-rot % 360)+360)%360 // 0..360
    let idx = slices.findIndex(s => {
      const st=((s.start%360)+360)%360, en=((s.end%360)+360)%360
      if (st<=en) return angleAtPin>=st && angleAtPin<=en
      // wrap
      return angleAtPin>=st || angleAtPin<=en
    })
    if (idx<0) idx = 0
    if (idx!==selected){
      setSelected(idx)
      // taptic/rumble leggero quando cambia
      try{ if(typeof navigator!=='undefined' && 'vibrate' in navigator) navigator.vibrate(8) }catch{}
      // ping audio opzionale se presente (agganciato al tuo provider)
      // @ts-ignore
      if (window?.__stimaFx?.tick) window.__stimaFx.tick()
    }
  }, [rot, slices, selected])

  // auto-rotate
  useEffect(()=>{
    if(!autoRotate) return
    const controls = animate(rotation, rot+360, {
      duration: 40, ease: 'linear', repeat: Infinity
    })
    return () => controls.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRotate])

  // drag manuale (mouse & touch)
  const ref = useRef<SVGSVGElement>(null)
  const dragState = useRef<{active:boolean; offset:number}>({active:false, offset:0})

  function angleFromEvent(e: PointerEvent){
    const rect = ref.current!.getBoundingClientRect()
    const x = (e.clientX - rect.left) - rect.width/2
    const y = (e.clientY - rect.top)  - rect.height/2
    const a = deg(Math.atan2(y, x))
    return a
  }
  function onDown(e: React.PointerEvent){
    (e.target as Element).setPointerCapture(e.pointerId)
    const a = angleFromEvent(e.nativeEvent)
    dragState.current = {active:true, offset: a - rot}
    // pausa l’auto-rotate
    // niente, il loop continua ma l’utente sovrascrive la motionValue
  }
  function onMove(e: React.PointerEvent){
    if(!dragState.current.active) return
    const a = angleFromEvent(e.nativeEvent)
    rotation.set(a - dragState.current.offset)
  }
  function onUp(e: React.PointerEvent){
    dragState.current.active = false
    // magnetismo dolce al centro del segmento selezionato
    const s = slices[selected]
    const mid = (s.start+s.end)/2
    const target = -mid
    animate(rotation, target, {type:'spring', stiffness:60, damping:12})
  }

  // UI dati selezione
  const sel = slices[selected]
  const percent = ((sel.span/360)*100).toFixed(1)

  return (
    <div className="card p-0 overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-4">
        <div className="text-sm font-medium">NAV Wheel</div>
        <div className="text-xs text-slate-400">Drag to rotate · Auto-rotate {autoRotate? 'on':'off'}</div>
      </div>

      <div className="relative">
        {/* spilla/pin sempre in alto */}
        <div className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 z-20">
          <div className="flex flex-col items-center">
            <div className="rounded-full w-2 h-2 bg-white/90 shadow-[0_0_12px_rgba(255,255,255,.55)]" />
            <div className="mt-1 text-center text-[11px] text-slate-300">
              <div className="font-medium">{sel.name} • {percent}%</div>
              <div className="text-slate-500">hover/drag for details</div>
            </div>
          </div>
        </div>

        {/* svg wheel */}
        <motion.svg
          ref={ref}
          width="100%" height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{rotate: rotation}}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          className="touch-none select-none"
        >
          {/* sfondo molto soft */}
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            {slices.map((s, i)=>{
              const [c1,c2] = PALETTE[s.name] || ['#64748B','#CBD5E1']
              return (
                <linearGradient key={i} id={`grad-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={c1} stopOpacity="0.35"/>
                  <stop offset="100%" stopColor={c2} stopOpacity="0.95"/>
                </linearGradient>
              )
            })}
          </defs>

          {/* alone radiale sotto l’anello */}
          <circle cx={cx} cy={cy} r={R} fill="none" stroke="url(#radial)" strokeWidth={stroke+12} opacity="0.08"/>
          {/* segmenti */}
          {slices.map((s, i)=>{
            const path = arcPath(cx, cy, R, s.start, s.end)
            const isSel = i===selected
            return (
              <path
                key={i}
                d={path}
                fill="none"
                stroke={`url(#grad-${i})`}
                strokeWidth={isSel ? stroke+2 : stroke}
                strokeLinecap="round"
                filter={isSel ? 'url(#glow)' : undefined}
                opacity={isSel ? 1 : 0.55}
              />
            )
          })}

          {/* foro centrale */}
          <circle cx={cx} cy={cy} r={R - stroke*1.1} fill="#0b0c0d" stroke="rgba(255,255,255,.05)" strokeWidth="1"/>
        </motion.svg>

        {/* scheda info “synth” flottante (agganciata alla ruota) */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-6">
          <div className="neu-card px-4 py-2">
            <div className="text-[11px] uppercase tracking-[.08em] text-slate-400">Selected</div>
            <div className="text-sm font-medium">{sel.name}</div>
            <div className="text-xs text-slate-500">{percent}% of NAV • TWAP-7d shown elsewhere</div>
          </div>
        </div>
      </div>
    </div>
  )
}
