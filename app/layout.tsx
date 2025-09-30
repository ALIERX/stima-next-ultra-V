// app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import React from 'react'
import Link from 'next/link'

// opzionale: variabili font se le hai definite
import { sans, mono } from './fonts'

import SoundFXProvider from '@/components/SoundFXProvider'
import SoundSwitch from '@/components/SoundSwitch'
import ThemeToggle from '@/components/ThemeToggle'
import NetworkBadge from '@/components/NetworkBadge'
import QuickActions from '@/components/QuickActions'
import CommandK from '@/components/CommandK'

export const metadata: Metadata = {
  title: 'STIMA — Asset Intelligence',
  description: 'Deterministic valuations and tokenization for real-world assets.',
  themeColor: '#0A0A0B',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${sans?.variable ?? ''} ${mono?.variable ?? ''}`}>
      <body className="min-h-screen bg-ink text-slate-100 antialiased selection:bg-crypto/20 selection:text-white">
        <SoundFXProvider>
          {/* Film grain sottile sopra tutto */}
          <div className="noise-overlay" />

          {/* Header sticky */}
          <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/70 backdrop-blur">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
              <Link href="/" className="group inline-flex items-center gap-2">
                <span className="text-gradient-metal text-xl font-semibold tracking-tight">STIMA</span>
                <span className="hidden sm:inline text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                  Asset&nbsp;Intelligence
                </span>
              </Link>

              <nav className="flex items-center gap-2 md:gap-3 text-sm">
                <NetworkBadge />
                <QuickActions />
                <ThemeToggle />
                <SoundSwitch />
                <CommandK />
              </nav>
            </div>
          </header>

          {/* Contenuto */}
          <main className="max-w-7xl mx-auto px-4 py-6 md:py-8 space-y-6">
            {children}
          </main>

          {/* CTA mobile sintetica */}
          <div className="md:hidden fixed bottom-4 left-0 right-0 flex justify-center z-40">
            <Link href="/mint" className="pill glow-gold px-6 py-2 text-sm font-medium">
              Mint Now
            </Link>
          </div>

          {/* Footer elegante */}
          <footer className="border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 py-8 text-xs text-slate-500 flex items-center justify-between">
              <div>© {new Date().getFullYear()} STIMA — Deterministic Valuation & Tokenization</div>
              <div className="hidden sm:flex items-center gap-3">
                <span className="text-slate-600">•</span>
                <a
                  href="https://stima.io"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline underline-animate"
                >
                  Powered by Next.js on Vercel
                </a>
              </div>
            </div>
          </footer>
        </SoundFXProvider>
      </body>
    </html>
  )
}
