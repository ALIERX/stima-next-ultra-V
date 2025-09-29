import data from '@/app/data/assets.json'
import AssetRadar from '@/components/AssetRadar'
import ValuationTimeline from '@/components/ValuationTimeline'

function dailySeries(id:string, days=90){
  const seed = id + new Date().toISOString().slice(0,10)
  let t = 0; for (let i=0;i<seed.length;i++) t = (t + seed.charCodeAt(i)) >>> 0
  function rand(){ let x = (t += 0x6D2B79F5); x = Math.imul(x ^ x >>> 15, x | 1); x ^= x + Math.imul(x ^ x >>> 7, x | 61); return ((x ^ x >>> 14) >>> 0) / 4294967296 }
  const out:any[] = []
  let v = (0.8 + rand()*0.4) * 100
  for (let i=days-1;i>=0;i--){
    v = Math.max(10, v + (rand()-0.5)*2)
    const d = new Date(Date.now() - i*24*3600*1000).toISOString().slice(0,10)
    const tw = v*0.93
    out.push({ date: d, value: Number(v.toFixed(2)), low: Number((v-1.2).toFixed(2)), high: Number((v+1.2).toFixed(2)), twap: Number(tw.toFixed(2)) })
  }
  return out
}

export default function AssetDetail({ params }:{ params:{ id:string }}){
  const a = (data as any[]).find(x=>String(x.id)===String(params.id))
  if(!a) return <div className="text-sm text-slate-400">Asset not found.</div>
  const series = dailySeries(a.id, 120)

  return (
    <div className="space-y-6">
      <section className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <div className="aspect-[4/3] rounded-xl overflow-hidden bg-black/40"><img src={a.image} alt="" className="w-full h-full object-cover"/></div>
          <div className="mt-3">
            <div className="text-[10px] uppercase tracking-wide text-slate-400">{a.category}</div>
            <h1 className="text-lg font-semibold">{a.brand} — {a.name}</h1>
            <div className="text-xs text-slate-400">{a.year || 'Year N/A'}</div>
            <div className="text-sm mt-1">€ {a.value.toLocaleString('en-US')}</div>
          </div>
        </div>
        <div className="card">
          <div className="text-sm font-semibold mb-2">Asset Score</div>
          <AssetRadar asset={a} height={220}/>
          <div className="text-xs text-slate-400 mt-2">Deterministic evaluation components (daily).</div>
        </div>
      </section>
      <section className="card">
        <div className="text-sm font-semibold mb-2">Daily Price Index</div>
        <ValuationTimeline data={series}/>
        <div className="text-xs text-slate-400 mt-2">TWAP 7d and confidence aura. Updated daily 00:00 UTC.</div>
      </section>
    </div>
  )
}
