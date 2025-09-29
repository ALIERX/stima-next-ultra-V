'use client'
import React from 'react'
export default function Ticker({ items }:{items:string[]}){
  return (
    <div className="relative whitespace-nowrap overflow-hidden py-2">
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-ink to-transparent pointer-events-none"/>
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-ink to-transparent pointer-events-none"/>
      <div className="flex gap-6 animate-[marquee_18s_linear_infinite] px-4">
        {items.map((n,i)=> (
          <div key={i} className="pill flex items-center gap-3">
            <span className="text-sm">{n}</span>
            <span className="text-xs text-emerald-400">▲ {(Math.random()*2).toFixed(2)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
