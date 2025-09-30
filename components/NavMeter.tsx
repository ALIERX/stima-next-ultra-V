'use client'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect } from 'react'

type Props = {
  /** Valore corrente del NAV (numero “grezzo”, lo formatteremo noi) */
  value: number
  /** Range visuale del meter (per normalizzare l’arco) */
  min?: number
  max?: number
  /** Titolo e descrizione sotto al titolo */
  title?: string
  description?: string
}

export default function NavMeter({
  value,
  min = 0,
  max = 1_000_000,
  title = 'NAV Meter',
  description = 'Indicatore sintetico del Net Asset Value corrente nel range configurato. Il valore è puramente dimostrativo.'
}: Props) {
  const clamped = Math.min(Math.max(value, min), max)
  const progress = (clamped - min) / (max - min) // 0..1

  // animazione dolce del progresso + haptics a soglie 25/50/75%
  const mv = useMotionValue(0)
  useEffect(() => {
    const controls = animate(mv, progress, { duration: 1.0, ease: 'easeInOut' })
    return () => controls.stop()
  }, [progress, mv])

  const pct = useTransform(mv, v => Math.round(v * 100))
  useEffect(() => {
    const unsub = pct.on('change', p => {
      if ([25, 50, 75].includes(p)) {
        try { navigator.vibrate?.(8) } catch {}
        // opzionale: window.__stimaFx?.tick?.()
      }
    })
    return () => unsub()
  }, [pct])

  // arco: 270° (da ~-225° a ~+45°) per look “meter”
  const START = -225
  const SWEEP = 270

  const radius = 60
  const stroke = 14
  const size = 180
  const cx = size / 2
  const cy = size / 2

  const dash = useTransform(mv, v => {
    const length = 2 * Math.PI * radius * (SWEEP / 360)
    return `${length * v} ${length}`
  })

  const prettyValue = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value)

  return (
    <div className="card p-0 overflow-hidden">
      <div className="px-5 pt-4">
        <div className="text-sm font-medium">{title}</div>
        <p className="mt-1 text-xs text-slate-400 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="px-5 pb-5">
        <div className="neu-card mx-auto mt-4 w-[240px] p-4">
          <div className="relative mx-auto flex h-[180px] w-[180px] items-center justify-center">
            {/* Glow di sfondo */}
            <div className="absolute inset-0 rounded-2xl bg-black/30 blur-xl" />
            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              className="relative z-10"
            >
              <defs>
                {/* gradiente bronzo con riflesso */}
                <linearGradient id="bronze" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#7A4D37" />
                  <stop offset="50%" stopColor="#B98364" />
                  <stop offset="100%" stopColor="#3A2720" />
                </linearGradient>
                <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="rgba(0,0,0,.5)"/>
                </filter>
              </defs>

              {/* semicorona “track” */}
              <g transform={`rotate(${START} ${cx} ${cy})`}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={radius}
                  fill="none"
                  stroke="rgba(255,255,255,.06)"
                  strokeWidth={stroke}
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * radius * (SWEEP / 360)}
                  strokeDashoffset={0}
                />
                {/* arco attivo animato */}
                <motion.circle
                  cx={cx}
                  cy={cy}
                  r={radius}
                  fill="none"
                  stroke="url(#bronze)"
                  strokeWidth={stroke}
                  strokeLinecap="round"
                  strokeDasharray={dash}
                  strokeDashoffset={0}
                  filter="url(#softShadow)"
                  className="[paint-order:stroke] drop-shadow-[0_0_8px_rgba(185,131,100,.35)]"
                />
              </g>

              {/* tacche sottili (ogni 45° del SWEEP) */}
              {Array.from({ length: 7 }).map((_, i) => {
                const a = START + (SWEEP / 6) * i
                const x1 = cx + Math.cos((Math.PI / 180) * a) * (radius + stroke / 1.6)
                const y1 = cy + Math.sin((Math.PI / 180) * a) * (radius + stroke / 1.6)
                const x2 = cx + Math.cos((Math.PI / 180) * a) * (radius + stroke / 2.2)
                const y2 = cy + Math.sin((Math.PI / 180) * a) * (radius + stroke / 2.2)
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="rgba(255,255,255,.18)"
                    strokeWidth={1}
                  />
                )
              })}
            </svg>

            {/* etichetta centrale */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-[11px] uppercase tracking-[.08em] text-slate-400 mb-1">NAV</div>
                <div className="text-3xl md:text-4xl font-semibold text-slate-100 tabular-nums">
                  {prettyValue}
                </div>
              </div>
            </div>
          </div>

          {/* baseline min/max allineata */}
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 tabular-nums">
            <span>{new Intl.NumberFormat('en-US').format(min)}</span>
            <span>{new Intl.NumberFormat('en-US').format(max)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
