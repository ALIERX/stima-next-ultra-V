'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function HeroBanner(){
  return (
    <section className="relative overflow-hidden rounded-3xl p-8 md:p-12 bg-metal-gradient border border-white/10">
      {/* soft particles */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(closest-side, rgba(180,140,88,.25), transparent)' }}
          animate={{ x:[0,20,-10,0], y:[0,10,-15,0] }}
          transition={{ repeat: Infinity, duration: 14, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-20 -right-24 w-80 h-80 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(closest-side, rgba(0,255,209,.18), transparent)' }}
          animate={{ x:[0,-15,10,0], y:[0,-10,20,0] }}
          transition={{ repeat: Infinity, duration: 16, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative z-10 max-w-3xl">
        <h1 className="text-4xl md:text-6xl leading-tight font-semibold text-gradient-metal">
          Tokenize Reality.
        </h1>
        <p className="mt-3 text-sm md:text-base text-slate-300">
          From vintage Rolex to Da Vinci — minted, verified, liquid.
        </p>

        <div className="mt-6 flex items-center gap-3">
          <Link href="/assets" className="pill glow-gold underline-animate">
            Explore Assets →
          </Link>
          <Link href="/mint" className="pill glow-teal">
            Start Mint (demo)
          </Link>
        </div>

        <div className="mt-4 text-xs text-slate-400">
          Valuation updated daily at 00:00 UTC • Hysteresis ≥ 1.5%
        </div>
      </div>
    </section>
  )
}
