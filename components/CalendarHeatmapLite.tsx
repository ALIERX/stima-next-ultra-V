'use client'
import React, { useMemo, useState } from 'react'

type Cell = { date: string; value: number }

function genData(weeks = 12): Cell[] {
  const days = weeks * 7
  const today = new Date()
  const out: Cell[] = []
  for (let i = days - 1; i >= 0; i--) {
    const dt = new Date(today.getTime() - i * 86400000)
    const d = dt.toISOString().slice(0, 10)
    // demo: pattern dolce con un po' di rumore
    const base = 0.2 + 0.6 * Math.pow(Math.sin(i / 6), 2)
    const value = Math.max(0, Math.min(1, base + (Math.random() - 0.5) * 0.15))
    out.push({ date: d, value })
  }
  return out
}

const levels = [
  'rgba(0,255,209,0.08)',
  'rgba(0,255,209,0.18)',
  'rgba(0,255,209,0.28)',
  'rgba(0,255,209,0.42)',
  'rgba(0,255,209,0.56)',
]

export default function CalendarHeatmapLite() {
  const [hover, setHover] = useState<Cell | null>(null)
  const data = useMemo(() => genData(12), [])

  // colonne = settimane, righe = giorni (lun→dom)
  // allineiamo l’ultima colonna alla settimana corrente
  const last = new Date()
  const start = new Date(last)
  start.setDate(last.getDate() - (12 * 7 - 1))

  function color(v: number) {
    if (v < 0.2) return levels[0]
    if (v < 0.4) return levels[1]
    if (v < 0.6) return levels[2]
    if (v < 0.8) return levels[3]
    return levels[4]
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium">Daily Activity (demo)</div>
        {/* legenda compatta */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-slate-400 mr-1">Low</span>
          {levels.map((c, i) => (
            <span key={i} className="h-3 w-3 rounded-sm" style={{ background: c }} />
          ))}
          <span className="text-[10px] text-slate-400 ml-1">High</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-1">
        {Array.from({ length: 12 }).map((_, col) => (
          <div key={col} className="grid grid-rows-7 gap-1">
            {Array.from({ length: 7 }).map((__, row) => {
              const idx = col * 7 + row
              const cell = data[idx]
              if (!cell) return <div key={row} className="h-4 w-4 rounded-sm bg-transparent" />
              const bg = color(cell.value)
              return (
                <div
                  key={row}
                  className="h-4 w-4 rounded-[3px] transition-transform will-change-transform hover:scale-[1.12]"
                  style={{ background: bg }}
                  onMouseEnter={() => setHover(cell)}
                  onMouseLeave={() => setHover(null)}
                  title={`${cell.date} — activity ${(cell.value * 100).toFixed(0)}%`}
                />
              )
            })}
          </div>
        ))}
      </div>

      <div className="text-xs text-slate-500 mt-2">
        {hover ? (
          <>Selected: <span className="text-slate-300">{hover.date}</span> • Activity {(hover.value * 100).toFixed(0)}%</>
        ) : (
          <>Hover squares for details. Last {12} weeks shown.</>
        )}
      </div>
    </div>
  )
}
