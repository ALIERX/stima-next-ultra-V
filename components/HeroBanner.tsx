'use client'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import Link from 'next/link'
import { useRef } from 'react'

export default function HeroBanner() {
  // parallax dolce sul mouse
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rot = useTransform(mx, [-50, 50], [-2.5, 2.5])
  const parX = useTransform(mx, [-50, 50], [12, -12])
  const parY = useTransform(my, [-50, 50], [8, -8])

  function onMouseMove(e: React.MouseEvent) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    mx.set(e.clientX - (rect.left + rect.width / 2))
    my.set(e.clientY - (rect.top + rect.height / 2))
  }

  return (
    <section
      ref={ref}
      onMouseMove={onMouseMove}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#212426] px-6 py-10 md:px-12 md:py-14"
      aria-label="Hero"
    >
      {/* riflessi soft + grana */}
      <div className="pointer-events-none absolute inset-0">
        {/* riflesso alto sinistra (copper) */}
        <motion.div
          aria-hidden
          className="absolute -top-32 -left-24 h-80 w-80 rounded-full blur-3xl"
          style={{
            x: parX, y: parY,
            background:
              'radial-gradient(closest-side, rgba(249,211,180,0.28), transparent 70%)',
          }}
          animate={{ opacity: [0.45, 0.6, 0.45] }}
          transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
        />
        {/* riflesso basso destra (teal) */}
        <motion.div
          aria-hidden
          className="absolute -bottom-28 -right-28 h-96 w-96 rounded-full blur-3xl"
          style={{
            x: useTransform(parX, v => -v),
            y: useTransform(parY, v => -v),
            background:
              'radial-gradient(closest-side, rgba(0,255,209,0.18), transparent 70%)',
          }}
          animate={{ opacity: [0.25, 0.4, 0.25] }}
          transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut' }}
        />
        {/* alone centrale leggero */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(60% 80% at 60% 40%, rgba(255,255,255,0.04), rgba(0,0,0,0) 60%)',
          }}
        />
        {/* grana */}
        <div className="absolute inset-0 opacity-[0.15] mix-blend-soft-light noise" />
      </div>

      {/* Orbita conica sintetica dietro il titolo */}
      <motion.div
        aria-hidden
        className="absolute right-8 top-8 hidden h-40 w-40 select-none rounded-full md:block"
        style={{
          rotate: rot,
          background:
            'conic-gradient(from 210deg, rgba(249,211,180,0.0) 0deg, rgba(249,211,180,0.38) 40deg, rgba(0,0,0,0) 140deg, rgba(0,255,209,0.25) 210deg, rgba(0,0,0,0) 330deg)',
          boxShadow:
            'inset 0 0 0.5px rgba(255,255,255,0.25), 0 8px 24px rgba(0,0,0,0.35)',
          filter: 'blur(0.2px)',
        }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, ease: 'linear', duration: 36 }}
      >
        {/* nucleo */}
        <div className="absolute inset-6 rounded-full border border-white/10 bg-[#1E1E1F]" />
      </motion.div>

      {/* Contenuto */}
      <div className="relative z-10 max-w-3xl">
        {/* pill tag superiori */}
        <div className="mb-4 flex flex-wrap gap-2 text-[11px]">
          <span className="synth-pill">Demo</span>
          <span className="synth-pill">Explore</span>
          <span className="synth-pill">Mint</span>
          <span className="synth-pill">Status</span>
          <span className="synth-pill">Crypto Teal</span>
          <span className="synth-pill">SFX</span>
        </div>

        <motion.h1
          className="text-balance text-4xl font-semibold tracking-tight text-white md:text-6xl"
          style={{
            textShadow:
              '0 1px 0 rgba(255,255,255,0.02), 0 10px 40px rgba(249,211,180,0.10)',
          }}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span className="bg-gradient-to-br from-slate-100 via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Tokenize Reality.
          </span>
        </motion.h1>

        <motion.p
          className="mt-3 text-sm text-slate-300 md:text-base"
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          From vintage Rolex to Da Vinci — minted, verified, liquid.
        </motion.p>

        {/* CTA con neuomorfismo + highlight copper */}
        <motion.div
          className="mt-6 flex flex-wrap items-center gap-3"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.45 }}
        >
          <Link
            href="/assets"
            className="btn-synth btn-copper"
            data-sfx="tap"
          >
            <span className="i-ph-compass-duotone -ml-0.5 mr-1.5 inline-block" />
            Explore Assets
          </Link>

          <Link href="/mint" className="btn-synth btn-teal" data-sfx="tap-2">
            <span className="i-ph-coin-duotone -ml-0.5 mr-1.5 inline-block" />
            Start Mint (demo)
          </Link>
        </motion.div>

        {/* meta row */}
        <div className="mt-4 text-xs text-slate-400">
          Valuation updated daily @ 00:00 UTC • Hysteresis ≥ 1.5%
        </div>
      </div>

      {/* bordo lucido “credit bar” alla CRED, molto sottile */}
      <div className="absolute inset-x-6 bottom-4 hidden h-px rounded-full bg-gradient-to-r from-transparent via-[#C46545]/50 to-transparent md:block" />
    </section>
  )
}

/* ---------- UTILITIES (Tailwind via @apply nel tuo globals.css) ----------
Aggiungi queste classi in globals.css (o sostituiscile con le tue utilità già presenti).

.noise{ background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.28'/%3E%3C/svg%3E"); mix-blend: soft-light }

.synth-pill{ @apply rounded-full border border-white/10 bg-[#1f2123]/70 px-2.5 py-1 backdrop-blur text-slate-300; box-shadow: inset -6px -6px 12px rgba(255,255,255,.04), inset 6px 6px 12px rgba(0,0,0,.22); }

.btn-synth{ @apply inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition-all; box-shadow:-6px -6px 12px rgba(255,255,255,.04), 6px 6px 12px rgba(0,0,0,.16); }
.btn-synth:active{ transform: translateY(1px); }
.btn-copper{ @apply border-black/10 text-[#F9D3B4]; background:linear-gradient(95deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.12) 100%), #212426; }
.btn-teal{ @apply border-black/10 text-[#00FFD1]; background:linear-gradient(95deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.12) 100%), #212426; }

/* Icon placeholders if you use an icon font like phosphor via CSS classes.
   If not, you can remove the spans with i-ph-* classes above. */
