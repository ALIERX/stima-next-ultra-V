'use client'
import React, { useMemo } from 'react'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Legend
} from 'recharts'

type FlowPoint = { date: string } & { [category: string]: number | string };

export default function ValueFlowStream({
  data,
  colors,
  height = 260,
  formatTick = (d:string) => d.slice(5), // mostra MM-DD
}: {
  data: FlowPoint[]
  colors?: Record<string, string>
  height?: number
  formatTick?: (d: string) => string
}) {
  const keys = useMemo(() => {
    if (!data?.length) return []
    return Object.keys(data[0]).filter(k => k !== 'date')
  }, [data])

  // palette default coerente con STIMA
  const palette: Record<string, string> = {
    Art: '#B48C58',        // oro
    Watch: '#6E7F8A',      // platino
    Wine: '#722F37',       // vino
    Car: '#0F4C81',        // petrolio/blu
    Gem: '#00FFD1',        // crypto teal
    Sneaker: '#E2E8F0',    // argento chiaro
    ...colors
  }

  return (
    <div className="card overflow-hidden">
      <div className="text-sm font-medium mb-2">Value Flow Stream (composition over time)</div>
      <div className="h-64 md:h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            stackOffset="expand" // mostra come % (river chart)
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
          >
            <defs>
              {keys.map((k, i) => (
                <linearGradient key={k} id={`grad-${k}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={palette[k] || '#8884d8'} stopOpacity={0.75}/>
                  <stop offset="100%" stopColor={palette[k] || '#8884d8'} stopOpacity={0.25}/>
                </linearGradient>
              ))}
            </defs>

            <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={formatTick} />
            <YAxis tick={{ fontSize: 10 }} tickFormatter={(v)=> `${Math.round(v*100)}%`} />
            <Tooltip
              contentStyle={{ background: '#0A0A0B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }}
              labelStyle={{ color: 'white', fontSize: 12 }}
              formatter={(value:any, name:any) => [`${(value*100).toFixed(1)}%`, name]}
              labelFormatter={(d)=> `Date: ${d}`}
            />
            <Legend wrapperStyle={{ fontSize: 10 }} />

            {keys.map(k => (
              <Area
                key={k}
                type="monotone"
                dataKey={k}
                stackId="1"
                stroke={palette[k] || '#8884d8'}
                fill={`url(#grad-${k})`}
                isAnimationActive
                animationDuration={900}
                animationEasing="ease-out"
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="text-xs text-slate-500 mt-2">
        Shares of NAV per category over time (stacked to 100%). Hover for details.
      </div>
    </div>
  )
}
