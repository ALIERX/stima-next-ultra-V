'use client'
import React, { useMemo } from 'react'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Legend, CartesianGrid
} from 'recharts'

interface FlowPoint {
  date: string
  [category: string]: number | string
}

export default function ValueFlowStream({
  data,
  colors = {},
}: {
  data: FlowPoint[]
  colors?: Record<string, string>
}) {
  // ricava le chiavi categoria (tutte tranne 'date')
  const keys = useMemo(() => {
    if (!data?.length) return []
    return Object.keys(data[0]).filter(k => k !== 'date')
  }, [data])

  return (
    <div className="card">
      <div className="text-sm font-medium mb-2">Value Flow Stream (30d)</div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            {/* SVG native: NON si importa da 'recharts' */}
            <defs>
              {keys.map((k) => (
                <linearGradient id={`grad-${k}`} key={k} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors[k] ?? '#7dd3fc'} stopOpacity={0.9} />
                  <stop offset="100%" stopColor={colors[k] ?? '#7dd3fc'} stopOpacity={0.15} />
                </linearGradient>
              ))}
            </defs>

            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} />
            <YAxis
              tickFormatter={(v) => `${Math.round((v as number) * 100)}%`}
              tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{ background: '#141516', border: '1px solid rgba(255,255,255,0.08)' }}
              formatter={(v: number) => `${(v * 100).toFixed(1)}%`}
              labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
            />
            <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.7)' }} />
            {keys.map((k) => (
              <Area
                key={k}
                type="monotone"
                dataKey={k}
                stackId="1"
                stroke={colors[k] ?? '#7dd3fc'}
                fill={`url(#grad-${k})`}
                strokeWidth={1.2}
                isAnimationActive
                animationDuration={900}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="text-[10px] text-slate-500 mt-2">Share-of-NAV per categoria (stack %)</div>
    </div>
  )
}
