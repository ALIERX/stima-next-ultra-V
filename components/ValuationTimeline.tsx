'use client'
import React from 'react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Line } from 'recharts'
export default function ValuationTimeline({ data }:{data:{date:string,value:number,low:number,high:number,twap:number}[]}){
  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="v" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00FFD1" stopOpacity="0.35"/>
              <stop offset="100%" stopColor="#00FFD1" stopOpacity="0.02"/>
            </linearGradient>
          </defs>
          <XAxis dataKey="date" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip />
          <Area type="monotone" dataKey="value" stroke="#00FFD1" fill="url(#v)" />
          <Line type="monotone" dataKey="twap" stroke="#6E7F8A" strokeDasharray="4 4" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
