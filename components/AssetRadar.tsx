'use client'
import React, { useMemo } from 'react'
import { ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip } from 'recharts'
function compute(a:any){
  const val = Number(a.value||0)
  const rarity = Math.max(20, Math.min(100, 20 + Math.log10(Math.max(1,val))/6*100))
  const condition = a.description?.toLowerCase().includes('mint') ? 90 : (a.description?.toLowerCase().includes('restored') ? 60 : 75)
  const liquidity = ['watch','sneaker','wine'].includes(a.category) ? 80 : (a.category==='art'?55:50)
  const volatility = 100 - Math.max(30, Math.min(90, 30 + (val>1e7?30:0)))
  const provenance = /certificate|coa|sotheby|christie|museum|documented/i.test(a.description||'') ? 90 : 70
  return [
    { k:'Rarity', v: Math.round(rarity) },
    { k:'Condition', v: Math.round(condition) },
    { k:'Liquidity', v: Math.round(liquidity) },
    { k:'Volatility', v: Math.round(100 - volatility) },
    { k:'Provenance', v: Math.round(provenance) }
  ]
}
export default function AssetRadar({ asset, height=200 }:{asset:any,height?:number}){
  const data = useMemo(()=>compute(asset), [asset])
  return (
    <div style={{height}}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="70%">
          <PolarGrid />
          <PolarAngleAxis dataKey="k" />
          <PolarRadiusAxis angle={30} domain={[0,100]} tick={false} />
          <Tooltip />
          <Radar dataKey="v" stroke="#e5e7eb" fill="#e5e7eb" fillOpacity={0.18} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
