'use client'
import React from 'react'

function dayBlocks(days=70){
  const today = new Date()
  const arr: {d:string,v:number}[] = []
  for(let i=days-1;i>=0;i--){
    const dt = new Date(today.getTime() - i*86400000)
    const ds = dt.toISOString().slice(0,10)
    const v = Math.random()
    arr.push({ d: ds, v })
  }
  return arr
}

export default function CalendarHeatmapLite(){
  const data = dayBlocks(84)
  return (
    <div className="card">
      <div className="text-sm font-medium mb-2">Daily Activity (demo)</div>
      <div className="grid grid-cols-14 gap-1">
        {data.map((x,i)=>(
          <div key={i} className="aspect-square rounded-md" title={`${x.d}`}
               style={{ background: `rgba(0,255,209,${0.08 + x.v*0.45})` }}/>
        ))}
      </div>
      <div className="text-xs text-slate-500 mt-2">Heat of updates / mints per day (simulated).</div>
    </div>
  )
}
