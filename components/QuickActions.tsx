'use client'
import Link from 'next/link'

export default function QuickActions(){
  return (
    <div className="hidden md:flex items-center gap-2">
      <Link href="/assets" className="pill hover:glow-teal">Explore</Link>
      <Link href="/mint" className="pill hover:glow-gold">Mint</Link>
      <a href="https://status.vercel.com/" target="_blank" rel="noreferrer" className="pill">Status</a>
    </div>
  )
}
