'use client'
import React from 'react'

export default function Ticker({ items }:{items:string[]}){
  const list = items.concat(items).concat(items) // molto lungo
  return (
    <div className="relative overflow-hidden py-2 border-y border-white/10 bg-white/[0.04] -mx-4 md:-mx-6">
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink to-transparent pointer-events-none"/>
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink to-transparent pointer-events-none"/>
      <div className="flex gap-6 animate-[marquee_30s_linear_infinite] px-4">
        {list.map((n,i)=> (
          <div key={i} className="pill hover:glow-teal transition-shadow">
            <span className="text-sm">{n}</span>
            <span className="ml-3 text-xs text-emerald-400">▲ {(Math.random()*2).toFixed(2)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
