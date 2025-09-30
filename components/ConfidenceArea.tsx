'use client'
import React from 'react'
import { ResponsiveContainer, AreaChart, Area, Line, Tooltip, XAxis, YAxis } from 'recharts'

export default function ConfidenceArea({ data }:{ data:{date:string, value:number, low:number, high:number, twap:number}[] }){
  return (
    <div className="card">
      <div className="text-sm font-medium mb-2">Confidence Bands & TWAP</div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="conf" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00FFD1" stopOpacity={0.25}/>
                <stop offset="100%" stopColor="#00FFD1" stopOpacity={0.03}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Area type="monotone" dataKey="high" stroke="transparent" fill="transparent" />
            <Area type="monotone" dataKey="low" stroke="transparent" fill="transparent" />
            {/* banda (high-low) resa come area tra due serie */}
            <Area type="monotone" dataKey="value" stroke="#00FFD1" fill="url(#conf)" />
            <Line type="monotone" dataKey="twap" stroke="#6E7F8A" strokeDasharray="4 4" dot={false}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="text-xs text-slate-500 mt-2">Aura = confidenza • Linea tratteggiata = TWAP 7d</div>
    </div>
  )
}
