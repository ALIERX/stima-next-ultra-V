'use client'
import React from 'react'
import { ResponsiveContainer, AreaChart, Area } from 'recharts'
export default function MiniSpark({ data }:{data:number[]}){
  const d = data.map((v,i)=>({i,v}))
  return (
    <div className="h-14 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={d}>
          <defs>
            <linearGradient id="s" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00FFD1" stopOpacity="0.35"/><stop offset="100%" stopColor="#00FFD1" stopOpacity="0.02"/>
            </linearGradient>
          </defs>
          <Area dataKey="v" stroke="#00FFD1" fill="url(#s)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
