'use client'
import React, { useEffect, useState } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts'

const COLORS = ['#B48C58','#6E7F8A','#722F37','#0F4C81','#00FFD1','#E2E8F0']

export default function CategoryBarRace({ data }:{ data:{name:string,value:number}[] }){
  const [tick, setTick] = useState(0)
  useEffect(()=>{
    const id = setInterval(()=> setTick(t => t+1), 2200)
    return ()=> clearInterval(id)
  },[])

  const d = data.map((c,i)=>({
    name: c.name,
    value: Math.max(0.1, c.value * (0.9 + Math.sin((tick+i)/2)*0.08)) // piccola variazione
  })).sort((a,b)=> b.value - a.value)

  return (
    <div className="card">
      <div className="text-sm font-medium mb-2">Category Momentum (demo)</div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={d} layout="vertical" margin={{ left: 40, right: 20 }}>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" />
            <Tooltip />
            <Bar dataKey="value" radius={[4,4,4,4]}>
              {d.map((entry, index) => (
                <Cell key={`c-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="text-xs text-slate-500 mt-2">Bars gently reorder as momentum shifts.</div>
    </div>
  )
}
