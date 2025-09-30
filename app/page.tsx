import assets from './data/assets.json'
import CounterRoll from '@/components/CounterRoll'
import Ticker from '@/components/Ticker'
import MiniSpark from '@/components/MiniSpark'
import HeroBanner from '@/components/HeroBanner'
import OracleSatellite from '@/components/OracleSatellite'
import CoverFlow3D from '@/components/CoverFlow3D'
import InfoTip from '@/components/InfoTip'
import InteractiveNavWheel from '@/components/InteractiveNavWheel'
import CategoryBarRace from '@/components/CategoryBarRace'
import ConfidenceArea from '@/components/ConfidenceArea'
import NavDonut from '@/components/NavDonut'
import ValueFlowStream from '@/components/ValueFlowStream'

function sum(xs:number[]){ return xs.reduce((a,b)=>a+b,0) }

/** Serie “stabile” per Confidence bands + TWAP (deterministica giornaliera) */
function buildSeries(id:string, days=90){
  const seed = id + new Date().toISOString().slice(0,10)
  let t = 0; for (let i=0;i<seed.length;i++) t = (t + seed.charCodeAt(i)) >>> 0
  function rand(){ let x = (t += 0x6D2B79F5); x = Math.imul(x ^ x >>> 15, x | 1); x ^= x + Math.imul(x ^ x >>> 7, x | 61); return ((x ^ x >>> 14) >>> 0) / 4294967296 }
  const out:any[] = []; let v = (0.8 + rand()*0.4) * 100
  for (let i=days-1;i>=0;i--){
    v = Math.max(10, v + (rand()-0.5)*2)
    const d = new Date(Date.now() - i*86400000).toISOString().slice(0,10)
    const tw = v*0.93
    out.push({
      date: d,
      value: Number(v.toFixed(2)),
      low: Number((v-1.2).toFixed(2)),
      high: Number((v+1.2).toFixed(2)),
      twap: Number(tw.toFixed(2))
    })
  }
  return out
}

/** Serie “river chart” per composizione NAV nel tempo (stacked %) */
function buildFlow(byCat: {name:string, value:number}[], days=30){
  const totalNow = byCat.reduce((a,b)=>a+b.value,0) || 1
  const base = byCat.map(c => ({ name: c.name, w: c.value/totalNow }))
  const seedStr = new Date().toISOString().slice(0,10)
  let t = 0; for (let i=0;i<seedStr.length;i++) t = (t + seedStr.charCodeAt(i)) >>> 0
  function rand(){ let x=(t+=0x6D2B79F5); x=Math.imul(x^x>>>15,x|1); x^=x+Math.imul(x^x>>>7,x|61); return ((x^x>>>14)>>>0)/4294967296 }

  const out:any[] = []
  for (let i=days-1;i>=0;i--){
    const date = new Date(Date.now() - i*86400000).toISOString().slice(0,10)
    const day:any = { date }
    let acc = 0
    base.forEach((b, idx) => {
      const osc = 1 + (Math.sin((i+idx)/6) * 0.04) + ((rand()-0.5) * 0.03)
      const v = Math.max(0.0001, b.w * osc)
      day[b.name] = v
      acc += v
    })
    // normalizza a 1 (così il river è percentuale)
    base.forEach(b => { day[b.name] = day[b.name] / acc })
    out.push(day)
  }
  return out
}

export default function Home(){
  const total = sum((assets as any[]).map(a=>a.value))

  const byCat = Array.from(
    (assets as any[]).reduce((m:any,a:any)=>m.set(a.category,(m.get(a.category)||0)+a.value), new Map())
  ).map(([k,v]:any)=>({ name: k[0].toUpperCase()+k.slice(1), value: total? v/total*100 : 0 }))

  const top5 = [...(assets as any[])].sort((a,b)=>b.value-a.value).slice(0,5)

  const featured = (assets as any[]).slice(0,5).map(a=>({
    id:a.id, image:a.image, title:`${a.brand}`, subtitle:a.name
  }))

  const series = buildSeries(top5[0]?.id || 'nav', 90)
  const flow   = buildFlow(byCat, 30)

  return (
    <>
      {/* HERO premium con bagliori + CTA */}
      <HeroBanner />

      {/* TICKER full-width a tutta pagina (sborda coi gradient edge) */}
      <Ticker items={byCat.map(c=>c.name)} />

      {/* KPI + ORACLE */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
        <div className="card">
          <div className="text-xs text-slate-400">
            Total Vault NAV <InfoTip text="Sum of all appraised assets currently in custody (mock). Updated daily @ 00:00 UTC." />
          </div>
          <div className="text-2xl font-semibold">€ <CounterRoll value={total} decimals={0}/></div>
          <MiniSpark data={[10,11,13,12,14,15,16,17,16,18,19,20]}/>
          <div className="badge mt-2">Hysteresis ≥ 1.5%</div>
        </div>

        <div className="card">
          <div className="text-xs text-slate-400">
            Minted supply (demo) <InfoTip text="Supply minted vs NAV. Real mint becomes active once Sepolia ENV are set." />
          </div>
          <div className="text-2xl font-semibold">
            <CounterRoll value={total/1000} suffix=" STIMA" decimals={2}/>
          </div>
          <div className="text-xs text-slate-400 mt-1">Deterministic @ 00:00 UTC</div>
        </div>

        <div className="card">
          <div className="text-xs text-slate-400">Categories</div>
          <div className="text-2xl font-semibold">{byCat.length}</div>
          <div className="text-xs text-slate-400 mt-1">Watch, Art, Car, Gem, Wine, Sneaker</div>
        </div>

        {/* Card con stile proprio */}
        <OracleSatellite status="Online" />
      </section>

      {/* COVERFLOW 3D per dare “vetrina” ai top/featured */}
      <section className="grid md:grid-cols-2 gap-3 mt-3">
        <CoverFlow3D items={featured} />
        <div className="card">
          <div className="text-sm font-medium mb-2">News (placeholder)</div>
          <ul className="text-sm space-y-2">
            <li>• Sotheby’s sets new record in modern art evening sale.</li>
            <li>• Rare Rolex Daytona achieves 7-figure hammer price.</li>
            <li>• Burgundy rally pauses after three months of gains.</li>
            <li>• Blue-chip classic car index hits decade high.</li>
          </ul>
          <div className="text-xs text-slate-500 mt-2">Soon: curated feed + sources.</div>
        </div>
      </section>

      {/* NAV WHEEL + SIDE CHARTS */}
      <section className="grid lg:grid-cols-3 gap-3 mt-3">
        {/* 2/3: ruota interattiva con vibrazioni + tick */}
        <div className="lg:col-span-2">
          <InteractiveNavWheel data={byCat} />
        </div>

        {/* 1/3: stack di charts aggiuntivi */}
        <div className="grid gap-3">
          <CategoryBarRace data={byCat} />
          <div className="card">
            <div className="text-sm font-medium mb-2">NAV Composition — Donut</div>
            <NavDonut data={byCat} />
          </div>
        </div>
      </section>

      {/* CONFIDENCE BANDS + VALUE FLOW STREAM */}
      <section className="grid md:grid-cols-2 gap-3 mt-3">
        <ConfidenceArea data={series} />
        <ValueFlowStream data={flow} colors={{
          Art:'#B48C58', Watch:'#6E7F8A', Wine:'#722F37', Car:'#0F4C81', Gem:'#00FFD1', Sneaker:'#E2E8F0'
        }}/>
      </section>

      {/* TOP VAULT + EXTRA NEWS */}
      <section className="grid md:grid-cols-2 gap-3 mt-3">
        <div className="card">
          <div className="text-sm font-medium mb-2">Top Vault Assets</div>
          <div className="space-y-2">
            {top5.map(a => (
              <div key={a.id} className="flex items-center gap-3">
                <img src={a.image} alt="" className="w-12 h-12 object-cover rounded-lg"/>
                <div className="flex-1">
                  <div className="text-sm font-medium">{a.brand} — {a.name}</div>
                  <div className="text-xs text-slate-400">
                    {a.category} • € {a.value.toLocaleString('en-US')}
                  </div>
                </div>
                <div className="text-xs text-emerald-400">▲ {(Math.random()*2+0.5).toFixed(2)}%</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="text-sm font-medium mb-2">Market Headlines (placeholder)</div>
          <ul className="text-sm space-y-2">
            <li>• Auction liquidity improves across blue-chip categories.</li>
            <li>• Vault custody premiums tighten as inflows rise.</li>
            <li>• Tokenized RWA indices outperform crypto majors this week.</li>
          </ul>
          <div className="text-xs text-slate-500 mt-2">Soon: live feed & sources.</div>
        </div>
      </section>
    </>
  )
}
