'use client'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

type Props = {
  address: string
  label?: string
  vs?: 'usd' | 'eur'
}

type ApiPayload = {
  price?: number
  change24h?: number | null
  vs?: string
  source?: string
  error?: string
}

export default function TokenIntelCard({
  address,
  label = 'STIMA',
  vs = 'usd',
}: Props) {
  const [data, setData] = useState<ApiPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [at, setAt] = useState<number>(Date.now())

  async function load() {
    try {
      setLoading(true)
      const r = await fetch(`/api/token/price?address=${address}&vs=${vs}`, { cache: 'no-store' })
      const j: ApiPayload = await r.json()
      setData(j)
      try { navigator.vibrate?.(6) } catch {}
    } catch (_) {
      // lascio i valori precedenti
    } finally {
      setLoading(false)
      setAt(Date.now())
    }
  }

  useEffect(() => {
    load()
    const id = setInterval(load, 120_000)
    const onVis = () => { if (document.visibilityState === 'visible') load() }
    document.addEventListener('visibilitychange', onVis)
    return () => { clearInterval(id); document.removeEventListener('visibilitychange', onVis) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, vs])

  const priceStr = useMemo(() => {
    if (!data?.price && data?.price !== 0) return '—'
    return vs === 'eur' ? `€${data.price!.toFixed(4)}` : `$${data.price!.toFixed(4)}`
  }, [data?.price, vs])

  const chgStr = useMemo(() => {
    if (typeof data?.change24h !== 'number') return '—'
    const s = data.change24h >= 0 ? '+' : ''
    return `${s}${data.change24h.toFixed(2)}%`
  }, [data?.change24h])

  const up = (data?.change24h ?? 0) >= 0

  function copyAddr() {
    navigator.clipboard?.writeText(address)
    try { navigator.vibrate?.(8) } catch {}
  }

  // mini spark (mock dolce)
  const spark = useMemo(() => {
    const N = 28
    const base = data?.price ?? 0.1
    const out = Array.from({ length: N }, (_, i) => {
      const t = (i / N) * Math.PI * 2
      const v = base * (1 + Math.sin(t) * 0.02 + Math.cos(t * 2) * 0.01)
      return v
    })
    const min = Math.min(...out), max = Math.max(...out)
    const H = 24, W = 96
    const d = out.map((v, i) => {
      const x = (i / (N - 1)) * W
      const y = H - ((v - min) / (max - min || 1)) * H
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
    }).join(' ')
    return { d, W, H }
  }, [data?.price, at])

  return (
    <div
      className="
        card relative overflow-hidden
        bg-[linear-gradient(95deg,rgba(0,0,0,0.08),rgba(0,0,0,0))]
        border border-white/10 rounded-2xl
        shadow-[inset_-6px_-6px_12px_rgba(255,255,255,0.04),inset_6px_6px_12px_rgba(0,0,0,0.32)]
      "
    >
      {/* conic glow lieve */}
      <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-50"
           style={{ background: 'conic-gradient(from 130deg,#D9896A33,transparent)' }} />
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* coin dot */}
          <span className="relative grid place-items-center w-9 h-9 rounded-full bg-[#212426]
                           shadow-[inset_-4px_-4px_8px_rgba(255,255,255,0.02),inset_4px_4px_12px_rgba(0,0,0,0.32)]">
            <span className="absolute inset-0 rounded-full
                             bg-[conic-gradient(from_130deg,#D9896A66,transparent)] blur-[7px]" />
            <span className="w-3 h-3 rounded-full bg-white/85" />
          </span>
          <div>
            <div className="text-sm tracking-wide text-slate-300">{label} <span className="text-slate-500 text-xs">({vs.toUpperCase()})</span></div>
            <div className="text-xl font-semibold text-slate-100 tabular-nums">{priceStr}
              <span className={`ml-2 text-xs tabular-nums ${up ? 'text-[#D9896A]' : 'text-[#722F37]'}`}>{chgStr}</span>
            </div>
          </div>
        </div>
        <button
          onClick={load}
          className="pill text-xs hover:border-white/20"
          title="Refresh"
        >
          {loading ? 'Sync…' : 'Refresh'}
        </button>
      </header>

      {/* spark */}
      <div className="mt-4">
        <svg width={spark.W} height={spark.H} viewBox={`0 0 ${spark.W} ${spark.H}`} className="block">
          <defs>
            <linearGradient id="sparkGrad" x1="0" y1="0" x2={spark.W} y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%"  stopColor="#D9896A" stopOpacity="0.8"/>
              <stop offset="100%" stopColor="#8C8E8F" stopOpacity="0.6"/>
            </linearGradient>
          </defs>
          <path d={spark.d} fill="none" stroke="url(#sparkGrad)" strokeWidth="1.75" strokeLinejoin="round" />
        </svg>
      </div>

      {/* address + actions */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="rounded-lg bg-black/20 border border-white/10 px-3 py-2">
          <div className="text-slate-400">Contract</div>
          <div className="mt-1 font-mono text-[11px] text-slate-200 break-all">{address}</div>
          <div className="mt-2 flex items-center gap-2">
            <button
              onClick={copyAddr}
              className="rounded-full border border-white/10 px-2 py-1 hover:border-white/20"
            >
              Copy
            </button>
            <Link
              href={`https://etherscan.io/token/${address}`}
              target="_blank"
              className="rounded-full border border-white/10 px-2 py-1 hover:border-white/20 underline-animate"
            >
              Etherscan
            </Link>
          </div>
        </div>

        <div className="rounded-lg bg-black/10 border border-white/10 px-3 py-2">
          <div className="text-slate-400">24h Source</div>
          <div className="mt-1 text-slate-200">{data?.source || '—'}</div>
          <div className="mt-2 text-slate-500">Auto-refresh ogni 2 min</div>
        </div>
      </div>
    </div>
  )
}
